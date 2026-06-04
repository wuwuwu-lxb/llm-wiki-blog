import { NextResponse } from "next/server";
import { consumeOAuthState, getAuthConfig, setSession, type AuthUser } from "@/lib/auth";

type GitHubAccessTokenResponse = {
  access_token?: string;
  error?: string;
};

type GitHubUserResponse = {
  id: number;
  login: string;
  avatar_url: string;
  name: string | null;
};

export async function GET(request: Request) {
  const config = getAuthConfig();
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");

  if (!code || !state || !(await consumeOAuthState(state))) {
    return NextResponse.redirect(new URL("/login?error=invalid-state", config.appUrl));
  }

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      redirect_uri: `${config.appUrl}/api/auth/github/callback`,
    }),
  });
  const tokenPayload = (await tokenResponse.json()) as GitHubAccessTokenResponse;

  if (!tokenPayload.access_token || tokenPayload.error) {
    return NextResponse.redirect(new URL("/login?error=token", config.appUrl));
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenPayload.access_token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!userResponse.ok) {
    return NextResponse.redirect(new URL("/login?error=user", config.appUrl));
  }

  const githubUser = (await userResponse.json()) as GitHubUserResponse;

  if (githubUser.login !== config.allowedLogin) {
    return NextResponse.redirect(new URL("/login?error=forbidden", config.appUrl));
  }

  const user: AuthUser = {
    id: githubUser.id,
    login: githubUser.login,
    avatarUrl: githubUser.avatar_url,
    name: githubUser.name,
  };

  const response = NextResponse.redirect(new URL("/dashboard", config.appUrl));
  setSession(response, user);

  return response;
}

