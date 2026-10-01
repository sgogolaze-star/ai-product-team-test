// api/task.ts
// Vercel Edge-compatible handler that forwards task requests to an n8n webhook
// and normalizes/sanitizes responses before sending them back to the frontend.

// This file intentionally avoids forwarding arbitrary upstream responses (HTML, stacks, headers)
// and returns safe JSON-only shapes. It also uses only runtime-supported types (Web Request/Response)
// so it is compatible with the Vercel Edge runtime (and Node runtimes that support the web fetch API).

type TaskRequest = {
  // The UI sends simple fields describing the task; keep these generic so frontend may evolve.
  prTitle?: string
  prBody?: string
  repoOwner?: string
  repoName?: string
  previewBranch?: string
}

type SuccessResponse = {
  ok: true
  prUrl?: string
  previewUrl?: string
}

type ErrorResponse = {
  ok: false
  status?: number
  message: string
}

const JSON_HEADERS = { 'Content-Type': 'application/json' }

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getStringField(obj: Record<string, unknown>, ...keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v.length > 0) return v
  }
  return undefined
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' } as ErrorResponse), {
      status: 405,
      headers: JSON_HEADERS,
    })
  }

  let body: TaskRequest | undefined
  try {
    body = (await req.json()) as TaskRequest
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, message: 'Request body must be valid JSON' } as ErrorResponse), {
      status: 400,
      headers: JSON_HEADERS,
    })
  }

  const webhook = process.env.N8N_WEBHOOK_URL
  const agentKey = process.env.N8N_AGENT_KEY

  if (!webhook) {
    // Keep message generic so no environment detail or secrets are leaked.
    return new Response(
      JSON.stringify({ ok: false, message: 'Server misconfiguration: webhook URL not configured' } as ErrorResponse),
      { status: 500, headers: JSON_HEADERS }
    )
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    // Forward the server-side N8N_AGENT_KEY to the upstream webhook only as a header.
    if (agentKey) headers['x-agent-key'] = agentKey

    const upstreamRes = await fetch(webhook, {
      method: 'POST',
      headers,
      body: JSON.stringify(body ?? {}),
    })

    const contentType = upstreamRes.headers.get('content-type') || ''

    // If upstream returned non-2xx, try to parse JSON and return a safe error message.
    if (!upstreamRes.ok) {
      if (contentType.includes('application/json')) {
        // Parse into unknown and only surface a safe, limited message field if present
        let parsed: unknown = null
        try {
          parsed = await upstreamRes.json()
        } catch (e) {
          // Parsing failed; log for diagnostics but don't reveal to client
          console.error('Failed to parse upstream JSON error response:', e)
        }

        let message = 'Upstream service returned an error'
        if (isObject(parsed)) {
          const m = getStringField(parsed, 'message')
          if (m) message = m
        }

        const err: ErrorResponse = { ok: false, status: upstreamRes.status, message }
        return new Response(JSON.stringify(err), { status: 502, headers: JSON_HEADERS })
      }

      // For non-JSON error responses (HTML, plain text), do NOT forward body/head/details.
      return new Response(
        JSON.stringify({ ok: false, status: upstreamRes.status, message: 'Upstream service returned a non-JSON error' } as ErrorResponse),
        { status: 502, headers: JSON_HEADERS }
      )
    }

    // Successful upstream response
    // Only accept JSON responses. If it's not JSON, refuse to forward raw content.
    if (!contentType.includes('application/json')) {
      return new Response(
        JSON.stringify({ ok: false, status: upstreamRes.status, message: 'Upstream returned a non-JSON response' } as ErrorResponse),
        { status: 502, headers: JSON_HEADERS }
      )
    }

    // Parse JSON into unknown and safely normalize only allowed fields
    let data: unknown = null
    try {
      data = await upstreamRes.json()
    } catch (e) {
      console.error('Failed to parse upstream JSON success response:', e)
      return new Response(
        JSON.stringify({ ok: false, message: 'Failed to parse upstream JSON response' } as ErrorResponse),
        { status: 502, headers: JSON_HEADERS }
      )
    }

    let prUrl: string | undefined
    let previewUrl: string | undefined

    if (isObject(data)) {
      prUrl = getStringField(data, 'prUrl', 'pr_url')
      previewUrl = getStringField(data, 'previewUrl', 'preview_url')
    }

    const success: SuccessResponse = { ok: true }
    if (prUrl) success.prUrl = prUrl
    if (previewUrl) success.previewUrl = previewUrl

    return new Response(JSON.stringify(success), { status: 200, headers: JSON_HEADERS })
  } catch (e) {
    // Catch network errors, timeouts, or unexpected exceptions.
    // Log the error server-side for diagnostics but do not expose details to the client.
    console.error('Internal error in /api/task handler:', e)
    return new Response(
      JSON.stringify({ ok: false, message: 'Network or internal server error' } as ErrorResponse),
      { status: 500, headers: JSON_HEADERS }
    )
  }
}
