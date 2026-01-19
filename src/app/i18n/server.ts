import i18next from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";
import { cookies } from "next/headers";

let initialized = false;

export async function initI18n(lang = "en", ns = "common") {
    if (!lang) {
        const cookieStore = await cookies();
        lang = cookieStore.get("i18next")?.value || cookieStore.get("NEXT_LOCALE")?.value || "en";
    }

    if (!initialized) {
        await i18next.use(Backend).init({
            lng: lang,
            fallbackLng: "en",
            ns: [ns],
            backend: {
                loadPath: path.resolve("./public/locales/{{lng}}/{{ns}}.json"),
            },
            interpolation: { escapeValue: false },
        });
        initialized = true;
    } else {
        i18next.changeLanguage(lang);
    }

    return i18next;
}
