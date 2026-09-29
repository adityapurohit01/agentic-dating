import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { ToolRegistry } from "../server/tools/registry";

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
