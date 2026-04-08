import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { Workflow } from "../types/Workflow";
import type { Service } from "../Service";
import { WorkflowStatus } from "../types/WorkflowStatus";

const execFileAsync = promisify(execFile);

type WorkflowRunStatus =
  | "completed"
  | "in_progress"
  | "queued"
  | "requested"
  | "waiting"
  | "pending";

type WorkflowRunConclusion =
  | "action_required"
  | "cancelled"
  | "failure"
  | "neutral"
  | "skipped"
  | "stale"
  | "success"
  | "timed_out"
  | null;

type WorkflowRun = {
  id: number;
  name: string | null;
  display_title: string | null;
  html_url: string;
  created_at: string;
  updated_at: string;
  status: WorkflowRunStatus;
  conclusion: WorkflowRunConclusion;
  head_branch: string | null;
  event: string;
  triggering_actor: { login: string; email?: string } | null;
  head_commit: { id: string } | null;
};

const ACTIVE_STATUSES: WorkflowRunStatus[] = [
  "in_progress",
  "queued",
  "requested",
  "waiting",
  "pending",
];

const SUCCESS_CONCLUSIONS: WorkflowRunConclusion[] = ["success", "cancelled"];

const FAILURE_CONCLUSIONS: WorkflowRunConclusion[] = [
  "action_required",
  "failure",
  "neutral",
  "skipped",
  "stale",
  "timed_out",
];

// Selects only the fields we need to keep the response payload small.
const JQ_FILTER = [
  ".workflow_runs[] | {",
  "  id, name, display_title, html_url, created_at, updated_at,",
  "  status, conclusion, head_branch, event,",
  "  triggering_actor: { login: .triggering_actor.login, email: .triggering_actor.email },",
  "  head_commit: { id: .head_commit.id }",
  "}",
].join("\n");

export class GithubWorkflowService implements Service {
  constructor(
    private readonly owner: string,
    private readonly repo: string,
  ) {}

  private async fetchRuns(): Promise<WorkflowRun[]> {
    const { stdout } = await execFileAsync("gh", [
      "api",
      `repos/${this.owner}/${this.repo}/actions/runs`,
      "--jq",
      JQ_FILTER,
    ]);

    return stdout
      .trim()
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as WorkflowRun);
  }

  private mapStatus(run: WorkflowRun): WorkflowStatus {
    if (ACTIVE_STATUSES.includes(run.status)) {
      return WorkflowStatus.running;
    }

    if (run.status === "completed") {
      if (SUCCESS_CONCLUSIONS.includes(run.conclusion)) {
        return WorkflowStatus.success;
      }
      if (FAILURE_CONCLUSIONS.includes(run.conclusion)) {
        return WorkflowStatus.failure;
      }
    }

    return WorkflowStatus.unknown;
  }

  private mapRun(run: WorkflowRun): Workflow {
    return {
      id: run.id,
      title: run.name ?? "N/A",
      description: run.display_title ?? "N/A",
      uri: run.html_url,
      createdAt: run.created_at,
      updatedAt: run.updated_at,
      status: this.mapStatus(run),
      branch: run.head_branch ?? undefined,
      event: run.event,
      actor:
        run.triggering_actor?.login ?? run.triggering_actor?.email ?? "N/A",
    };
  }

  async getWorkflowsForLatestCommit(): Promise<Workflow[]> {
    const runs = await this.fetchRuns();
    const latestCommitId = runs[0]?.head_commit?.id;

    if (!latestCommitId) {
      return [];
    }

    return runs
      .filter(
        (run) =>
          run.head_commit?.id === latestCommitId || run.status !== "completed",
      )
      .map((run) => this.mapRun(run));
  }

  async getHistory(): Promise<Workflow[]> {
    const runs = await this.fetchRuns();
    return runs.map((run) => this.mapRun(run));
  }
}
