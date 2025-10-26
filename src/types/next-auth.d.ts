import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      role: "admin" | "member";
    };
  }

  interface User {
    role: "admin" | "member";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "admin" | "member";
    githubToken?: string;
    jiraToken?: string;
  }
}
