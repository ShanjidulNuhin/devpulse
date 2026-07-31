import type { ROLES } from "../../types/roleTypes";

export interface IUser {
    id: number,
    name: string,
    email: string,
    age: number,
    password: string,
    role?: ROLES,
    created_at?: Date,
    updated_at?: Date
}