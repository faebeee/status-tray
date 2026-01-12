import type { RestEndpointMethodTypes } from '@octokit/rest';
import { Workflow } from '../types/Workflow';
import { WorkflowStatus } from '../types/WorkflowStatus';
import { OctokitService } from './OctokitService';

type RepoWorkflowRun = RestEndpointMethodTypes['actions']['listWorkflowRunsForRepo']['response']['data']['workflow_runs'][0]
type WorkflowConclusion =
  'completed'
  | 'action_required'
  | 'cancelled'
  | 'failure'
  | 'neutral'
  | 'skipped'
  | 'stale'
  | 'success'
  | 'timed_out'
  | 'in_progress'
  | 'queued'
  | 'requested'
  | 'waiting'
  | 'pending';

export class GithubWorkflowService {
  private api: OctokitService;

  constructor() {
    this.api = OctokitService.getInstance();
  }

  private async getListOfWorkflows(owner: string, repo: string): Promise<RepoWorkflowRun[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { data } = await this.api.getApi().rest.actions.listWorkflowRunsForRepo({
      owner,
      repo
    });

    return data.workflow_runs;
  }

  public getStatusForWorkflow(run: RepoWorkflowRun) {
    if (['in_progress', 'queued', 'requested', 'waiting', 'pending'].includes(run.conclusion as WorkflowConclusion)) {
      return WorkflowStatus.running;
    }

    if (['completed', 'cancelled', 'success'].includes(run.conclusion as WorkflowConclusion)) {
      return WorkflowStatus.success;
    }

    if (['timed_out', 'skipped', 'failure', 'action_required'].includes(run.conclusion as WorkflowConclusion)) {
      return WorkflowStatus.failure;
    }
  }

  public async getWorkflowRunsForRepo(owner: string, repo: string): Promise<Workflow[]> {
    const result = await this.getListOfWorkflows(owner, repo);
    const latestCommitId = result[0].head_commit!.id;
    const runsForCommit = result.filter((run) => (run.head_commit!.id === latestCommitId || run.status !== 'completed'));

    return runsForCommit.map(
      (run) => {

        return {
          id: run.id,
          title: run.name ?? 'K/A',
          description: run.display_title ?? 'K/A',
          uri: run.html_url,
          createdAt: run.created_at,
          updatedAt: run.updated_at,
          status: this.getStatusForWorkflow(run),
          branch: run.head_branch,
          actor: run.triggering_actor?.login ?? run.triggering_actor?.email ?? 'K/A'
        };
      }
    );
  }
}
