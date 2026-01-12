import { TextAttributes } from '@opentui/core';
import { WorkflowStatus } from '@repo/backend/lib/types/WorkflowStatus.ts';
import { COLORS } from '../config/colors.ts';

export type RepositoryActionProps = {
  status: WorkflowStatus;
  title: string
  description: string;
  branch?: string;
  actor?: string;
  createdAt?: string
}

export const RepositoryAction = ({ status, title, description, branch, createdAt, actor }: RepositoryActionProps) => {
  const getColor = () => {
    console.log(status);
    if (status === WorkflowStatus.running) {
      return COLORS.info
    }

    if (status === WorkflowStatus.success) {
      return COLORS.success;
    }

    if (status === WorkflowStatus.failure) {
      return COLORS.failure;
    }

    return COLORS.neutral;
  };


  return <box title={title}>
    <box width={2} backgroundColor={getColor()}></box>
    <box marginLeft={3} flexGrow={1}>
      <box backgroundColor={status === WorkflowStatus.failure ? COLORS.failure : undefined}>
        <text attributes={TextAttributes.BOLD} font-size={3}>{title}</text>
      </box>
      <text attributes={TextAttributes.DIM}>{description}</text>
      {createdAt && <text attributes={TextAttributes.DIM}>{new Date(createdAt).toLocaleString()}</text>}
      <box flexDirection='row' gap={2}>
        {actor && <text bg={COLORS.neutral}><span attributes={TextAttributes.BOLD}>Actor</span> {actor}</text>}
        {branch && <text bg={COLORS.neutral}><span  attributes={TextAttributes.BOLD}>Branch</span> {branch}</text>}
      </box>
    </box>
  </box>;
};
function useMemo(arg0: () => string | undefined, arg1: WorkflowStatus[]) {
    throw new Error('Function not implemented.');
}
