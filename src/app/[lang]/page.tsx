import Carousel from "@/components/Carousel";
import { initI18n } from "../i18n/server";
import AnimatedParentsCard from "../components/animatedParentsCard/animated-parents-card";
import AnimatedReviewsCard from "../components/animatedReviewsCard/animated-reviews-card";

const items = [
    {
        title: "Learn the Alphabet",
        image: "/assets/alphabet.png", // or GIF "/gifs/alphabet.gif"
    },
    {
        title: "Count with Animals",
        image: "/assets/count.png",
    },
    {
        title: "Color & Draw",
        image: "/assets/draw.png",
    },
    {
        title: "Sing Along Songs",
        image: "/assets/sing.png",
    },
];

const parentsItems = [
    {
        title: "No External Ads",
        desc: "A safe environment — no pop-ups or third-party ads.",
        icon: "🚫",
    },
    {
        title: "Parental Gate",
        desc: "Settings and purchases are protected by a parent-only gate.",
        icon: "🔒",
    },
    {
        title: "Voice Narration",
        desc: "Every activity can be read aloud for early learners.",
        icon: "🔊",
    },
    {
        title: "Simple Navigation",
        desc: "Big buttons and colorful icons — perfect for little hands.",
        icon: "🧭",
    },
];

const testimonialsItems = [
    {
        quote: "My 5-year-old loves learning with Monkey! It’s safe and fun.",
        name: "— Sarah, Mom of 2",
    },
    {
        quote: "Finally, an app I can trust. The parental controls are amazing!",
        name: "— Omar, Father of 3",
    },
];

export default async function HomePage({ params: { lang } }: any) {
    const i18n = await initI18n(lang);
    const t = i18n.getFixedT(lang, "common");

    return (
        <>
            <section className="section-1 ">
                <div className="z-20 p-5 w-[50%] md:w-[70%] flex flex-col items-start gap-6 animate-slide-in">
                    <h2 className="text-4xl lg:text-6xl w-[50%] md:w-full font-bold text-blue-950 mb-6 animate-fade-up delay-100">
                        {t("hero.title")}
                    </h2>
                    <p className="text-xl lg:text-3xl w-[90%] md:w-[40vw] font-bold text-blue-950 mb-6 animate-fade-up delay-200">
                        {t("hero.subtitle")}
                    </p>
                </div>
                <button className="animate-wiggle absolute top-[85%] left-1/3 bg-gradient-to-b from-orange-400 to-orange-500 hover:from-orange-300 hover:to-orange-400 text-white font-bold px-12 py-5 rounded-3xl shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:translate-y-0 border-4 border-white hover:border-orange-200 hover:shadow-orange-300/50 cursor-pointer">
                    <span className="flex items-center justify-center gap-2 text-lg">
                        {t("hero.startButton")}
                    </span>
                </button>
            </section>
            <section className="section-2 w-full bg-gradient-to-b from-[rgb(255,250,239)] to-[rgb(186,233,254)] py-16 px-6 md:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-bold text-pink-600 mb-4">
                        What's Inside
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl">
                        Fun lessons designed for young learners
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, i) => (
                        <div key={i} className="flex flex-col">
                            <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
                                {/* Video or GIF */}
                                <img
                                    src={item.image}
                                    className="w-full h-56 object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 hover:bg-black/10 transition-all duration-300"></div>

                                {/* Content */}
                            </div>
                            <div className="inset-0 flex flex-col items-center justify-center text-gray-600">
                                <h3 className="text-xl mt-2 font-bold drop-shadow-md">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section className="section-3 relative ">
                <div className="absolute bg-white border rounded-2xl h-[60%] w-1/2 right-5 bottom-5">
                    <div
                        style={{
                            height: "100%",
                            width: "100%",
                            position: "relative",
                        }}
                    >
                        <Carousel
                            autoplay={true}
                            autoplayDelay={3000}
                            pauseOnHover={true}
                            loop={true}
                            round={false}
                        />
                    </div>
                </div>
            </section>
            <section className="section-4 relative py-20 bg-gradient-to-b from-[rgb(186,233,254)] to-[rgb(255,250,239)] overflow-hidden">
                <div className="relative z-10 container mx-auto px-6 text-center">
                    {/* Section Title */}
                    <h2 className="text-4xl md:text-6xl font-bold text-pink-600 mb-10">
                        For Parents
                    </h2>

                    {/* Safety Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                        {parentsItems.map((item, index) => (
                            <AnimatedParentsCard
                                key={index}
                                item={item}
                                index={index}
                            />
                        ))}
                    </div>

                    {/* Testimonials */}
                    <h3 className="text-4xl font-bold text-green-600 mb-8">
                        What Parents Say
                    </h3>
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        {testimonialsItems.map((t, index) => (
                            // Usage in your component:
                            <AnimatedReviewsCard
                                key={index}
                                t={t}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
