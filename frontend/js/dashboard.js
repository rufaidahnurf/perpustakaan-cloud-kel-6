const API = "http://localhost:3000/api/dashboard";

async function loadDashboard(){

    const response = await fetch(API);
    const result = await response.json();

    console.log("Response API:", result);

    console.log(document.getElementById("totalBuku"));
    console.log(document.getElementById("totalAnggota"));
    console.log(document.getElementById("dipinjam"));
    console.log(document.getElementById("dikembalikan"));

    document.getElementById("totalBuku").textContent = result.data.totalBuku;
    document.getElementById("totalAnggota").textContent = result.data.totalAnggota;
    document.getElementById("dipinjam").textContent = result.data.dipinjam;
    document.getElementById("dikembalikan").textContent = result.data.dikembalikan;

}

loadDashboard();

window.addEventListener("focus", () => {
    loadDashboard();
});

loadDashboard();