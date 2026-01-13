import { TextAttributes } from '@opentui/core';
import { WorkflowStatus } from '@repo/backend/lib/types/WorkflowStatus.ts';
import { COLORS } from '../config/colors.ts';
import { getStatusColor } from '../utils/get-status-color.ts';

export type RepositoryActionProps = {
  status: WorkflowStatus;
  project?: string;
  title: string
  description: string;
  branch?: string;
  actor?: string;
  event?: string;
  createdAt?: string;
  url?: string;
}

export const MinimalRepositoryAction = ({ status, project, event, url, title, description, branch, createdAt, actor }: RepositoryActionProps) => {
  return <box title={title}>
    <box width={2} backgroundColor={getStatusColor(status)}></box>
    <box marginLeft={3} flexGrow={1}>
      <box>
        <text attributes={TextAttributes.BOLD} font-size={3}>{project} :: {title}</text>
      </box>
      <box flexDirection='row' gap={2}>
        {createdAt && <text attributes={TextAttributes.DIM}>{new Date(createdAt).toLocaleString()}</text>}
        {actor && <text bg={COLORS.neutral}><span attributes={TextAttributes.BOLD}>Actor</span> {actor}</text>}
        {branch && <text bg={COLORS.neutral}><span  attributes={TextAttributes.BOLD}>Branch</span> {branch}</text>}
        {event && <text bg={COLORS.neutral}><span  attributes={TextAttributes.BOLD}>Event</span> {event}</text>}
      </box>
    </box>
  </box>;
};
