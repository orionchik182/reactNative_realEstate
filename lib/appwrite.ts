import { Client, Account, OAuthProvider } from "react-native-appwrite";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

const projectId = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1") // Your API Endpoint
  .setProject(projectId as string); // Your project ID

const account = new Account(client);

export async function signInWithGoogle(): Promise<boolean> {
    try {
        const provider = OAuthProvider.Google;
        const deepLink = new URL(makeRedirectUri({ preferLocalhost: true }));
        const callbackUrlScheme = `${deepLink.protocol}//`;

        const loginUrl = account.createOAuth2Token({
            provider: provider,
            success: deepLink.toString(),
            failure: deepLink.toString(),
        });

        if (!loginUrl) {
            throw new Error("Не удалось создать ссылку для входа");
        }

        const result = await WebBrowser.openAuthSessionAsync(
            loginUrl.toString(),
            callbackUrlScheme
        );

        // Если пользователь закрыл окно браузера — возвращаем false
        if (result.type !== 'success') return false;

        const url = new URL(result.url);

        // --- ВАЖНОЕ ИСПРАВЛЕНИЕ ---
        // Appwrite возвращает параметры с именами "secret" и "userId".
        // Не нужно использовать здесь переменные окружения.
        const secret = url.searchParams.get(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET as string);
        const userId = url.searchParams.get(process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID as string); 
        // ---------------------------

        if (!secret || !userId) throw new Error("No credentials");

        await account.createSession({
            userId: userId,
            secret: secret
        });

        console.log("Успешный вход!");
        return true; // <--- Возвращаем true, чтобы if(result) сработал

    } catch (error) {
        console.error("Ошибка входа:", error);
        return false; // <--- Возвращаем false при ошибке
    }
}