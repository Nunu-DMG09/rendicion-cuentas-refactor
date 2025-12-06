export interface User {
	id: string;
	dni: string;
	nombre: string;
	categoria: "super_admin" | "admin";
	estado: "1" | "0";
	created_at: string;
	updated_at: string;
	deleted_at: string | null;
}
export type UserModalType =
	| "change_password"
	| "edit_role"
	| "toggle_status"
	| "success"
	| "error"
	| "confirm";

export interface UserModalState {
	isOpen: boolean;
	type: UserModalType;
	title: string;
	message: string;
	user?: User;
	onConfirm?: () => void;
}
