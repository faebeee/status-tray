import { createCliRenderer, KeyEvent } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { useState } from "react";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { ViewContext } from "./context/view-context.ts";
import { Dashboard } from "./views/dashboard.tsx";
import { DashboardMinimal } from "./views/dashboard-minimal.tsx";
import { assertGhAuth } from "./utils/assert-gh-auth.ts";

await assertGhAuth();

const argv = await yargs(hideBin(process.argv))
  .option("git", { type: "string", array: true, default: [] as string[] })
  .option("vercel", { type: "string", array: true, default: [] as string[] })
  .option("minimal", { type: "boolean", default: false })
  .parse();

const renderer = await createCliRenderer();

function App({
  gitRepos,
  vercelProjects,
  minimal,
}: {
  minimal: boolean;
  gitRepos: string[];
  vercelProjects: string[];
}) {
  const [showOnlyFailed, setShowOnlyFailed] = useState(false);

  useKeyboard((key) => {
    if (key.name === "x") {
      setShowOnlyFailed(!showOnlyFailed);
    }
  });

  return (
    <ViewContext.Provider
      value={{
        showOnlyFailed,
        toggle: () => setShowOnlyFailed(!showOnlyFailed),
      }}
    >
      {minimal ? (
        <DashboardMinimal gitRepos={gitRepos} vercelProjects={vercelProjects} />
      ) : (
        <Dashboard gitRepos={gitRepos} vercelProjects={vercelProjects} />
      )}
    </ViewContext.Provider>
  );
}

renderer.keyInput.on("keypress", (key: KeyEvent) => {
  if (key.ctrl && key.name === "l") {
    renderer.console.toggle();
  }
});

createRoot(renderer).render(
  <App
    minimal={argv.minimal}
    gitRepos={argv.git}
    vercelProjects={argv.vercel}
  />,
);
