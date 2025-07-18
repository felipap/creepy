import { NextRequest } from 'next/server'

const MOBILE_REQUEST_HEADER = 'x-tracker-secret'

const MOBILE_REQUEST_SECRET = process.env.MOBILE_REQUEST_SECRET || ''
if (!MOBILE_REQUEST_SECRET) {
  throw new Error('Missing MOBILE_REQUEST_SECRET')
}

export function authMobileRequest(
  handler: (request: NextRequest) => Promise<Response>,
) {
  return async (request: NextRequest) => {
    const secret = request.headers.get(MOBILE_REQUEST_HEADER)

    if (secret !== MOBILE_REQUEST_SECRET) {
      console.debug('Unauthorized', secret)
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(request)
  }
}
