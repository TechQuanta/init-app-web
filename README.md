# Init App Web

The web interface for planning Init App projects. It generates a portable command preview and links users to the hosted Init App MCP server.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## MCP server

The hosted MCP endpoint is `https://initapp.fastmcp.app/mcp`.

## Inspect MCP locally

Run the MCP Inspector to test the hosted endpoint in a local browser:

```bash
npx @modelcontextprotocol/inspector https://initapp.fastmcp.app/mcp
```

This opens the Inspector directly against the hosted Streamable HTTP endpoint.
