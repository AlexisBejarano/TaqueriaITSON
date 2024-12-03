<script>
    import { onMount } from 'svelte';
    import { fetchData, addData, updateData, deleteData } from '../../api.js';

    let productos = []; // Lista de productos
    let showModal = false; // Modal para productos nuevos
    let showAddExistingModal = false; // Modal para productos existentes
    let isEditing = false; // Indica si se está editando un producto
    let currentProduct = {}; // Producto actual (para agregar/editar)
    let selectedProductId = null; // ID del producto seleccionado en la lista
    let cantidadAdicional = 0; // Cantidad adicional para productos existentes
    let precioAdicional = 0; // Precio adicional para productos existentes

    // Al cargar la página, obtenemos los productos
    onMount(async () => {
        productos = await fetchData();
    });

    // Función para abrir el modal para agregar o editar productos
    function openModal(producto = {}) {
        currentProduct = { ...producto }; // Copia del producto actual
        showModal = true;
        isEditing = !!producto.id;
    }

    // Función para abrir el modal para añadir productos existentes
    function openAddExistingModal() {
        selectedProductId = null; // Resetear selección
        cantidadAdicional = 0; // Resetear cantidad
        precioAdicional = 0; // Resetear precio
        showAddExistingModal = true; // Mostrar modal
    }

    // Función para cerrar los modales
    function closeModal() {
        showModal = false;
        showAddExistingModal = false;
        currentProduct = {};
        selectedProductId = null;
        cantidadAdicional = 0;
        precioAdicional = 0;
    }

    // Guardar producto (agregar o editar)
    async function handleSave() {
        if (isEditing) {
            await updateData(currentProduct);
        } else {
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

    // Agregar producto existente con nueva cantidad y precio
    async function addExistingProduct() {
        if (!selectedProductId || cantidadAdicional <= 0 || precioAdicional <= 0) {
            alert('Por favor selecciona un producto, cantidad y precio válidos.');
            return;
        }

        // Buscar el producto seleccionado
        const producto = productos.find(p => p.id === selectedProductId);

        if (producto) {
            // Crear una nueva entrada para el producto con la nueva cantidad y precio
            const newProduct = {
                nombre: producto.nombre,
                codigo: producto.codigo,
                precio: precioAdicional, // Asignamos el nuevo precio
                cantidad: cantidadAdicional, // Asignamos la cantidad adicional
            };

            // Agregar el nuevo producto a la base de datos
            await addData(newProduct);

            // Reflejar los cambios en la tabla
            productos = await fetchData();
        }

        closeModal(); // Cerrar el modal
    }

    // Calcular la cantidad total por producto (suma de todas las cantidades por producto)
    function getTotalQuantityByProduct(nombre) {
        const filteredProducts = productos.filter(producto => producto.nombre === nombre);
        return filteredProducts.reduce((total, producto) => total + Number(producto.cantidad), 0);
    }

    // Calcular la suma total de precios por producto (suma de todos los precios)
    function getTotalPriceByProduct(nombre) {
        const filteredProducts = productos.filter(producto => producto.nombre === nombre);
        return filteredProducts.reduce((total, producto) => total + parseFloat(producto.precio), 0).toFixed(2);
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

<div class="mb-4 mx-auto">
    <button class="font-bold border-2 border-slate-200 rounded-md bg-emerald-200 p-2 my-2" on:click={() => openModal()}>Añadir Producto Nuevo</button>
    <button class="font-bold border-2 border-slate-200 rounded-md bg-blue-200 p-2 my-2" on:click={openAddExistingModal}>Añadir Producto Existente</button>
</div>

<!-- Tabla Principal con productos -->
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
        {#each productos as producto (producto.id)}
            <tr>
                <td>{producto.nombre}</td>
                <td>{producto.codigo}</td>
                <td>{producto.precio}</td>
                <td>{producto.cantidad}</td>
                <td>
                    <button class="mx-2 border-2 border-slate-200 rounded-md bg-emerald-200 p-2" on:click={() => openModal(producto)}>Editar</button>
                    <button class="mx-2 border-2 border-slate-200 rounded-md bg-rose-400 p-2" on:click={() => handleDelete(producto.id)}>Eliminar</button>
                </td>
            </tr>
        {/each}
    </tbody>
</table>

<!-- Tabla de Totales de Productos (acumulando cantidades y precios) -->
<h2 class="mt-8 mb-2 text-center font-bold">Totales de Productos</h2>
<table>
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Precio</th>
            <th>Cantidad</th>
        </tr>
    </thead>
    <tbody>
        {#each [...new Set(productos.map(p => p.nombre))] as productoNombre}
            <tr>
                <td>{productoNombre}</td>
                <td>{productos.find(p => p.nombre === productoNombre)?.codigo}</td>
                <td>{getTotalPriceByProduct(productoNombre)}</td>
                <td>{getTotalQuantityByProduct(productoNombre)}</td>
            </tr>
        {/each}
    </tbody>
</table>

<!-- Modal para agregar o editar productos -->
<div class="modal w-64 text-center {showModal ? 'show' : ''}">
    <h2 class="text-center font-bold">{isEditing ? 'Editar Producto' : 'Añadir Producto Nuevo'}</h2>
    <label>Nombre: <input class="border-2 border-slate-200 rounded-md mb-2" bind:value={currentProduct.nombre} /></label>
    <label>Código: <input class="border-2 border-slate-200 rounded-md mb-2" bind:value={currentProduct.codigo} /></label>
    <label>Precio: <input class="border-2 border-slate-200 rounded-md mb-2" type="number" bind:value={currentProduct.precio} /></label>
    <label>Cantidad: <input class="border-2 border-slate-200 rounded-md mb-2" type="number" bind:value={currentProduct.cantidad} /></label>
    <div class="mt-4">
        <button on:click={handleSave} class="border-2 border-slate-200 rounded-md bg-emerald-200 p-2">{isEditing ? 'Actualizar' : 'Guardar'}</button>
        <button on:click={closeModal} class="border-2 border-slate-200 rounded-md bg-rose-400 p-2">Cancelar</button>
    </div>
</div>

<!-- Modal para añadir cantidad y precio a productos existentes -->
<div class="modal w-64 text-center {showAddExistingModal ? 'show' : ''}">
    <h2 class="font-bold mb-4">Añadir Producto Existente</h2>
    <label>
        Producto:
        <select class="border-2 border-slate-200 rounded-md mb-2" bind:value={selectedProductId}>
            <option value="" disabled selected>Selecciona un producto</option>
            {#each [...new Set(productos.map(producto => producto.nombre))] as productoNombre}
                <option value={productos.find(p => p.nombre === productoNombre).id}>{productoNombre}</option>
            {/each}
        </select>
    </label>
    <label>
        Cantidad:
        <input class="border-2 border-slate-200 rounded-md mb-2" type="number" min="1" bind:value={cantidadAdicional} />
    </label>
    <label>
        Precio:
        <input class="border-2 border-slate-200 rounded-md mb-2" type="number" min="1" bind:value={precioAdicional} />
    </label>
    <div class="mt-4">
        <button on:click={addExistingProduct} class="border-2 border-slate-200 rounded-md bg-emerald-200 p-2">Añadir</button>
        <button on:click={closeModal} class="border-2 border-slate-200 rounded-md bg-rose-400 p-2">Cancelar</button>
    </div>
</div>
