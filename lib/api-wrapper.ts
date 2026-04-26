import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, rateLimitResponse } from "@/lib/rate-limit";
import { apiLogger } from "@/lib/logger";

export interface RateLimitedHandler {
  GET?: (request: NextRequest) => Promise<NextResponse>;
  POST?: (request: NextRequest) => Promise<NextResponse>;
  PUT?: (request: NextRequest) => Promise<NextResponse>;
  DELETE?: (request: NextRequest) => Promise<NextResponse>;
  PATCH?: (request: NextRequest) => Promise<NextResponse>;
}

export function withRateLimit(handler: RateLimitedHandler) {
  return async (request: NextRequest) => {
    const rateLimit = await checkRateLimit(request);

    if (!rateLimit.success) {
      apiLogger.warn({
        ip: request.headers.get("x-forwarded-for"),
        path: request.nextUrl.pathname,
        message: "Rate limit exceeded",
      });

      return rateLimitResponse(
        rateLimit.limit,
        rateLimit.remaining,
        rateLimit.reset
      );
    }

    try {
      const method = request.method as keyof RateLimitedHandler;
      const response = handler[method];

      if (!response) {
        return NextResponse.json(
          { error: "Method not allowed" },
          { status: 405 }
        );
      }

      return await response(request);
    } catch (error) {
      apiLogger.error({
        error: error instanceof Error ? error.message : "Unknown error",
        path: request.nextUrl.pathname,
        method: request.method,
      });

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
