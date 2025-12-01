import { capitalize } from "@/shared/utils";

export const isSuperAdmin = (role: string): boolean => {
    return role === 'super_admin';
}
export const firstAdminName = (fullName: string): string => {
    return capitalize(fullName.split(' ')[0]);
}