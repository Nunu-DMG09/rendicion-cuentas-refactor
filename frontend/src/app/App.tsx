import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { Layout, AdminLayout } from "./layouts";
import { SidebarProvider, AuthProvider } from "./providers";
import {
	HomePage,
	RendicionPage,
	RegistrationPage,
	DashboardPage,
	NuevaRendicionPage,
	VerRendicionesPage,
	EjesTematicosPage,
	ReportesPage,
	LoginPage,
	SeleccionarPreguntasPage,
	NewUserPage,
	ListUsersPage,
	HistorialAdminPage,
	AsistenciaPage,
} from "./routes"
import VerPreguntasPage from "../features/preguntas/pages/VerPreguntasPage";
import { Toaster } from "sonner";
import { ProtectedRoute } from "./routes/ProtectedRoute";

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
							<Route
								path="/asistencia"
								element={<AsistenciaPage />}
							/>
						</Route>
						<Route path="/auth/login" element={<LoginPage />} />
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
										<SeleccionarPreguntasPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="usuarios/agregar-usuario"
								element={
									<ProtectedRoute>
										<NewUserPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="usuarios/ver-usuarios"
								element={
									<ProtectedRoute>
										<ListUsersPage />
									</ProtectedRoute>
								}
							/>
							<Route
								path="usuarios/historial-acciones"
								element={
									<ProtectedRoute>
										<HistorialAdminPage />
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
