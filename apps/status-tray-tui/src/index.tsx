import { createCliRenderer, KeyEvent } from '@opentui/core';
import { createRoot, useKeyboard } from '@opentui/react';
import { useState } from 'react';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { ViewContext } from './context/view-context.ts';
import { Dashboard } from './views/dashboard.tsx';
import { Minimal } from './views/minimal.tsx';

const renderer = await createCliRenderer();

function App({ gitRepos, vercelProjects, minimal }: { minimal: boolean, gitRepos: string[], vercelProjects: string[] }) {
  const [showOnlyFailed, setShowOnlyFailed] = useState(false);

  useKeyboard((key) => {
    if (key.name === "x") {
      setShowOnlyFailed(!showOnlyFailed);
    }
  });

  return (<ViewContext.Provider value={{ showOnlyFailed, toggle: () => setShowOnlyFailed(!showOnlyFailed) }}>
    {minimal ? <Minimal gitRepos={gitRepos} vercelProjects={vercelProjects} />
      : <Dashboard gitRepos={gitRepos} vercelProjects={vercelProjects} />}
  </ViewContext.Provider>);
}

renderer.keyInput.on('keypress', (key: KeyEvent) => {
  if (key.ctrl && key.name === 'l') {
    renderer.console.toggle();
  }
});

const argv = yargs(hideBin(process.argv)).parse()
const vercelProjects = argv.vercel ? (Array.isArray(argv.vercel) ? argv.vercel : [argv.vercel]) : [];
const minimal = argv.minimal ?? false;

createRoot(renderer).render(<App minimal={minimal} gitRepos={argv.git ?? []} vercelProjects={vercelProjects} />);
