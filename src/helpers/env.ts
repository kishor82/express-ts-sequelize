import { config } from '../config';
import { StaticStageName } from '../constants';

export const getStage = (): string => {
  if (!config.stage) throw new Error('Missing process.env.STAGE');
  return config.stage;
};

export const isLocalStage = (): boolean => {
  return getStage() === StaticStageName.LOCAL;
};

export const isSandboxStage = (): boolean => {
  const env = getStage();
  return env !== StaticStageName.PROD && env !== StaticStageName.STAGING;
};
