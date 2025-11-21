import Layout from './layouts/Layout'
import HeroCarousel from '../features/home/components/HeroCarousel'
import { CardGrid } from '../features/cards/components/CardGrid'
import { ScheduleSection } from '../features/schedule/components/ScheduleSection'

function App() {
  return (
    <Layout>
      <HeroCarousel />
      <CardGrid />
      <ScheduleSection />
    </Layout>
  )
}

export default App
