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
