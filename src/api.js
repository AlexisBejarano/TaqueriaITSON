export async function fetchData() {
    try {
        const response = await fetch('http://localhost:3000/api/data');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return [];
    }
}

export async function addData(producto) {
    try {
        await fetch('http://localhost:3000/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
    } catch (error) {
        console.error('Error adding data:', error);
    }
}

export async function updateData(producto) {
    try {
        await fetch(`http://localhost:3000/api/data/${producto.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(producto)
        });
    } catch (error) {
        console.error('Error updating data:', error);
    }
}

export async function deleteData(id) {
    try {
        await fetch(`http://localhost:3000/api/data/${id}`, {
            method: 'DELETE'
        });
    } catch (error) {
        console.error('Error deleting data:', error);
    }
}


//INDEX...
// Función para obtener los datos de la taquería
export async function fetchTaqueriaData() {
    try {
        const response = await fetch('http://localhost:3000/api/taqueria');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener datos de la taquería:', error);
        return {};
    }
}

// Función para actualizar los datos de la taquería
export async function updateTaqueriaData(taqueria) {
    try {
        await fetch(`http://localhost:3000/api/taqueria/${taqueria.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taqueria)
        });
    } catch (error) {
        console.error('Error al actualizar datos de la taquería:', error);
    }
}


//caja
// Función para obtener los tacos disponibles
export async function fetchTacos() {
    try {
        const response = await fetch('http://localhost:3000/api/caja');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los tacos:', error);
        return [];
    }
}

// Función para añadir un nuevo taco
export async function addTaco(taco) {
    try {
        await fetch('http://localhost:3000/api/caja', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taco)
        });
    } catch (error) {
        console.error('Error al añadir taco:', error);
    }
}

// Función para editar un taco
export async function updateTaco(taco) {
    try {
        await fetch(`http://localhost:3000/api/caja/${taco.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taco)
        });
    } catch (error) {
        console.error('Error al editar taco:', error);
    }
}

// Función para eliminar un taco
export async function deleteTaco(id) {
    try {
        await fetch(`http://localhost:3000/api/caja/${id}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error al eliminar taco:', error);
    }
}


