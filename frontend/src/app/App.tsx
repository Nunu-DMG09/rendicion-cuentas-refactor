import Layout from './layouts/Layout';
import HeroCarousel from '../features/home/components/HeroCarousel';
import { CardGrid } from '../features/cards/components/CardGrid';

function App() {
  return (
    <Layout>
      <HeroCarousel />
      <CardGrid />
      <h1 className="text-2xl text-blue-700 mt-6">Commit de Petusotwo owo</h1>
    </Layout>
  )
}

export default App
