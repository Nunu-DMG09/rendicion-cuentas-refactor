import { useNavigate } from "react-router-dom";
import type { ScheduleEvent } from "../types/schedule";
import { RiArrowRightSLine } from "react-icons/ri";
import { HiMiniCheck } from "react-icons/hi2";
import { LuCalendar } from "react-icons/lu";

type Props = {
	event: ScheduleEvent;
	index: number;
};

export default function ScheduleCard({ event }: Props) {
	const navigate = useNavigate();

	const getStatusConfig = () => {
		switch (event.estado) {
			case "realizada":
				return {
					card: "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md",
					badge: "bg-green-50 text-green-700 border border-green-200",
					badgeText: "Completada",
				};
			default:
				return {
					card: "bg-white border-gray-200 hover:border-gray-300 hover:shadow-md",
					badge: "bg-gray-50 text-gray-600 border border-gray-200",
					badgeText: "Próxima",
				};
		}
	};

	const config = getStatusConfig();

	const getIcon = () => {
		switch (event.estado) {
			case "realizada":
				return <HiMiniCheck className="size-7" />
			default:
				return <LuCalendar className="size-7" />
		}
	};

	const handleCardClick = () => {
		navigate(`/rendicion/${event.id}`);
	};

	return (
		<article
			className={`group relative flex items-center justify-between p-8 rounded-2xl border-2 shadow-lg
                transform transition-all duration-300 hover:-translate-y-1 cursor-pointer
                ${config.card}
            `}
			onClick={handleCardClick}
		>
			<div className="flex items-center space-x-6">
				<div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-dark text-white shadow-lg transform transition-all duration-300 group-hover:scale-105">
					{getIcon()}
				</div>
				<div className="flex flex-col">
					<h3 className="text-2xl font-bold text-gray-900 mb-2">
						{event.titulo}
					</h3>
					{event.description && (
						<p className="text-base text-gray-600 mb-3">
							{event.description}
						</p>
					)}
					<span
						className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium w-fit ${config.badge}`}
					>
						{config.badgeText}
					</span>
				</div>
			</div>
			<div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-dark text-white shadow-lg transform transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">
				<RiArrowRightSLine className="size-8" />
			</div>
		</article>
	);
}
