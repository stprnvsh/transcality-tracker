import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import JiraProvider from "next-auth/providers/atlassian";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
      authorization: {
        params: { scope: "read:user repo" }
      }
    }),
    JiraProvider({
      clientId: process.env.JIRA_CLIENT_ID ?? "",
      clientSecret: process.env.JIRA_CLIENT_SECRET ?? "",
      issuer: process.env.JIRA_ISSUER ?? "https://auth.atlassian.com"
    })
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "member";
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role ?? "member";
      }
      if (account) {
        if (account.provider === "github" && account.access_token) {
          token.githubToken = account.access_token;
        }
        if (account.provider === "atlassian" && account.access_token) {
          token.jiraToken = account.access_token;
        }
      }
      return token;
    }
  }
};

export const { handlers: { GET, POST }, auth } = NextAuth(authOptions);
