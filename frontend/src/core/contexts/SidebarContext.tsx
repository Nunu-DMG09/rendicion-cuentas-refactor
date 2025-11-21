import { createContext, useEffect, useState } from "react";

interface Type {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}
export const SidebarContext = createContext<Type | undefined>(undefined);
export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(() => {
        const savedState = localStorage.getItem("sidebar-open");
        return savedState !== null ? JSON.parse(savedState) : true;
    });
    useEffect(() => {
        localStorage.setItem("sidebar-open", JSON.stringify(isOpen));
    }, [isOpen]);
    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);
    return (
        <SidebarContext.Provider value={{ isOpen, toggleSidebar, closeSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}