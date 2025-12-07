import { lazyPage } from "./lazyFactory";

// Public Pages
export const HomePage = lazyPage(() => import('@/features/home/pages/HomePage'), 'HomePage');
export const RendicionPage = lazyPage(() => import('@/features/rendicion/pages/RendicionPage'), 'RendicionPage');
export const RegistrationPage = lazyPage(() => import('@/features/registration/pages/RegistrationPage'), 'RegistrationPage');
// Admin Pages
export const DashboardPage = lazyPage(() => import('@/features/dashboard/pages/DashboardPage'), 'DashboardPage');
export const NuevaRendicionPage = lazyPage(() => import('@/features/rendicion-admin/pages/NuevaRendicionPage'), 'NuevaRendicionPage');
export const VerRendicionesPage = lazyPage(() => import('@/features/rendicion-admin/pages/VerRendicionesPage'), 'VerRendicionesPage');
export const EjesTematicosPage = lazyPage(() => import('@/features/ejes-tematicos/pages/EjesTematicosPage'), 'EjesTematicosPage');
export const ReportesPage = lazyPage(() => import('@/features/reportes/pages/ReportesPage'), 'ReportesPage');
export const LoginPage = lazyPage(() => import('@/features/login/pages/Login'), 'LoginForm');
export const SeleccionarPreguntasPage = lazyPage(() => import('@/features/preguntas/pages/SeleccionarPreguntas'), 'SeleccionarPreguntas');
export const NewUserPage = lazyPage(() => import('@/features/users/pages/NewUser'), 'NewUser');
export const ListUsersPage = lazyPage(() => import('@/features/users/pages/ListUsers'), 'ListUsers');
export const HistorialAdminPage = lazyPage(() => import('@/features/historial/pages/HistorialAdmin'), 'HistorialAdmin');