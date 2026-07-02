const express = require("express");
const cors = require("cors");

const bukuRoutes = require("./routes/bukuRoutes");
const anggotaRoutes = require("./routes/anggotaRoutes");
const peminjamanRoutes = require("./routes/peminjamanRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const laporanRoutes = require("./routes/laporanRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "API Sistem Informasi Perpustakaan"
    });
});

app.use("/api/buku", bukuRoutes);
app.use("/api/anggota", anggotaRoutes);
app.use("/api/peminjaman", peminjamanRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/laporan", laporanRoutes);

module.exports = app;