import HeroCarousel from '../../features/home/components/HeroCarousel'
import { CardGrid } from '../../features/cards/components/CardGrid'
import { ScheduleSection } from '../../features/schedule/components/ScheduleSection'

export default function HomePage() {
    return (
        <>
            <HeroCarousel />
            <CardGrid />
            <ScheduleSection />
        </>
    )
}