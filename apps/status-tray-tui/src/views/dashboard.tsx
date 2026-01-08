import { Repository } from '../components/repository.tsx';

export const Dashboard = () => {
  return (
    <box padding={2}>
      <scrollbox focused>
        <box alignSelf="center" marginBottom={2}>
          <ascii-font text={'Github Actions'}/>
        </box>

        <Repository owner={'konova-ag'} repo={'emi-app'}/>
        <Repository owner={'konova-ag'} repo={'emi-api'}/>
        <Repository owner={'faebeee'} repo={'storybook-utils'}/>
      </scrollbox>
    </box>
  );
};
