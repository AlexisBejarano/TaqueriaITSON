<script>
    import { onMount } from 'svelte';
    import { fetchTaqueriaData, updateTaqueriaData, fetchTacos, addTaco, updateTaco, deleteTaco } from '../../api.js';

    let taqueria = {}; // Datos de la taquería
    let currentTaqueria = {}; // Taquería actual para editar
    let tacos = []; // Lista de tacos
    let selectedTacos = []; // Tacos seleccionados para la venta
    let total = 0; // Total a pagar

    // Al cargar la página, obtenemos los datos de la taquería y los tacos
    onMount(async () => {
        taqueria = await fetchTaqueriaData();
        currentTaqueria = { ...taqueria }; // Copiar datos para edición
        tacos = await fetchTacos();
    });

    // Función para agregar tacos al ticket
    function addToTicket(taco) {
    const existingTaco = selectedTacos.find(item => item.id === taco.id);
    if (existingTaco) {
        existingTaco.cantidad += 1; // Si ya está en el ticket, solo incrementa la cantidad
    } else {
        selectedTacos = [...selectedTacos, { ...taco, cantidad: 1 }]; // Agregar el taco al ticket
    }
    // Forzar la reactividad al hacer una copia completa del array
    selectedTacos = [...selectedTacos];  // Esto asegura que Svelte lo vea como una nueva asignación
    calculateTotal();
}


    // Función para restar tacos en el ticket
    function removeFromTicket(id) {
    const tacoToRemove = selectedTacos.find(item => item.id === id);
    if (tacoToRemove) {
        if (tacoToRemove.cantidad > 1) {
            tacoToRemove.cantidad -= 1; // Disminuir cantidad
        } else {
            // Eliminar taco si cantidad llega a 0
            selectedTacos = selectedTacos.filter(taco => taco.id !== id);
        }
    }
    // Forzar la reactividad
    selectedTacos = [...selectedTacos];  // Clonamos el arreglo para que Svelte lo vea como una nueva asignación
    calculateTotal(); // Recalcular el total después de restar el taco
}


    // Función para calcular el total de los tacos seleccionados
    function calculateTotal() {
        total = selectedTacos.reduce((sum, taco) => sum + taco.precio * taco.cantidad, 0);
    }

    // Función para confirmar el ticket (guardar o enviar al servidor)
async function confirmTicket() {
    // Crear el mensaje del ticket con los productos seleccionados
    let ticketDetails = `${taqueria.nombre} \n \n`+"Detalles de compra:\n";
    selectedTacos.forEach(taco => {
        ticketDetails += `${taco.nombre} x ${taco.cantidad} - $${taco.precio * taco.cantidad}\n`;
    });
    ticketDetails += `\nTotal a pagar: $${total} \n \n ${taqueria.telefono} \n ${taqueria.email} \n ¡¡Gracias por su compra!!`;
    
    // Mostrar la alerta con los detalles del ticket
    alert(ticketDetails);
    
    // Limpiar el ticket después de confirmar
    selectedTacos = []; 
    calculateTotal(); // Reiniciar total
}

</script>

<style>
    /* Estilos para la tabla y el modal */
    .modal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .modal.show {
        display: block;
    }

    .caja-container {
        display: flex;
        flex-wrap: wrap;
    }

    .taco-item {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        width: 150px;
        text-align: center;
    }

    .selected-tacos {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
    }

    .ticket-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .ticket-item span {
        font-weight: bold;
    }
</style>

<h1>Punto de venta {taqueria.nombre}</h1>

<!-- Información de la taquería -->
<div class="taqueria-info">
    <p><strong>Nombre:</strong> {taqueria.nombre}</p>
    <p><strong>Teléfono:</strong> {taqueria.telefono}</p>
    <p><strong>Email:</strong> {taqueria.email}</p>
    <p><strong>Descripción:</strong> {taqueria.descripcion}</p>
</div>

<h2 class="mt-3 text-center font-bold">ARTICULOS</h2>

<!-- Lista de tacos disponibles -->
<div class="caja-container justify-center">
    {#each tacos as taco}
        <div class="taco-item">
            <h3>{taco.nombre}</h3>
            <p>Precio: ${taco.precio}</p>
            <p>Cantidad: {taco.cantidad}</p>
            <button class="border-2 border-slate-200 rounded-md bg-emerald-200 p-2 w-full" on:click={() => addToTicket(taco)}>Añadir</button>
        </div>
    {/each}
</div>

<!-- Lista del Ticket -->
<div class="selected-tacos w-96 mx-auto">
    <h3 class="text-center mb-2 font-bold">ARTICULOS SELECCIONADOS</h3>
    <div class="ticket-item font-bold border-b-2 border-slate-300">
        <span>Nombre</span>
        <span>Precio</span>
        <span>Accion</span>
    </div>
    {#each selectedTacos as taco (taco.id)}
        <div class="ticket-item">
            <span>{taco.nombre} x {taco.cantidad}</span>
            <span>${taco.precio * taco.cantidad}</span>
            <button class="mx-2 border-2 border-slate-200 rounded-md bg-rose-400 p-2" on:click={() => removeFromTicket(taco.id)}>Eliminar</button>
        </div>
    {/each}
    <p><strong>Total:</strong> ${total}</p>
</div>

<button on:click={confirmTicket} class="w-96 mx-auto border-2 border-slate-200 rounded-md bg-emerald-200 p-2 mt-2">¡Realizar Compra!</button>
