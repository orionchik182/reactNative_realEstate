import { Account, Avatars, Client, OAuthProvider } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.jsm.realestate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const account = new Account(client);
export const avatar = new Avatars(client);

export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = account.createOAuth2Token({
      provider: OAuthProvider.Google,
      success: redirectUri,
      failure: redirectUri,
    });

    if (!response) throw new Error("Failed to login");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );

    if (browserResult.type !== "success") throw new Error("Failed to login");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("Failed to login");

    const session = await account.createSession({
      userId: userId,
      secret: secret,
    });

    if (!session) throw new Error("Failed to create a session");
    return true;
  } catch (error) {
    console.error("Login Error:", error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession({
      sessionId: "current",
    });
    return true;
  } catch (error) {
    console.error("Logout Error:", error);
    return false;
  }
}

export async function getCurrentUser() {
  try {
    const user = await account.get();
    if (user.$id) {
      const userAvatar = `${config.endpoint}/avatars/initials?name=${encodeURIComponent(user.name)}&project=${config.projectId}`;

      return {
        ...user,
        avatar: userAvatar,
      };
    }
    return null;
  } catch (error: any) {
    if (error.code === 401 || error.message?.includes("missing scopes")) {
      return null;
    }

    console.error("Get User Error:", error);
    return null;
  }
}
