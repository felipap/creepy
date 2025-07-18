# MCP Server for Location Tracker

This MCP (Model Context Protocol) server provides access to location data from the tracker database through a standardized API.

## Features

- **Resources**: Access individual location records as resources
- **Tools**: Query location data with filtering and statistics
- **JSON-RPC 2.0**: Standard protocol implementation

## Available Tools

### `get_locations`

Retrieve location data with optional filtering.

**Parameters:**

- `startDate` (optional): Start date in ISO format
- `endDate` (optional): End date in ISO format
- `limit` (optional): Maximum number of locations to return (default: 50, max: 100)

**Example:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "get_locations",
    "arguments": {
      "startDate": "2024-01-01T00:00:00Z",
      "endDate": "2024-01-31T23:59:59Z",
      "limit": 25
    }
  }
}
```

### `get_location_stats`

Get statistics about location data for a specified time period.

**Parameters:**

- `days` (optional): Number of days to look back for stats (default: 30)

**Example:**

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "get_location_stats",
    "arguments": {
      "days": 7
    }
  }
}
```

## Available Resources

### Location Resources

Each location in the database is available as a resource with URI format: `location://{location-id}`

**List Resources:**

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/list",
  "params": {}
}
```

**Read Resource:**

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/read",
  "params": {
    "uri": "location://your-location-id"
  }
}
```

## Authentication

All requests must include the `x-tracker-secret` header with the correct secret value (same as used by the mobile app).

## Error Handling

The server returns standard JSON-RPC 2.0 error responses:

- `-32601`: Method not found
- `-32602`: Invalid parameters
- `-32603`: Internal error

## Testing

Use the provided `test.http` file to test the MCP server endpoints. Make sure to:

1. Replace `your-secret-here` with the actual `MOBILE_REQUEST_SECRET` value
2. Replace `location-id-here` with an actual location ID from your database
3. Start the development server with `pnpm dev`

## Integration

This MCP server can be integrated with any MCP-compatible client, including:

- Claude Desktop
- Other AI assistants that support MCP
- Custom MCP clients

The server follows the MCP specification and provides a standardized way to access location tracking data.
