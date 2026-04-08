import { useEffect, useState } from "react";
import { useKeyboard } from "@opentui/react";
import type { Workflow } from "@repo/backend/lib/types/Workflow";
import type { Service } from "@repo/backend/lib/Service";

const POLL_INTERVAL_MS = 60_000;

type UseWorkflowsResult = {
  workflows: Workflow[];
  history: Workflow[];
};

export function useWorkflows(service: Service): UseWorkflowsResult {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [history, setHistory] = useState<Workflow[]>([]);

  const load = async () => {
    const [loadedWorkflows, loadedHistory] = await Promise.all([
      service.getWorkflowsForLatestCommit(),
      service.getHistory(),
    ]);
    setWorkflows(loadedWorkflows);
    setHistory(loadedHistory);
  };

  useKeyboard((key) => {
    if (key.name === "r") {
      load();
    }
  });

  useEffect(() => {
    const interval = setInterval(load, POLL_INTERVAL_MS);
    load();
    return () => clearInterval(interval);
  }, []);

  return { workflows, history };
}
