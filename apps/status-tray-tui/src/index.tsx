import { createCliRenderer, KeyEvent } from '@opentui/core';
import { createRoot } from '@opentui/react';
import { getSettings } from '@repo/backend/lib/settings/get-settings.ts';
import type { TuiSettings } from '@repo/backend/lib/types/tui-settings.ts';
import { useEffect, useMemo, useState } from 'react';
import { Dashboard } from './views/dashboard.tsx';
import { Settings } from './views/settings.tsx';

function App() {
  const [settings, setSettings] = useState<TuiSettings | null>(null);
  const needsSetup = useMemo(() => {
    if (!settings) {
      return false;
    }
    return Object.values(settings).every((entry) => !entry);
  }, [settings]);

  useEffect(() => {
    getSettings()
      .then((settings) => {
        setSettings(settings);
      });
  }, []);

  if (needsSetup === null) {
    return null;
  }

  return (<>
    {needsSetup && settings && <Settings settings={settings}/>}
    {!needsSetup && <Dashboard/>}
  </>);
}

const renderer = await createCliRenderer();

renderer.keyInput.on('keypress', (key: KeyEvent) => {
  if (key.ctrl && key.name === 'l') {
    renderer.console.toggle();
  }
});

createRoot(renderer).render(<App/>);
