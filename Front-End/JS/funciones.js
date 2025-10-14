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
                localStorage.setItem("nombre", nombre);
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
    document.getElementById('menuDish').style.display = 'grid';
}

// Mostrar main buyDish
function mainBuyDish() {
    document.getElementById('buyDish').style.display = 'flex';
    document.getElementById('menuDish').style.display = 'none';

    const cedula = localStorage.getItem("cedula");

    const formdata = new FormData();
    formdata.append('funcion', 'carrito');
    formdata.append('cedula', cedula)

    fetch ('../../Back-End/APIS/APIs.php', {
        method: "POST",
        body: formdata
    })
    .then(res => res.json())
    .then(data => {
        mostrarCarrito(data)
    })
    .catch(err => {
        console.error("Error al enviar el formulario:", err);
        alert("❌ Error inesperado al enviar el formulario.");
    });
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
    mainMenuDish();
    cargarProductos('Main-dishes');
}

// Funcion mostrar Side-Disshes
function mostrarSideDisshes() {
    document.getElementById('Main-dishes').classList.add('oculto');
    document.getElementById('Side-Disshes').classList.remove('oculto');
    document.getElementById('Drinks').classList.add('oculto');
    document.getElementById('Desserts').classList.add('oculto');

    cerrarModal();
    mainMenuDish();
    cargarProductos('Side-Disshes');
}

// Function mostrar Drinks
function mostrarDrinks() {
    document.getElementById('Main-dishes').classList.add('oculto');
    document.getElementById('Side-Disshes').classList.add('oculto');
    document.getElementById('Drinks').classList.remove('oculto');
    document.getElementById('Desserts').classList.add('oculto');

    cerrarModal();
    mainMenuDish();
    cargarProductos('Drinks');
}

// Function mostrar Desserts
function mostrarDesserts() {
    document.getElementById('Main-dishes').classList.add('oculto');
    document.getElementById('Side-Disshes').classList.add('oculto');
    document.getElementById('Drinks').classList.add('oculto');
    document.getElementById('Desserts').classList.remove('oculto');

    cerrarModal();
    mainMenuDish();
    cargarProductos('Desserts');
}




// ============================== Funciones para mostrar las comidas y añadir al carrito ==============================

// Para cargar las categorias
function cargarProductos(categoria) {
    const formdata = new FormData();
    formdata.append('funcion', 'cargarProductos')
    formdata.append('categoriaa', categoria)

    fetch ('../../Back-End/APIS/APIs.php', {
        method: "POST",
        body: formdata
    })
    .then(res => res.json())
    .then(data => {
        const error = data.errores;

        if (error && error.length > 0) {
            alert("Error: " + error[0]);
        } else {
            mostrarTarjetas(data, categoria);
        }
    })
    .catch(err => {
        console.error("Error al enviar el formulario:", err);
        alert("❌ Error inesperado al enviar el formulario.");
    });
}

function mostrarTarjetas(productos, contenedorF) {
    let contenedor = null;

    if (contenedorF === 'Main-dishes') {
        contenedor = document.getElementById('contenedorMainDishes');
    } else if (contenedorF === 'Side-Disshes') {
        contenedor = document.getElementById('contenedorSideDishes');
    } else if (contenedorF === 'Drinks') {
        contenedor = document.getElementById('contenedorDrinks');
    } else if (contenedorF === 'Desserts') {
        contenedor = document.getElementById('contenedorDesserts');
    }

    contenedor.innerHTML = '';

    productos.forEach(prod => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        tarjeta.innerHTML = `
            <img src="../IMG/${prod.foto}" alt="${prod.nombre}" class="imgProducto">
            <h2>${prod.nombre}</h2>
            <p>${prod.descripcion}</p>
            <p><strong>$${prod.precio}</strong></p>
            <div class="cantidad">
                <button class="btnMenos">-</button>
                <span class="numCant">1</span>
                <button class="btnMas">+</button>
            </div>
            <button class="btnAgregar">Añadir al carrito</button>
        `;

        // lógica cantidad
        let numCant = tarjeta.querySelector('.numCant');
        tarjeta.querySelector('.btnMas').onclick = () => {
            numCant.textContent = parseInt(numCant.textContent) + 1;
        };
        tarjeta.querySelector('.btnMenos').onclick = () => {
            let actual = parseInt(numCant.textContent);
            if (actual > 1) numCant.textContent = actual - 1;
        };

        // botón agregar
        tarjeta.querySelector('.btnAgregar').onclick = () => {
            const cantidad = numCant.textContent;
            insertarPedido(prod.id, cantidad, productos, contenedorF);
        };

        contenedor.appendChild(tarjeta);
    });
}

function insertarPedido(id_producto, cantidad, productos, contenedorF) {
    const cedula = localStorage.getItem("cedula");

    const formdata = new FormData();
    formdata.append('funcion', 'agregarCarrito');
    formdata.append('id_producto', id_producto);
    formdata.append('cedula', cedula);
    formdata.append('cantidad', cantidad)

    fetch ('../../Back-End/APIS/APIs.php', {
        method: "POST",
        body: formdata
    })
    .then(res => res.json())
    .then(() => {
        alert("Pedido añadido al carrito.");
        mostrarTarjetas(productos, contenedorF);
    })
    .catch(err => {
        console.error("Error al enviar el formulario:", err);
        alert("❌ Error inesperado al enviar el formulario.");
    });
}

function mostrarCarrito(productos) {
    const contenedor = document.getElementById("buyDish");
    contenedor.innerHTML = '';

    productos.forEach(prod => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        if (prod.estado === "Mirando") {
            tarjeta.innerHTML = `
                <img src="../IMG/${prod.foto}" alt="${prod.nombre}" class="imgProducto">
                <h2>${prod.nombre}</h2>
                <p><strong>$${prod.precio}</strong></p>
                <div class="cantidad">
                    <button class="btnMenos">-</button>
                    <span class="numCant">${prod.cantidad}</span>
                    <button class="btnMas">+</button>
                </div>
                <button class="btnAgregar confirmarPedido">Confirmar Pedido</button>
                <button class="btnAgregar eliminarPedido">Eliminar Pedido</button>
            `;
            // lógica cantidad
            let numCant = tarjeta.querySelector('.numCant');
            tarjeta.querySelector('.btnMas').onclick = () => {
                numCant.textContent = parseInt(numCant.textContent) + 1;
            };
            tarjeta.querySelector('.btnMenos').onclick = () => {
                let actual = parseInt(numCant.textContent);
                if (actual > 1) numCant.textContent = actual - 1;
            };
            tarjeta.querySelector('.eliminarPedido').onclick = () => {
                eliminarPedido(prod.id_pedido);
            };

            tarjeta.querySelector('.confirmarPedido').onclick = () => {
                confirmarPedido(parseInt(numCant.textContent), prod.id_pedido);
            };

        } else {
            switch (prod.proceso){
                case 'Pendiente':
                    tarjeta.innerHTML = `
                        <img src="../IMG/${prod.foto}" alt="${prod.nombre}" class="imgProducto">
                        <h2>${prod.nombre}</h2>
                        <p><strong>$${prod.precio}</strong></p>
                        <div class="cantidad">
                            <span class="numCant">${prod.cantidad}</span>
                        </div>
                        <span class="pendiente">${prod.proceso}</span>
                    `;
                    break;
                case 'Preparando':
                    tarjeta.innerHTML = `
                        <img src="../IMG/${prod.foto}" alt="${prod.nombre}" class="imgProducto">
                        <h2>${prod.nombre}</h2>
                        <p><strong>$${prod.precio}</strong></p>
                        <div class="cantidad">
                            <span class="numCant">${prod.cantidad}</span>
                        </div>
                        <span class="preparando">${prod.proceso}</span>
                    `;
                    break;
                case 'Entregado':
                    tarjeta.innerHTML = `
                        <img src="../IMG/${prod.foto}" alt="${prod.nombre}" class="imgProducto">
                        <h2>${prod.nombre}</h2>
                        <p><strong>$${prod.precio}</strong></p>
                        <div class="cantidad">
                            <span class="numCant">${prod.cantidad}</span>
                        </div>
                        <span class="entregado">${prod.proceso}</span>
                    `;
                    break;
            }
        }

        contenedor.appendChild(tarjeta);
    })
}

function eliminarPedido(id_pedido) {
    const formdata = new FormData();
    formdata.append('funcion', 'eliminarPedido');
    formdata.append('id_pedido', id_pedido)

    fetch ('../../Back-End/APIS/APIs.php', {
        method: "POST",
        body: formdata
    })
    .then(res => res.json())
    .then(() => {
        mainBuyDish();
        alert("Pedido Eliminado.");
    })
    .catch(err => {
        console.error("Error al enviar el formulario:", err);
        alert("❌ Error inesperado al enviar el formulario.");
    });
}

function confirmarPedido(numeroPedido, id_pedido) {
    const formdata = new FormData();
    formdata.append('funcion', 'confirmarPedido');
    formdata.append('id_pedido', id_pedido)
    formdata.append('numPed', numeroPedido)

    fetch ('../../Back-End/APIS/APIs.php', {
        method: "POST",
        body: formdata
    })
    .then(res => res.json())
    .then(() => {
        mainBuyDish();
        alert("Pedido Confirmado!");
    })
    .catch(err => {
        console.error("Error al enviar el formulario:", err);
        alert("❌ Error inesperado al enviar el formulario.");
    });
}

// Cuando cargue la página de cliente.html
document.addEventListener('DOMContentLoaded', () => {
    mainBuyDish();
    cargarProductos('Main-dishes');
    mainMenuDish();
});