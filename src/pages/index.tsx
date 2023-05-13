import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import CreatePostWizzard from "~/components/Posts/CreatePostWizzard";
import PostsFeed from "~/components/Posts/PostsFeed";
import PageLayout from "~/layouts/PageLayout";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return null;

  return (
    <PageLayout>
      <div className="w-100  flex border-b-2  border-y-slate-500/50">
        {!isSignedIn ? <SignInButton mode="modal" /> : <CreatePostWizzard />}
      </div>

      <PostsFeed />
    </PageLayout>
  );
};

export default Home;
