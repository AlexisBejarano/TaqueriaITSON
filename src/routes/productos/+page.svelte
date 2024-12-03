<script>
    import { onMount } from 'svelte';
    import { fetchData, addData, updateData, deleteData } from '../../api.js';

    let productos = []; // Lista de productos
    let showModal = false; // Mostrar u ocultar el modal
    let isEditing = false; // Indica si se está editando un producto para que lo muestre en el modal xd.
    let currentProduct = {}; // Producto actual (para agregar/editar)

    // Al cargar la página, obtenemos los productos
    onMount(async () => {
        productos = await fetchData();
    });

    // Función para abrir el modal, ya sea para agregar o editar
    function openModal(producto = {}) {
        currentProduct = { ...producto }; // Copia del producto actual
        showModal = true; // Mostrar modal
        isEditing = !!producto.id; // para editar en base al ID y no lo agregue a la tabla como nuevo producto.
    }

    // Función para cerrar el modal y limpiar datos
    function closeModal() {
        showModal = false; // Ocultar modal
        currentProduct = {}; // Limpiar producto actual
    }

    // Guardar producto (agregar o editar)
    async function handleSave() {
        if (isEditing) {
            // Si estamos editando, actualizamos el producto
            await updateData(currentProduct);
        } else {
            // Si no, agregamos un nuevo producto
            await addData(currentProduct);
        }
        productos = await fetchData(); // Actualizamos la lista de productos
        closeModal(); // Cerramos el modal
    }

    // Eliminar producto
    async function handleDelete(id) {
        await deleteData(id); // Eliminamos el producto por ID
        productos = await fetchData(); // Actualizamos la lista de productos
    }
</script>


<style>
    /* Estilos para la tabla y el modal */
    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 8px;
        border: 1px solid #ddd;
    }

    th {
        background-color: #f4f4f4;
    }

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
</style>

<h1>Lista de Productos</h1>

<button class="font-bold border-2 border-slate-200 rounded-md bg-emerald-200 p-2 my-2" on:click={() => openModal()}>Añadir Productos</button>

<table>
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th class="w-52">Acciones</th>
        </tr>
    </thead>
    <tbody>
        {#each productos as producto}
            <tr>
                <td>{producto.nombre}</td>
                <td>{producto.codigo}</td>
                <td>{producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>
                    <div class="table m-auto">
                        <button class="mx-2 border-2 border-slate-200 rounded-md bg-emerald-200 p-2" on:click={() => openModal(producto)}>Editar</button>
                        <button class="mx-2 border-2 border-slate-200 rounded-md bg-rose-400 p-2" on:click={() => handleDelete(producto.id)}>Eliminar</button>
                    </div>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<div class="modal {showModal ? 'show' : ''}">
    <h2 class="text-center font-bold">{isEditing ? 'Editar Producto' : 'Añadir Producto'}</h2>
    <label class="grid"> <div class="font-bold">Nombre:</div> <input class="border-2 border-slate-200 rounded-md mb-2 cursive" bind:value={currentProduct.nombre} /></label>
    <label class="grid"> <div class="font-bold">Código:</div> <input class="border-2 border-slate-200 rounded-md mb-2" bind:value={currentProduct.codigo} /></label>
    <label class="grid"> <div class="font-bold">Precio:</div> <input class="border-2 border-slate-200 rounded-md mb-2" bind:value={currentProduct.precio} /></label>
    <label class="grid"> <div class="font-bold">Cantidad:</div> <input class="border-2 border-slate-200 rounded-md mb-2" bind:value={currentProduct.cantidad} /></label>
    <div class="table m-auto">
        <button class="mx-2 border-2 border-slate-200 rounded-md bg-emerald-200 p-2" on:click={handleSave}>{isEditing ? 'Actualizar' : 'Guardar'}</button>
        <button class="mx-2 border-2 border-slate-200 rounded-md bg-rose-400 p-2" on:click={closeModal}>Cancelar</button>
    </div>
</div>
