import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface User {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    //   password: string;
  }

  interface Session {
    user: {
      _id?: string;
      username?: string;
      isVerified?: boolean;
      isAcceptingMessage?: boolean;
      //   password: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    username?: string;
    isVerified?: boolean;
    isAcceptingMessage?: boolean;
    //   password: string;
  }
}
