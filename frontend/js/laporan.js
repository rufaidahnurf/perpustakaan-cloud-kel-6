const API = "http://localhost:3000/api/peminjaman";

let allData = [];

// =====================
// LOAD DATA
// =====================
async function loadLaporan() {

    try {

        const res = await fetch(API);
        const result = await res.json();

        if (!result.success) {
            throw new Error(result.message);
        }

        allData = result.data;

        renderTable(allData);

    } catch (err) {

        console.error(err);
        alert("Gagal memuat data laporan");

    }
}

// =====================
// RENDER TABLE
// =====================
function renderTable(data) {

    const tbody = document.getElementById("dataLaporan");
    tbody.innerHTML = "";

    document.getElementById("totalLaporan").innerText =
        `${data.length} Data`;

    if (data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4 text-muted">
                    Tidak ada data laporan
                </td>
            </tr>
        `;

        return;
    }

    data.forEach((d) => {

        tbody.innerHTML += `
        <tr>

            <td>${d.id}</td>

            <td>${d.anggota?.nama ?? "-"}</td>

            <td>${d.buku?.title ?? "-"}</td>

            <td>${d.tanggal_pinjam}</td>

            <td>${d.tanggal_kembali}</td>

            <td>${getStatus(d)}</td>

        </tr>
        `;
    });
}

// =====================
// STATUS BADGE
// =====================
function getStatus(d) {

    const today = new Date().toISOString().split("T")[0];

    if (d.status === "Dikembalikan") {
        return `<span class="badge bg-success">Kembali</span>`;
    }

    if (d.tanggal_kembali < today) {
        return `<span class="badge bg-danger">Terlambat</span>`;
    }

    return `<span class="badge bg-warning text-dark">Dipinjam</span>`;
}

// =====================
// FILTER
// =====================
function filterLaporan() {

    const dari = document.getElementById("dari").value;
    const sampai = document.getElementById("sampai").value;

    let filtered = [...allData];

    if (dari) {
        filtered = filtered.filter(d =>
            d.tanggal_pinjam >= dari
        );
    }

    if (sampai) {
        filtered = filtered.filter(d =>
            d.tanggal_pinjam <= sampai
        );
    }

    renderTable(filtered);
}

// =====================
// EXPORT CSV
// =====================
function exportCSV() {

    const data = allData;

    if (!data || data.length === 0) {
        alert("Tidak ada data untuk diexport");
        return;
    }

    let csv = [];

    // HEADER CSV
    csv.push([
        "ID",
        "Anggota",
        "Buku",
        "Tanggal Pinjam",
        "Tanggal Kembali",
        "Status"
    ].join(","));

    // DATA ROW
    data.forEach(d => {

        const row = [
            d.id,
            `"${d.anggota?.nama ?? "-"}"`,
            `"${d.buku?.title ?? "-"}"`,
            d.tanggal_pinjam,
            d.tanggal_kembali,
            getStatusText(d)
        ];

        csv.push(row.join(","));

    });

    // DOWNLOAD FILE
    const blob = new Blob([csv.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-peminjaman.csv";
    a.click();

    URL.revokeObjectURL(url);
}

// =====================
// STATUS TEXT (tanpa HTML badge)
// =====================
function getStatusText(d) {

    const today = new Date().toISOString().split("T")[0];

    if (d.status === "Dikembalikan") {
        return "Kembali";
    }

    if (d.tanggal_kembali < today) {
        return "Terlambat";
    }

    return "Dipinjam";
}

// =====================
// EVENT BUTTON FILTER
// =====================
document
    .getElementById("btnFilter")
    .addEventListener("click", filterLaporan);

// =====================
// INIT
// =====================
loadLaporan();