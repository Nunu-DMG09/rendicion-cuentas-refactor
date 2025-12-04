import { CardGrid } from "../components/cards/CardGrid";
import { ScheduleSection } from "../components/schedule/ScheduleSection";
import { useHomeData } from "../hooks/useHomeData";
import { HeroCarouselSection } from "../components/carousel/HeroCarouselSection";
import { useRegistrationData } from "@/core/hooks";

export default function HomePage() {
	const { slides, isLoadingBanners, bannersError, recentRendicionesQuery } = useHomeData();
	const {
		hasActiveRegistration,
		rendicionData,
		isLoading: isLoadingRendicion,
	} = useRegistrationData();
	return (
		<>
			<HeroCarouselSection
				slides={slides}
				isLoading={isLoadingBanners}
				error={bannersError}
			/>
			<CardGrid />
			<ScheduleSection
				hasActiveRegistration={hasActiveRegistration}
				rendicionData={rendicionData}
				isLoading={isLoadingRendicion}
				recentRendiciones={recentRendicionesQuery.data || []}
				isLoadingRendiciones={recentRendicionesQuery.isLoading}
			/>
		</>
	);
}
