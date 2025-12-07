import { useParams, Navigate } from 'react-router-dom'
import { RegistrationWizard } from '../components/RegistrationWizard'

export const RegistrationPage = () => {
  const { rendicionId } = useParams<{ rendicionId: string }>()

  if (!rendicionId) {
    return <Navigate to="/" replace />
  }

  return <RegistrationWizard rendicionId={rendicionId} />
}