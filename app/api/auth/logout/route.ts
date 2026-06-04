import { NextResponse } from "next/server";
import { clearSession, getAuthConfig } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.redirect(new URL("/", getAuthConfig().appUrl));
  clearSession(response);

  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/", getAuthConfig().appUrl));
  clearSession(response);

  return response;
}

