import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiRequestWithSession,
  NextApiResponse,
} from "next";
import NextAuth, { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authorizedUsers = [
  { id: "1", username: "demo1", password: "demo1" },
  { id: "2", username: "demo2", password: "demo2" },
];
export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      // name: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (credentials?.username && credentials?.password) {
          const authUser = authorizedUsers.find(
            (user) =>
              user.username === credentials.username &&
              user.password === credentials.password,
          );
          if (!authUser) {
            throw new Error("Invalid credentials");
          }
          const user = { id: authUser.id, name: authUser.username };
          return user;
        }
        throw new Error("Invalid credentials");
        return null;
      },
    }),
  ],
};

export function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return getServerSession(...args, authOptions);
}

export const protectedEndpoint =
  (
    handler: (
      req: NextApiRequestWithSession,
      res: NextApiResponse,
    ) => Promise<void>,
  ) =>
  async (req: NextApiRequestWithSession, res: NextApiResponse) => {
    const session = await auth(req, res);
    if (session && session.user?.name) {
      // Signed in
      req.session = session;
      await handler(req, res);
    } else {
      // Not Signed in
      res.status(401).end();
    }
  };

export default NextAuth(authOptions);
