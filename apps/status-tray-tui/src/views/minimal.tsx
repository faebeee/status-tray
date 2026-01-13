import { MinimalGitRepo } from "../components/github/minimal-git-repo";
import { MinimalVercelProject } from "../components/vercel/minimal-vercel-project";

export const Minimal = ({ gitRepos, vercelProjects }: { gitRepos: string[], vercelProjects: string[] }) => {
  const repos:[string, string] = gitRepos.map(repo => repo.split('/')) as unknown as [string, string];

  return (
    <box padding={2}>
      <scrollbox focused>
        <box alignSelf="center" marginBottom={2}>
          <ascii-font text={'Workflows'}/>
        </box>

        <box flexDirection="column" gap={2}>
        {repos.map(([owner, repo]) => (
          <MinimalGitRepo key={`${owner}/${repo}`} owner={owner!} repo={repo!}/>
        ))}
        {vercelProjects.map((project) => (<MinimalVercelProject key={project} projectName={project} />))}
          </box>

      </scrollbox>
    </box>
  );
};
