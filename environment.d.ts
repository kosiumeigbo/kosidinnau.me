declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ProcessEnv {
    readonly WS_SERVER_PORT: string;
    readonly HTTP_SERVER_PORT: string;
  }
}
