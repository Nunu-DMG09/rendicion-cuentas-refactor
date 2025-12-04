import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type {
	PreguntasPorEje,
	PreguntasPorEjeSelector,
} from "../types/preguntas";
import { PreguntaPorEjeItem } from "./PreguntaPorEjeItem";

type Props = {
	preguntasPorEje: PreguntasPorEje[] | PreguntasPorEjeSelector[];
	isSelectorMode?: boolean;
	onSelectQuestion?: (preguntaId: string) => void;
	onUnselectQuestion?: (preguntaId: string) => void;
};

export default function PreguntasPorEjeList({
	preguntasPorEje,
	isSelectorMode,
	onSelectQuestion,
	onUnselectQuestion,
}: Props) {
	const [expandedEjes, setExpandedEjes] = useState<Set<string>>(new Set());
	const toggleEje = (ejeId: string) => {
		setExpandedEjes((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(ejeId)) newSet.delete(ejeId);
			else newSet.add(ejeId);
			return newSet;
		});
	};
	const expandAll = () => setExpandedEjes(new Set(preguntasPorEje.map((e) => e.ejeId)));
	const collapseAll = () => setExpandedEjes(new Set());

	return (
		<div className="space-y-4">
			<div className="flex justify-end gap-2">
				<button
					onClick={expandAll}
					className="px-3 py-1.5 text-sm text-primary-dark hover:bg-primary-dark/10 rounded-lg transition-colors cursor-pointer"
				>
					Expandir todo
				</button>
				<button
					onClick={collapseAll}
					className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
				>
					Colapsar todo
				</button>
			</div>
			<div className="space-y-3">
				<AnimatePresence>
					{preguntasPorEje.map((grupo, grupoIndex) => {
						const isExpanded = expandedEjes.has(grupo.ejeId);
						return (
							<PreguntaPorEjeItem
								key={grupo.ejeId}
								grupo={grupo}
								isExpanded={isExpanded}
								grupoIndex={grupoIndex}
								toggleEje={toggleEje}
								onUnselect={onUnselectQuestion}
								isSelectorMode={isSelectorMode}
								onSelect={onSelectQuestion}
							/>
						);
					})}
				</AnimatePresence>
			</div>
		</div>
	);
}
