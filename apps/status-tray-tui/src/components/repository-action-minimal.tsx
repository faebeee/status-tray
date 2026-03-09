import { TextAttributes } from '@opentui/core';
import { WorkflowStatus } from '@repo/backend/lib/types/WorkflowStatus.ts';
import { COLORS } from '../config/colors.ts';
import { getStatusColor } from '../utils/get-status-color.ts';
import type { RepositoryActionProps } from './repository-action.tsx';


export const RepositoryActionMinimal = ({ project, status, event, url, title, description, branch, createdAt, actor }: RepositoryActionProps & { project: string }) => {
  return <box title={title}>
    <box width={2} backgroundColor={getStatusColor(status)}></box>
    <box marginLeft={3} flexGrow={1}>
      <box backgroundColor={status === WorkflowStatus.failure ? COLORS.failure : undefined} flexDirection='row' gap={1}>
        <text attributes={TextAttributes.BOLD} font-size={3}>{project}</text>
        {branch && <text bg={COLORS.neutral}>{branch}</text>}
        <text attributes={TextAttributes.BOLD} font-size={3}>{title}</text>
      </box>
      {url && <text fg={"#349beb"}>{url}</text>}
      {createdAt && <text attributes={TextAttributes.DIM}>{new Date(createdAt).toLocaleString()}</text>}
    </box>
  </box>;
};
