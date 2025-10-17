// ==================== This code was made by me ====================

document.addEventListener("DOMContentLoaded", function() {
    const cedula = localStorage.getItem("cedula");
    const descuento = localStorage.getItem("tipoDescuento");
    const nombre = localStorage.getItem("nombre");

    if (!cedula || !descuento) {
        alert("⚠️ No has iniciado sesión");
        window.location.href = "../HTML/inicioSesion.html";
        return;
    }

    document.getElementById("nomUsu").textContent = nombre;
    document.getElementById("cedula").textContent = cedula;
    document.getElementById("tipoDescuento").textContent = descuento;
});