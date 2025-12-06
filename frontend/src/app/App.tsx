import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Layout, AdminLayout } from "./layouts";
import { SidebarProvider, AuthProvider } from "./providers";
import HomePage from "../features/home/pages/HomePage";
import RendicionPage from "../features/rendicion/pages/RendicionPage";
import RegistrationPage from "../features/registration/pages/RegistrationPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import NuevaRendicionPage from "../features/rendicion-admin/pages/NuevaRendicionPage";
import VerRendicionesPage from "../features/rendicion-admin/pages/VerRendicionesPage";
import EjesTematicosPage from "../features/ejes-tematicos/pages/EjesTematicosPage";
import ReportesPage from "../features/reportes/pages/ReportesPage";
import VerPreguntasPage from "../features/preguntas/pages/VerPreguntasPage";
import { Toaster } from "sonner";
import { LoginForm } from "@/features/login/pages/Login";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { SeleccionarPreguntas } from "@/features/preguntas/pages/SeleccionarPreguntas";
import { NewUser } from "@/features/users/pages/NewUser";

function App() {
	return (
		<Router>
			<AuthProvider>
				<SidebarProvider>
					<Routes>
						<Route path="/" element={<Layout />}>
							<Route index element={<HomePage />} />
							<Route
								path="/rendicion/:rendicionId"
								element={<RendicionPage />}
							/>
							<Route
								path="/register/:rendicionId"
								element={<RegistrationPage />}
							/>
						</Route>
						<Route path="/auth/login" element={<LoginForm />} />
						<Route path="/admin" element={<AdminLayout />}>
							<Route
								index
								element={
									<Navigate to="/admin/dashboard" replace />
								}
							/>
							<Route
								path="dashboard"
								element={
									<ProtectedRoute>
										<DashboardPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="rendiciones/nueva-rendicion"
								element={
									<ProtectedRoute>
										<NuevaRendicionPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="rendiciones/ver-rendiciones"
								element={
									<ProtectedRoute>
										<VerRendicionesPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="ejes"
								element={
									<ProtectedRoute>
										<EjesTematicosPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="reportes"
								element={
									<ProtectedRoute>
										<ReportesPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="preguntas/ver"
								element={
									<ProtectedRoute>
										<VerPreguntasPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="preguntas/seleccionar"
								element={
									<ProtectedRoute>
										<SeleccionarPreguntas />
									</ProtectedRoute>
								}
							/>
							<Route
								path="usuarios/agregar-usuario"
								element={
									<ProtectedRoute>
										<NewUser />
									</ProtectedRoute>
								}
							/>
						</Route>
					</Routes>
					<Toaster richColors closeButton />
				</SidebarProvider>
			</AuthProvider>
		</Router>
	);
}

export default App;
