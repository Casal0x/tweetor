import type { User } from "@clerk/nextjs/dist/api";

export const providers = ["google", "oauth_google", "oauth_github", "github"];

export type ReturnedUser = {
  id: string;
  username: string | null;
  profileImageUrl: string | null;
  externalUsername: string | null;
};

export const filterUserForClient = (user: User): ReturnedUser => {
  return {
    id: user.id,
    username: user.username,
    profileImageUrl: user.profileImageUrl,
    externalUsername:
      user.externalAccounts.find((externalAccount) => {
        const provider = providers.includes(externalAccount.provider);

        return provider;
      })?.username || null,
  };
};

export const hasUsername = (user: User) => {
  if (!user.username) {
    const externalUsername =
      user.externalAccounts.find((externalAccount) => {
        const provider = providers.includes(externalAccount.provider);

        return provider;
      })?.username || false;

    return externalUsername;
  }
  return user.username;
};
