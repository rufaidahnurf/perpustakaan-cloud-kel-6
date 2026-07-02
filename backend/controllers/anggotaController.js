const supabase = require("../config/supabase");

// GET semua anggota
const getAllAnggota = async (req, res) => {

    const { data, error } = await supabase
        .from("anggota")
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

// POST anggota
const createAnggota = async (req, res) => {

    const { nama } = req.body;

    const { data, error } = await supabase
        .from("anggota")
        .insert([{ nama }])
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

// PUT anggota
const updateAnggota = async (req, res) => {

    const { id } = req.params;
    const { nama } = req.body;

    const { data, error } = await supabase
        .from("anggota")
        .update({ nama })
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

// DELETE anggota
const deleteAnggota = async (req, res) => {

    const { id } = req.params;

    const { error } = await supabase
        .from("anggota")
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
        message: "Anggota berhasil dihapus"
    });
};

module.exports = {
    getAllAnggota,
    createAnggota,
    updateAnggota,
    deleteAnggota
};