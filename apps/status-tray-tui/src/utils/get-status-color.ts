import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { COLORS } from "../config/colors";

export const getStatusColor = (status: WorkflowStatus): string => {
  switch (status) {
    case WorkflowStatus.running:
      return COLORS.info;
    case WorkflowStatus.success:
      return COLORS.success;
    case WorkflowStatus.failure:
      return COLORS.failure;
    default:
      return COLORS.neutral;
  }
};
