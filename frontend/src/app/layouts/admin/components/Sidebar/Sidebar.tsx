import { useSidebar } from "@/core/hooks"
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png"
import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { SIDEBAR_ITEMS } from "./constants/sidebarItems";
import { SidebarSubmenu } from "./SidebarSubmenu";
import { SidebarItem } from "./SidebarItem";
import { isSuperAdmin } from "@/core/utils";
import { useAuthStore } from "@/features/auth/store/auth.store";

export const Sidebar = () => {
    const { isOpen, toggleSidebar, closeSidebar } = useSidebar();
    const { user } = useAuthStore();
    const [isIconHovered, setIsIconHovered] = useState(false);
    return (
        <>
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-primary-dark/30 z-20"
                    onClick={closeSidebar}
                />
            )} 
            <aside 
                className={`fixed top-0 left-0 h-full bg-white flex flex-col shadow-md z-30 transition-all duration-300 ease-in-out
                    ${isOpen ?  "w-60 p-4 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 md:w-16 p-2"}
                `}
            >
                <div className={`${isOpen ? "opacity-100": "opacity-0 md:opacity-100"} transition-all duration-300 h-full flex flex-col overflow-hidden ease-in-out`}>
                    <div className={`flex justify-center ${!isOpen ? "md:justify-center": "md:justify-between"} items-center mb-8`}>
                        {isOpen ? (
                            <Link
                                to="/admin/"
                                aria-label="Ir al inicio"
                                title="Ir al inicio"
                            >
                                <img src={logo} alt="Logo de la Municipalidad Distrital de JLO" className="h-16 w-auto" />
                            </Link>
                        ): (
                            <button
                                onClick={toggleSidebar}
                                onMouseEnter={() => setIsIconHovered(true)}
                                onMouseLeave={() => setIsIconHovered(false)}
                                aria-label="Abrir barra lateral"
                                title="Abrir barra lateral"
                                className="hidden md:flex justify-center items-center mt-4 size-10 group hover:bg-primary/50 rounded-lg transition-all duration-300 ease-in-out cursor-pointer"
                            >
                                {isIconHovered ? (
                                    <GoSidebarCollapse className="text-primary-dark text-2xl transition-all duration-300 ease-in-out" />
                                ): (
                                    <img
                                        src={logo}
                                        alt="Logo de la Municipalidad Distrital de JLO"
                                        className="h-10 w-auto"
                                    />
                                )}
                            </button>
                        )}
                        {isOpen && (
							<button
								className="p-2 rounded-lg hidden md:block cursor-pointer hover:bg-primary/50 transition-all duration-200 ease-in-out group"
								onClick={toggleSidebar}
							>
								<GoSidebarExpand className="text-primary-dark text-2xl transition-all duration-300 ease-in-out" />
							</button>
						)}
                    </div>
                    <div className="flex-1 pr-1 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-primary/50">
                        <nav className="flex flex-col gap-3 mt-2 justify-center">
                            {SIDEBAR_ITEMS.map(item => {
                                const showItem = !item.restricted || isSuperAdmin(user?.rol || "")
                                if (!showItem) return null;
                                const Icon = item.icon;
                                if (item.subItems) {
                                    return (
                                        <SidebarSubmenu
                                            key={item.text}
                                            parentTo={item.to}
                                            icon={<Icon />}
                                            text={item.text}
                                            subItems={item.subItems}
                                            isCompact={!isOpen}
                                        />
                                    )
                                }
                                return (
                                    <SidebarItem
                                        key={item.text}
                                        text={item.text}
                                        icon={<Icon />}
                                        to={item.to}
                                        isCompact={!isOpen}
                                    />
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </aside>
        </>
    )
}