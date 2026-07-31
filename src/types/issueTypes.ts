export const ISSUE_TYPE = {
    bug: 'bug',
    feature_request: 'feature_request'
} as const;

export type ISSUES = 'bug' | 'feature_request';