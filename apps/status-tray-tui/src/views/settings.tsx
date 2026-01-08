import { OctokitService } from '@repo/backend/lib/github/OctokitService.ts';
import type { TuiSettings } from '@repo/backend/lib/types/tui-settings.ts';
import { useState } from 'react';

export type SettingsProps = {
  settings: TuiSettings;
}

export const Settings = ({ settings }: SettingsProps) => {
  const [githubToken, setGithubToken] = useState(settings.githubToken || '');

  const persistGithubToken = (value: string) => {
    console.log(value);
    OctokitService.getInstance().updateAuth();
  };

  return (
    <box padding={2}>

      <box alignSelf="center">
        <ascii-font text={'Settings'}/>
      </box>

      <box padding={2}>
        <box title="Github Token" style={{ border: true, height: 3 }}>
          <input
            placeholder="Type here..."
            focused
            value={githubToken}
            onInput={setGithubToken}
            onSubmit={persistGithubToken}
          />
        </box>
      </box>
    </box>
  );
};
