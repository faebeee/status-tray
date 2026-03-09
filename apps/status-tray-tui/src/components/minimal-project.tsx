import type { Workflow } from "@repo/backend/lib/types/Workflow"; import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { useViewContext } from "../context/view-context";
import { MinimalRepositoryAction } from "./minimal-repository-action";
import type { ProjectProps } from "./project";
import { useEffect, useState } from "react";
import { useKeyboard } from "@opentui/react";
import { ProjectHistory } from "./project-history";
import { RepositoryActionMinimal } from "./repository-action-minimal";


export const MinimalProject = ({ title, service }: ProjectProps) => {
  const viewContext = useViewContext();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [workflowHistory, setHistory] = useState<Workflow[]>([]);

  const loadWorkflows = async () => {
    const [loadedWorkflows, loadedWorkflowHistory] = await Promise.all([
      service.getWorkflowsForLatestCommit(),
      service.getHistory()
    ]);
    setWorkflows(loadedWorkflows);
    setHistory(loadedWorkflowHistory);
  }

  useKeyboard((key) => {
    if (key.name === 'r') {
      loadWorkflows();
    }
  })

  useEffect(() => {
    const i = setInterval(loadWorkflows, 1000 * 60);
    loadWorkflows();

    return () => {
      clearInterval(i);
    };
  }, []);

  if (viewContext.showOnlyFailed && workflows.every(w => [WorkflowStatus.success].includes(w.status))) {
    return null;
  }

  return <>
    {workflows.map((run: Workflow) => (
      <RepositoryActionMinimal
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
