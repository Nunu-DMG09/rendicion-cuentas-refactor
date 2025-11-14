# Rendición de Cuentas — Frontend (refactor)

Resumen
- Este repositorio es una refactorización de un proyecto anterior. Antes el backend estaba embebido en las plantillas HTML y el frontend usaba Bootstrap y CSS poco mantenible.  
- Objetivo: separar frontend/ backend, modernizar tecnologías y mejorar mantenibilidad, rendimiento y experiencia de desarrollo.

Arquitectura propuesta
- Backend: API REST (PHP/CodeIgniter) que expone endpoints JSON.
- Frontend: SPA moderna (React + Vite + TypeScript), con Tailwind CSS para estilos y Axios/Fetch para llamadas a la API.


Tecnologías 
- Frontend: React | Vite | TypeScript | Tailwind CSS | ESLint + Prettier | Vitest/Jest
- Backend: PHP 8.x + CodeIgniter (API) 


Estructura 
- /backend — API
- /frontend — SPA
- /SQL — DB

Requisitos
- node >= 18, npm/yarn
- php >= 8.0, composer 
