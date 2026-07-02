const supabase = require("../config/supabase");

const getDashboard = async (req, res) => {

    const { count: totalBuku } = await supabase
        .from("buku")
        .select("*", { count: "exact", head: true });

    const { count: totalAnggota } = await supabase
        .from("anggota")
        .select("*", { count: "exact", head: true });

    const { count: dipinjam } = await supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .eq("status", "Dipinjam");

    const { count: dikembalikan } = await supabase
        .from("peminjaman")
        .select("*", { count: "exact", head: true })
        .eq("status", "Dikembalikan");

    res.json({
        success: true,
        data: {
            totalBuku,
            totalAnggota,
            dipinjam,
            dikembalikan
        }
    });

};

module.exports = {
    getDashboard
};