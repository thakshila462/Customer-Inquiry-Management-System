const pool = require("../config/db");

async function createInquiry(data) {
    const result = await pool.query(
        `INSERT INTO inquiries
            (customer_name, contact_info, subject, description, created_by)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
            data.customer_name,
            data.contact_info,
            data.subject,
            data.description,
            data.created_by,
        ]
    );

    return result.rows[0];
}

async function getAllInquiries({ status, search }) {
    const conditions = [];
    const values = [];

    if (status) {
        values.push(status);
        conditions.push(`status = $${values.length}`);
    }

    if (search) {
        values.push(`%${search}%`);
        const position = values.length;

        conditions.push(
            `(customer_name ILIKE $${position}
              OR subject ILIKE $${position}
              OR contact_info ILIKE $${position})`
        );
    }

    let query = "SELECT * FROM inquiries";

    if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY created_at DESC, id DESC";

    const result = await pool.query(query, values);

    return result.rows;
}

async function getInquiryById(id) {
    const result = await pool.query(
        "SELECT * FROM inquiries WHERE id = $1",
        [id]
    );

    return result.rows[0] || null;
}

async function updateInquiry(id, data) {
    const result = await pool.query(
        `UPDATE inquiries
         SET customer_name = $1,
             contact_info = $2,
             subject = $3,
             description = $4,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $5
         RETURNING *`,
        [
            data.customer_name,
            data.contact_info,
            data.subject,
            data.description,
            id,
        ]
    );

    return result.rows[0] || null;
}

async function updateInquiryStatus(id, status) {
    const result = await pool.query(
        `UPDATE inquiries
         SET status = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [status, id]
    );

    return result.rows[0] || null;
}

async function deleteInquiry(id) {
    const result = await pool.query(
        `DELETE FROM inquiries
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
}

module.exports = {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    updateInquiry,
    updateInquiryStatus,
    deleteInquiry,
};