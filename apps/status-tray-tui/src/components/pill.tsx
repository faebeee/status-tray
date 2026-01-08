import type { ReactNode } from 'react';

export type PillProps = {
  children: ReactNode
}

export const Pill = ({children}: PillProps) => {
  return <box border borderStyle={'rounded'}>
    {children}
  </box>;
};
