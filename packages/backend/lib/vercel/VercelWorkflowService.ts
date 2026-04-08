import type { Service } from "../Service";
import type { Workflow } from "../types/Workflow";
import { WorkflowStatus } from "../types/WorkflowStatus";

type VercelReadyState = "ERROR" | "READY" | "BUILDING" | string;

type VercelDeployment = {
  id: string;
  uid: string;
  name: string;
  createdAt: number;
  readyState: VercelReadyState;
  state: VercelReadyState;
  creator: { username: string };
  meta: { githubCommitMessage: string; githubCommitRef: string };
  oidcTokenClaims: { aud: string };
  target: string;
  inspectorUrl: string;
};

const VERCEL_API = "https://api.vercel.com";

export class VercelWorkflowService implements Service {
  private readonly headers: Record<string, string>;

  constructor(private readonly name: string) {
    this.headers = {
      Authorization: `Bearer ${process.env.VERCEL_BEARER}`,
    };
  }

  private mapReadyState(state: VercelReadyState): WorkflowStatus {
    switch (state) {
      case "ERROR":
        return WorkflowStatus.failure;
      case "READY":
        return WorkflowStatus.success;
      default:
        return WorkflowStatus.running;
    }
  }

  async getWorkflowsForLatestCommit(): Promise<Workflow[]> {
    const response = await fetch(`${VERCEL_API}/v9/projects/${this.name}`, {
      method: "GET",
      headers: this.headers,
    });
    const data = (await response.json()) as {
      latestDeployments: VercelDeployment[];
    };

    return data.latestDeployments.map((deployment) => ({
      id: deployment.id,
      title: deployment.name,
      description: deployment.meta.githubCommitMessage,
      createdAt: new Date(deployment.createdAt).toISOString(),
      updatedAt: new Date(deployment.createdAt).toISOString(),
      actor: deployment.creator.username,
      status: this.mapReadyState(deployment.readyState),
      branch: deployment.meta.githubCommitRef,
      uri: deployment.oidcTokenClaims.aud,
    }));
  }

  async getHistory(): Promise<Workflow[]> {
    const response = await fetch(`${VERCEL_API}/v6/deployments`, {
      method: "GET",
      headers: this.headers,
    });
    const data = (await response.json()) as { deployments: VercelDeployment[] };

    return data.deployments.map((deployment) => ({
      id: deployment.uid,
      title: deployment.name,
      description: "",
      createdAt: new Date(deployment.createdAt).toISOString(),
      updatedAt: new Date(deployment.createdAt).toISOString(),
      actor: deployment.creator.username,
      status: this.mapReadyState(deployment.state),
      branch: deployment.target,
      uri: deployment.inspectorUrl,
    }));
  }
}
