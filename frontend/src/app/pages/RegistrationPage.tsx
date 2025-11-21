import { useParams, Navigate } from 'react-router-dom'
import { RegistrationWizard } from '../../features/registration/components/RegistrationWizard'

export default function RegistrationPage() {
  const { rendicionId } = useParams<{ rendicionId: string }>()

  if (!rendicionId) {
    return <Navigate to="/" replace />
  }

  return <RegistrationWizard rendicionId={rendicionId} />
}