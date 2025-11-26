import type { IconType } from "react-icons";

export interface SidebarItem {
    text: string;
    to: string;
    icon: IconType;
    subItems?: SidebarItem[];
}
export interface SidebarItemRestricted extends Omit<SidebarItem, 'subItems'> {
    restricted?: boolean;
    subItems?: SidebarItemRestricted[];
}