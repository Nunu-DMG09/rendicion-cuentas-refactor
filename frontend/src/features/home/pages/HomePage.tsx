import { CardGrid } from "../../cards/components/CardGrid";
import { ScheduleSection } from "../../schedule/components/ScheduleSection";
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
