const API = "http://localhost:3000/api/anggota";

const form = document.getElementById("formAnggota");
const btnSimpan = document.getElementById("btnSimpan");
const btnBatal = document.getElementById("btnBatal");

let editId = null;
const modalAnggota = new bootstrap.Modal(
    document.getElementById("modalAnggota")
);

async function loadAnggota() {

    const response = await fetch(API);
    const result = await response.json();

    const tbody = document.getElementById("dataAnggota");

    tbody.innerHTML = "";

    result.data.forEach((anggota) => {

        const nama = anggota.nama.replace(/'/g, "\\'");

        tbody.innerHTML += `
        <tr>

            <td>${anggota.id}</td>

            <td>

                <strong>${anggota.nama}</strong>

            </td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-2"
                    onclick="editAnggota(${anggota.id},'${nama}')">

                    <i class="bi bi-pencil-square"></i>


                </button>

                <button
                    class="btn btn-danger btn-sm"
                    onclick="hapusAnggota(${anggota.id})">

                    <i class="bi bi-trash-fill"></i>


                </button>

            </td>

        </tr>
        `;

    });

}

loadAnggota();

form.addEventListener("submit", simpanAnggota);

async function simpanAnggota(e) {

    e.preventDefault();

    const anggota = {

        nama: document.getElementById("nama").value

    };

    let url = API;
    let method = "POST";

    if (editId !== null) {

        url = `${API}/${editId}`;

        method = "PUT";

    }

    const response = await fetch(url, {

        method,

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(anggota)

    });

    const result = await response.json();

    if (result.success) {

        await Swal.fire({

    icon: "success",

    title: editId ? "Data diperbarui" : "Data ditambahkan",

    timer: 1400,

    showConfirmButton: false

});

modalAnggota.hide();

resetForm();

loadAnggota();

    } else {

        Swal.fire({

    icon: "error",

    title: "Gagal",

    text: result.message

});

    }

}

function editAnggota(id, nama) {

    editId = id;

    document.getElementById("nama").value = nama;

    btnSimpan.innerHTML = `
        <i class="bi bi-arrow-repeat"></i>
        Update
    `;

    modalAnggota.sshow();

}

async function hapusAnggota(id) {

    const konfirmasi = await Swal.fire({

        title: "Hapus Anggota?",

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

        loadAnggota();

    } else {

        Swal.fire({

            icon: "error",

            title: "Gagal",

            text: result.message

        });

    }

}

function resetForm() {

    form.reset();

    editId = null;

    btnSimpan.innerHTML = `
        <i class="bi bi-save-fill"></i>
        Simpan
    `;

}

if (btnBatal) {
    btnBatal.addEventListener("click", resetForm);
}

document
    .getElementById("modalAnggota")
    .addEventListener("hidden.bs.modal", resetForm);

document
    .getElementById("searchAnggota")
    .addEventListener("keyup", cariAnggota);

function cariAnggota() {

    const keyword = document
        .getElementById("searchAnggota")
        .value
        .toLowerCase();

    document
        .querySelectorAll("#dataAnggota tr")
        .forEach((row) => {

            row.style.display = row.innerText
                .toLowerCase()
                .includes(keyword)
                ? ""
                : "none";

        });

}


document.getElementById("jumlahAnggota").textContent =
    `${result.data.length} Anggota`;