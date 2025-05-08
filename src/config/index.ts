export const APP_NAME = 'jackpot';

const env = process.env;

export interface Config {
  nodeEnv: string;
  port: number;
  mongoUri: string;
}

export function configuration() {
  const nodeEnv: string = env.NODE_ENV ?? 'development';

  const config: Config = {
    nodeEnv,
    port: parseInt(env.PORT as string) || 3010,
    mongoUri: env.MONGO_URI || `mongodb://127.0.0.1:27010/${APP_NAME}`,
  };

  return config;
}
