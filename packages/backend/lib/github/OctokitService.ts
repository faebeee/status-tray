import { Octokit } from '@octokit/rest';
import { getGithubToken } from './get-github-token';

export class OctokitService {
  private appOctokit: Octokit | null = null;

  constructor() {
    getGithubToken().then((token) => {
      this.appOctokit = new Octokit({
        auth: token
      });
    });
  }

  getApi() {
    return this.appOctokit;
  }

  async updateAuth() {
    const token = await getGithubToken();
    this.appOctokit = new Octokit({
      auth: token
    });
  }

}
