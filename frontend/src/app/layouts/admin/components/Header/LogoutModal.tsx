import { Button, Modal } from "dialca-ui";

interface Props {
    isModalOpen: boolean;
    closeModal: () => void;
    handleLogout: () => void;
}

export const LogoutModal = ({ isModalOpen, closeModal, handleLogout }: Props) => (
	<Modal
		isOpen={isModalOpen}
		onClose={closeModal}
		title="Cerrar sesión"
		animation="zoom"
	>
		<div className="text-center">
			<h3 className="text-2xl font-bold text-gray-900 mb-2 font-titles">
				¿Estás seguro de cerrar sesión?
			</h3>
			<p className="text-gray-600 text-lg mb-6 font-body">
				Se cerrará tu sesión actual y tendrás que volver a iniciar
				sesión.
			</p>
			<div className="flex gap-3 justify-center">
				<Button
					variant="outline"
					text="Cancelar"
					onClick={closeModal}
				/>
				<Button
					variant="danger"
					text="Cerrar sesión"
					onClick={handleLogout}
				/>
			</div>
		</div>
	</Modal>
);
