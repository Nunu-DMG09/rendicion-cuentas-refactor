import { AiOutlineEye } from "react-icons/ai";
import type { RendicionAxis } from "../types/rendicion";

type Props = {
	axis: RendicionAxis;
	index: number;
	isEven: boolean;
	onViewQuestions: (axis: RendicionAxis) => void;
};

export default function RendicionAxisRow({
	axis,
	isEven,
	onViewQuestions,
}: Props) {
	return (
		<tr
			className={`${
				isEven ? "bg-gray-50" : "bg-white"
			} hover:bg-blue-50 transition-colors duration-200`}
		>
			<td className="px-6 py-6 text-sm font-medium text-gray-900 border-r border-gray-200">
				<div className="flex items-center space-x-3">
					<div className="w-3 h-3 bg-primary-dark rounded-full shrink-0"></div>
					<span className="text-base font-titles">
						{axis.tematica}
					</span>
				</div>
			</td>
			<td className="px-6 py-6 text-center border-gray-200">
				<button
					className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 
                    bg-primary-dark text-white text-sm font-medium rounded-lg
                    hover:bg-primary focus:ring-2 focus:ring-primary-dark-dark focus:ring-offset-2
                    transform hover:scale-105 transition-all duration-200
                    shadow-sm hover:shadow-md"
					onClick={() => onViewQuestions(axis)}
				>
					<AiOutlineEye className='size-5' />
					Ver Preguntas
					<span className="bg-white/20 text-xs px-2 py-1 rounded-full">
						{axis.preguntas.length}
					</span>
				</button>
			</td>
		</tr>
	);
}
