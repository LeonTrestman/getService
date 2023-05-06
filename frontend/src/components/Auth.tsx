//TODO:remove this

import { useSession } from "next-auth/react";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import Navbar from "~/components/Navbar";
import { useGetUsers } from "~/api/user";
import { MessageCardCentered } from "./MessageCards";

//////////////////////////////////////////////// types
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
  WORKER = "worker",
}

export interface PageWithAuth {
  auth: {
    requiredRoles: UserRole[];
  };
}

export type NextPageWithAuth<
  Props = Record<string, never>,
  InitialProps = Props
> = NextPage<Props, InitialProps> & PageWithAuth;

////////////////////////////////////////////////////
interface AuthProps {
  children: ReactNode & { type: { auth: { requiredRoles: UserRole[] } } };
}

const Auth = ({ children }: AuthProps) => {
  const router = useRouter();
  const { data: session, status } = useSession({ required: true });
  const { data: users, isLoading: isLoadingUser } = useGetUsers(
    session?.idToken ?? ""
  );

  const user = users && users[0] ? users[0] : null;

  const pushToCompleteDetails = async () => {
    await router.push("/onboarding/completeDetails");
  };

  if (status === "loading") {
    return <MessageCardCentered message="Loading Session" />;
  }

  if (isLoadingUser) {
    return <MessageCardCentered message="Loading User" />;
  }

  if (!user) {
    return <MessageCardCentered message="User not found" />;
  }

  if (user.isOnBoardingCompleted === false) {
    void pushToCompleteDetails();
    return null;
  }

  const pageAuth = children.type.auth;
  const { requiredRoles } = pageAuth;

  //no user will always be unauthorized
  if (!requiredRoles.includes(user.type)) {
    return <MessageCardCentered message="Unauthorized" />;
  }

  return (
    <>
      <Navbar
        firstName={user.firstName}
        lastName={user.lastName}
        role={user.type}
      />
      {children}
    </>
  );
};

export default Auth;
