import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import ScheduleCard from "./ScheduleCard";
import { useSchedule } from "../hooks/useSchedule";
import type { RegistrationRendicion } from "@/core/hooks";
import { Button } from "dialca-ui";
import { RiArrowRightSLine } from "react-icons/ri";

interface Props {
	hasActiveRegistration: boolean;
	rendicionData: RegistrationRendicion | undefined;
	isLoading: boolean;
}

export default function ScheduleSection({
	hasActiveRegistration,
	rendicionData,
	isLoading,
}: Props) {
	const scheduleData = useSchedule();
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
						{scheduleData.title}
					</h2>
					<p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-body">
						{scheduleData.subtitle}
					</p>
				</motion.header>
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
					{scheduleData.events.map((event, index) => (
						<motion.div
							key={event.id}
							variants={{
								hidden: { opacity: 0, y: 50 },
								visible: { opacity: 1, y: 0 },
							}}
							transition={{ duration: 0.6, ease: "easeOut" }}
						>
							<ScheduleCard event={event} index={index} />
						</motion.div>
					))}
				</motion.div>
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
						{scheduleData.ctaSubtext}
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
