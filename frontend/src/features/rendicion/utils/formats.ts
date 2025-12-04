export const formatTime = (timeString: string) => {
	if (!timeString) return "Hora por definir";
    let isAM = true;
	try {
		const [hours, minutes] = timeString.split(":");
        if (parseInt(hours) >= 12) isAM = false;
		return `${hours}:${minutes} ${isAM ? 'AM' : 'PM'}`;
	} catch {
		return timeString;
	}
};
