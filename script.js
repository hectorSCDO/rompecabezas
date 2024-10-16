const piezas = document.getElementById('piezas');
const zonaArmado = document.getElementById('zona-armado');
const iniciarJuegoButton = document.getElementById('iniciar-juego');
const dificultadSelect = document.getElementById('nivel-dificultad');

let totalPiezas = 0;
let piezasColocadas = 0;
let posicionesOcupadas = [];

// Función para iniciar el juego
iniciarJuegoButton.addEventListener('click', () => {
    totalPiezas = parseInt(dificultadSelect.value);
    piezasColocadas = 0;
    posicionesOcupadas = Array(totalPiezas * totalPiezas).fill(false); // Reiniciar posiciones ocupadas
    piezas.innerHTML = ''; // Limpiar piezas anteriores
    zonaArmado.innerHTML = ''; // Limpiar zona de armado
    crearPiezas(); // Crear nuevas piezas
});

// Crear las piezas del rompecabezas
function crearPiezas() {
    const imagenBase = 'url("images/arandano.jpg")';
    const dimension = totalPiezas * 100; // Dimensión de la zona de armado

    // Establecer dimensiones de la zona de armado
    zonaArmado.style.width = `${dimension}px`;
    zonaArmado.style.height = `${dimension}px`;

    // Crear piezas
    for (let i = 0; i < totalPiezas * totalPiezas; i++) {
        const pieza = document.createElement('div');
        pieza.classList.add('pieza');
        pieza.setAttribute('draggable', 'true');
        pieza.setAttribute('data-index', i); 
        
        // Posicionar cada pieza en la imagen original
        pieza.style.backgroundImage = imagenBase;
        pieza.style.backgroundSize = `${dimension}px ${dimension}px`; // Tamaño total de la imagen
        pieza.style.backgroundPosition = `${-(i % totalPiezas) * 100}px ${-Math.floor(i / totalPiezas) * 100}px`;
        
        pieza.addEventListener('dragstart', dragStart);
        
        piezas.appendChild(pieza); // Agrega las piezas a la zona de piezas
    }
}

let draggedPiece = null; // Guardar la pieza arrastrada
let previousIndex = null; // Para recordar la posición anterior de la pieza

// Función para iniciar el arrastre de la pieza
function dragStart(e) {
    draggedPiece = e.target; // Guardar la pieza que se está arrastrando
    previousIndex = parseInt(draggedPiece.getAttribute('data-index')); // Guardar la posición anterior
}

// Permitir que se suelten piezas en la zona de armado
zonaArmado.addEventListener('dragover', function(e) {
    e.preventDefault();
});

// Función para manejar cuando se suelta la pieza en la zona de armado
zonaArmado.addEventListener('drop', function(e) {
    e.preventDefault();
    
    // Verifica que haya una pieza siendo arrastrada
    if (draggedPiece) {
        // Obtener la posición de la zona de armado
        const rect = zonaArmado.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const col = Math.floor(x / 100); // Calcular la columna
        const row = Math.floor(y / 100); // Calcular la fila

        // Calcular el índice
        const index = (row * totalPiezas) + col; // Número de columnas

        // Si la pieza se mueve a una nueva posición
        if (!posicionesOcupadas[index] || previousIndex === index) {
            // Si estaba ocupada y se está moviendo de vuelta, no se considera ocupada
            if (posicionesOcupadas[previousIndex] && previousIndex !== index) {
                posicionesOcupadas[previousIndex] = false; // Liberar la posición anterior
            }

            // Crear una nueva pieza en la zona de armado
            draggedPiece.style.position = 'absolute';
            draggedPiece.style.left = `${col * 100}px`;
            draggedPiece.style.top = `${row * 100}px`;

            zonaArmado.appendChild(draggedPiece);
            posicionesOcupadas[index] = true; // Marcar la nueva posición como ocupada
            
            // Verifica si la pieza está en la posición correcta
            checkPuzzleCompletion(draggedPiece, col, row);
        } else {
            alert('Esta posición ya está ocupada. Elige otra.');
        }
    
        draggedPiece = null; // Resetear la pieza arrastrada
    }
});

// Función para verificar si el rompecabezas está completo
function checkPuzzleCompletion(piece, col, row) {
    // Calcular el índice de la posición en la zona de armado
    const index = (row * totalPiezas) + col; // Número de columnas
    const piezaCorrectaIndex = parseInt(piece.getAttribute('data-index')); // Obtener el índice correcto de la pieza

    console.log(`Colocando pieza en: (${col}, ${row}) con índice: ${index}, pieza correcta tiene índice: ${piezaCorrectaIndex}`);

    // Verificar si la pieza arrastrada es la correcta
    if (index === piezaCorrectaIndex) {
        piezasColocadas++;
        console.log(`Pieza colocada correctamente. Total colocadas: ${piezasColocadas}`);
    } else {
        console.log(`Pieza colocada incorrectamente. Total colocadas: ${piezasColocadas}`);
    }

    // Verificar si se completaron todas las piezas
    if (piezasColocadas === totalPiezas * totalPiezas) {
        alert('¡Felicidades! Has completado el rompecabezas.');
    }
}
