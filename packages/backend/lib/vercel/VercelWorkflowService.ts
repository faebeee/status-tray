import type { Service } from "../Service";
import type { Workflow } from "../types/Workflow";
import { WorkflowStatus } from "../types/WorkflowStatus";
import { execa } from "execa";

type VercelReadyState = "ERROR" | "READY" | "BUILDING" | string;

type VercelDeployment = {
  url: string;
  name: string;
  state: string;
  target: null | string;
  createdAt: number;
  buildingAt: number;
  ready: number;
  creator: {
    uid: string;
    username: string;
  },
  meta: {
    githubCommitAuthorName: string;
    githubCommitMessage: string;
    githubCommitSha: string;
  }
};

const VERCEL_API = "https://api.vercel.com";

export class VercelWorkflowService implements Service {

  constructor(private readonly name: string) {
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
    const response = await execa('vercel', ['ls', this.name, '-F', 'json']);
    const { deployments } = JSON.parse(response.stdout) as { deployments: VercelDeployment[] };

    return deployments.slice(0, 1).map((deployment) => ({
      id: deployment.meta.githubCommitSha,
      title: deployment.meta.githubCommitMessage,
      description: "",
      uri: deployment.url,
      createdAt: new Date(deployment.createdAt).toISOString(),
      updatedAt: new Date(deployment.createdAt).toISOString(),
      actor: deployment.creator.username,
      status: this.mapReadyState(deployment.state),
      branch: deployment.target,
    }));
  }

  async getHistory(): Promise<Workflow[]> {
    const response = await execa('vercel', ['ls', this.name, '-F', 'json']);
    const { deployments } = JSON.parse(response.stdout) as { deployments: VercelDeployment[] };

    return deployments.map((deployment) => ({
      id: deployment.meta.githubCommitSha,
      title: deployment.meta.githubCommitMessage,
      description: "",
      uri: deployment.url,
      createdAt: new Date(deployment.createdAt).toISOString(),
      updatedAt: new Date(deployment.createdAt).toISOString(),
      actor: deployment.creator.username,
      status: this.mapReadyState(deployment.state),
      branch: deployment.target,
    }));
  }
}
