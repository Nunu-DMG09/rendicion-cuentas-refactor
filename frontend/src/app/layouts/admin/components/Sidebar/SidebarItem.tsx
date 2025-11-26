import { useSidebar } from "@/core/hooks";
import { NavLink } from "react-router-dom";

interface Props {
    text: string;
    icon: React.ReactNode;
    to: string;
    isCompact?: boolean;
}

export const SidebarItem = ({ text, icon, to, isCompact = false }: Props) => {
    const { closeSidebar } = useSidebar();
    const baseClass = "text-gray-700 hover:bg-primary/50";
    const activeClass = "bg-primary text-white font-semibold";
    
    return (
        <NavLink
            to={to}
            onClick={() => { if (window.innerWidth < 768) closeSidebar() }}
            className={({ isActive }) => `
                flex items-center py-2 px-4 rounded-lg transition-all duration-300 ${isCompact ? "justify-center" : ""}
                ${isActive ? activeClass : baseClass}
            `}
        >
            <div className={`${isCompact ? "text-xl" : "w-6"}`}>
                {icon}
            </div>
            {!isCompact && <span className="ml-3 font-medium text-center">{text}</span>}
        </NavLink>
    )
}