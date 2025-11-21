import { useSidebar } from "@/core/hooks";
import { TbMenu3 } from "react-icons/tb";

export const Header = () => {
    const { toggleSidebar } = useSidebar();
    return (
        <header className="text-gray-900 p-4 flex items-center justify-between">
            <button
				className="p-1 block md:hidden"
				onClick={toggleSidebar}
				aria-label="Open Menu"
				title="Open menu"
			>
				<TbMenu3 className="text-2xl text-primary-dark dark:text-primary-light transition-all duration-300 ease-in-out" />
			</button>
            {/* Aca vendra el nombre del contexto xd */}
            <h2 className="font-bold text-base font-titles md:text-2xl hidden md:block">
				Bienvenido nuevamente, Admin!
			</h2>
        </header>
    )
}