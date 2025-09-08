console.log("Conectado...")

const mensaje = document.getElementById("mensaje")
const btnCambiar = document.getElementById("btnCambiar")
const inputTarea = document.getElementById("inputTarea")
const btnAgregar = document.getElementById("btnAgregar")
const listaTareas = document.getElementById("listaTareas")

const obtenerTareas = () => {
    return JSON.parse(localStorage.getItem('tareas')) || []
}

const renderizarTareas = () => {
    listaTareas.innerHTML = ''
    const tareas = obtenerTareas()

    tareas.forEach((tarea, index) => {
        const nuevaTarea = document.createElement('li')

        const spanTexto = document.createElement('span')
        spanTexto.textContent = tarea.texto

        // Saber si la tarea está completada
        if(tarea.completada){
            spanTexto.style.textDecoration = 'line-through'
            spanTexto.style.color = 'gray'
        }

        const btnCompletar = document.createElement('button')
        btnCompletar.textContent = tarea.completada ? '↩' : '✅'
        btnCompletar.style.marginLeft = '10px'
        btnCompletar.addEventListener('click', () => {
            toggleCompletar(index)
        })

        const btnBorrar = document.createElement('button')
        btnBorrar.textContent = '❌'
        btnBorrar.style.marginLeft = '10px'
        btnBorrar.addEventListener('click', () => {
            eliminarTarea(index)
        })

        nuevaTarea.appendChild(spanTexto)
        nuevaTarea.appendChild(btnBorrar)
        nuevaTarea.appendChild(btnCompletar)
        listaTareas.appendChild(nuevaTarea)
    })
}

const agregarTarea = texto => {
    const tareas = obtenerTareas()
    tareas.push({texto, completada: false})
    guardarTareas(tareas)
    renderizarTareas()
} 

const guardarTareas = tareas => {
        localStorage.setItem('tareas', JSON.stringify(tareas))
    }


const eliminarTarea = index => {
    const tareas = obtenerTareas()
    tareas.splice(index, 1)
    guardarTareas(tareas)
    renderizarTareas()
}

const toggleCompletar = (index) => {
    const tareas = obtenerTareas()
    tareas[index].completada = !tareas[index].completada
    guardarTareas(tareas)
    renderizarTareas()
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

    agregarTarea(texto)
    inputTarea.value = ''

})

document.addEventListener('DOMContentLoaded', () => {
        renderizarTareas()
    })


/*

    const nuevaTarea = document.createElement('li')
    nuevaTarea.textContent = texto

    const btnBorrar = document.createElement('button')
    btnBorrar.textContent = '❌'
    btnBorrar.style.marginLeft = '10px'
    btnBorrar.addEventListener('click', () => {
        listaTareas.removeChild(nuevaTarea)
    })

    nuevaTarea.appendChild(btnBorrar)
    listaTareas.appendChild(nuevaTarea)

*/