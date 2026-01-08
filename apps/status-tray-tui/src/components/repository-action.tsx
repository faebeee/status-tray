import { TextAttributes } from '@opentui/core';
import { WorkflowStatus } from '@repo/backend/lib/types/WorkflowStatus.ts';
import { COLORS } from '../config/colors.ts';
import { Pill } from './pill.tsx';

export type RepositoryActionProps = {
  status: WorkflowStatus;
  title: string
  description: string;
  branch?: string;
  actor?: string;
}

export const RepositoryAction = ({ status, title, description, branch }: RepositoryActionProps) => {
  return <box title={title}>
    <box width={2} backgroundColor={status === WorkflowStatus.failure ? COLORS.failure : COLORS.success}></box>
    <box marginLeft={3} flexGrow={1}>
      <box backgroundColor={status === WorkflowStatus.failure ? COLORS.failure : undefined}>
        <text attributes={TextAttributes.BOLD} font-size={3}>{title}</text>
      </box>
      <text attributes={TextAttributes.DIM}>{description}</text>

      {branch && <Pill>
        <text attributes={TextAttributes.DIM}><span attributes={TextAttributes.BOLD}>Branch:</span>{branch}</text>
      </Pill>}
    </box>
  </box>;
};
