import { DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait } from 'testcontainers';

/**
 * Versions each route for our application.
 * e.g. if a user wants to access category route,
 * the UI calls 'api/v1/category'.
 */
export const API_PREFIX = '/api/v1/';

/**
 * A utility class for managing Docker Compose environments using
 * {@link Testcontainers} library.
 * @see https://node.testcontainers.org/features/compose/
 */
export class CustomCompose {
  /** The reference to the started Docker Compose environment. */
  private static _compose: StartedDockerComposeEnvironment;

  /**
   * Starts the Docker Compose environment and initializes the _compose
   * property.
   *
   * @returns a Promise that resolves when the Docker Compose environment
   * is started.
   * */
  public static async composeUp(): Promise<void> {
    if (CustomCompose._compose) return;

    CustomCompose._compose = await new DockerComposeEnvironment('./', 'compose.yaml',)
      .withWaitStrategy('mysql', Wait.forHealthCheck())
      .up();
  }

  /**
   * Stops the Docker Compose environment if it is initialized.
   *
   * @returns a Promise that resolves when the Docker Compose
   * environment is stopped.
   * */
  public static async composeDown(): Promise<void> {
    const compose = CustomCompose._compose;
    if (compose) await compose.stop();
  }
}