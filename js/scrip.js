document.addEventListener('DOMContentLoaded', function () {
    const prendaSelect = document.getElementById('prenda');
    const opcionSelect = document.getElementById('opcion');
    const cantidadInput = document.querySelector(".selec_box input[type='number']");
    const precioUnitarioInput = document.getElementById("precio_unitario");
    const celularInput = document.getElementById("celular");

    const totalGeneralInput = document.getElementById("total_general");
    const adelantoInput = document.getElementById("adelanto");
    const restaInput = document.getElementById("resta");

    // Mensaje de error para el número de celular
    const mensajeError = document.createElement("small");
    mensajeError.style.color = "red";
    mensajeError.style.display = "none"; // Ocultar por defecto
    mensajeError.textContent = "El número debe tener exactamente 9 dígitos.";
    celularInput.parentNode.appendChild(mensajeError);

    const nombrePrendas = {
        jean: "Jean",
        pantalon_vestir: "Pantalón de vestir",
        polo: "Polo",
        short: "Short",
        camisa: "Camisa"
    };

    const opcionesDetalles = {
        jean: ["Subir basta", "Entalle de pierna", "Entalle de cintura", "Cambiar cierre", "Surcido", "Añadir bolsillo"],
        pantalon_vestir: ["Ajustar cintura", "Basta a mano", "Basta a máquina", "Entalle de pierna"],
        polo: ["Subir basta", "Reducir tamaño", "Entalle total", "Reducir cuello"],
        short: ["Añadir bolsillo", "Ajustar largo"],
        camisa: ["Subir basta", "Entallar", "Voltear cuello", "Poner botón"]
    };

    const preciosServicios = {
        "Subir basta": 6,
        "Entalle de pierna": 6,
        "Entalle de cintura": 10,
        "Cambiar cierre": 10,
        "Surcido": 6,
        "Añadir bolsillo": 10,
        "Ajustar cintura": 10,
        "Basta a mano": 8,
        "Basta a máquina": 6,
        "Entalle total": 15,
        "Reducir tamaño": 7,
        "Reducir cuello": 6,
        "Ajustar largo": 6,
        "Entallar": 12,
        "Voltear cuello": 7,
        "Poner botón": 3
    };

    prendaSelect.addEventListener('change', function () {
        const prendaSeleccionada = prendaSelect.value;
        opcionSelect.innerHTML = '<option value="" selected disabled>Seleccione una opción</option>';

        if (opcionesDetalles[prendaSeleccionada]) {
            opcionesDetalles[prendaSeleccionada].forEach(opcion => {
                const optionElement = document.createElement("option");
                optionElement.value = opcion;
                optionElement.textContent = opcion;
                opcionSelect.appendChild(optionElement);
            });
            opcionSelect.disabled = false;
        } else {
            opcionSelect.disabled = true;
        }
        precioUnitarioInput.value = "";
    });

    opcionSelect.addEventListener("change", function () {
        let servicioSeleccionado = this.value;
        if (preciosServicios.hasOwnProperty(servicioSeleccionado)) {
            precioUnitarioInput.value = `S/${preciosServicios[servicioSeleccionado]}`;
        } else {
            precioUnitarioInput.value = "";
        }
    });

    celularInput.addEventListener("input", function () {
        let valor = celularInput.value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
        if (valor.length > 9) {
            valor = valor.substring(0, 9);
        }
        celularInput.value = valor;

        if (valor.length === 9) {
            mensajeError.style.display = "none";
        } else {
            mensajeError.style.display = "block";
        }
    });

    function actualizarTotalGeneral() {
        let total = 0;
        document.querySelectorAll(".total").forEach(td => {
            total += parseFloat(td.textContent.replace("S/", "")) || 0;
        });
        totalGeneralInput.value = `S/${total.toFixed(2)}`;
        actualizarResta();
    }

    function actualizarResta() {
        let totalGeneral = parseFloat(totalGeneralInput.value.replace("S/", "")) || 0;
        let adelanto = parseFloat(adelantoInput.value) || 0;
        let resta = totalGeneral - adelanto;
        restaInput.value = `S/${resta.toFixed(2)}`;
    }

    adelantoInput.addEventListener("input", actualizarResta);

    window.agregarFila = function () {
        let prenda = prendaSelect.value;
        let servicio = opcionSelect.value;
        let cantidad = parseInt(cantidadInput.value, 10);
        let celular = celularInput.value.trim();

        if (!prenda || !servicio || cantidad <= 0) {
            alert("Por favor, complete todos los campos antes de agregar.");
            return;
        }

        if (celular.length !== 9) {
            mensajeError.style.display = "block";
            return;
        }

        let precio = preciosServicios[servicio] || 0;
        let total = cantidad * precio;
        let nombrePrendaMostrar = nombrePrendas[prenda] || prenda;

        let nuevaFila = document.createElement("tr");
        nuevaFila.innerHTML = `
            <td>${nombrePrendaMostrar}</td>
            <td>${servicio}</td>
            <td><input type="number" value="${cantidad}" min="1" onchange="actualizarTotal(this, ${precio})"></td>
            <td>S/${precio.toFixed(2)}</td>
            <td class="total">S/${total.toFixed(2)}</td>
            <td><button onclick="eliminarFila(this)"><i class="fa-solid fa-trash"></i></button></td>
        `;

        document.querySelector("tbody").appendChild(nuevaFila);

        prendaSelect.value = "";
        opcionSelect.innerHTML = '<option value="" selected disabled>Seleccione una opción</option>';
        opcionSelect.disabled = true;
        cantidadInput.value = 1;
        precioUnitarioInput.value = "";

        actualizarTotalGeneral();
    };

    window.eliminarFila = function (boton) {
        let fila = boton.parentElement.parentElement;
        fila.remove();
        actualizarTotalGeneral();
    };

    window.actualizarTotal = function (input, precio) {
        let fila = input.parentElement.parentElement;
        let cantidad = parseInt(input.value, 10);
        let total = cantidad * precio;
        fila.querySelector(".total").innerText = `S/${total.toFixed(2)}`;
        actualizarTotalGeneral();
    };
});
