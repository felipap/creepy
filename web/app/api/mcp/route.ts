import { NextRequest } from 'next/server'
import { authMcpRequest } from '../lib'

export const GET = authMcpRequest(async (request: NextRequest) => {
  console.log('GET /mcp')

  return new Response(JSON.stringify({ message: 'Coming soon!' }))
})
