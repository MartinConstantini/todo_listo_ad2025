console.log("Conectado...")

const mensaje = document.getElementById("mensaje")
const btnCambiar = document.getElementById("btnCambiar")
const inputTarea = document.getElementById("inputTarea")
const btnAgregar = document.getElementById("btnAgregar")
const listaTareas = document.getElementById("listaTareas")
const filtros = document.querySelectorAll('#filtros button')
const btnBorrarCompletadas = document.getElementById('btnBorrarCompletadas')
const contadorPendientes = document.getElementById('contadorPendientes')

// Mantén el filtro seleccionado entre recargas
let filtroActual = localStorage.getItem('filtroActual') || 'todas'

// Generador de IDs
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

// --- Persistencia y migración ---
const obtenerTareas = () => {
    const raw = localStorage.getItem('tareas')
    if (!raw) return []

    try {
        const data = JSON.parse(raw)

        // Caso 1: era un array de strings => migrar a objetos
        if (Array.isArray(data) && typeof data[0] === 'string') {
            const nuevo = data.map(texto => ({
                id: genId(),
                texto,
                completada: false
            }))
            localStorage.setItem('tareas', JSON.stringify(nuevo))
            return nuevo
        }

        // Caso 2: es array de objetos pero sin id => agregar id
        if (Array.isArray(data) && data[0] && !data[0].id) {
            const conId = data.map(t => ({
                id: genId(),
                texto: typeof t.texto === 'string' ? t.texto : String(t.texto ?? ''),
                completada: Boolean(t.completada)
            }))
            localStorage.setItem('tareas', JSON.stringify(conId))
            return conId
        }

        // Validación mínima
        if (Array.isArray(data)) return data
    } catch (error) {
        // Si el JSON está corrupto, lo reseteamos
        console.warn('JSON inválido en localStorage. Se reinicia la lista.', error)
        localStorage.removeItem('tareas')
        return []
    }

    return []
}

const guardarTareas = tareas => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
}

// --- Utilidades ---
const actualizarContadorPendientes = () => {
    const pendientes = obtenerTareas().filter(t => !t.completada).length
    contadorPendientes.textContent = pendientes === 1
        ? '1 tarea pendiente'
        : `${pendientes} tareas pendientes`
}

const setFiltroActual = (nuevo) => {
    filtroActual = nuevo
    localStorage.setItem('filtroActual', filtroActual)
    // Marcar visualmente el activo
    filtros.forEach(b => b.classList.remove('activo'))
    const btnActivo = Array.from(filtros).find(b => b.dataset.filtro === filtroActual)
    if (btnActivo) btnActivo.classList.add('activo')
}

// --- Render ---
const renderizarTareas = () => {
    listaTareas.innerHTML = ''
    const tareas = obtenerTareas()

    // Filtrado
    const tareasFiltradas = tareas.filter((tarea) => {
        if (filtroActual === 'pendientes') return !tarea.completada
        if (filtroActual === 'completadas') return tarea.completada
        return true // 'todas'
    })

    tareasFiltradas.forEach((tarea) => {
        const li = document.createElement('li')
        li.dataset.id = tarea.id

        const spanTexto = document.createElement('span')
        spanTexto.textContent = tarea.texto

        if (tarea.completada) {
            spanTexto.style.textDecoration = 'line-through'
            spanTexto.style.color = 'gray'
        }

        // Botón Eliminar
        const btnBorrar = document.createElement('button')
        btnBorrar.textContent = '❌'
        btnBorrar.title = 'Eliminar tarea'
        btnBorrar.addEventListener('click', () => {
            eliminarTareaPorId(tarea.id)
        })

        // Botón Completar / Deshacer
        const btnCompletar = document.createElement('button')
        btnCompletar.textContent = tarea.completada ? '↩' : '✅'
        btnCompletar.title = tarea.completada ? 'Marcar como pendiente' : 'Marcar como completada'
        btnCompletar.addEventListener('click', () => {
            toggleCompletarPorId(tarea.id)
        })

        li.appendChild(spanTexto)
        li.appendChild(btnBorrar)
        li.appendChild(btnCompletar)
        listaTareas.appendChild(li)
    })

    actualizarContadorPendientes()
}

// --- Acciones sobre tareas ---
const agregarTarea = texto => {
    const tareas = obtenerTareas()
    tareas.push({ id: genId(), texto, completada: false })
    guardarTareas(tareas)
    renderizarTareas()
}

const eliminarTareaPorId = id => {
    const tareas = obtenerTareas().filter(t => t.id !== id)
    guardarTareas(tareas)
    renderizarTareas()
}

const toggleCompletarPorId = id => {
    const tareas = obtenerTareas().map(t => {
        if (t.id === id) return { ...t, completada: !t.completada }
        return t
    })
    guardarTareas(tareas)
    renderizarTareas()
}

const borrarCompletadas = () => {
    const tareas = obtenerTareas().filter(t => !t.completada)
    guardarTareas(tareas)
    renderizarTareas()
}

// --- Eventos UI ---
btnCambiar.addEventListener('click', () => {
    mensaje.textContent = 'Lo cambiamos con un click'
})

btnAgregar.addEventListener('click', () => {
    const texto = inputTarea.value.trim()
    if (texto === '') {
        alert('Escribe algo antes de agregar la tarea.')
        return
    }
    agregarTarea(texto)
    inputTarea.value = ''
})

// Agregar con Enter
inputTarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        btnAgregar.click()
    }
})

// Borrar completadas con confirmación
btnBorrarCompletadas.addEventListener('click', () => {
    const completadas = obtenerTareas().filter(t => t.completada).length
    if (completadas === 0) {
        alert('No hay tareas completadas para borrar.')
        return
    }
    const ok = confirm(`Se eliminarán ${completadas} tarea(s) completada(s). ¿Continuar?`)
    if (ok) borrarCompletadas()
})

// Filtros
filtros.forEach((btn) => {
    btn.addEventListener('click', () => {
        const nuevo = btn.dataset.filtro || 'todas'
        setFiltroActual(nuevo)
        renderizarTareas()
    })
})

// --- Inicio ---
document.addEventListener('DOMContentLoaded', () => {
    // Asegura que el botón activo coincida con el filtro guardado
    setFiltroActual(filtroActual)
    renderizarTareas()
})
