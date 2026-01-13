import { useKeyboard } from '@opentui/react';
import { GithubWorkflowService } from '@repo/backend/lib/github/GithubWorkflowService.ts';
import type { Workflow } from '@repo/backend/lib/types/Workflow.ts';
import { useEffect, useState } from 'react';
import { Project } from '../project.tsx';

export type RepositoryProps = {
  owner: string;
  repo: string;
}

export const GitRepository = ({ owner, repo }: RepositoryProps) => {
  const service = new GithubWorkflowService();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const load = async () => {
    const runs = await service.getWorkflowRunsForRepo(owner, repo);
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

  return <Project title={`${owner}/${repo}`} workflows={workflows} />
};
