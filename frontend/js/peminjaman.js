const API_BUKU = "http://localhost:3000/api/buku";
const API_ANGGOTA = "http://localhost:3000/api/anggota";
const API_PINJAM = "http://localhost:3000/api/peminjaman";

let bukuSelect;
let anggotaSelect;
let editId = null;
let modalPeminjaman;

// =======================
// INIT MODAL
// =======================
document.addEventListener("DOMContentLoaded", () => {
    modalPeminjaman = new bootstrap.Modal(
        document.getElementById("modalPeminjaman")
    );
});

// =======================
// LOAD BUKU
// =======================
async function loadBuku() {

    const res = await fetch(API_BUKU);
    const result = await res.json();

    const select = document.getElementById("buku");
    select.innerHTML = "";

    result.data.forEach((buku) => {
        select.innerHTML += `
            <option value="${buku.id}">
                ${buku.title} - ${buku.author} (Stok ${buku.stock})
            </option>
        `;
    });

    if (bukuSelect) bukuSelect.destroy();

    bukuSelect = new TomSelect("#buku", {
        create: false
    });
}

// =======================
// LOAD ANGGOTA
// =======================
async function loadAnggota() {

    const res = await fetch(API_ANGGOTA);
    const result = await res.json();

    const select = document.getElementById("anggota");
    select.innerHTML = "";

    result.data.forEach((a) => {
        select.innerHTML += `
            <option value="${a.id}">
                ${a.nama}
            </option>
        `;
    });

    if (anggotaSelect) anggotaSelect.destroy();

    anggotaSelect = new TomSelect("#anggota", {
        create: false
    });
}

// =======================
// STATUS HELPER
// =======================
function getStatus(pinjam) {

    const today = new Date().toISOString().split("T")[0];

    if (pinjam.status === "Dikembalikan") {
        return `<span class="badge bg-success">Kembali</span>`;
    }

    if (pinjam.tanggal_kembali < today) {
        return `<span class="badge bg-danger">Terlambat</span>`;
    }

    return `<span class="badge bg-warning text-dark">Dipinjam</span>`;
}

// =======================
// LOAD PEMINJAMAN
// =======================
async function loadPeminjaman() {

    const res = await fetch(API_PINJAM);
    const result = await res.json();

    const tbody = document.getElementById("dataPeminjaman");
    tbody.innerHTML = "";

    result.data.forEach((p) => {

        tbody.innerHTML += `
        <tr>

            <td>${p.id}</td>
            <td>${p.anggota?.nama ?? "-"}</td>
            <td>${p.buku?.title ?? "-"}</td>
            <td>${p.tanggal_pinjam}</td>
            <td>${p.tanggal_kembali}</td>

            <td>${getStatus(p)}</td>

            <td>

                <button class="btn btn-warning btn-sm me-1"
                    onclick="editPeminjaman(${p.id})">
                    <i class="bi bi-pencil"></i>
                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="hapusPeminjaman(${p.id})">
                    <i class="bi bi-trash"></i>
                </button>

            </td>

            <td>

                ${p.status === "Dipinjam"
                    ? `<button class="btn btn-success btn-sm"
                        onclick="kembalikan(${p.id})">
                        <i class="bi bi-arrow-return-left"></i>
                    </button>`
                    : `<span class="badge bg-success">
                        <i class="bi bi-check-circle-fill"></i>
                        Done
                    </span>`
                }

            </td>

        </tr>
        `;
    });
}

// =======================
// SUBMIT (CREATE / UPDATE)
// =======================
document
    .getElementById("formPeminjaman")
    .addEventListener("submit", simpanPeminjaman);

async function simpanPeminjaman(e) {

    e.preventDefault();

    const data = {
        anggota_id: document.getElementById("anggota").value,
        buku_id: document.getElementById("buku").value,
        tanggal_pinjam: document.getElementById("tanggal_pinjam").value,
        tanggal_kembali: document.getElementById("tanggal_kembali").value
    };

    let url = API_PINJAM;
    let method = "POST";

    if (editId !== null) {
        url = `${API_PINJAM}/${editId}`;
        method = "PUT";
    }

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    const result = await res.json();

    if (result.success) {

        Swal.fire({
            icon: "success",
            title: editId ? "Data diupdate" : "Berhasil ditambahkan",
            timer: 1200,
            showConfirmButton: false
        });

        resetForm();
        modalPeminjaman.hide();
        loadPeminjaman();
        loadBuku();

    } else {

        Swal.fire({
            icon: "error",
            title: result.message
        });

    }
}

// =======================
// EDIT
// =======================
async function editPeminjaman(id) {

    const res = await fetch(`${API_PINJAM}/${id}`);
    const result = await res.json();

    if (!result.success) return;

    const p = result.data;

    anggotaSelect.setValue(p.anggota_id);
    bukuSelect.setValue(p.buku_id);

    document.getElementById("tanggal_pinjam").value = p.tanggal_pinjam;
    document.getElementById("tanggal_kembali").value = p.tanggal_kembali;

    editId = id;

    modalPeminjaman.show();
}

// =======================
// RETURN BOOK
// =======================
async function kembalikan(id) {

    const confirm = await Swal.fire({
        title: "Buku telah dikembalikan?",
        icon: "question",
        showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`${API_PINJAM}/${id}/kembali`, {
        method: "PUT"
    });

    const result = await res.json();

    if (result.success) {

        Swal.fire({
            icon: "success",
            title: "Buku dikembalikan"
        });

        loadPeminjaman();
        loadBuku();
    }
}

// =======================
// DELETE (opsional)
// =======================
async function hapusPeminjaman(id) {

    const confirm = await Swal.fire({
        title: "Hapus data?",
        icon: "warning",
        showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    await fetch(`${API_PINJAM}/${id}`, {
        method: "DELETE"
    });

    loadPeminjaman();
}

// =======================
// RESET FORM
// =======================
function resetForm() {

    document.getElementById("formPeminjaman").reset();

    editId = null;

}

// =======================
// SEARCH
// =======================
document
    .getElementById("searchPeminjaman")
    .addEventListener("keyup", function () {

        const keyword = this.value.toLowerCase();

        document
            .querySelectorAll("#dataPeminjaman tr")
            .forEach((row) => {

                row.style.display = row.innerText.toLowerCase()
                    .includes(keyword)
                    ? ""
                    : "none";

            });

    });

// =======================
// INIT LOAD
// =======================
loadAnggota();
loadBuku();
loadPeminjaman();