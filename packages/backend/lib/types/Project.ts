import { Workflow } from './Workflow';

export type Project = {
  name: string;
  workflows: Workflow[];
  uri?: string;
  type: 'github' | 'vercel';
}
