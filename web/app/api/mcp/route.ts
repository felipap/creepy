import { db } from '@/db'
import { DEFAULT_USER_ID, Locations } from '@/db/schema'
import { and, desc, eq, gte, lte } from 'drizzle-orm'
import { NextRequest } from 'next/server'
import { authMcpRequest } from '../lib'

async function handleMcpRequest(request: NextRequest) {
  const body = await request.json()
  const { jsonrpc, id, method, params } = body

  if (jsonrpc !== '2.0') {
    return Response.json({ error: 'Invalid JSON-RPC version' }, { status: 400 })
  }

  try {
    switch (method) {
      case 'initialize': {
        return Response.json({
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              resources: {
                listChanged: true,
              },
              tools: {},
            },
            serverInfo: {
              name: 'location-tracker',
              version: '1.0.0',
            },
          },
        })
      }

      case 'resources/list': {
        const locations = await db.query.Locations.findMany({
          where: eq(Locations.userId, DEFAULT_USER_ID),
          orderBy: desc(Locations.timestamp),
          limit: 100,
        })

        return Response.json({
          jsonrpc: '2.0',
          id,
          result: {
            resources: locations.map(location => ({
              uri: `location://${location.id}`,
              name: `Location ${location.id}`,
              description: `Location recorded at ${location.timestamp}`,
              mimeType: 'application/json',
            })),
          },
        })
      }

      case 'resources/read': {
        const { uri } = params
        const locationId = uri.replace('location://', '')

        const location = await db.query.Locations.findFirst({
          where: and(
            eq(Locations.id, locationId),
            eq(Locations.userId, DEFAULT_USER_ID),
          ),
        })

        if (!location) {
          return Response.json({
            jsonrpc: '2.0',
            id,
            error: {
              code: -32602,
              message: `Location not found: ${locationId}`,
            },
          })
        }

        return Response.json({
          jsonrpc: '2.0',
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(location, null, 2),
              },
            ],
          },
        })
      }

      case 'tools/list': {
        return Response.json({
          jsonrpc: '2.0',
          id,
          result: {
            tools: [
              {
                name: 'get_locations',
                description:
                  'Get location data with optional filtering by date range',
                inputSchema: {
                  type: 'object',
                  properties: {
                    startDate: {
                      type: 'string',
                      description: 'Start date in ISO format (optional)',
                    },
                    endDate: {
                      type: 'string',
                      description: 'End date in ISO format (optional)',
                    },
                    limit: {
                      type: 'number',
                      description:
                        'Maximum number of locations to return (default: 50)',
                      default: 50,
                    },
                  },
                },
              },
              {
                name: 'get_location_stats',
                description: 'Get statistics about location data',
                inputSchema: {
                  type: 'object',
                  properties: {
                    days: {
                      type: 'number',
                      description:
                        'Number of days to look back for stats (default: 30)',
                      default: 30,
                    },
                  },
                },
              },
            ],
          },
        })
      }

      case 'tools/call': {
        const { name, arguments: args } = params

        switch (name) {
          case 'get_locations': {
            const { startDate, endDate, limit = 50 } = args

            const conditions = [eq(Locations.userId, DEFAULT_USER_ID)]

            if (startDate) {
              conditions.push(gte(Locations.timestamp, new Date(startDate)))
            }

            if (endDate) {
              conditions.push(lte(Locations.timestamp, new Date(endDate)))
            }

            const whereClause = and(...conditions)

            const locations = await db.query.Locations.findMany({
              where: whereClause,
              orderBy: desc(Locations.timestamp),
              limit: Math.min(limit, 100),
            })

            return Response.json({
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(
                      {
                        count: locations.length,
                        locations: locations.map(loc => ({
                          id: loc.id,
                          timestamp: loc.timestamp,
                          latitude: loc.latitude,
                          longitude: loc.longitude,
                          source: loc.source,
                          accuracy: loc.accuracy,
                        })),
                      },
                      null,
                      2,
                    ),
                  },
                ],
              },
            })
          }

          case 'get_location_stats': {
            const { days = 30 } = args
            const startDate = new Date()
            startDate.setDate(startDate.getDate() - days)

            const locations = await db.query.Locations.findMany({
              where: and(
                eq(Locations.userId, DEFAULT_USER_ID),
                gte(Locations.timestamp, startDate),
              ),
              orderBy: desc(Locations.timestamp),
            })

            const totalLocations = locations.length
            const uniqueDays = new Set(
              locations.map(loc => loc.timestamp.toISOString().split('T')[0]),
            ).size

            const sources = locations.reduce(
              (acc, loc) => {
                acc[loc.source || 'unknown'] =
                  (acc[loc.source || 'unknown'] || 0) + 1
                return acc
              },
              {} as Record<string, number>,
            )

            return Response.json({
              jsonrpc: '2.0',
              id,
              result: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(
                      {
                        period: `${days} days`,
                        totalLocations,
                        uniqueDays,
                        averagePerDay: totalLocations / uniqueDays,
                        sources,
                        dateRange: {
                          start: startDate.toISOString(),
                          end: new Date().toISOString(),
                        },
                      },
                      null,
                      2,
                    ),
                  },
                ],
              },
            })
          }

          default:
            return Response.json({
              jsonrpc: '2.0',
              id,
              error: {
                code: -32601,
                message: `Unknown tool: ${name}`,
              },
            })
        }
      }

      default:
        return Response.json({
          jsonrpc: '2.0',
          id,
          error: {
            code: -32601,
            message: `Method not found: ${method}`,
          },
        })
    }
  } catch (error) {
    console.error('MCP request error:', error)
    return Response.json({
      jsonrpc: '2.0',
      id,
      error: {
        code: -32603,
        message: 'Internal error',
      },
    })
  }
}

export const GET = authMcpRequest(async (request: NextRequest) => {
  console.log('GET /api/mcp')
  return new Response('MCP Server - Use POST for requests', { status: 200 })
})

export const POST = authMcpRequest(async (request: NextRequest) => {
  console.log('POST /api/mcp')
  return handleMcpRequest(request)
})
