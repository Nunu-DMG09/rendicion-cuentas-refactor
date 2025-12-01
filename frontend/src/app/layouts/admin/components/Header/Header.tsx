import { useSidebar } from "@/core/hooks";
import { firstAdminName } from "@/core/utils/user";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { Button } from "dialca-ui";
import { useState } from "react";
import { TbMenu3 } from "react-icons/tb";
import { LogoutModal } from "./LogoutModal";

export const Header = () => {
	const { toggleSidebar } = useSidebar();
	const { user } = useAuthStore();
	const { useLogoutMutation } = useAuth();
	const logoutMutation = useLogoutMutation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const handleLogout = () => {
		logoutMutation.mutate();
		closeModal();
	};

	return (
		<header className="text-gray-900 p-4 flex items-center justify-between">
			<button
				className="p-1 block md:hidden"
				onClick={toggleSidebar}
				aria-label="Open Menu"
				title="Open menu"
			>
				<TbMenu3 className="text-2xl text-primary-dark dark:text-primary-light transition-all duration-300 ease-in-out" />
			</button>
			<h2 className="font-bold text-base font-titles md:text-2xl hidden md:block">
				Bienvenido(a) nuevamente,{" "}
				{firstAdminName(user ? user.nombre : "") || "Admin"}!
			</h2>
			<Button
				variant="danger"
				size={window.innerWidth < 768 ? "sm" : "md"}
				text="Cerrar sesión"
				onClick={openModal}
			/>
			<LogoutModal
				isModalOpen={isModalOpen}
				closeModal={closeModal}
				handleLogout={handleLogout}
			/>
		</header>
	);
};
