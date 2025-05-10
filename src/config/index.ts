export const APP_NAME = 'jackpot';

const env = process.env;

export interface Config {
  nodeEnv: string;
  port: number;
  mongoUri: string;
  jwt: { secret: string; issuer: string; audience: string; expiresIn: string };
}

export function configuration() {
  const apiUrl = env.API_URL || 'jackpot.api';
  const websiteUrl = env.WEBSITE_URL || 'jackpot.app';
  const nodeEnv: string = env.NODE_ENV ?? 'development';

  const config: Config = {
    nodeEnv,
    port: parseInt(env.PORT as string) || 3010,
    mongoUri: env.MONGO_URI || `mongodb://127.0.0.1:27017/${APP_NAME}`,
    jwt: {
      secret: env.JWT_SECRET || 'insecure',
      issuer: env.JWT_ISSUER || apiUrl,
      audience: env.JWT_AUDIENCE || websiteUrl,
      expiresIn: env.JWT_EXPIRES_IN || '30d',
    },
  };

  return config;
}
