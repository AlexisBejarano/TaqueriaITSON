<script>
    import { onMount } from 'svelte';
    import { fetchTaqueriaData, updateTaqueriaData, fetchTacos, addTaco, updateTaco, deleteTaco } from '../../api.js';

    let taqueria = {}; // Datos de la taquería
    let showModal = false; // Modal para editar taquería
    let showEditTacoModal = false; // Modal para editar taco
    let currentTaqueria = {}; // Taquería actual para editar
    let tacos = []; // Lista de tacos
    let newTaco = { nombre: '', precio: '', cantidad: 0 }; // Nuevo taco para agregar
    let currentTaco = {}; // Taco actual para editar
    let selectedTacos = []; // Tacos seleccionados para la venta
    let total = 0; // Total a pagar

    // Al cargar la página, obtenemos los datos de la taquería y los tacos
    onMount(async () => {
        taqueria = await fetchTaqueriaData();
        currentTaqueria = { ...taqueria }; // Copiar datos para edición
        tacos = await fetchTacos();
    });

    // Función para abrir el modal de edición de la taquería
    function openModal() {
        currentTaqueria = { ...taqueria }; // Resetear valores con los actuales
        showModal = true;
    }

    // Función para cerrar el modal
    function closeModal() {
        showModal = false;
    }

    // Función para guardar los cambios en la taquería
    async function handleSave() {
        await updateTaqueriaData(currentTaqueria);
        taqueria = { ...currentTaqueria }; // Actualizar los datos mostrados
        closeModal();
    }

    // Función para añadir un nuevo taco
    async function handleAddTaco() {
        await addTaco(newTaco);
        tacos = await fetchTacos(); // Recargar la lista de tacos
        newTaco = { nombre: '', precio: '', cantidad: 0 }; // Limpiar formulario
    }

    // Función para editar un taco
    function openEditTacoModal(taco) {
        currentTaco = { ...taco }; // Clonar los datos del taco
        showEditTacoModal = true;  // Abrir el modal
    }


    // Función para guardar los cambios al editar un taco
    async function handleEditTacoSave() {
        await updateTaco(currentTaco); // Guardar cambios en el taco
        tacos = await fetchTacos(); // Recargar los tacos
        showEditTacoModal = false;  // Cerrar el modal
    }


    // Función para eliminar un taco
    function handleDeleteTaco(id) {
        deleteTaco(id);
        tacos = tacos.filter(taco => taco.id !== id); // Eliminar taco localmente
    }

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
        // Aquí podrías agregar el ticket a la base de datos si es necesario
        alert('Ticket confirmado. Total: ' + total);
        selectedTacos = []; // Limpiar el ticket después de confirmar
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

<h1>Información de la Taquería</h1>

<!-- Información de la taquería -->
<div class="taqueria-info">
    <p><strong>Nombre:</strong> {taqueria.nombre}</p>
    <p><strong>Teléfono:</strong> {taqueria.telefono}</p>
    <p><strong>Email:</strong> {taqueria.email}</p>
    <p><strong>Descripción:</strong> {taqueria.descripcion}</p>
    <button on:click={openModal} class="font-bold border-2 border-slate-200 rounded-md bg-emerald-200 p-2 my-2">Editar Información</button>
</div>

<!-- Modal para editar la taquería -->
<!-- Modal para editar taco -->
<div class="modal w-64 text-center {showEditTacoModal ? 'show' : ''}">
    <h2 class="font-bold">Editar Taco</h2>
    <label>Nombre: <input class="border-2 border-slate-200 rounded-md mb-2" bind:value={currentTaco.nombre} /></label>
    <label>Precio: <input class="border-2 border-slate-200 rounded-md mb-2" type="number" bind:value={currentTaco.precio} /></label>
    <label>Cantidad: <input class="border-2 border-slate-200 rounded-md mb-2" type="number" bind:value={currentTaco.cantidad} /></label>
    <div class="mt-4">
        <button on:click={handleEditTacoSave} class="border-2 border-slate-200 rounded-md bg-emerald-200 p-2">Guardar</button>
        <button on:click={() => showEditTacoModal = false} class="border-2 border-slate-200 rounded-md bg-rose-400 p-2">Cancelar</button>
    </div>
</div>


<h2>Punto de Venta</h2>

<!-- Lista de tacos disponibles -->
<h3>Tacos Disponibles</h3>
<div class="caja-container">
    {#each tacos as taco}
        <div class="taco-item">
            <h3>{taco.nombre}</h3>
            <p>Precio: ${taco.precio}</p>
            <p>Cantidad: {taco.cantidad}</p>
            <button on:click={() => addToTicket(taco)}>Agregar al Ticket</button>
            <button on:click={() => openEditTacoModal(taco)}>Editar</button>
            <button on:click={() => handleDeleteTaco(taco.id)}>Eliminar</button>
        </div>
    {/each}
</div>

<!-- Botón para añadir un nuevo taco -->
<h3>Agregar Nuevo Taco</h3>
<div>
    <label>Nombre: <input class="border-2 border-slate-200 rounded-md mb-2" bind:value={newTaco.nombre} /></label>
    <label>Precio: <input class="border-2 border-slate-200 rounded-md mb-2" type="number" bind:value={newTaco.precio} /></label>
    <label>Cantidad: <input class="border-2 border-slate-200 rounded-md mb-2" type="number" bind:value={newTaco.cantidad} /></label>
    <button on:click={handleAddTaco}>Añadir Taco</button>
</div>

<!-- Lista del Ticket -->
<div class="selected-tacos">
    <h3>Productos en el Ticket</h3>
    {#each selectedTacos as taco (taco.id)}
        <div class="ticket-item">
            <span>{taco.nombre} x {taco.cantidad}</span>
            <span>${taco.precio * taco.cantidad}</span>
            <button on:click={() => removeFromTicket(taco.id)}>Restar</button>
        </div>
    {/each}
    <p><strong>Total:</strong> ${total}</p>
</div>

<button on:click={confirmTicket} class="border-2 border-slate-200 rounded-md bg-emerald-200 p-2">Confirmar Ticket</button>
