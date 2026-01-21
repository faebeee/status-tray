import { getStatusColor } from "../utils/get-status-color";
import type { Workflow } from "@repo/backend/lib/types/Workflow";

export type ProjectHistoryProps = {
  workflows: Workflow[];
}

export const ProjectHistory = ({ workflows }: ProjectHistoryProps) => {
  const list = workflows.map(workflow => workflow.status).slice(0, 40);

  return <box height={2} flexDirection="row" gap={1}>
    {list.map((status, i) => (<box key={i} width={1} height={1} backgroundColor={getStatusColor(status)} />))}
  </box>
}
