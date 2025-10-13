// fUNCION DE INICIAR SESION
function iniciarSesion() {
    const nombre = document.getElementById('loginNombre').value;
    const cedula = document.getElementById('loginCedula').value;
    const mesa = document.getElementById('loginMesa').value;

    if (!nombre || nombre.trim() === "" && !cedula || cedula.trim() === "" && !mesa || mesa.trim() === "") {
        alert("Llene los campos!")
    } else {
        const formdata = new FormData();
        formdata.append('funcion', 'iniciarSecion');
        formdata.append('usuario', nombre);
        formdata.append('NCedula', cedula);
        formdata.append('NMesa', mesa);
    
        fetch ('../../Back-End/APIS/APIs.php', {
            method: "POST",
            body: formdata
        })
        .then(res => res.json())
        .then(data => {
            const errores = data.errores;
    
            if (Array.isArray(errores) && errores.length > 0) {
                document.getElementById('loginError').textContent = "❌ " + errores[0];
    
                document.getElementById('loginError').style.background = 'rgba(12, 53, 75, 0.95)';
            } else {
                const descuento = data.descuento;

                localStorage.setItem("cedula", cedula);
                localStorage.setItem("tipoDescuento", descuento);
                window.location.href = "../HTML/cliente.html";
            }
        })
        .catch(err => {
            console.error("Error al enviar el formulario:", err);
            alert("❌ Error inesperado al enviar el formulario.");
        });
    }

}


// Funcion para pasar de main a otro en cliente

// Mostrar main menuDish
function mainMenuDish() {
    document.getElementById('buyDish').style.display = 'none';
    document.getElementById('menuDish').style.display = 'flex';
}

// Mostrar main buyDish
function mainBuyDish() {
    document.getElementById('buyDish').style.display = 'flex';
    document.getElementById('menuDish').style.display = 'none';
}

// Mostrar MENU
function abrirModal() {
    document.getElementById('menuLateral').classList.remove('oculto');
    document.getElementById('mains').classList.add('panel-opaco');
}
// Ocultar menu
function cerrarModal() {
    document.getElementById('menuLateral').classList.add('oculto');
    document.getElementById('mains').classList.remove('panel-opaco');
}


// =============== Funciones de Main comidas ===============

// Function mostrar Main-dishes
function mostrarMainDishes() {
    document.getElementById('Main-dishes').classList.remove('oculto');
    document.getElementById('Side-Disshes').classList.add('oculto');
    document.getElementById('Drinks').classList.add('oculto');
    document.getElementById('Desserts').classList.add('oculto');

    cerrarModal();
    mainMenuDish()
}

// Funcion mostrar Side-Disshes
function mostrarSideDisshes() {
    document.getElementById('Main-dishes').classList.add('oculto');
    document.getElementById('Side-Disshes').classList.remove('oculto');
    document.getElementById('Drinks').classList.add('oculto');
    document.getElementById('Desserts').classList.add('oculto');

    cerrarModal();
    mainMenuDish()
}

// Function mostrar Drinks
function mostrarDrinks() {
    document.getElementById('Main-dishes').classList.add('oculto');
    document.getElementById('Side-Disshes').classList.add('oculto');
    document.getElementById('Drinks').classList.remove('oculto');
    document.getElementById('Desserts').classList.add('oculto');

    cerrarModal();
    mainMenuDish()
}

// Function mostrar Desserts
function mostrarDesserts() {
    document.getElementById('Main-dishes').classList.add('oculto');
    document.getElementById('Side-Disshes').classList.add('oculto');
    document.getElementById('Drinks').classList.add('oculto');
    document.getElementById('Desserts').classList.remove('oculto');

    cerrarModal();
    mainMenuDish()
}