export const ISSUE_STATUS = {
    open: 'open',
    in_progress: 'in_progress',
    resolved: 'resolved'
} as const;

export type STATUS = 'open' | 'in_progress' | 'resolved';