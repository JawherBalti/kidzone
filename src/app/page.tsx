import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("i18next")?.value || cookieStore.get("NEXT_LOCALE")?.value || "en";
    redirect(lang);
}
