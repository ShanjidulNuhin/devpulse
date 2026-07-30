import { pool } from "../../db";
import type { IIssue } from "./issue.interface";
import { ISSUE_STATUS  } from "../../types/issueStatus";
import { USER_ROLE } from "../../types/roleTypes";
import type { JwtPayload } from "jsonwebtoken";

const createIssueIntoDB = async (payload: IIssue, reporter_id: number) => {
    const { title, description, type } = payload;

    const report = await pool.query(`
        INSERT INTO issues (title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4) RETURNING *;
        `, [title, description, type, reporter_id]);

    return report;
}

const getAllIssuesFromDB = async () => {
    const result = await pool.query(`
        SELECT
            issues.id,
            issues.title,
            issues.description,
            issues.type,
            issues.status,
            issues.created_at,
            issues.updated_at,
            users.id AS reporter_id,
            users.name AS reporter_name,
            users.role AS reporter_role
            FROM issues
            JOIN users
            ON issues.reporter_id = users.id
            ORDER BY created_at DESC;
        `);

    const formattedData = result.rows.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: {
            id: issue.reporter_id,
            name: issue.reporter_name,
            role: issue.reporter_role
        },
        created_at: issue.created_at,
        updated_at: issue.updated_at
    }));

    return formattedData;
}

const getSingleIssueFromDB = async (id: number) => {
    const issue = await pool.query(`
        SELECT * FROM issues WHERE id = $1
        `, [id]);

    if (issue.rowCount === 0)
        throw new Error(`Issue with id ${id} not found`);

    const reporter = await pool.query(`
        SELECT id, name, role FROM users WHERE id = $1
        `, [issue?.rows[0]?.reporter_id]);

    const formattedData = {
        id: issue.rows[0].id,
        title: issue.rows[0].title,
        description: issue.rows[0].description,
        type: issue.rows[0].type,
        status: issue.rows[0].status,
        reporter: {
            id: reporter.rows[0].id,
            name: reporter.rows[0].name,
            role: reporter.rows[0].role
        },
        created_at: issue.rows[0].created_at,
        updated_at: issue.rows[0].updated_at
    };

    return formattedData;
}

const updateIssueIntoDB = async (issueId: number, payload: JwtPayload) => {
    const { id, role } = payload.user;
    const { title, description, type, status: updatedStatus } = payload.body;

    const resolvedOrNot = await pool.query(`
        SELECT status FROM issues WHERE id = $1 
        `, [issueId]);
    const { status } = resolvedOrNot.rows[0];
    if (status === ISSUE_STATUS.resolved)
        return false;

    if (role === USER_ROLE.maintainer) {
        const result = await pool.query(`
        UPDATE issues SET 
        title = COALESCE($1, title), 
        description = COALESCE($2, description), 
        type = COALESCE($3, type),
        status = COALESCE($4, status),
        updated_at = NOW()
        WHERE id = $5 RETURNING *;
        `, [title, description, type, updatedStatus, issueId]);
        return result;
    }

    if (role === USER_ROLE.contributor) {
        const result = await pool.query(`
        UPDATE issues SET 
        title = COALESCE($1, title), 
        description = COALESCE($2, description), 
        type = COALESCE($3, type),
        status = COALESCE($4, status),
        updated_at = NOW()
        WHERE id = $5 AND 
        reporter_id = $6 AND 
        status = 'open' RETURNING *;
        `, [title, description, type, updatedStatus, issueId, id]);
        return result;
    }
}

const deleteIssueFromDB = async (id: number) => {
    const result = await pool.query(`
        DELETE FROM issues WHERE id = $1;`, [id]);
    return result;
}

export const issueService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueIntoDB,
    deleteIssueFromDB
}