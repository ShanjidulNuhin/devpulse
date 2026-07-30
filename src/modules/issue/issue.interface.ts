import type { STATUS } from "../../types/issueStatus";
import type { ISSUES } from "../../types/issueTypes";

export interface IIssue {
    id: number,
    title: string,
    description: string,
    type?: ISSUES,
    status?: STATUS,
    reporter_id: number,
    created_at?: Date,
    updated_at?: Date
}