import { TextAttributes } from "@opentui/core";
import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { COLORS } from "../config/colors";
import { getStatusColor } from "../utils/get-status-color";
import type { RepositoryActionProps } from "./repository-action";

export const RepositoryActionMinimal = ({
  project,
  status,
  title,
  branch,
  createdAt,
  url,
}: RepositoryActionProps & { project: string }) => (
  <box title={title}>
    <box width={2} backgroundColor={getStatusColor(status)} />
    <box marginLeft={3} flexGrow={1}>
      <box
        backgroundColor={
          status === WorkflowStatus.failure ? COLORS.failure : undefined
        }
        flexDirection="row"
        gap={1}
      >
        <text attributes={TextAttributes.BOLD}>{project}</text>
        {branch && <text bg={COLORS.neutral}>{branch}</text>}
        <text attributes={TextAttributes.BOLD}>{title}</text>
      </box>
      {url && <text fg="#349beb">{url}</text>}
      {createdAt && (
        <text attributes={TextAttributes.DIM}>
          {new Date(createdAt).toLocaleString()}
        </text>
      )}
    </box>
  </box>
);
