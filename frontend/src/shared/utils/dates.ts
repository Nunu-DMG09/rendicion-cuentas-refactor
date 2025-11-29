export const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "Fecha inválida";
	return date.toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};
