import { useKeyboard } from "@opentui/react";
import type { Workflow } from "@repo/backend/lib/types/Workflow";
import { VercelWorkflowService } from '@repo/backend/lib/vercel/VercelWorkflowService';
import { useEffect, useState } from 'react';
import { Project } from "../project";

export type VercelProjectProps = {
  projectName: string;
}

export const VercelProject = ({ projectName }: VercelProjectProps) => {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const service = new VercelWorkflowService(projectName);

  const load = async () => {
    const runs = await service.getWorkflows();
    setWorkflows((oldRuns: Workflow[]) => {
      if (oldRuns[0]?.id !== runs[0]?.id) {
        // add notification
      }
      return runs
    });
  };

  useKeyboard((key) => {
    if (key.name === 'r') {
      load();
    }
  })

  useEffect(() => {
    const i = setInterval(load, 1000 * 60);
    load();

    return () => {
      clearInterval(i);
    };
  }, []);

  return <Project title={ projectName} workflows={workflows}/>
}
