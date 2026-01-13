import type { Workflow } from "@repo/backend/lib/types/Workflow";
import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { useViewContext } from "../context/view-context";
import { RepositoryAction } from "./repository-action";

export type ProjectProps = {
  title: string;
  workflows: Workflow[]
}

export const Project = ({ title, workflows }: ProjectProps) => {
  const viewContext = useViewContext();

  if (viewContext.showOnlyFailed && workflows.every(w => [WorkflowStatus.success].includes(w.status))) {
    return null;
  }

  return <box justifyContent="center" alignItems="flex-start" border padding={1}>
    <text>{title}</text>
    <box paddingLeft={2} marginTop={1}>
      <box gap={1} title={'Runs'}>
        {workflows.map((run: Workflow) => (
          <RepositoryAction
            key={run.id}
            status={run.status}
            title={run.title}
            description={run.description}
            createdAt={run.createdAt}
            branch={run.branch}
            actor={run.actor}
            event={run.event}
            url={run.uri}
          />
        ))}
      </box>
    </box>
  </box>;
}
