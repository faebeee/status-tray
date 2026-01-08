import { WorkflowStatus } from './WorkflowStatus';

export type Workflow = {
  id: number;
  title: string;
  description: string;
  uri?: string;
  createdAt: string;
  updatedAt: string;
  status: WorkflowStatus
}
