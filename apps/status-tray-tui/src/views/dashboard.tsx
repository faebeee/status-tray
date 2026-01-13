import { GitRepository } from "../components/github/git-repository";
import { VercelProject } from "../components/vercel/vercel-project";

export const Dashboard = ({ gitRepos, vercelProjects }: { gitRepos: string[], vercelProjects: 	string[]}) => {
  const repos:[string, string] = gitRepos.map(repo => repo.split('/')) as unknown as [string, string];

  return (
    <box padding={2}>
      <scrollbox focused>
        <box alignSelf="center" marginBottom={2}>
          <ascii-font text={'Workflows'}/>
        </box>

        {repos.map(([owner, repo]) => (
          <GitRepository key={`${owner}/${repo}`} owner={owner!} repo={repo!}/>
        ))}

        {vercelProjects.map((project) => (<VercelProject key={project} projectName={project} />))}
      </scrollbox>
    </box>
  );
};
