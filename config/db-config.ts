import dotenv from 'dotenv'

dotenv.config({ path: process.cwd() + '/.env' })

const {
  DB_TARGET,
  POSTGRES_HOST: LOCAL_HOST,
  POSTGRES_USER: LOCAL_USER,
  POSTGRES_PASSWORD: LOCAL_PASSWORD,
  POSTGRES_DB: LOCAL_DB,
  POSTGRES_PORT: LOCAL_PORT,
  POSTGRES_SSL: LOCAL_SSL,
  POSTGRES_REMOTE_HOST: REMOTE_HOST,
  POSTGRES_REMOTE_USER: REMOTE_USER,
  POSTGRES_REMOTE_PASSWORD: REMOTE_PASSWORD,
  POSTGRES_REMOTE_DB: REMOTE_DB,
  POSTGRES_REMOTE_PORT: REMOTE_PORT,
  POSTGRES_REMOTE_SSL: REMOTE_SSL
} = process.env

const isRemote = DB_TARGET === 'remote'

export const dbCredentials = {
  host: isRemote ? REMOTE_HOST : LOCAL_HOST,
  user: isRemote ? REMOTE_USER : LOCAL_USER,
  password: isRemote ? REMOTE_PASSWORD : LOCAL_PASSWORD,
  database: isRemote ? REMOTE_DB : LOCAL_DB,
  port: isRemote ? REMOTE_PORT : LOCAL_PORT,
  ssl: isRemote ? REMOTE_SSL : LOCAL_SSL
}

export function validateAndLoadDbCredentials(context: string) {
  const { host, user, password, database } = dbCredentials
  if (!host || !user || !password || !database) {
    const missingVars = [
      !host && (isRemote ? 'POSTGRES_REMOTE_HOST' : 'POSTGRES_HOST'),
      !user && (isRemote ? 'POSTGRES_REMOTE_USER' : 'POSTGRES_USER'),
      !password &&
        (isRemote ? 'POSTGRES_REMOTE_PASSWORD' : 'POSTGRES_PASSWORD'),
      !database && (isRemote ? 'POSTGRES_REMOTE_DB' : 'POSTGRES_DB')
    ]
      .filter(Boolean)
      .join(', ')
    throw new Error(
      `Missing required database environment variables for ${
        isRemote ? 'remote' : 'local'
      } target (${context}): ${missingVars}`
    )
  }
}
