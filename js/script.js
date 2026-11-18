/*=====================================================
            HUELLA VERDE TOUR
======================================================*/


//==============================
// PAQUETES
//==============================

const paquetes = [

{

id:1,

nombre:"Aventura Maya",

destino:"Cancún • Chichén Itzá • Isla Mujeres",

descripcion:"5 días y 4 noches",

precio:18669.30,

salida:"10 de enero de 2027",

regreso:"14 de enero de 2027",

capacidad:30,

imagen:"img/cancun.jpg"

}

];



//==============================
// RESERVAS
//==============================

let reservas = JSON.parse(

localStorage.getItem("reservas")

) || [];



//==============================
// CARGAR
//==============================

actualizarLugares();


//===========================================
// PERSONAS OCUPADAS
//===========================================

function personasReservadas(id){

let total = 0;

reservas.forEach(reserva=>{

if(reserva.paquete==id){

total += reserva.personas;

}

});

return total;

}

//===========================================
// LUGARES DISPONIBLES
//===========================================

function lugaresDisponibles(id){

const paquete = paquetes.find(

p=>p.id==id

);

return paquete.capacidad-personasReservadas(id);

}//===========================================
// ACTUALIZAR TARJETAS
//===========================================

function actualizarLugares(){

document.querySelectorAll(".reservar-btn")

.forEach((boton)=>{

const id = Number(

boton.dataset.id

);

const disponibles = lugaresDisponibles(id);

const tarjeta = boton.closest(".card");

const badge = tarjeta.querySelector(".badge");

const barra = tarjeta.querySelector(".progress-bar");

const texto = tarjeta.querySelector("small");



texto.innerHTML=

`${30-disponibles} / 30 personas`;



barra.style.width=

((30-disponibles)/30)*100+"%";



if(disponibles==0){

badge.className="badge bg-danger";

badge.innerHTML="Agotado";

boton.disabled=true;

boton.innerHTML="Agotado";

boton.className="btn btn-danger w-100";

}

else if(disponibles<=5){

badge.className="badge bg-warning";

badge.innerHTML="Últimos lugares";

boton.className="btn btn-warning w-100 reservar-btn";

}

else{

badge.className="badge bg-success";

badge.innerHTML="Disponible";

boton.className="btn btn-success w-100 reservar-btn";

}

});

}

//===================================
// MODAL
//===================================

const modal = new bootstrap.Modal(

document.getElementById("modalReserva")

);

let paqueteSeleccionado = null;

//===================================
// ABRIR RESERVA
//===================================

document.addEventListener("click",(e)=>{

if(e.target.classList.contains("reservar-btn")){

const id = Number(

e.target.dataset.id

);

paqueteSeleccionado = paquetes.find(

p=>p.id==id

);

document.getElementById("nombrePaquete").innerHTML =
paqueteSeleccionado.nombre;

document.getElementById("destinoPaquete").innerHTML =
paqueteSeleccionado.destino;

document.getElementById("precioPaquete").innerHTML =
paqueteSeleccionado.precio.toLocaleString();

document.getElementById("salidaPaquete").innerHTML =
paqueteSeleccionado.salida;

document.getElementById("imagenPaquete").src =
paqueteSeleccionado.imagen;

document.getElementById("personas").value = 1;

document.getElementById("totalCompra").innerHTML =
paqueteSeleccionado.precio.toLocaleString();

modal.show();

}

});

//===================================
// CALCULAR TOTAL
//===================================

document.getElementById("personas")

.addEventListener("input",()=>{

let personas = Number(

document.getElementById("personas").value

);

if(personas<1){

personas=1;

}

let total=

personas*paqueteSeleccionado.precio;

document.getElementById("totalCompra")

.innerHTML=

total.toLocaleString(

'es-MX',

{

minimumFractionDigits:2

}

);

});

//=====================================
// CONFIRMAR RESERVA
//=====================================

document
.getElementById("formReserva")
.addEventListener("submit",function(e){

e.preventDefault();

const personas = Number(
document.getElementById("personas").value
);

const disponibles =
lugaresDisponibles(paqueteSeleccionado.id);

if(personas>disponibles){

alert(
"Solo quedan "+
disponibles+
" lugares disponibles."
);

return;

}

const reserva={

folio:generarFolio(),

paquete:paqueteSeleccionado.id,

paqueteNombre:paqueteSeleccionado.nombre,

nombre:document.getElementById("nombre").value,

correo:document.getElementById("correo").value,

telefono:document.getElementById("telefono").value,

personas:personas,

precio:paqueteSeleccionado.precio,

total:personas*paqueteSeleccionado.precio,

fecha:paqueteSeleccionado.salida,

fechaCompra:new Date().toLocaleString()

};

reservas.push(reserva);

localStorage.setItem(

"reservas",

JSON.stringify(reservas)

);

actualizarLugares();

mostrarTicket(reserva);

modal.hide();

this.reset();

});

//=====================================
// GENERAR FOLIO
//=====================================

function generarFolio(){

const numero=

reservas.length+1;

return "HV-"+

new Date().getFullYear()

+"-"+

String(numero).padStart(5,"0");

}

//=====================================
// TICKET
//=====================================

function mostrarTicket(reserva){

const ticket=`

====================================

🌿 HUELLA VERDE TOUR

====================================

Compra realizada correctamente.

Folio:
${reserva.folio}

Cliente:
${reserva.nombre}

Correo:
${reserva.correo}

Teléfono:
${reserva.telefono}

------------------------------------

Paquete:

${reserva.paqueteNombre}

Fecha de salida:

${reserva.fecha}

------------------------------------

Personas:

${reserva.personas}

Precio por persona:

$${reserva.precio.toLocaleString("es-MX",{
minimumFractionDigits:2
})}

------------------------------------

TOTAL PAGADO

$${reserva.total.toLocaleString("es-MX",{
minimumFractionDigits:2
})}

------------------------------------

Hora de presentación

04:30 hrs

Punto de reunión

Terminal indicada en el itinerario.

====================================

¡Gracias por confiar en
Huella Verde Tour!

Te esperamos.

`;

alert(ticket);

}

