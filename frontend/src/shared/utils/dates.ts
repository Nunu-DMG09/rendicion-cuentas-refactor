export const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	if (isNaN(date.getTime())) return "Fecha inválida";
	return date.toLocaleDateString("es-ES", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
export const formatDateWithWeekday = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
    }
