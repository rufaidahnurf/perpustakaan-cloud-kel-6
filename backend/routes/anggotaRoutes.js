const express = require("express");
const router = express.Router();

const {
    getAllAnggota,
    createAnggota,
    updateAnggota,
    deleteAnggota
} = require("../controllers/anggotaController");

router.get("/", getAllAnggota);
router.post("/", createAnggota);
router.put("/:id", updateAnggota);
router.delete("/:id", deleteAnggota);

module.exports = router;