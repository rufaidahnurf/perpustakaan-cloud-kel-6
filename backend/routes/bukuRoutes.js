const express = require("express");
const router = express.Router();

const {
    getAllBuku,
    getBukuById,
    createBuku,
    updateBuku,
    deleteBuku
} = require("../controllers/bukuController");

router.get("/", getAllBuku);
router.get("/:id", getBukuById);
router.post("/", createBuku);
router.put("/:id", updateBuku);
router.delete("/:id", deleteBuku);

module.exports = router;