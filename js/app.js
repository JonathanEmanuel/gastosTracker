import { obtenerLocal, guardarLocal } from "./database/indexedDB.js";
const btnAbrirModal = document.querySelector('#btnAbrirModal');
const btnCerrarModal = document.querySelector('#btnCerrarModal');
const btnCancelar = document.querySelector('#btnCancelar');
const modalGasto = document.querySelector('#modalGasto');

const formGasto = document.querySelector('#formGasto');
const inputDescripcion = document.querySelector('#descripcion');
const inputMonto = document.querySelector('#monto');

const listaGastos = document.querySelector('#listaGastos');
const estadoVacio = document.querySelector('#estadoVacio');

let gastos = [];

navigator.serviceWorker.register('./sw.js');


const abrirModal = () => {
    modalGasto.classList.add('active');
    inputDescripcion.focus();
}

const cerrarModal = () => {
    modalGasto.classList.remove('active');
}

const renderGastos = (gastos) => {
    listaGastos.innerHTML = '';

    estadoVacio.style.display = gastos.length === 0 ? 'block' : 'none';

    gastos.forEach(gasto => {
        const fecha = new Date(gasto.fecha);
        const fechaHora = fecha.toLocaleString('es-AR');
        const li = document.createElement('li');
        li.classList.add('expense-item');

        li.innerHTML = `
        <div>
            <strong>${gasto.descripcion}</strong>
            <small>${gasto._id} - [ </small>
            <small>${fechaHora} ]</small>

        </div>

        <span>$${gasto.monto}</span>
        `;

        listaGastos.appendChild(li);
    });
}

async function iniciarApp() {
    gastos = await obtenerLocal();
    renderGastos(gastos);
}


btnAbrirModal.addEventListener('click', abrirModal);
btnCerrarModal.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

modalGasto.addEventListener('click', (event) => {
    if (event.target === modalGasto) {
        cerrarModal();
    }
});

formGasto.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nuevoGasto = {
        _id: Date.now(),
        descripcion: inputDescripcion.value.trim(),
        monto: Number(inputMonto.value),
        fecha: new Date().toISOString(),
        sincronizados: 'pendiente'
    };

    const resultado = await guardarLocal( nuevoGasto );

    gastos.push(nuevoGasto);
    renderGastos(gastos);

    formGasto.reset();
    cerrarModal();
});

iniciarApp();