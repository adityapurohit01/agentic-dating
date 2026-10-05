import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolRegistry } from "../server/tools/registry";

const RATE_LIMITS = {
  get_profile: { maxCalls: 120, windowMs: 60_000 },
  recall_memory: { maxCalls: 120, windowMs: 60_000 },
  write_memory: { maxCalls: 60, windowMs: 60_000 },
  list_rankings: { maxCalls: 120, windowMs: 60_000 },
  get_date: { maxCalls: 120, windowMs: 60_000 },
  start_pipeline: { maxCalls: 1, windowMs: 60_000 },
} as const;

const callHistory = new Map<string, number[]>();

function checkRateLimit(toolName: string): boolean {
  const limit = RATE_LIMITS[toolName as keyof typeof RATE_LIMITS];
  if (!limit) return true;

  const now = Date.now();
  const recent = (callHistory.get(toolName) || []).filter(
    (timestamp) => now - timestamp < limit.windowMs
  );

  if (recent.length >= limit.maxCalls) {
    callHistory.set(toolName, recent);
    return false;
  }

  recent.push(now);
  callHistory.set(toolName, recent);
  return true;
}

async function main() {
  const server = new Server(
    {
      name: "agentic-dating-mcp",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // List tools
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: Object.entries(ToolRegistry).map(([name, def]) => ({
        name,
        description: def.description,
        annotations: def.annotations,
        inputSchema: {
          type: "object",
          properties: (def.schema as any).shape || {},
        },
      })),
    };
  });

  // Call tool
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = ToolRegistry[request.params.name as keyof typeof ToolRegistry];
    if (!tool) {
      throw new Error(`Unknown tool: ${request.params.name}`);
    }

    if (!checkRateLimit(request.params.name)) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Rate limit exceeded for tool "${request.params.name}". Please wait before trying again.`,
          },
        ],
      };
    }

    const validatedArgs = tool.schema.parse(request.params.arguments || {});
    const result = await tool.handler(validatedArgs as any);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
