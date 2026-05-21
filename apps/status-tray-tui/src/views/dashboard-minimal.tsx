import { version } from "../../package.json";
import { GithubWorkflowService } from "@repo/backend/lib/github/GithubWorkflowService";
import { VercelWorkflowService } from "@repo/backend/lib/vercel/VercelWorkflowService";
import { MinimalProject } from "../components/minimal-project";

type DashboardMinimalProps = {
  gitRepos: string[];
  vercelProjects: string[];
};

export const DashboardMinimal = ({
  gitRepos,
  vercelProjects,
}: DashboardMinimalProps) => (
  <box padding={2}>
    <scrollbox focused>
      <box alignSelf="center" marginBottom={2}>
        <text>{version}</text>
        <ascii-font text="Workflows" />
      </box>

      <box flexDirection="column" gap={1}>
        {gitRepos.map((repo) => {
          const [owner, name] = repo.split("/");
          return (
            <MinimalProject
              key={repo}
              title={repo}
              service={new GithubWorkflowService(owner!, name!)}
            />
          );
        })}

        {vercelProjects.map((project) => (
          <MinimalProject
            key={project}
            title={project}
            service={new VercelWorkflowService(project)}
          />
        ))}
      </box>
    </scrollbox>
  </box>
);
