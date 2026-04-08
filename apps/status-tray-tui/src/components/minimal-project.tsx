import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { useViewContext } from "../context/view-context";
import { useWorkflows } from "../hooks/use-workflows";
import { RepositoryActionMinimal } from "./repository-action-minimal";
import type { ProjectProps } from "./project";

export const MinimalProject = ({ title, service }: ProjectProps) => {
  const { showOnlyFailed } = useViewContext();
  const { workflows } = useWorkflows(service);

  const allSucceeded = workflows.every(
    (w) => w.status === WorkflowStatus.success,
  );
  if (showOnlyFailed && allSucceeded) {
    return null;
  }

  return (
    <>
      {workflows.map((run) => (
        <RepositoryActionMinimal
          key={run.id}
          project={title}
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
    </>
  );
};
