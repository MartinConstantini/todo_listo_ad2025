console.log('Conectado')

const mensaje = document.getElementById('mensaje')
const btnCambiar = document.getElementById('btnCambiar')
const inputTarea = document.getElementById('inputTarea')
const btnAgregar = document.getElementById('btnAgregar')
const listaTareas = document.getElementById('listaTareas')

console.log('@@@ elelemtos =>', mensaje,btnCambiar,inputTarea ,btnAgregar,listaTareas)

btnCambiar.addEventListener('click',()=>{

    mensaje.textContent = 'Lo cambiamos con un click'

})


btnAgregar.addEventListener('click',() =>{

    const texto = inputTarea.value.trim()
    if(texto ===''){

        alert('Escribe antes de agregar')
        return

    }

    const nuevaTarea = document.createElement('li')

    nuevaTarea.textContent = texto 

    const btnBorrar = document.createElement('button')

    btnBorrar.textContent = 'X'

    btnBorrar.style.marginLeft = '10px'
    btnBorrar.addEventListener('click',()=>{

        listaTareas.removeChild(nuevaTarea)

    })

    nuevaTarea.appendChild(btnBorrar)
    listaTareas.appendChild(nuevaTarea)
    inputTarea.value = ''

})