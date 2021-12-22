//let contCatalogo;
let listaCarrito = localStorage.listaCarrito ? JSON.parse(localStorage.listaCarrito) : [];
let listaCatalogo = [];
let listaCarritoCantidad;
let ulProds;
let ulCarrito;
let menuClick;
let menuNav;

window.onload = function (){

    ulProds = document.querySelector(".ul_prods")
    menuClick = document.querySelector(".menu_click")
    menuNav = document.querySelector(".menu_nav")
    ulCarrito = document.querySelector(".ul_carrito")
    
    menuClick.addEventListener("click", menuHandler)

    cargarCatalogo();
    mostrarProdsAgregados();
    
    setTimeout(()=>{
        mostrarListaAgregados();
    },500)
    
}

function cargarCatalogo(){
    ulProds.innerHTML = " ";
    let html = " ";


    console.log("CARGA CATALOGO")
    //JQUERY AGREGADO
    $.ajax({
        url: "catalogo.json",
        success: function(data){
            console.log(data)
            listaCatalogo = data;
            data.forEach(prod => {
                html = html + htmlCatalogo(prod);
            });
            ulProds.innerHTML = html;
            
        },
        error: function (error) {
            console.log("ERROR")
        }
    });

    
}

function htmlCatalogo(prod){
    return `
    <li class="card_prod" id="${prod.id}">
        <div>
            <div class="cont_img_card">
                <img class="img_card" src="${prod.imagen}" alt="${prod.alt}" >
            </div>
            <div class="titulo_card">${prod.nombre}</div>
            <div class="cont_precio">
                <div class="precio_card">$${prod.precio}</div>
                <div>
                    <button class="btn_comprar" onClick="agregar(${prod.id})">Agregar</button>
                </div>
            </div>
        </div>
    </li>
    `
}

function menuHandler(){
    menuNav.classList.toggle("bajar_menu_nav")
    menuClick.classList.toggle("menu_active")
}

function agregar(id){
    mostrarNotif()
    console.log("SE AGREGA " + id)

    listaCatalogo.forEach(prod => {
        if (prod.id == id) {
            listaCarrito.push(prod);
        }
    });

    localStorage.listaCarrito = JSON.stringify(listaCarrito);

    console.log("LISTA: ", listaCarrito)
    mostrarProdsAgregados()
    mostrarListaAgregados()

}

//Se utiliza para modificar el DOM del Carrito y mostrar los productos agregados en el Navbar
function mostrarProdsAgregados(){
    document.querySelector(".cant_cart").innerHTML = " ";

    let contador = listaCarrito.length;

    document.querySelector(".cant_cart").innerHTML = `${contador}`

    if (contador>=1) {
        document.querySelector(".cant_cart").classList.remove("display-none")

    }else if(contador==0){
        document.querySelector(".cant_cart").classList.add("display-none")

    }

    //totalPagar.textContent = " ";
    //totalPagar.textContent = "$"+calcularTotal()
}

function mostrarListaAgregados(){
    if(listaCarrito.length>=1){
        document.querySelector(".alert_cart").classList.add("display-none");
        ulCarrito.innerHTML = htmlLista()
    }else{
        document.querySelector(".alert_cart").classList.remove("display-none");
    }
}

function htmlLista(){
    let html = " "

    listaProductoCantidad().forEach(element => {
        if (element.cantidad>=1) {
            let nombre = element.producto.nombre;
            let cantidad = element.cantidad;
            let precio = element.producto.precio;
            let imagen = element.producto.imagen;
            let id = element.producto.id;
            html = html + htmlListaUnidad(nombre, cantidad, precio, imagen, id);
            listaBtn = document.querySelectorAll(".listaBtn")
        }
    });

    return html;
}

function htmlListaUnidad(nombre, cantidad, precio, imagen, id){
    return `
        <div class="item_lista">
            <div class="div_img_unidad_lista">
                <img class="img_unidad_lista" src="${imagen}" alt="${nombre}">
            </div>
            <div>${nombre}</div>
            
            <div class="cant_item_lista">x${cantidad}</div>
            
        </div>
    `
}

function eliminarCarrito(){
    console.log("SE QUIERE ELIMINAR CARRITO")
    listaCarrito = [];
    mostrarProdsAgregados();
    mostrarListaAgregados();
    ulCarrito.innerHTML = " ";
}

function listaProductoCantidad(){
    let productosYCantidad = [];

    listaCatalogo.forEach(prodCatalogo => {
        let cont = 0;
        let prodActual = prodCatalogo;

        listaCarrito.forEach(prodCarrito => {
            if (prodActual.id == prodCarrito.id) {
                cont = cont + 1;
            }
        });

        //Crea objeto para lista
        let prodCant = {producto : prodActual, cantidad : cont};

        productosYCantidad.push(prodCant);
    });

    return productosYCantidad;
}

//Toast de producto Agregado
function mostrarNotif() {
    Swal.fire({
        title: 'Producto agregado!',
        position: "top-end",
        timer: 1500,
        showConfirmButton: false,
        icon: "success",
        toast: "true",
    })
}

function modalToggle(){
    document.querySelector(".modal").classList.toggle("modal_on")
}

function compraFinal(){
    modalToggle()
    Swal.fire({
        position: 'top-center',
        icon: 'success',
        title: 'TE AGRADECEMOS DESDE SYLVANIAN FAMILIES',
        showConfirmButton: false,
        timer: 2500
      })
}

