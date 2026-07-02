const express = require("express");
const router = express.Router();

const {
    getLaporan
} = require("../controllers/laporanController");

// ======================
// GET LAPORAN (with filter query)
// contoh: /api/laporan?dari=2026-01-01&sampai=2026-01-31
// ======================
router.get("/", getLaporan);

module.exports = router;