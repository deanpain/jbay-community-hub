import pino from "pino";

const level =
  process.env.NODE_ENV === "test" || process.env.VITEST
    ? "silent"
    : (process.env.LOG_LEVEL ?? "info");

const transport =
  process.env.NODE_ENV !== "production" && process.stdout.isTTY
    ? pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          singleLine: true,
          ignore: "pid,hostname",
        },
      })
    : undefined;

export const logger = pino(
  {
    level,
    base: undefined,
  },
  transport,
);

