import type { RestEndpointMethodTypes } from '@octokit/rest';
import { Workflow } from '../types/Workflow';
import { WorkflowStatus } from '../types/WorkflowStatus';
import { OctokitService } from './OctokitService';
import { Service } from '../Service';

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

export class GithubWorkflowService implements Service {
  private api: OctokitService;
  private owner: string;
  private repo: string;

  constructor(owner: string, repo: string) {
    this.api = new OctokitService();
    this.owner = owner;
    this.repo = repo;
  }

  private async getListOfWorkflows(): Promise<RepoWorkflowRun[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { data } = await this.api.getApi().rest.actions.listWorkflowRunsForRepo({
      owner: this.owner,
      repo: this.repo
    });

    return data.workflow_runs;
  }

  private getStatusForWorkflow(run: RepoWorkflowRun) {
    if (['in_progress', 'queued', 'requested', 'waiting', 'pending'].includes(run.conclusion as WorkflowConclusion)) {
      return WorkflowStatus.running;
    }

    if (['completed', 'cancelled', 'success'].includes(run.conclusion as WorkflowConclusion)) {
      return WorkflowStatus.success;
    }

    if (['timed_out', 'skipped', 'failure', 'action_required'].includes(run.conclusion as WorkflowConclusion)) {
      return WorkflowStatus.failure;
    }

    //throw new Error(run.conclusion);
    return WorkflowStatus.unknown;
  }

  public async getWorkflowsForLatestCommit(): Promise<Workflow[]> {
    const result = await this.getListOfWorkflows();
    if (!result[0]) {
      return [];
    }

    const latestCommitId = result[0].head_commit?.id;
    if (!latestCommitId) {
      return [];
    }
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
          event: run.event,
          actor: run.triggering_actor?.login ?? run.triggering_actor?.email ?? 'K/A'
        };
      }
    );
  }

  public async getHistory(): Promise<Workflow[]> {
    const workflows = await this.getListOfWorkflows();

    if (!workflows) {
      return [];
    }

    return workflows.map(
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
          event: run.event,
          actor: run.triggering_actor?.login ?? run.triggering_actor?.email ?? 'K/A'
        };
      }
    );
  }
}
