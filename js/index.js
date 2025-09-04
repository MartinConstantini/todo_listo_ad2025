console.log("Conectado...")

const mensaje = document.getElementById("mensaje")
const btnCambiar = document.getElementById("btnCambiar")
const inputTarea = document.getElementById("inputTarea")
const btnAgregar = document.getElementById("btnAgregar")
const listaTareas = document.getElementById("listaTareas")

const obtenerTareas = () => {
    return JSON.parse(localStorage.getItem('tareas')) || []
}

const guardarTareas = (tareas) => {
    localStorage.setItem('tareas', JSON.stringify(tareas))
}

const eliminarTarea = (index) => {
    const tareas = obtenerTareas()
    tareas.splice(index, 1)
    guardarTareas(tareas)
    renderizarTareas()
}

const renderizarTareas = () => {
    listaTareas.innerHTML = ''
    const tareas = obtenerTareas()

    tareas.forEach((texto, index) => {
        const nuevaTarea = document.createElement('li')
        nuevaTarea.textContent = texto

        const btnBorrar = document.createElement('button')
        btnBorrar.textContent = '❌'
        btnBorrar.style.marginLeft = '10px'
        btnBorrar.addEventListener('click', () => {
            eliminarTarea(index)
        })

        nuevaTarea.appendChild(btnBorrar)
        listaTareas.appendChild(nuevaTarea)
    })
}

btnCambiar.addEventListener('click', () =>{
    mensaje.textContent = 'Lo cambiamos con un click'
})

btnAgregar.addEventListener('click', () => {
    const texto = inputTarea.value.trim()
    if(texto === ''){
        alert('Escribe algo antes de agregar la tarea.')
        return
    }

    const tareas = obtenerTareas()
    tareas.push(texto)
    guardarTareas(tareas)
    renderizarTareas()
    inputTarea.value = ''
})

// Render inicial al cargar
renderizarTareas()
