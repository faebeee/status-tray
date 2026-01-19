import { Service } from "../Service";
import { Workflow } from "../types/Workflow";
import { WorkflowStatus } from "../types/WorkflowStatus";

export class VercelWorkflowService implements Service {
  private options: RequestInit;

  constructor(private name: string) {
    this.options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.VERCEL_BEARER}` } };
  }

  getStatus(readyState: string) {
    switch (readyState) {
      case 'ERROR':
        return WorkflowStatus.failure
      default:
        return WorkflowStatus.running
    }
  }

  async getWorkflowsForLatestCommit(): Promise<Workflow[]> {
    const response = await fetch(`https://api.vercel.com/v9/projects/${this.name}`, this.options);
    const data = await response.json();
    return data.latestDeployments.map((deployment) => {
      return {
        id: deployment.id,
        title: deployment.name,
        createdAt: new Date(deployment.createdAt).toISOString(),
        actor: deployment.creator.username,
        description: deployment.meta.githubCommitMessage,
        status: this.getStatus(deployment.readyState),
        branch: deployment.meta.githubCommitRef,
        uri: deployment.oidcTokenClaims.aud
      }
    });
  }

  async getHistory(): Promise<Workflow[]> {
    return [];
  }
}
