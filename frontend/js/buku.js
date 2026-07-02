const API = "http://localhost:3000/api/buku";

const form = document.getElementById("formBuku");
const btnSimpan = document.getElementById("btnSimpan");
const btnBatal = document.getElementById("btnBatal");
const tbody = document.getElementById("dataBuku");

let editId = null;
const modalBuku = new bootstrap.Modal(
    document.getElementById("modalBuku")
);

// ==============================
// LOAD DATA
// ==============================

async function loadBuku() {

    tbody.innerHTML = `
        <tr>
            <td colspan="6" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
                <br>
                <small class="text-muted">Memuat data...</small>
            </td>
        </tr>
    `;

    try {

        const response = await fetch(API);
        const result = await response.json();

        if (!result.success) {

            throw new Error(result.message);

        }

        if (result.data.length === 0) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-5">

                        <i class="bi bi-book fs-1 text-secondary"></i>

                        <p class="mt-3 text-muted">

                            Belum ada data buku

                        </p>

                    </td>
                </tr>
            `;

            return;

        }

        let html = "";

        result.data.forEach((buku) => {

            const title = buku.title.replace(/'/g, "\\'");
            const author = buku.author.replace(/'/g, "\\'");

            html += `
            <tr>

                <td>${buku.id}</td>

                <td>
                    <strong>${buku.title}</strong>
                </td>

                <td>${buku.author}</td>

                <td>${buku.year}</td>

                <td>

                    <span class="badge bg-primary">

                        ${buku.stock}

                    </span>

                </td>

                <td>

                    <button
                        class="btn btn-warning btn-sm me-2"
                        onclick="editBuku(
                            ${buku.id},
                            '${title}',
                            '${author}',
                            ${buku.year},
                            ${buku.stock}
                        )">

                        <i class="bi bi-pencil"></i>

                    </button>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="hapusBuku(${buku.id})">

                        <i class="bi bi-trash"></i>

                    </button>

                </td>

            </tr>
            `;

        });

        tbody.innerHTML = html;

    } catch (err) {

        console.error(err);

        Swal.fire({

            icon: "error",

            title: "Oops...",

            text: "Gagal mengambil data buku."

        });

    }

}

loadBuku();

// ==============================
// SUBMIT
// ==============================

form.addEventListener("submit", simpanBuku);

// ==============================
// EDIT
// ==============================

function editBuku(id, title, author, year, stock) {

    editId = id;

    document.getElementById("title").value = title;
    document.getElementById("author").value = author;
    document.getElementById("year").value = year;
    document.getElementById("stock").value = stock;

    btnSimpan.innerHTML = `
        <i class="bi bi-arrow-repeat"></i>
        Update Buku
    `;

    modalBuku.show();

}
// ==============================
// HAPUS
// ==============================

async function hapusBuku(id) {

    const konfirmasi = await Swal.fire({

        title: "Hapus Buku?",

        text: "Data yang dihapus tidak bisa dikembalikan.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonColor: "#dc3545",

        cancelButtonColor: "#6c757d",

        confirmButtonText: "Ya, Hapus",

        cancelButtonText: "Batal"

    });

    if (!konfirmasi.isConfirmed) return;

    const response = await fetch(`${API}/${id}`, {

        method: "DELETE"

    });

    const result = await response.json();

    if (result.success) {

        await Swal.fire({

            icon: "success",

            title: "Berhasil",

            text: "Data berhasil dihapus",

            timer: 1500,

            showConfirmButton: false

        });

        loadBuku();

    } else {

        Swal.fire({

            icon: "error",

            title: "Gagal",

            text: result.message

        });

    }

}

// ==============================
// SIMPAN / UPDATE
// ==============================

async function simpanBuku(e) {

    e.preventDefault();

    btnSimpan.disabled = true;

    btnSimpan.innerHTML = `
        <span class="spinner-border spinner-border-sm"></span>
        Menyimpan...
    `;

    const buku = {

        title: document.getElementById("title").value,

        author: document.getElementById("author").value,

        year: Number(document.getElementById("year").value),

        stock: Number(document.getElementById("stock").value)

    };

    let url = API;
    let method = "POST";

    if (editId !== null) {

        url = `${API}/${editId}`;
        method = "PUT";

    }

    try {

        const response = await fetch(url, {

            method,

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(buku)

        });

        const result = await response.json();

        if (result.success) {

            await Swal.fire({

                icon: "success",

                title: editId ? "Data diperbarui" : "Data ditambahkan",

                timer: 1400,

                showConfirmButton: false

            });

            modalBuku.hide();

            resetForm();

            loadBuku();

        } else {

            Swal.fire({

                icon: "error",

                title: "Gagal",

                text: result.message

            });

        }

    } catch (err) {

        console.error(err);

        Swal.fire({

            icon: "error",

            title: "Terjadi Kesalahan"

        });

    }

    btnSimpan.disabled = false;

    btnSimpan.innerHTML = editId
        ? `<i class="bi bi-arrow-repeat"></i> Update Buku`
        : `<i class="bi bi-save-fill"></i> Simpan`;

}

// ==============================
// RESET
// ==============================

function resetForm() {

    form.reset();

    editId = null;

    btnSimpan.disabled = false;

    btnSimpan.innerHTML = `
        <i class="bi bi-save-fill"></i>
        Simpan
    `;

}

if (btnBatal) {
    btnBatal.addEventListener("click", resetForm);
}

// ==============================
// SEARCH
// ==============================

document
    .getElementById("searchBuku")
    .addEventListener("keyup", cariBuku);

function cariBuku() {

    const keyword = document
        .getElementById("searchBuku")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#dataBuku tr")
        .forEach((row) => {

            row.style.display = row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

        });


}

document
    .getElementById("modalBuku")
    .addEventListener("hidden.bs.modal", resetForm);