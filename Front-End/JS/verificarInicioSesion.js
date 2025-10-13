document.addEventListener("DOMContentLoaded", function() {
    const cedula = localStorage.getItem("cedula");
    const descuento = localStorage.getItem("tipoDescuento");

    if (!cedula || !descuento) {
        alert("⚠️ No has iniciado sesión");
        window.location.href = "../HTML/inicioSesion.html";
        return;
    }

    document.getElementById("cedula").textContent = cedula;
    document.getElementById("tipoDescuento").textContent = descuento;
});