const inquiryModel = require("../models/inquiryModel");
const {
    VALID_STATUSES,
    canTransitionStatus,
} = require("../utils/inquiryRules");

function parseId(value) {
    if (!/^[1-9]\d*$/.test(value)) {
        return null;
    }

    const id = Number(value);

    return Number.isSafeInteger(id) ? id : null;
}

function validateInquiryBody(body) {
    const fields = [
        "customer_name",
        "contact_info",
        "subject",
        "description",
    ];

    for (const field of fields) {
        if (
            typeof body[field] !== "string" ||
            body[field].trim() === ""
        ) {
            return `${field} is required and must be text.`;
        }
    }

    if (body.customer_name.trim().length > 100) {
        return "Customer name must not exceed 100 characters.";
    }

    if (body.contact_info.trim().length > 150) {
        return "Contact information must not exceed 150 characters.";
    }

    if (body.subject.trim().length > 200) {
        return "Subject must not exceed 200 characters.";
    }

    if (body.description.trim().length > 5000) {
        return "Description must not exceed 5000 characters.";
    }

    return null;
}

async function createInquiry(req, res, next) {
    try {
        const validationError = validateInquiryBody(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        const inquiry = await inquiryModel.createInquiry({
            customer_name: req.body.customer_name.trim(),
            contact_info: req.body.contact_info.trim(),
            subject: req.body.subject.trim(),
            description: req.body.description.trim(),
            created_by: req.user.id,
        });

        return res.status(201).json({
            success: true,
            message: "Inquiry created successfully.",
            inquiry,
        });
    } catch (error) {
        next(error);
    }
}

async function getAllInquiries(req, res, next) {
    try {
        const status = req.query.status;
        const search = req.query.search;

        if (status && !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry status.",
            });
        }

        if (search !== undefined && typeof search !== "string") {
            return res.status(400).json({
                success: false,
                message: "Search must be text.",
            });
        }

        if (search && search.length > 100) {
            return res.status(400).json({
                success: false,
                message: "Search must not exceed 100 characters.",
            });
        }

        const inquiries = await inquiryModel.getAllInquiries({
            status,
            search: search?.trim(),
        });

        return res.status(200).json({
            success: true,
            count: inquiries.length,
            inquiries,
        });
    } catch (error) {
        next(error);
    }
}

async function getInquiryById(req, res, next) {
    try {
        const id = parseId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry ID.",
            });
        }

        const inquiry = await inquiryModel.getInquiryById(id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found.",
            });
        }

        return res.status(200).json({
            success: true,
            inquiry,
        });
    } catch (error) {
        next(error);
    }
}

async function updateInquiry(req, res, next) {
    try {
        const id = parseId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry ID.",
            });
        }

        const validationError = validateInquiryBody(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError,
            });
        }

        const existingInquiry = await inquiryModel.getInquiryById(id);

        if (!existingInquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found.",
            });
        }

        const inquiry = await inquiryModel.updateInquiry(id, {
            customer_name: req.body.customer_name.trim(),
            contact_info: req.body.contact_info.trim(),
            subject: req.body.subject.trim(),
            description: req.body.description.trim(),
        });

        return res.status(200).json({
            success: true,
            message: "Inquiry updated successfully.",
            inquiry,
        });
    } catch (error) {
        next(error);
    }
}

async function updateInquiryStatus(req, res, next) {
    try {
        const id = parseId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry ID.",
            });
        }

        const { status } = req.body;

        if (typeof status !== "string" || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry status.",
            });
        }

        const existingInquiry = await inquiryModel.getInquiryById(id);

        if (!existingInquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found.",
            });
        }

        if (!canTransitionStatus(existingInquiry.status, status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${existingInquiry.status} to ${status}.`,
            });
        }

        const inquiry = await inquiryModel.updateInquiryStatus(id, status);

        return res.status(200).json({
            success: true,
            message: "Inquiry status updated successfully.",
            inquiry,
        });
    } catch (error) {
        next(error);
    }
}

async function deleteInquiry(req, res, next) {
    try {
        const id = parseId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                success: false,
                message: "Invalid inquiry ID.",
            });
        }

        const inquiry = await inquiryModel.deleteInquiry(id);

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: "Inquiry not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Inquiry deleted successfully.",
            inquiry,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    updateInquiry,
    updateInquiryStatus,
    deleteInquiry,
};