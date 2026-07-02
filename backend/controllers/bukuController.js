const supabase = require("../config/supabase");

// GET semua buku
const getAllBuku = async (req, res) => {
    const { data, error } = await supabase
        .from("buku")
        .select("*")
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

// GET buku berdasarkan ID
const getBukuById = async (req, res) => {

    const { id } = req.params;

    const { data, error } = await supabase
        .from("buku")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        return res.status(404).json({
            success: false,
            message: "Buku tidak ditemukan"
        });
    }

    res.json({
        success: true,
        data
    });

};

// POST tambah buku
const createBuku = async (req, res) => {

    const { title, author, year, stock } = req.body;

    const { data, error } = await supabase
        .from("buku")
        .insert([
            {
                title,
                author,
                year,
                stock
            }
        ])
        .select();

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    res.status(201).json({
        success: true,
        data
    });

};

// PUT update buku
const updateBuku = async (req, res) => {

    const { id } = req.params;
    const { title, author, year, stock } = req.body;

    const { data, error } = await supabase
        .from("buku")
        .update({
            title,
            author,
            year,
            stock
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
        data
    });

};

// DELETE buku
const deleteBuku = async (req, res) => {

    const { id } = req.params;

    const { error } = await supabase
        .from("buku")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }

    res.json({
        success: true,
        message: "Buku berhasil dihapus"
    });

};

module.exports = {
    getAllBuku,
    getBukuById,
    createBuku,
    updateBuku,
    deleteBuku
};