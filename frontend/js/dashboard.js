console.log("dashboard.js loaded");

const API = "https://perpustakaan-cloud-production.up.railway.app/api/dashboard";

async function loadDashboard() {
    try {
        const response = await fetch(API);

        const result = await response.json();

        console.log("API:", result);

        document.getElementById("totalBuku").textContent = result.data.totalBuku;
        document.getElementById("totalAnggota").textContent = result.data.totalAnggota;
        document.getElementById("dipinjam").textContent = result.data.dipinjam;
        document.getElementById("dikembalikan").textContent = result.data.dikembalikan;

    } catch (err) {
        console.error("Error dashboard:", err);
    }
}

loadDashboard();
window.addEventListener("focus", loadDashboard);