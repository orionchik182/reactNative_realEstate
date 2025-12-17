import { Account, Avatars, Client, Databases, OAuthProvider, Query, TablesDB } from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

export const config = {
  platform: "com.jsm.realestate",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  agentsTableId: "agents",
  reviewsTableId: "reviews",
  galleriesTableId: "galleries",
  propertiesTableId: "properties",
};

export const client = new Client();

client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const account = new Account(client);
export const avatar = new Avatars(client);
export const databases = new Databases(client);

export const tables = new TablesDB(client);

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

export async function getLatestProperties() {
  try {
    const result = await tables.listRows({
      databaseId: config.databaseId!,
      tableId: config.propertiesTableId!,
      queries: [
        Query.orderDesc("$createdAt"), 
        Query.limit(5),
      ],
    });

    return result.rows;
  } catch (error) {
    console.error("Get Latest Properties Error:", error);
    return [];
  }
}

export async function getProperties({filter, query, limit}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];
    if (filter && filter !== "All") {
      buildQuery.push(Query.equal("type", filter));
    }
    if (query) {
      buildQuery.push(Query.or([
        Query.search("name", query),
        Query.search("address", query),
        Query.search("type", query),
      ]));
    }
    if (limit) {
      buildQuery.push(Query.limit(limit));
    }
    const result = await tables.listRows({
      databaseId: config.databaseId!,
      tableId: config.propertiesTableId!,
      queries: buildQuery,
    });
    return result.rows;
  } catch (error) {
    console.error("Get Properties Error:", error);
    return [];
  }
}
