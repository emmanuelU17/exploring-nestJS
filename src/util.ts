import { MySqlContainer, StartedMySqlContainer } from '@testcontainers/mysql';
import process from 'process';

/**
 * Versions each route for our application.
 * e.g. if a user wants to access category route,
 * the UI calls 'api/v1/category'.
 */
export const API_PREFIX = '/api/v1/';

/**
 * Implementation to set db variables when in dev or test mode.
 * */
export async function MYSQL_CONTAINER(): Promise<StartedMySqlContainer> {
  const container = await new MySqlContainer()
    .withUsername('explore')
    .withUserPassword('explore')
    .withRootPassword('explore')
    .withDatabase('explore_db')
    .start();

  process.env.MYSQL_HOST = container.getHost();
  process.env.MYSQL_PORT = String(container.getPort());
  process.env.MYSQL_USERNAME = container.getUsername();
  process.env.MYSQL_PASSWORD = container.getUserPassword();
  process.env.MYSQL_DATABASE = container.getDatabase();

  return container
}