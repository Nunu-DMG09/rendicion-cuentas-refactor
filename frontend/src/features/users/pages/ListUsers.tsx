import { motion } from "motion/react";
import { useListUsers } from "../hooks/useListUsers";
import { UsersTable } from "../components/UsersTable";
import { UsersTableSkeleton } from "../components/TableSkeleton";
import { UsersErrorState } from "../components/ErrorState";
import { UsersFilters } from "../components/Filter";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { UserModal } from "../components/UserModal";
import { Button } from "dialca-ui";
import { LuRefreshCw } from "react-icons/lu";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { useSearchUser } from "../hooks/useSearchUser";
import { HiSearch } from "react-icons/hi";
import { SearchUserSkeleton } from "../components/SearchUserSkeleton";
import { SearchUserCard } from "../components/SearchUserCard";

export const ListUsers = () => {
	const {
		filteredUsers,
		isLoading,
		isError,
		error,
		refetch,
		currentTab,
		handleTabChange,
		roleFilter,
		handleRoleFilterChange,
		statusFilter,
		handleStatusFilterChange,
		modal,
		closeModal,
		showChangePasswordModal,
		showEditRoleModal,
		showToggleStatusConfirm,
		confirmModalAction,
		isChangingPassword,
		isUpdatingRole,
		isTogglingStatus,
	} = useListUsers();
	const {
		dni,
		handleDniChange,
		handleSearch,
		clearSearch,
		isSearching,
		isSearchError,
		searchError,
		searchedUser,
	} = useSearchUser();

	const { user } = useAuthStore();

	const isModalLoading =
		isChangingPassword || isUpdatingRole || isTogglingStatus;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="space-y-6"
		>
			<header>
				<h1 className="text-4xl font-titles font-bold text-gray-900">
					Gestión de Usuarios
				</h1>
				<p className="text-gray-600 font-body text-lg mt-1">
					Administra los usuarios del sistema
				</p>
			</header>
			<div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
				<div className="flex border-b border-gray-200">
					<button
						onClick={() => handleTabChange("list")}
						className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
							currentTab === "list"
								? "text-primary-dark border-b-4 border-primary bg-blue-50"
								: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
						}`}
					>
						Listar Administradores
					</button>
					<button
						onClick={() => handleTabChange("search")}
						className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
							currentTab === "search"
								? "text-primary-dark border-b-4 border-primary bg-blue-50"
								: "text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
						}`}
					>
						Buscar Administrador
					</button>
				</div>
			</div>
			{currentTab === "list" && (
				<motion.div
					className="space-y-6"
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="flex justify-end">
						<Button
							onClick={() => refetch()}
							loading={isLoading}
							loadingText="Refrescando..."
							loadingIcon={
								<LuRefreshCw className="size-5 text-white animate-spin" />
							}
							className={`${
								isLoading && "cursor-not-allowed! opacity-60!"
							}`}
							classes={{
								content: "flex items-center gap-2",
							}}
						>
							<LuRefreshCw className={`size-5 text-white`} />
							Refrescar Lista
						</Button>
					</div>
					<UsersFilters
						roleFilter={roleFilter}
						onRoleFilterChange={handleRoleFilterChange}
						statusFilter={statusFilter}
						onStatusFilterChange={handleStatusFilterChange}
					/>
					{isLoading && <UsersTableSkeleton rows={5} />}
					{isError && (
						<UsersErrorState error={error} onRetry={refetch} />
					)}
					{!isLoading && !isError && filteredUsers && (
						<UsersTable
							users={filteredUsers}
							onChangePassword={showChangePasswordModal}
							onEdit={showEditRoleModal}
							onToggleStatus={showToggleStatusConfirm}
							currentUserId={user?.id.toString() || ""}
						/>
					)}
				</motion.div>
			)}

			{currentTab === "search" && (
				<motion.div
					className="space-y-6"
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.3 }}
				>
					<div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
						<label className="block text-sm font-medium text-gray-700 mb-3">
							Buscar administrador por DNI
						</label>
						<div className="flex gap-3">
							<input
								type="text"
								value={dni}
								onChange={(e) =>
									handleDniChange(e.target.value)
								}
								placeholder="Ingrese DNI (8 dígitos)"
								maxLength={8}
								className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-lg font-medium"
							/>
							<Button
								onClick={handleSearch}
								disabled={dni.length !== 8}
								loading={isSearching}
								loadingText="Buscando..."
								loadingIcon={
									<HiSearch className="size-5 text-white animate-pulse" />
								}
								className={`${
									(dni.length !== 8 || isSearching) &&
									"cursor-not-allowed! opacity-60!"
								}`}
								classes={{
									content: "flex items-center gap-2",
								}}
							>
								<HiSearch className="size-5 text-white" />
								Buscar
							</Button>
							{dni && (
								<Button
									onClick={clearSearch}
									variant="outline"
									classes={{
										content: "flex items-center gap-2",
									}}
								>
									Limpiar
								</Button>
							)}
						</div>
						<p className="text-xs text-gray-500 mt-2">
							{dni.length}/8 caracteres
						</p>
					</div>
					{isSearching && <SearchUserSkeleton />}
					{isSearchError && (
						<UsersErrorState
							error={searchError}
							onRetry={handleSearch}
						/>
					)}
					{!isSearching && !isSearchError && searchedUser && (
						<SearchUserCard
							user={searchedUser}
							onChangePassword={showChangePasswordModal}
							onEditRole={showEditRoleModal}
							onToggleStatus={showToggleStatusConfirm}
							currentUserId={user?.id.toString() || ""}
						/>
					)}
					{!isSearching &&
						!isSearchError &&
						!searchedUser &&
						dni.length === 0 && (
							<div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100">
								<div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
									<PiMagnifyingGlassDuotone className="text-5xl text-primary" />
								</div>
								<h3 className="text-2xl font-titles font-bold text-gray-900 mb-2">
									Buscar Administrador
								</h3>
								<p className="text-gray-600 font-body text-lg">
									Ingresa un DNI de 8 dígitos para buscar un
									administrador
								</p>
							</div>
						)}
				</motion.div>
			)}
			<UserModal
				modal={modal}
				onClose={closeModal}
				onConfirm={confirmModalAction}
				isLoading={isModalLoading}
			/>
		</motion.div>
	);
};
