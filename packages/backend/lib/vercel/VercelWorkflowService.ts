import { Service } from "../Service";
import { Workflow } from "../types/Workflow";
import { WorkflowStatus } from "../types/WorkflowStatus";

export class VercelWorkflowService implements Service {
  private options: RequestInit;

  constructor(private name: string) {
    this.options = { method: 'GET', headers: { Authorization: `Bearer ${process.env.VERCEL_BEARER}` } };
  }

  getStatus(readyState: string) {
    console.log(readyState);
    switch (readyState) {
      case 'ERROR':
        return WorkflowStatus.failure
      case 'READY':
        return WorkflowStatus.success
      case 'BUILDING':
        return WorkflowStatus.running;
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
    const response = await fetch(`https://api.vercel.com/v6/deployments`, this.options);
    const data = await response.json();
    return data.deployments.map((deployment) => {
      return {
        id: deployment.uid,
        title: deployment.name,
        createdAt: new Date(deployment.createdAt).toISOString(),
        actor: deployment.creator.username,
        status: this.getStatus(deployment.state),
        branch: deployment.target,
        uri: deployment.inspectorUrl
      };
    });
  }
}
