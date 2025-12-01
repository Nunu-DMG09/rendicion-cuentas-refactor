import { AuthProvider as Provider } from "@/features/auth/providers/AuthProvider";

interface Props {
	children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
	return <Provider>{children}</Provider>;
};
