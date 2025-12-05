import { api } from "@/core/config";
import type {
	NormalizedRendicionDataWithSelector,
	RendicionDataWithSelector,
} from "@/features/rendicion/types/rendicion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useCallback, useEffect } from "react";
import type {
	Pregunta,
	PreguntasModalState,
	PreguntasPorEjeSelector,
} from "../types/preguntas";
import type { ApiError } from "@/core/types";
import { useAuthStore } from "@/features/auth/store/auth.store";

interface UpdateSelectionPayload {
	pregunta_ids: number[];
	action: "select" | "unselect";
	id_eje_seleccionado: number;
	admin_id: number;
}

interface UpdateSelectionResponse {
	success: boolean;
	message: string;
	data: {
		pregunta_ids: number[];
		action: "select" | "unselect";
		id_eje: number;
		processed_count: number;
	};
}

export const useSeleccionarPreguntas = (rendicionId: string) => {
	const queryClient = useQueryClient();
	const { user } = useAuthStore();
	const adminId = user?.id || 1;

	const [modal, setModal] = useState<PreguntasModalState>({
		isOpen: false,
		type: "confirm",
		title: "",
		message: "",
	});
	const [localSelections, setLocalSelections] = useState<Set<string>>(
		new Set()
	);
	const [pendingChanges, setPendingChanges] = useState<{
		toSelect: Set<string>;
		toUnselect: Set<string>;
	}>({
		toSelect: new Set(),
		toUnselect: new Set(),
	});
	const [backendSelections, setBackendSelections] = useState<Set<string>>(
		new Set()
	);

	// Fetch preguntas para la rendición
	const fetchQuestionsForRendicion =
		async (): Promise<RendicionDataWithSelector> => {
			const res = await api.get(`admin/preguntas/${rendicionId}`, {
				withCredentials: true,
			});
			return res.data.data;
		};
	const questionsQuery = useQuery({
		queryKey: ["questionsForRendicion", rendicionId],
		queryFn: fetchQuestionsForRendicion,
		enabled: !!rendicionId,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000,
		retry: (failureCount, error) => {
			if (failureCount >= 2) return false;
			if (error.message.includes("404") || error.message.includes("400"))
				return false;
			return true;
		},
		retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
	});
	useEffect(() => {
		if (questionsQuery.data && questionsQuery.isSuccess) {
			const backendSelectedIds = new Set<string>();
			Object.values(questionsQuery.data).forEach((axis) => {
				axis.preguntas.forEach((pregunta) => {
					if (pregunta.is_selected)
						backendSelectedIds.add(pregunta.id.toString());
				});
			});
			setLocalSelections(backendSelectedIds);
			setBackendSelections(backendSelectedIds);
			setPendingChanges({ toSelect: new Set(), toUnselect: new Set() });
		}
	}, [questionsQuery.data, questionsQuery.isSuccess]);

	const updateSelectionQuestions = async (
		payload: UpdateSelectionPayload
	): Promise<UpdateSelectionResponse> => {
		const res = await api.post(`/admin/preguntas/seleccionar`, payload, {
			withCredentials: true,
		});
		return res.data;
	};

	const updateSelectionMutation = useMutation({
		mutationFn: updateSelectionQuestions,
		onSuccess: (data, variables) => {
			queryClient.setQueryData<RendicionDataWithSelector>(
				["questionsForRendicion", rendicionId],
				(oldData) => {
					if (!oldData) return oldData;
					const updatedData = { ...oldData };
					const idsToUpdate = variables.pregunta_ids.map((id) =>
						id.toString()
					);
					const newSelectionState = variables.action === "select";
					Object.keys(updatedData).forEach((ejeKey) => {
						updatedData[ejeKey] = {
							...updatedData[ejeKey],
							preguntas: updatedData[ejeKey].preguntas.map(
								(pregunta) => {
									if (
										idsToUpdate.includes(
											pregunta.id.toString()
										)
									) {
										return {
											...pregunta,
											is_selected: newSelectionState,
										};
									}
									return pregunta;
								}
							),
						};
					});
					return updatedData;
				}
			);
			const updatedSelections = new Set(localSelections);
			variables.pregunta_ids.forEach((id) => {
				const idStr = id.toString();
				if (variables.action === "select") {
					updatedSelections.add(idStr);
				} else {
					updatedSelections.delete(idStr);
				}
			});
			setLocalSelections(updatedSelections);
			setBackendSelections(updatedSelections);
			setPendingChanges((prev) => {
				const newState = { ...prev };
				variables.pregunta_ids.forEach((id) => {
					const idStr = id.toString();
					if (variables.action === "select") {
						newState.toSelect.delete(idStr);
					} else {
						newState.toUnselect.delete(idStr);
					}
				});
				return newState;
			});
			setModal({
				isOpen: true,
				type: "success",
				title: "¡Selección actualizada!",
				message: `${data.data.processed_count} pregunta${
					data.data.processed_count !== 1 ? "s" : ""
				} actualizada${
					data.data.processed_count !== 1 ? "s" : ""
				} correctamente.`,
			});
		},
		onError: (error: ApiError) => {
			setLocalSelections((prev) => {
				const reverted = new Set(prev);
				pendingChanges.toSelect.forEach((id) => reverted.delete(id));
				pendingChanges.toUnselect.forEach((id) => reverted.add(id));
				return reverted;
			});
			setPendingChanges({ toSelect: new Set(), toUnselect: new Set() });
			let errorMessage = "";
			if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				errorMessage = error.response.data.message;
			}
			if (error.message) errorMessage = error.message;
			setModal({
				isOpen: true,
				type: "error",
				title: "Error al actualizar",
				message:
					errorMessage ||
					"Ocurrió un error al actualizar las selecciones.",
			});
		},
	});

	const normalizedData: NormalizedRendicionDataWithSelector | undefined =
		useMemo(() => {
			return questionsQuery.data
				? {
						axes: Object.values(questionsQuery.data).sort((a, b) =>
							a.tematica.localeCompare(b.tematica)
						),
						totalQuestions: Object.values(
							questionsQuery.data
						).reduce(
							(total, axis) => total + axis.preguntas.length,
							0
						),
				  }
				: undefined;
		}, [questionsQuery.data]);

	const preguntasPorEje = useMemo((): PreguntasPorEjeSelector[] => {
		if (!normalizedData?.axes) return [];
		return normalizedData.axes
			.map((axis) => ({
                selectedEjeId: axis.id.toString(),
				ejeId: axis.eje_id.toString(),
				ejeNombre: axis.tematica,
				preguntas: axis.preguntas.map((pregunta) => {
					const preguntaId = pregunta.id.toString();
					const isLocallySelected = localSelections.has(preguntaId);
					const isPendingSelect =
						pendingChanges.toSelect.has(preguntaId);
					const isPendingUnselect =
						pendingChanges.toUnselect.has(preguntaId);
					let finalSelection = isLocallySelected;
					if (isPendingSelect) finalSelection = true;
					if (isPendingUnselect) finalSelection = false;

					return {
						id: preguntaId,
						texto: pregunta.contenido,
						participante: {
							nombre: pregunta.usuario,
							id: pregunta.usuario_id.toString(),
							dni: "",
						},
						isSelected: finalSelection,
						ejeId: axis.eje_id.toString(),
						ejeNombre: axis.tematica,
						fechaCreacion: pregunta.created_at,
						respondida: false,
					};
				}),
			}))
			.filter((eje) => eje.preguntas.length > 0);
	}, [normalizedData, localSelections, pendingChanges]);

	const allQuestions = useMemo((): Pregunta[] => {
		return preguntasPorEje.flatMap((eje) => eje.preguntas);
	}, [preguntasPorEje]);

	const stats = useMemo(() => {
		const selectedQuestions = allQuestions.filter(
			(p) => "isSelected" in p && p.isSelected
		);
		const pendingSelectCount = pendingChanges.toSelect.size;
		const pendingUnselectCount = pendingChanges.toUnselect.size;

		return {
			total: allQuestions.length,
			selected: selectedQuestions.length,
			pending: pendingSelectCount + pendingUnselectCount,
			respondidas: allQuestions.filter((p) => p.respondida).length,
			pendientes: allQuestions.filter((p) => !p.respondida).length,
			ejes: preguntasPorEje.length,
		};
	}, [allQuestions, preguntasPorEje, pendingChanges]);

	const toggleQuestionSelection = useCallback(
		(preguntaId: string) => {
			const isCurrentlySelected = localSelections.has(preguntaId);
			const isSelectedInBackend = backendSelections.has(preguntaId);

			setLocalSelections((prev) => {
				const updated = new Set(prev);
				if (isCurrentlySelected) updated.delete(preguntaId);
				else updated.add(preguntaId);
				return updated;
			});
			setPendingChanges((prev) => {
				const updated = { ...prev };
				const newSelectionState = !isCurrentlySelected;
				if (newSelectionState === isSelectedInBackend) {
					updated.toUnselect.delete(preguntaId);
					updated.toSelect.delete(preguntaId);
				} else if (newSelectionState && !isSelectedInBackend) {
					updated.toSelect.add(preguntaId);
					updated.toUnselect.delete(preguntaId);
				} else if (!newSelectionState && isSelectedInBackend) {
					updated.toUnselect.add(preguntaId);
					updated.toSelect.delete(preguntaId);
				}
				return updated;
			});
		},
		[localSelections, backendSelections]
	);
	const groupQuestionsByEje = useCallback((questionIds: string[]): Map<string, string[]> => {
			const groups = new Map<string, string[]>();
			questionIds.forEach((questionId) => {
				for (const eje of preguntasPorEje) {
					const pregunta = eje.preguntas.find(p => p.id === questionId);
					if (pregunta) {
						const ejeId = eje.selectedEjeId;
						if (!groups.has(ejeId)) groups.set(ejeId, []);
						groups.get(ejeId)!.push(questionId);
						break;
					}
				}
			});
			return groups;
		},
		[preguntasPorEje]
	);
	const saveChanges = useCallback(async () => {
		const { toSelect, toUnselect } = pendingChanges;
		if (toSelect.size === 0 && toUnselect.size === 0) {
			setModal({
				isOpen: true,
				type: "confirm",
				title: "Sin cambios",
				message: "No hay cambios pendientes para guardar.",
			});
			return;
		}
        try {
            if (toSelect.size > 0) {
                const selectGroups = groupQuestionsByEje(Array.from(toSelect));
                for (const [ejeId, questionIds] of selectGroups) {
                    const selectIds = questionIds.map(id => parseInt(id));
                    await updateSelectionMutation.mutateAsync({
                        pregunta_ids: selectIds,
                        action: "select",
                        admin_id: adminId,
                        id_eje_seleccionado: parseInt(ejeId),
                    });
                }
            }
            if (toUnselect.size > 0) {
                const unselectGroups = groupQuestionsByEje(Array.from(toUnselect));
                for (const [ejeId, questionIds] of unselectGroups) {
                    const unselectIds = questionIds.map(id => parseInt(id));
                    await updateSelectionMutation.mutateAsync({
                        pregunta_ids: unselectIds,
                        action: "unselect",
                        admin_id: adminId,
                        id_eje_seleccionado: parseInt(ejeId),
                    });
                }
            }
        } catch (error) {
            console.error("Error saving changes:", error);
        }
	}, [pendingChanges, updateSelectionMutation, adminId, groupQuestionsByEje]);

	const discardChanges = useCallback(() => {
		setLocalSelections(backendSelections);
		setPendingChanges({ toSelect: new Set(), toUnselect: new Set() });
	}, [backendSelections]);

	const closeModal = () => setModal((prev) => ({ ...prev, isOpen: false }));
	const hasResults = preguntasPorEje.length > 0;
	const hasPendingChanges =
		pendingChanges.toSelect.size > 0 || pendingChanges.toUnselect.size > 0;

	return {
		// Data
		preguntasPorEje,
		isLoading: questionsQuery.isLoading,
		isError: questionsQuery.isError,
		error: questionsQuery.error,
		hasResults,
		stats,

		// Selection state
		localSelections,
		hasPendingChanges,
		isUpdating: updateSelectionMutation.isPending,

		// Actions
		toggleQuestionSelection,
		saveChanges,
		discardChanges,

		// Modal
		modal,
		closeModal,

		// Utils
		refetch: questionsQuery.refetch,
	};
};
