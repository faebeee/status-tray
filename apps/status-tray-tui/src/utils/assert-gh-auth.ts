import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export async function assertGhAuth(): Promise<void> {
  try {
    await execFileAsync("gh", ["auth", "status"]);
  } catch {
    console.error(
      "Error: not logged in to the GitHub CLI. Run `gh auth login` and try again.",
    );
    process.exit(1);
  }
}
