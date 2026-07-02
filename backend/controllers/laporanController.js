const supabase = require("../config/supabase");

const getLaporan = async (req, res) => {

    try {

        const { dari, sampai } = req.query;

        let query = supabase
            .from("peminjaman")
            .select(`
                id,
                tanggal_pinjam,
                tanggal_kembali,
                status,
                anggota(nama),
                buku(title)
            `)
            .order("tanggal_pinjam", { ascending: false });

        // ======================
        // FILTER TANGGAL (AMAN)
        // ======================
        if (dari) {
            query = query.gte("tanggal_pinjam", dari);
        }

        if (sampai) {
            query = query.lte("tanggal_pinjam", sampai);
        }

        const { data, error } = await query;

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        // ======================
        // RESPONSE
        // ======================
        res.json({
            success: true,
            data: data ?? []
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message || "Server error"
        });

    }
};

module.exports = {
    getLaporan
};