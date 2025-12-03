export const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return bytes + " B";
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
	return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

export const formatName = (
	names: string,
	paternalSurname: string,
	maternalSurname: string
) => `${paternalSurname} ${maternalSurname}, ${names}`;
