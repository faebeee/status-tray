import type { Service } from "@repo/backend/lib/Service";
import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { useViewContext } from "../context/view-context";
import { useWorkflows } from "../hooks/use-workflows";
import { ProjectHistory } from "./project-history";
import { RepositoryAction } from "./repository-action";

export type ProjectProps = {
  title: string;
  service: Service;
};

export const Project = ({ title, service }: ProjectProps) => {
  const { showOnlyFailed } = useViewContext();
  const { workflows, history } = useWorkflows(service);

  const allSucceeded = workflows.every(
    (w) => w.status === WorkflowStatus.success,
  );
  if (showOnlyFailed && allSucceeded) {
    return null;
  }

  return (
    <box justifyContent="center" alignItems="flex-start" border padding={1}>
      <box flexDirection="column" gap={1} justifyContent="space-between">
        <text>{title}</text>
        <ProjectHistory workflows={history} />
      </box>

      <box paddingLeft={2} marginTop={1}>
        <box gap={1} title="Runs">
          {workflows.map((run) => (
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
    </box>
  );
};
