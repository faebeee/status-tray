import { version } from "../../package.json";
import { GithubWorkflowService } from "@repo/backend/lib/github/GithubWorkflowService";
import { VercelWorkflowService } from "@repo/backend/lib/vercel/VercelWorkflowService";
import { Project } from "../components/project";

type DashboardProps = {
  gitRepos: string[];
  vercelProjects: string[];
};

export const Dashboard = ({ gitRepos, vercelProjects }: DashboardProps) => (
  <box padding={2}>
    <scrollbox focused>
      <box alignSelf="center" marginBottom={2}>
        <text>{version}</text>
        <ascii-font text="Workflows" />
      </box>

      {gitRepos.map((repo) => {
        const [owner, name] = repo.split("/");
        return (
          <Project
            key={repo}
            title={repo}
            service={new GithubWorkflowService(owner!, name!)}
          />
        );
      })}

      {vercelProjects.map((project) => (
        <Project
          key={project}
          title={project}
          service={new VercelWorkflowService(project)}
        />
      ))}
    </scrollbox>
  </box>
);
