import "next";
import { NextApiRequest } from "next";
import { Session } from "next-auth/core/types";
import { Logger } from "pino";

declare module "next" {
  interface NextApiRequest {
    log: Logger;
  }
  interface NextApiRequestWithSession extends NextApiRequest {
    session: Session;
  }
}
