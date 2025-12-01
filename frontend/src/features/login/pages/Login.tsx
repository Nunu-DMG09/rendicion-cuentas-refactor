import { Navigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import logo from "@/assets/logo.png";
import { useLogin } from "../hooks/useLogin";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { useAuthContext } from "@/features/auth/providers/AuthProvider";
import { Button, InputField, Loader } from "dialca-ui";

export const LoginForm = () => {
    const { isInitializing } = useAuthContext();
    const {
        dni,
        handleDniChange,
        password,
        handlePasswordChange,
        isFormValid,
        isVisible,
        togglePasswordVisibility,
        isLoading,
        handleSubmit,
    } = useLogin();
    const { isAuthenticated } = useAuthStore();
    
    if (isInitializing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader variant="xl" />
                    <p className="mt-5 text-primary-dark">Verificando sesión...</p>
                </div>
            </div>
        );
    }
    
    if (isAuthenticated) return <Navigate to="/admin" />;

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <main className="min-h-screen transition-all duration-300 ease-in-out">
            <motion.header
                className="flex items-center justify-center md:justify-start w-full py-7 px-5 transition-all duration-300 ease-in-out"
            >
                <Link className="flex items-center gap-4" to="/">
                    <motion.img
                        src={logo}
                        alt="Logo Municipal"
                        className="h-14 md:h-25 object-contain"
                        initial="hidden"
                        animate="visible"
                        whileHover={{ scale: 1.05 }}
                    />
                </Link>
            </motion.header>

            <motion.div
                className="container mx-auto my-10 px-4 py-6 max-w-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h2
                    className="text-5xl wrap-break-word text-center font-bold mb-6 text-primary-dark font-titles"
                    variants={itemVariants}
                >
                    Iniciar Sesión
                </motion.h2>

                <motion.form
                    className="rounded-lg p-6"
                    onSubmit={handleSubmit}
                    variants={itemVariants}
                >
                    <div className="space-y-6">
                        <motion.div
                            variants={itemVariants}
                            whileFocus={{ scale: 1.02 }}
                        >
                            <InputField
                                label="DNI"
                                value={dni}
                                onChange={handleDniChange}
                                minLength={8}
                                maxLength={8}
                                disabled={isLoading}
                                required
                            />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileFocus={{ scale: 1.02 }}
                        >
                            <InputField
                                label="Contraseña"
                                value={password}
                                onChange={handlePasswordChange}
                                isPassword
                                showPassword={isVisible}
                                onToggleVisibility={togglePasswordVisibility}
                                disabled={isLoading}
                                minLength={8}
                                required
                            />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                type="submit"
                                disabled={!isFormValid}
                                className="w-full!"
                            >
                                {isLoading ? <Loader /> : "Iniciar Sesión"}
                            </Button>
                        </motion.div>
                    </div>
                </motion.form>
            </motion.div>
        </main>
    );
};
