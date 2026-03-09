import { version } from '../../package.json';
import { MinimalProject } from '../components/minimal-project';
import { Project } from "../components/project";
import { GithubWorkflowService } from "@repo/backend/lib/github/GithubWorkflowService";
import { VercelWorkflowService } from "@repo/backend/lib/vercel/VercelWorkflowService";

export const DashboardMinimal = ({ gitRepos, vercelProjects }: { gitRepos: string[], vercelProjects: string[] }) => {
  const repos: [string, string] = gitRepos.map(repo => repo.split('/')) as unknown as [string, string];

  return (
    <box padding={2}>
      <scrollbox focused>
        <box alignSelf="center" marginBottom={2}>
          <text>{version}</text>
          <ascii-font text={'Workflows'} />
        </box>

        <box flexDirection={'column'} gap={1}>
          {repos.map(([owner, repo]) => (
            <MinimalProject key={`${owner}/${repo}`} service={new GithubWorkflowService(owner!, repo!)} title={`${owner}/${repo}`} />
          ))}

          {vercelProjects.map((project) => (<MinimalProject key={project} service={new VercelWorkflowService(project)} title={project} />))}
        </box>
      </scrollbox>
    </box>
  );
};
