import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import CreatePostWizzard from "~/components/Posts/CreatePostWizzard";
import Button from "~/components/Base/Button";

const Home: NextPage = () => {
  const { isSignedIn, isLoaded: userLoaded } = useUser();

  if (!userLoaded) return null;

  return (
    <>
      <main className="grid min-h-screen grid-cols-12  bg-gradient-to-b from-[#15162c] to-[#2e026d]">
        <div className="col-span-12 md:col-span-3">Menu</div>
        <div className="col-span-12 flex flex-col gap-2 border-x-2 border-x-slate-500/25 md:col-span-6 ">
          <div className="w-100 mb-10 flex border-b-2  border-y-slate-500/50">
            {!isSignedIn ? (
              <SignInButton mode="modal" />
            ) : (
              <CreatePostWizzard />
            )}
          </div>

          {/* <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p> */}
        </div>
        <div className="col-span-12 md:col-span-3">Feed</div>
      </main>
    </>
  );
};

export default Home;
