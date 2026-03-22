import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/api/client";
import { TaskBoard } from "@/components/TaskBoard";

export function GlobalTasks() {
  const { data: agentsData } = useQuery({
    queryKey: ["agents"],
    queryFn: api.agents,
    staleTime: 10_000,
  });

  const agents = agentsData?.agents ?? [];

  const agentNames = useMemo(() => {
    const map: Record<string, string | undefined> = {};
    for (const agent of agents) {
      map[agent.id] = agent.display_name;
    }
    return map;
  }, [agents]);

  // Use the first agent as default owner for task creation.
  // In the global view this is a reasonable default — the user can reassign later.
  const defaultOwner = agents[0]?.id;

  return (
    <TaskBoard
      ownerAgentId={defaultOwner}
      agentNames={agentNames}
      showAgentBadge={agents.length > 1}
    />
  );
}
