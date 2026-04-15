import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signJWT } from "@/lib/auth/jwt";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/login?error=oauth_failed", APP_URL));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", APP_URL));
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenRes.ok) {
      console.error("GitHub token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(new URL("/login?error=token_exchange_failed", APP_URL));
    }

    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;

    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/login?error=user_info_failed", APP_URL));
    }

    const githubUser = await userRes.json();
    const email = githubUser.email;

    let user;
    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      
      if (emailsRes.ok) {
        const emails = await emailsRes.json();
        const primaryEmail = emails.find((e: { primary: boolean }) => e.primary);
        if (primaryEmail) {
          user = await prisma.user.findUnique({ where: { email: primaryEmail.email } });
        }
      }
    }

    if (!user) {
      const name = githubUser.name || githubUser.login;
      user = await prisma.user.create({
        data: {
          email: email || `${githubUser.id}@github.local`,
          name: name || "GitHub User",
          authProvider: "github",
          isVerified: true,
        },
      });
    }

    if (user.authProvider !== "github") {
      return NextResponse.redirect(new URL("/login?error=email_exists", APP_URL));
    }

    const jwtResult = signJWT({ userId: user.id, email: user.email });

    const response = NextResponse.redirect(new URL("/dashboard", APP_URL));
    response.cookies.set("auth_token", jwtResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    return NextResponse.redirect(new URL("/login?error=oauth_error", APP_URL));
  }
}