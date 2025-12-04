import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import ScheduleCard from "./ScheduleCard";
import type { RegistrationRendicion } from "@/core/hooks";
import { Button } from "dialca-ui";
import { RiArrowRightSLine } from "react-icons/ri";
import type { ScheduleEvent } from "../../types/schedule";
import { ScheduleCardSkeleton } from "./ScheduleSkeleton";
import { HiCalendarDays, HiExclamationTriangle } from "react-icons/hi2";

interface Props {
	hasActiveRegistration: boolean;
	rendicionData: RegistrationRendicion | undefined;
	isLoading: boolean;
	recentRendiciones: ScheduleEvent[];
	isLoadingRendiciones: boolean;
}

export default function ScheduleSection({
	hasActiveRegistration,
	rendicionData,
	isLoading,
	recentRendiciones,
	isLoadingRendiciones,
}: Props) {
	const navigate = useNavigate();

	const handleRegistrationClick = () => {
		if (hasActiveRegistration && rendicionData?.id) {
			navigate(`/register/${rendicionData.id}`);
		}
	};
	return (
		<section className="w-full py-20">
			<div className="max-w-4xl mx-auto px-6 lg:px-8">
				<motion.header
					className="text-center mb-16"
					whileInView={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: -30 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					viewport={{ once: true, amount: 0.3 }}
				>
					<div className="inline-flex items-center justify-center w-20 h-1 mb-8"></div>
					<h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 font-titles">
						Rendiciones de Cuentas
					</h2>
					<p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-body">
						Cronograma de audiencias públicas programadas más
						recientes
					</p>
				</motion.header>
				{isLoadingRendiciones && (
					<div className="space-y-6 mb-16">
						{[...Array(2)].map((_, index) => (
							<ScheduleCardSkeleton key={index} />
						))}
					</div>
				)}
				{!isLoadingRendiciones &&
					(!recentRendiciones || recentRendiciones.length === 0) && (
						<motion.div
							className="text-center pb-20"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, ease: "easeOut" }}
						>
							<div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-8">
								<HiCalendarDays className="w-10 h-10 text-gray-400" />
							</div>
							<h3 className="text-2xl font-bold text-gray-900 mb-4 font-titles">
								No hay rendiciones programadas
							</h3>
							<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-8">
								Por el momento no hay audiencias públicas
								programadas. Revisa regularmente esta página para estar informado.
							</p>
							<div className="bg-blue-50 rounded-xl p-6 max-w-md mx-auto">
								<div className="flex items-center justify-center text-blue-800 mb-2">
									<HiExclamationTriangle className="w-5 h-5 mr-2" />
									<span className="font-semibold">
										¿Quieres estar al día?
									</span>
								</div>
								<p className="text-blue-700 text-sm">
									Mantente informado sobre las próximas
									convocatorias visitando regularmente esta
									página.
								</p>
							</div>
						</motion.div>
					)}
				{!isLoadingRendiciones && recentRendiciones && recentRendiciones.length > 0 && (
					<motion.div
						className="space-y-6 mb-16"
						whileInView="visible"
						initial="hidden"
						variants={{
							hidden: {},
							visible: {
								transition: {
									staggerChildren: 0.15,
								},
							},
						}}
						viewport={{ once: true, amount: 0.2 }}
					>
						{recentRendiciones.map((event, index) => (
							<motion.div
								key={event.id}
								initial={{ opacity: 0, y: 50 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.6,
									ease: "easeOut",
									delay: index * 0.15,
								}}
								viewport={{
									once: true,
									amount: 0.3,
									margin: "0px 0px -50px 0px",
								}}
							>
								<ScheduleCard event={event} index={index} />
							</motion.div>
						))}
					</motion.div>
				)}
				<motion.div
					className="text-center"
					whileInView={{ opacity: 1, y: 0 }}
					initial={{ opacity: 0, y: 30 }}
					transition={{ duration: 0.6, ease: "easeOut" }}
					viewport={{ once: true, amount: 0.3 }}
				>
					<h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 font-titles">
						Sé parte del cambio
					</h3>
					<p className="text-base lg:text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
						Únete a nuestras conferencias y participa activamente en el desarrollo de nuestra ciudad.
					</p>
					<Button
						variant="primary"
						size="lg"
						onClick={handleRegistrationClick}
						disabled={!hasActiveRegistration || isLoading}
						loading={isLoading}
						loadingText="Cargando..."
						className="group"
						classes={{
							content: "flex items-center gap-4",
						}}
					>
						<>
							{hasActiveRegistration
								? "Registrarse"
								: "Sin registro disponible"}
						</>
						<RiArrowRightSLine className="size-5 group-hover:translate-x-1 transition-all" />
					</Button>
				</motion.div>
			</div>
		</section>
	);
}

export { ScheduleSection };
