import { CardGrid } from "../../cards/components/CardGrid";
import { ScheduleSection } from "../../schedule/components/ScheduleSection";
import { useHomeData } from "../hooks/useHomeData";
import { HeroCarouselSection } from "../components/HeroCarouselSection";

export default function HomePage() {
	const { slides, isLoadingBanners, bannersError } = useHomeData();
	return (
		<>
			<HeroCarouselSection
				slides={slides}
				isLoading={isLoadingBanners}
				error={bannersError}
			/>
			<CardGrid />
			<ScheduleSection />
		</>
	);
}
