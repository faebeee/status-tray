import type { Workflow } from "@repo/backend/lib/types/Workflow"; import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { useViewContext } from "../context/view-context";
import { MinimalRepositoryAction } from "./minimal-repository-action";

export type ProjectProps = {
  title: string;
  workflows: Workflow[]
}

export const MinimalProject = ({ title, workflows }: ProjectProps) => {
  const viewContext = useViewContext();

  if (viewContext.showOnlyFailed && workflows.every(w => [WorkflowStatus.success].includes(w.status))) {
    return null;
  }

  return <>
    {workflows.map((run: Workflow) => (
      <MinimalRepositoryAction
        project={title}
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
  </>;
}
