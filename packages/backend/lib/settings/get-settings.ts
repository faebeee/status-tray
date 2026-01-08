import { getPassword } from 'keytar';
import { KEYCHAIN_SERVICE } from '../config';
import { getGithubToken } from '../github/get-github-token';
import { TuiSettings } from '../types/tui-settings';

export const getSettings = async (): Promise<TuiSettings> => {
  return {
    githubToken: await getGithubToken(),
    vercelToken: await getPassword(KEYCHAIN_SERVICE, 'vercel')
  };
};
