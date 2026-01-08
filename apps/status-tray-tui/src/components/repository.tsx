import { GithubWorkflowService } from '@repo/backend/lib/github/GithubWorkflowService.ts';
import type { Workflow } from '@repo/backend/lib/types/Workflow.ts';
import { useEffect, useState } from 'react';
import { RepositoryAction } from './repository-action.tsx';

export type RepositoryProps = {
  owner: string;
  repo: string;
}

export const Repository = ({ owner, repo }: RepositoryProps) => {
  const service = new GithubWorkflowService();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);

  const load = async () => {
    const runs = await service.getWorkflowRunsForRepo(owner, repo);
    setWorkflows(runs);
  };

  useEffect(() => {
    const i = setInterval(load, 1000 * 60);
    load();

    return () => {
      clearInterval(i);
    };
  }, []);

  return <box justifyContent="center" alignItems="flex-start" border padding={1}>
    <text>{owner}/{repo}</text>
    <box paddingLeft={2} marginTop={1}>
      <box gap={1} title={'Runs'}>
        {workflows.map((run: Workflow) => (
          <RepositoryAction
            status={run.status}
            title={run.title}
            description={run.description}
            branch={'master'}
            actor={'faebeee'}
          />
        ))}
      </box>
    </box>
  </box>;
};
