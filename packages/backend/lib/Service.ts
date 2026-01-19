import { Workflow } from "./types/Workflow";

export interface Service {
  getWorkflowsForLatestCommit(): Promise<Workflow[]>
  getHistory(): Promise<Workflow[]>
}
