import { useContext } from "react"
import { SidebarContext } from "../contexts"

export const useSidebar = () => {
    const ctx = useContext(SidebarContext);
    if (!ctx) throw new Error("useSidebar must be used within a SidebarProvider");
    return ctx;
}