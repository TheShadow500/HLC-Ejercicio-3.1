let boton = document.getElementById("convertir");
boton.addEventListener("click", function(){
    if(parseFloat(document.getElementById("cantidad").value) > 0){
        conversionMoneda();
    }
    else{
        errorMensaje();
    }
});

document.getElementById("cantidad").addEventListener("keydown", function(event){
    if(event.key === "ArrowDown" || event.key === "ArrowUp" || event.key === "-" || event.key === "+"){
        event.preventDefault();
    }
});

let libra = 1.13;   // Valor Libra
let dolar = 0.92;   // Valor Dolar
let yen = 0.0072;   // Valor Yen
let fecha;
let paginaWeb;

function getMoneda(url){
    return fetch(url)
        .then(response => response.json())
        .then(data => data.rate)
        .catch(error => {
            console.error("Error al obtener los datos: ", error);
        });
}

// Promesas
// https://trustpilot.digitalshopuy.com/currency/api-docs/
let promiseGBP = getMoneda("https://trustpilot.digitalshopuy.com/currency/conversion_rate?from=GBP&to=EUR");   // Promesa GBP
let promiseUSD = getMoneda("https://trustpilot.digitalshopuy.com/currency/conversion_rate?from=USD&to=EUR");   // Promesa USD
let promiseJPY = getMoneda("https://trustpilot.digitalshopuy.com/currency/conversion_rate?from=JPY&to=EUR");   // Promesa JPY

// Esperamos a que se devuelvan los datos de las promesas para mostrarlos en pantalla
Promise.all([promiseGBP, promiseUSD, promiseJPY])
    .then(([valorGBP, valorUSD, valorJPY]) => {
        libra = valorGBP.toFixed(2);
        dolar = valorUSD.toFixed(2);
        yen = valorJPY.toFixed(4);
        fecha = new Date();
        mostrarDatos("<b>Consulta API con éxito.</b><br>Fecha de Consulta: <b>" + fecha.getFullYear() + "-" + fecha.getMonth() + "-" + fecha.getDate() + "</b>");
    })
    .catch(() => {
        fecha = "<b>Error al Actualizar.</b> Utilizando datos por defecto";
        mostrarDatos(fecha);
    });

function mostrarDatos(fecha){
    document.getElementById("tipoconversion").innerHTML = "";
    
    let contenido = document.createElement("div");
    contenido.innerHTML = "Libra: <b>" + libra + "€</b><br>Dólar: <b>" + dolar + "€</b><br>Yen: <b>" + yen + "€</b><br><br>" + fecha;
    document.getElementById("tipoconversion").appendChild(contenido);
}

function conversionMoneda(){
    let moneda = document.getElementById("moneda").value;
    let total = 0;

    switch(moneda){
        case "libras":
            total = (libra * parseFloat(document.getElementById("cantidad").value)).toFixed(2);
            break;
        case "dolares":
            total = (dolar * parseFloat(document.getElementById("cantidad").value)).toFixed(2);
            break;
        case "yenes":
            total = (yen * parseFloat(document.getElementById("cantidad").value)).toFixed(4);
            break;
    }

    mostrarResultado(total)
}

function errorMensaje(){
    document.getElementById("resultado").innerHTML = "";

    let contenido = document.createElement("div");
    contenido.className = "error";
    contenido.innerHTML = "El campo '<b>Cantidad</b>' no puede quedar vacío ni contener caracteres no válidos";
    document.getElementById("resultado").appendChild(contenido);
}

function mostrarResultado(total){
    document.getElementById("resultado").innerHTML = "";
    
    let contenido = document.createElement("div");
    contenido.innerHTML = "<h1>RESULTADO<br>" + total + "€</h1>";
    document.getElementById("resultado").appendChild(contenido);
}