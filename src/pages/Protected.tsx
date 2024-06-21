import * as React from "react";
import { useSession, signIn } from "next-auth/react";
import { CircularProgress } from "@mui/material";

export interface ProtectedProps {
  children: React.ReactNode;
}

const Protected = ({ children }: ProtectedProps) => {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;

  React.useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) return <>{children}</>;

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <CircularProgress />;
};

export default Protected;
