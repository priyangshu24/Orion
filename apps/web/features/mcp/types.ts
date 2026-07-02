// Model Context Protocol (MCP) — types for the connector UI.
// Transports: stdio (local process), sse (legacy), http (Streamable HTTP).
// Capabilities: tools, resources, prompts — the three MCP server primitives.

export type McpTransport = "stdio" | "sse" | "http";
export type McpStatus = "connected" | "available";
export type McpAuth = "oauth" | "bearer" | "none";

export interface McpServer {
  id: string;
  name: string;
  description: string;
  transport: McpTransport;
  status: McpStatus;
  auth: McpAuth;
  /** URL for http/sse transports, or the launch command for stdio. */
  endpoint: string;
  tools: number;
  resources: number;
  prompts: number;
}
