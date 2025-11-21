import { useParams, Navigate } from 'react-router-dom'
import { RendicionDetail } from '../../features/rendicion/components/RendicionDetail'

export default function RendicionPage() {
  const { rendicionId } = useParams<{ rendicionId: string }>()

  if (!rendicionId) {
    return <Navigate to="/" replace />
  }

  return <RendicionDetail rendicionId={rendicionId} />
}