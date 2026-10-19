const express = require("express");

const authenticateToken = require("../middleware/authMiddleware");

const {
    createInquiry,
    getAllInquiries,
    getInquiryById,
    updateInquiry,
    updateInquiryStatus,
    deleteInquiry,
} = require("../controllers/inquiryController");

const router = express.Router();

// All inquiry endpoints require authentication.
router.use(authenticateToken);

router.post("/", createInquiry);

router.get("/", getAllInquiries);

router.get("/:id", getInquiryById);

router.put("/:id", updateInquiry);

router.patch("/:id/status", updateInquiryStatus);

router.delete("/:id", deleteInquiry);

module.exports = router;