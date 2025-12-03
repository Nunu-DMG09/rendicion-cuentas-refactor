import { Loader } from "dialca-ui";
import type { Slide } from "../../types/slide";
import HeroCarousel from "./HeroCarousel";

interface Props {
    slides: Slide[];
    isLoading: boolean;
    error?: unknown;
}
export const HeroCarouselSection: React.FC<Props> = ({ slides, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="h-[720px] md:h-[640px] lg:h-[700px] flex items-center justify-center bg-linear-to-r from-gray-300 to-primary/20">
                <div className="text-center text-white">
                    <Loader classes={{
                        container: "mx-auto! mb-4!"
                    }} />
                    <p className="text-lg text-gray-700">Cargando banners...</p>
                </div>
            </div>
        );
    }
    if (error) {
        console.warn('Error cargando banners:', error);
        return <HeroCarousel />; // Usa banners por defecto
    }
    if (slides.length > 0) {
        return <HeroCarousel slides={slides} />;
    }

    // Fallback si no hay banners
    return <HeroCarousel />;
}