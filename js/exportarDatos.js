window.mostrarJSON = function () {
    let nombreInput = document.getElementById("nombre"); 
    let celularInput = document.getElementById("celular");

    let datos = {
        nombre: nombreInput ? nombreInput.value.trim() : "",
        celular: celularInput ? celularInput.value.trim() : "",
        prendas: []
    };

    let filas = document.querySelectorAll("tbody tr");

    filas.forEach(fila => {
        let celdas = fila.querySelectorAll("td");
        let prenda = celdas[0] ? celdas[0].innerText : "";
        let servicio = celdas[1] ? celdas[1].innerText : "";
        
        let cantidadInput = celdas[2] ? celdas[2].querySelector("input") : null;
        let cantidad = cantidadInput ? parseInt(cantidadInput.value, 10) : 0;
        
        let precioUnitario = celdas[3] ? parseFloat(celdas[3].innerText.replace("S/", "")) : 0;
        let total = celdas[4] ? parseFloat(celdas[4].innerText.replace("S/", "")) : 0;

        datos.prendas.push({
            prenda: prenda,
            servicio: servicio,
            cantidad: cantidad,
            precio_unitario: precioUnitario,
            total: total
        });
    });

    console.log(JSON.stringify(datos, null, 2)); 
};
