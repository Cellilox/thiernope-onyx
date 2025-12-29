import { ActionsTable } from "./ActionTable";
import { ToolSnapshot, MCPServersResponse } from "@/lib/tools/interfaces";
import Separator from "@/refresh-components/Separator";
import Text from "@/refresh-components/texts/Text";
import Title from "@/components/ui/title";
import { fetchSS } from "@/lib/utilsSS";
import { ErrorCallout } from "@/components/ErrorCallout";
import { AdminPageTitle } from "@/components/admin/Title";
import SvgActions from "@/icons/actions";
import RestrictedCreateButtons from "./RestrictedCreateButtons";

export default async function Page() {
  // Fetch both tools and MCP servers
  const [toolResponse, mcpResponse] = await Promise.all([
    fetchSS("/tool"),
    fetchSS("/admin/mcp/servers"),
  ]);

  if (!toolResponse.ok) {
    return (
      <ErrorCallout
        errorTitle="Something went wrong :("
        errorMsg={`Failed to fetch tools - ${await toolResponse.text()}`}
      />
    );
  }

  const tools = (await toolResponse.json()) as ToolSnapshot[];

  // Filter out MCP tools from the regular tools list
  const nonMcpTools = tools.filter((tool) => !tool.mcp_server_id);

  let mcpServers: MCPServersResponse["mcp_servers"] = [];
  if (mcpResponse.ok) {
    try {
      const mcpData = (await mcpResponse.json()) as MCPServersResponse;
      mcpServers = mcpData.mcp_servers;
    } catch (error) {
      console.error("Error parsing MCP servers response:", error);
    }
  } else {
    return (
      <ErrorCallout
        errorTitle="Something went wrong :("
        errorMsg={`Failed to fetch MCP servers - ${await mcpResponse.text()}`}
      />
    );
  }

  return (
    <div className="mx-auto container">
      <AdminPageTitle
        // icon={<SvgActions className="stroke-text-04 h-8 w-8" />}
        title="Actions"
      />

      <Text className="mb-2">
        Actions allow assistants to retrieve information or take actions.
      </Text>

      <div>
        <RestrictedCreateButtons />

        <Separator />

        <Title>Existing Actions</Title>
        <ActionsTable tools={nonMcpTools} mcpServers={mcpServers} />
      </div>
    </div>
  );
}
