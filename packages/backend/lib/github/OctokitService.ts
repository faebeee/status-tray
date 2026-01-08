import { Octokit } from '@octokit/rest';
import { getGithubToken } from './get-github-token';

export class OctokitService {
  private static instance: OctokitService;
  private appOctokit: Octokit | null = null;

  private constructor() {
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

  static getInstance(): OctokitService {
    if (!OctokitService.instance) {
      OctokitService.instance = new OctokitService();
    }
    return OctokitService.instance;
  }
}
