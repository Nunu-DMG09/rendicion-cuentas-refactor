import { useLogin } from '../hooks/useLogin';

export const LoginForm = () => {
    const {
        dni,
        password,
        isVisible,
        isFormValid,
        isLoading,
        togglePasswordVisibility,
        handleDniChange,
        handlePasswordChange,
        handleSubmit
    } = useLogin();

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={dni}
                onChange={handleDniChange}
                placeholder="DNI"
                maxLength={8}
            />
            
            <div className="relative">
                <input
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Contraseña"
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                >
                    {isVisible ? "Ocultar" : "Mostrar"}
                </button>
            </div>

            <button
                type="submit"
                disabled={!isFormValid || isLoading}
                className={`${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <>
                        <span className="spinner" />
                        Iniciando sesión...
                    </>
                ) : (
                    'Iniciar Sesión'
                )}
            </button>
        </form>
    );
};