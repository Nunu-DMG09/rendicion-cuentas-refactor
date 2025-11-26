import { useState } from "react";
import type { SidebarItemRestricted } from "./types/sidebarItem";
import { useSidebar } from "@/core/hooks";
import { IoChevronForward } from "react-icons/io5";
import { NavLink } from "react-router-dom";
// import { isAdmin } from "@/core/utils";
// import { useAuth } from "@/features/auth/hooks";

interface Props {
	parentTo?: string;
	icon: React.ReactNode;
	isCompact?: boolean;
	text: string;
	subItems: SidebarItemRestricted[];
	onClick?: () => void;
}
export const SidebarSubmenu = ({
	icon,
	isCompact = false,
	text,
	subItems,
	onClick,
	parentTo,
}: Props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { closeSidebar } = useSidebar();
	// const { user } = useAuth();
	const toggleSubmenu = () => {
		if (!isCompact) setIsOpen(!isOpen);
	};
	const baseClass = "text-gray-700 hover:bg-primary/50";

	return (
		<div className="mb-1" onClick={onClick}>
			<button
				onClick={toggleSubmenu}
				className={`w-full flex items-center py-2 px-4 rounded-lg transition-all duration-300 ${
					isCompact ? "justify-center" : ""
				} ${baseClass}`}
			>
				<div className={`${isCompact ? "text-xl" : "w-6"}`}>{icon}</div>
				{!isCompact && (
					<>
						<span className="ml-3 font-medium flex-1 text-left">
							{text}
						</span>
						<IoChevronForward
							className={`text-xs transition-all ${
								isOpen ? "rotate-90" : "rotate-0"
							}`}
						/>
					</>
				)}
			</button>
			{!isCompact && (
				<div
					className={`overflow-hidden transition-all duration-300 ease-in-out ${
						isOpen ? "max-h-96" : "max-h-0"
					}`}
				>
					<div className="pl-4 pr-2 py-1">
						{subItems.map((item) => {
							const showItem = !item.restricted /*|| isAdmin(user?.role || "")*/;
							if (!showItem) return null;
							return (
								<NavLink
									key={item.text}
									to={`${parentTo}${item.to}`}
									end
									onClick={() => {if (window.innerWidth < 768) closeSidebar(); }}
									className={({ isActive }) => `flex items-center py-2 px-4 mb-1 rounded-lg transition-all duration-300 text-sm
									${isActive
										? "bg-primary text-white font-semibold"
										: baseClass
									}`}
								>
									<div className="text-sm">
										{item.icon && <item.icon />}
									</div>
									<span className="ml-3 font-medium">
										{item.text}
									</span>
								</NavLink>
							);
						})}
					</div>
				</div>
			)}
		</div>
	);
};