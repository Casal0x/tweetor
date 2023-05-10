import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import CreatePostWizzard from "~/components/Posts/CreatePostWizzard";
import PageLayout from "~/layouts/PageLayout";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return null;

  return (
    <PageLayout>
      <div className="w-100 mb-10 flex border-b-2  border-y-slate-500/50">
        {!isSignedIn ? <SignInButton mode="modal" /> : <CreatePostWizzard />}
      </div>

      {/* <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p> */}
    </PageLayout>
  );
};

export default Home;
