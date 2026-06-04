import { NextResponse } from "next/server";
import { createOAuthState, getAuthConfig, isAuthConfigured, setOAuthState } from "@/lib/auth";

export async function GET() {
  if (!isAuthConfigured()) {
    return NextResponse.redirect(new URL("/login?error=not-configured", getAuthConfig().appUrl));
  }

  const config = getAuthConfig();
  const state = createOAuthState();
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", config.clientId);
  authorizeUrl.searchParams.set("redirect_uri", `${config.appUrl}/api/auth/github/callback`);
  authorizeUrl.searchParams.set("scope", "read:user");
  authorizeUrl.searchParams.set("state", state);

  const response = NextResponse.redirect(authorizeUrl);
  setOAuthState(response, state);

  return response;
}

