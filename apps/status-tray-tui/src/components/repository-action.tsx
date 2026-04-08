import { TextAttributes } from "@opentui/core";
import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { COLORS } from "../config/colors";
import { getStatusColor } from "../utils/get-status-color";

export type RepositoryActionProps = {
  status: WorkflowStatus;
  title: string;
  description: string;
  branch?: string;
  actor?: string;
  event?: string;
  createdAt?: string;
  url?: string;
};

export const RepositoryAction = ({
  status,
  title,
  description,
  branch,
  actor,
  event,
  createdAt,
  url,
}: RepositoryActionProps) => (
  <box title={title}>
    <box width={2} backgroundColor={getStatusColor(status)} />
    <box marginLeft={3} flexGrow={1}>
      <box
        backgroundColor={
          status === WorkflowStatus.failure ? COLORS.failure : undefined
        }
      >
        <text attributes={TextAttributes.BOLD}>{title}</text>
      </box>
      {url && <text fg="#349beb">{url}</text>}
      <text attributes={TextAttributes.DIM}>{description}</text>
      {createdAt && (
        <text marginTop={1} attributes={TextAttributes.DIM}>
          {new Date(createdAt).toLocaleString()}
        </text>
      )}
      <box flexDirection="row" gap={2}>
        {actor && (
          <text bg={COLORS.neutral}>
            <span attributes={TextAttributes.BOLD}>Actor</span> {actor}
          </text>
        )}
        {branch && (
          <text bg={COLORS.neutral}>
            <span attributes={TextAttributes.BOLD}>Branch</span> {branch}
          </text>
        )}
        {event && (
          <text bg={COLORS.neutral}>
            <span attributes={TextAttributes.BOLD}>Event</span> {event}
          </text>
        )}
      </box>
    </box>
  </box>
);
