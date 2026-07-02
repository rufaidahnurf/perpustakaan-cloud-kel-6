const express = require("express");
const router = express.Router();

const {
    getAllPeminjaman,
    createPeminjaman,
    kembalikanBuku,
    getPeminjamanById,
    updatePeminjaman
} = require("../controllers/peminjamanController");

router.get("/", getAllPeminjaman);
router.post("/", createPeminjaman);
router.put("/:id/kembali", kembalikanBuku);

// TAMBAHAN BARU
router.get("/:id", getPeminjamanById);
router.put("/:id", updatePeminjaman);

module.exports = router;