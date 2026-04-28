import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok(data, status = 200) {
  return NextResponse.json(data, { status });
}

export function fail(message, status = 400, details = null) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleApiError(error) {
  if (error instanceof ZodError) {
    return fail("Validation failed", 422, error.flatten());
  }

  if (error.message === "Unauthorized") {
    return fail("Unauthorized", 401);
  }

  if (error.message === "Forbidden") {
    return fail("Forbidden", 403);
  }

  if (error.message === "NotFound") {
    return fail("Resource not found", 404);
  }

  if (error.name === "MongooseServerSelectionError") {
    return fail("Database unavailable. Check MONGODB_URI and MongoDB server.", 503);
  }

  if (process.env.NODE_ENV !== "production" && error.message?.startsWith("Missing ")) {
    return fail(error.message, 500);
  }

  return fail("Internal server error", 500);
}
