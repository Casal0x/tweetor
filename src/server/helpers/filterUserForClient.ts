import type { User } from "@clerk/nextjs/dist/api";

const providers = ["google", "oauth_google", "oauth_github", "github"];

export const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    externalUsername:
      user.externalAccounts.find((externalAccount) =>
        providers.includes(externalAccount.provider)
      )?.username || null,
  };
};
