import { 
    MdDashboard, 
    MdDescription, 
    MdAdd, 
    MdVisibility, 
    MdCategory, 
    MdQuestionAnswer, 
    MdChecklist, 
    MdAssessment, 
    MdPeople, 
    MdPersonAdd, 
    MdHistory 
} from "react-icons/md";
import type { SidebarItemRestricted } from "../types/sidebarItem";

export const SIDEBAR_ITEMS: SidebarItemRestricted[] = [
    {
        text: "Dashboard",
        to: "/admin/dashboard",
        icon: MdDashboard
    },
    {
        text: "Rendiciones",
        icon: MdDescription,
        to: "/admin/rendiciones",
        subItems: [
            {
                text: "Nueva Rendición",
                to: "/nueva-rendicion",
                icon: MdAdd
            },
            {
                text: "Ver Rendiciones",
                to: "/ver-rendiciones",
                icon: MdVisibility
            }
        ]
    },
    {
        text: "Ejes Temáticos",
        to: "/admin/ejes",
        icon: MdCategory,
    },
    {
        text: "Preguntas",
        to: "/admin/preguntas",
        icon: MdQuestionAnswer,
        subItems: [
            {
                text: "Seleccionar",
                to: "/seleccionar",
                icon: MdChecklist
            },
            {
                text: "Ver preguntas",
                to: "/ver",
                icon: MdVisibility
            }
        ]
    },
    {
        text: "Ver reportes",
        to: "/admin/reportes",
        icon: MdAssessment,
    },
    {
        text: "Usuarios",
        to: "/admin/usuarios",
        icon: MdPeople,
        restricted: true,
        subItems: [
            {
                text: "Agregar usuario",
                to: "/agregar-usuario",
                icon: MdPersonAdd,
                restricted: true,
            },
            {
                text: "Ver usuarios",
                to: "/ver-usuarios",
                icon: MdPeople,
                restricted: true,
            },
            {
                text: "Historial de acciones",
                to: "/historial-acciones",
                icon: MdHistory,
                restricted: true,
            }
        ]
    }
]