import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  base: {
    service: "fieldspec",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export function createChildLogger(context: Record<string, unknown>) {
  return logger.child(context);
}

export const authLogger = createChildLogger({ module: "auth" });
export const apiLogger = createChildLogger({ module: "api" });
export const queueLogger = createChildLogger({ module: "queue" });
export const aiLogger = createChildLogger({ module: "ai" });
