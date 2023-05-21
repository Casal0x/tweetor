import PageLayout from "~/layouts/PageLayout";

const NotFound = () => {
  return (
    <PageLayout>
      <div className="flex h-full flex-col items-center justify-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="text-xl">Profile not found</p>
      </div>
    </PageLayout>
  );
};

export default NotFound;
