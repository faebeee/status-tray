import { WorkflowStatus } from "@repo/backend/lib/types/WorkflowStatus";
import { COLORS } from "../config/colors";

export const getStatusColor = 	(status: WorkflowStatus)=> {
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
