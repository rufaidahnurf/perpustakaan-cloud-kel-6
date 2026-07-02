const supabase = require("../config/supabase");

const getAllPeminjaman = async (req, res) => {

    const { data, error } = await supabase
        .from("peminjaman")
        .select(`
            id,
            tanggal_pinjam,
            tanggal_kembali,
            status,
            anggota(nama),
            buku(title)
        `)
        .order("id");

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        data
    });

};

const createPeminjaman = async (req, res) => {

    const {
        anggota_id,
        buku_id,
        tanggal_pinjam,
        tanggal_kembali
    } = req.body;

    // Ambil stok buku
    const { data: buku, error: bukuError } = await supabase
        .from("buku")
        .select("stock")
        .eq("id", buku_id)
        .single();

    if (bukuError) {
        return res.status(500).json({
            success: false,
            message: bukuError.message
        });
    }

    if (buku.stock <= 0) {
        return res.status(400).json({
            success: false,
            message: "Stok buku habis."
        });
    }

    // Simpan peminjaman
    const { data, error } = await supabase
        .from("peminjaman")
        .insert([{
            anggota_id,
            buku_id,
            tanggal_pinjam,
            tanggal_kembali,
            status: "Dipinjam"
        }])
        .select();

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    // Kurangi stok buku
    await supabase
        .from("buku")
        .update({ stock: buku.stock - 1 })
        .eq("id", buku_id);

    res.status(201).json({
        success: true,
        data
    });
};

const kembalikanBuku = async (req, res) => {

    const { id } = req.params;

    // Ambil data peminjaman
    const { data: pinjam, error: pinjamError } = await supabase
        .from("peminjaman")
        .select("*")
        .eq("id", id)
        .single();

    if (pinjamError) {
        return res.status(500).json({
            success: false,
            message: pinjamError.message
        });
    }

    if (pinjam.status === "Dikembalikan") {
        return res.status(400).json({
            success: false,
            message: "Buku sudah dikembalikan"
        });
    }

    // Ubah status
    const { error } = await supabase
        .from("peminjaman")
        .update({
            status: "Dikembalikan"
        })
        .eq("id", id);

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    // Ambil stok buku
    const { data: buku } = await supabase
        .from("buku")
        .select("stock")
        .eq("id", pinjam.buku_id)
        .single();

    // Tambah stok
    await supabase
        .from("buku")
        .update({
            stock: buku.stock + 1
        })
        .eq("id", pinjam.buku_id);

    res.json({
        success: true,
        message: "Buku berhasil dikembalikan"
    });

};

const getPeminjamanById = async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("peminjaman")
        .select(`
            id,
            anggota_id,
            buku_id,
            tanggal_pinjam,
            tanggal_kembali,
            status
        `)
        .eq("id", id)
        .single();

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        data
    });

};

const updatePeminjaman = async (req, res) => {

    const { id } = req.params;

    const {
        anggota_id,
        buku_id,
        tanggal_pinjam,
        tanggal_kembali
    } = req.body;

    const { data, error } = await supabase
        .from("peminjaman")
        .update({
            anggota_id,
            buku_id,
            tanggal_pinjam,
            tanggal_kembali
        })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        message: "Data peminjaman berhasil diupdate",
        data
    });

};

module.exports = {

    getAllPeminjaman,
    createPeminjaman,
    kembalikanBuku,
    getPeminjamanById,
    updatePeminjaman

};