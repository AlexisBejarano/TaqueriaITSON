<script>
    import { onMount } from 'svelte';
    import { fetchData, addData, updateData, deleteData } from '../../api.js'; // Asegúrate de que las rutas sean correctas

    let productos = [];
    let showModal = false;
    let isEditing = false;
    let currentProduct = {};

    onMount(async () => {
        productos = await fetchData();
    });

    const openModal = (producto = {}) => {
        currentProduct = { ...producto };
        showModal = true;
        isEditing = !!producto.id;
    };

    const closeModal = () => {
        showModal = false;
        currentProduct = {};
    };

    const handleSave = async () => {
        if (isEditing) {
            await updateData(currentProduct);
        } else {
            await addData(currentProduct);
        }
        productos = await fetchData();
        closeModal();
    };

    const handleDelete = async (id) => {
        await deleteData(id);
        productos = await fetchData();
    };
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

<button on:click={() => openModal()}>Añadir Producto</button>

<table>
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Acciones</th>
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
                    <button on:click={() => openModal(producto)}>Editar</button>
                    <button on:click={() => handleDelete(producto.id)}>Eliminar</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<div class="modal {showModal ? 'show' : ''}">
    <h2>{isEditing ? 'Editar Producto' : 'Añadir Producto'}</h2>
    <label>Nombre: <input bind:value={currentProduct.nombre} /></label><br>
    <label>Código: <input bind:value={currentProduct.codigo} /></label><br>
    <label>Precio: <input bind:value={currentProduct.precio} /></label><br>
    <label>Cantidad: <input bind:value={currentProduct.cantidad} /></label><br>
    <button on:click={handleSave}>{isEditing ? 'Actualizar' : 'Guardar'}</button>
    <button on:click={closeModal}>Cancelar</button>
</div>
