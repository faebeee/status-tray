import { WorkflowStatus } from './WorkflowStatus';

export type Workflow = {
  id: number|string;
  title: string;
  description: string;
  uri?: string;
  createdAt: string;
  updatedAt: string;
  status: WorkflowStatus;
  branch?: string;
  event?: string;
  actor?: string;
}
