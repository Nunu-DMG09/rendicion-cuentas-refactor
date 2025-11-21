import { SidebarProvider as Provider } from "@/core/contexts";
export const SidebarProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	return <Provider>{children}</Provider>;
};
