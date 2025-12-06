import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DropZone } from "dialca-ui";
import { FaCloudUploadAlt, FaTimes, FaImage } from "react-icons/fa";
import type { BannerSelectorProps } from "../types/rendicionAdmin";
import {
	ACCEPTED_IMAGE_FORMATS,
	MAX_FILE_SIZE_MB,
	MAX_FILES,
} from "../constants/rendicionAdminData";
import { formatFileSize } from "@/shared/utils";

export default function BannerSelector({
	selectedBanners,
	onAdd,
	onRemove,
}: BannerSelectorProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

	const handleClick = () => fileInputRef.current?.click();
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			onAdd(files);
		}
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};
    
	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};
    const handleDragLeave = () => setIsDragging(false);
	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
        setIsDragging(false);
		const files = e.dataTransfer.files;
		if (files && files.length > 0) {
			onAdd(files);
		}
	};
	return (
		<div className="space-y-4">
			<motion.div>
				<DropZone
					isDragging={isDragging}
					onClick={handleClick}
					onDragOver={handleDragOver}
					onDrop={handleDrop}
					onDragLeave={handleDragLeave}
					disabled={selectedBanners.length >= MAX_FILES}
					title={
						selectedBanners.length >= MAX_FILES
							? "Límite de archivos alcanzado"
							: "Arrastra tus imágenes aquí o haz click para seleccionar"
					}
					description={`JPG, PNG, WebP o GIF • Máx. ${MAX_FILE_SIZE_MB}MB por archivo • Hasta ${MAX_FILES} archivos`}
					icon={
						<div
							className={`
                            size-16 rounded-full flex items-center justify-center
                            ${
								selectedBanners.length >= MAX_FILES
									? "bg-gray-200"
									: "bg-primary-dark/10"
							}`}
						>
							<FaCloudUploadAlt
								className={`
                                size-8  ${
									selectedBanners.length >= MAX_FILES
										? "text-gray-400"
										: "text-primary-dark"
								}
                            `}
							/>
						</div>
					}
				/>
                <input
					ref={fileInputRef}
					type="file"
					accept={ACCEPTED_IMAGE_FORMATS}
					multiple
					onChange={handleFileChange}
					className="hidden"
					disabled={selectedBanners.length >= MAX_FILES}
				/>
			</motion.div>
			<AnimatePresence mode="popLayout">
				{selectedBanners.length > 0 && (
					<motion.div
						className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: "auto" }}
						exit={{ opacity: 0, height: 0 }}
					>
						{selectedBanners.map((banner, index) => (
							<motion.div
								key={banner.id}
								className="relative group rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow"
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 0.8 }}
								transition={{ delay: index * 0.05 }}
								layout
							>
								{/* Image Preview */}
								<div className="aspect-video bg-gray-100">
									<img
										src={banner.preview}
										alt={banner.name}
										className="w-full h-full object-cover"
									/>
								</div>
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />
								<motion.button
									type="button"
									className="cursor-pointer absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
									onClick={() => onRemove(banner.id)}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<FaTimes className="h-3 w-3" />
								</motion.button>
								<div className="p-2 bg-white">
									<p
										className="text-xs font-medium text-gray-700 truncate"
										title={banner.name}
									>
										{banner.name}
									</p>
									<p className="text-xs text-gray-500">
										{formatFileSize(banner.file.size)}
									</p>
								</div>
								<div className="absolute top-2 left-2 w-6 h-6 bg-primary-dark text-white text-xs font-bold rounded-full flex items-center justify-center">
									{index + 1}
								</div>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
			{selectedBanners.length === 0 && (
				<div className="flex items-center justify-center py-4 text-gray-400">
					<FaImage className="h-5 w-5 mr-2" />
					<span className="text-sm">
						No hay banners seleccionados
					</span>
				</div>
			)}
			{selectedBanners.length > 0 && (
				<div className="flex items-center justify-between text-sm">
					<span className="text-gray-500">
						{selectedBanners.length} de {MAX_FILES} archivos
						seleccionados
					</span>
					{selectedBanners.length > 1 && (
						<button
							type="button"
							className="cursor-pointer text-red-500 hover:text-red-600 font-medium transition-colors"
							onClick={() =>
								selectedBanners.forEach((b) => onRemove(b.id))
							}
						>
							Eliminar todos
						</button>
					)}
				</div>
			)}
		</div>
	);
}
