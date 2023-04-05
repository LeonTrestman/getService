import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { FC } from "react";
import { getServerAuthSession } from "~/server/auth";

const SignIn: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ providers }) => {
  return (
    <div className="container m-auto grid justify-center ">
      <h1 className=" ">Sign in to continue</h1>

      {Object.values(providers).map((provider) => (
        <ProviderBtn provider={provider} />
      ))}
    </div>
  );
};

export default SignIn;

interface ProviderBtnProps {
  provider: ClientSafeProvider;
}

/*Button to sign in with a provider*/
const ProviderBtn: FC<ProviderBtnProps> = ({ provider }) => {
  return (
    <div key={provider.name}>
      <button
        className={`${provider.id}Btn`}
        onClick={() => signIn(provider.id)}
      >
        <span className="inline-block">Continue with {provider.name}</span>
      </button>
    </div>
  );
};

/*Check if user is logged in and pass auth providers to the page */
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerAuthSession(context);
  if (session) return { redirect: { destination: "/" } };
  const providers = await getProviders();

  return {
    props: { session, providers: providers ?? [] },
  };
}
