import type { Workflow } from "@repo/backend/lib/types/Workflow";
import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { useViewContext } from "../context/view-context";
import { RepositoryAction } from "./repository-action";
import { ProjectHistory } from "./project-history";
import type { Service } from "@repo/backend/lib/Service";
import { useEffect, useState } from "react";
import { useKeyboard } from "@opentui/react";

export type ProjectProps = {
  title: string;
  service: Service;
}

export const Project = ({ title, service }: ProjectProps) => {
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

  return <box justifyContent="center" alignItems="flex-start" border padding={1}>

    <box flexDirection="column" gap={1} justifyContent={'space-between'}>
      <text>{title}</text>
      <ProjectHistory workflows={workflowHistory} />
    </box>

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
