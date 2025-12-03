import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import logo from '../../../assets/logo.png'
import { useRegistrationData } from '@/core/hooks';
import { Button } from 'dialca-ui';

export default function Header() {
  const navigate = useNavigate();
  const { hasActiveRegistration, rendicionData, isLoading } = useRegistrationData();
  const handleRegistrationClick = () => {
    if (hasActiveRegistration && rendicionData?.id) {
      navigate(`/register/${rendicionData.id}`);
    }
  }
  return (
    <header className="bg-white border-b border-gray-200 p-5">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link to="/" className="flex items-center gap-3">
              <motion.img
                src={logo}
                alt="Logo Municipalidad José Leonardo Ortiz"
                className="h-20 w-auto"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
              <motion.div
                className="leading-tight hidden sm:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              >
                <div className="text-2xl font-semibold text-primary-dark">Municipalidad José Leonardo Ortiz</div>
                <div className="text-lg text-gray-500">Rendición de Cuentas</div>
              </motion.div>
            </Link>
          </motion.div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleRegistrationClick}
              disabled={!hasActiveRegistration || isLoading}
              loading={isLoading}
              variant={hasActiveRegistration ? 'primary' : 'outline'}
              className={`
                ${!hasActiveRegistration ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {isLoading 
                ? 'Cargando...' 
                : hasActiveRegistration 
                  ? 'Registrarse' 
                  : 'Sin registro disponible'
              }
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}