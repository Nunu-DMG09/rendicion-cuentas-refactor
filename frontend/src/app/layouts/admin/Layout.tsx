import { useSidebar } from "@/core/hooks";
import { Outlet } from "react-router-dom"
import { Header } from "./components/Header/Header";
import { Sidebar } from "./components/Sidebar/Sidebar";

export const AdminLayout = () => {
    const { isOpen } = useSidebar();
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isOpen ? "md:ml-60" : "md:ml-16"}`}>
                <Header />
                <div className="flex-1 p-4 lg:p-6">
                    <Outlet />
                </div>
            </div>
        </div>
    )
}