// Obtiene referencias a los elementos HTML relevantes
const lyricsInput = document.getElementById("lyricsInput"); // Textarea para ingresar las letras de la canción
const addLyricsButton = document.getElementById("addLyricsButton"); // Botón para pasar a la etapa 2
const lyricsContainer = document.getElementById("lyricsContainer"); // Contenedor para mostrar los renglones de la canción en la etapa 2
const startSongButton = document.getElementById("startSongButton"); // Botón para iniciar la canción y pasar a la etapa 3
const lyricsSlider = document.getElementById("lyricsSlider"); // Elemento que muestra los renglones de la canción en la etapa 3
const stopSongButton = document.getElementById("stopSongButton"); // Botón para detener/continuar la canción
const loopCheckbox = document.getElementById("loopCheckbox"); // Checkbox para activar/desactivar el bucle

// Arreglo para almacenar los datos de los renglones de la canción
let lyricsData = [];

// Variables para el control del intervalo
let currentIndex = 0; // Índice actual del renglón de la canción
let currentTiming = 0; // Tiempo actual en segundos
let intervalId; // ID del intervalo

// Evento click en el botón "Agregar letras" (pasa a la etapa 2)
addLyricsButton.addEventListener("click", renderLyricsStage2);

// Evento click en el botón "Iniciar canción" (pasa a la etapa 3)
startSongButton.addEventListener("click", renderLyricsStage3);

// Evento click en el botón "Detener/Continuar"
stopSongButton.addEventListener("click", toggleSong);

// Función para renderizar la etapa 2
function renderLyricsStage2() {
  const lyrics = lyricsInput.value.trim(); // Obtiene el texto ingresado en el textarea y elimina los espacios en blanco al inicio y al final
  if (lyrics === "") {
    return; // Si no se ingresó ningún texto, no hace nada y sale de la función
  }

  const lines = lyrics.split("\n"); // Divide el texto en líneas separadas por salto de línea
  lyricsData = []; // Reinicia el arreglo de datos de los renglones

  let lyricsHTML = ""; // Variable para almacenar el HTML generado

  // Recorre cada línea de texto ingresada
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim(); // Elimina los espacios en blanco al inicio y al final de la línea
    if (line !== "") {
      const timingInputId = `timingInput${i}`; // Genera un ID único para el input de tiempo de cada renglón
      lyricsHTML += `<div class="lyricLineContainer">
                      <p class="lyricLine">${line}</p>
                      <input type="text" class="timingInput" id="${timingInputId}" />
                    </div>`; // Crea el HTML para mostrar el renglón y el input de tiempo
      lyricsData.push({
        text: line,
        timingInputId: timingInputId,
      }); // Agrega los datos del renglón al arreglo lyricsData
    }
  }

  lyricsContainer.innerHTML = lyricsHTML; // Muestra el HTML generado en el contenedor de renglones
  document.getElementById("lyricsStage1").style.display = "none"; // Oculta la etapa 1
  document.getElementById("lyricsStage2").style.display = "block"; // Muestra la etapa 2
}

// Función para obtener el mayor endTime de los renglones
function getMaxEndTime() {
  let maxEndTime = 0;
  for (const lyric of lyricsData) {
    const timingInput = document.getElementById(lyric.timingInputId);
    const timingValue = timingInput.value.trim();
    if (timingValue !== "") {
      const [, end] = timingValue.split("-");
      const endTime = parseInt(end);
      if (!isNaN(endTime) && endTime > maxEndTime) {
        maxEndTime = endTime;
      }
    }
  }

  return maxEndTime;
}

// Función para renderizar la etapa 3
function renderLyricsStage3() {
  document.getElementById("lyricsStage2").style.display = "none"; // Oculta la etapa 2
  document.getElementById("lyricsStage3").style.display = "block"; // Muestra la etapa 3

  currentIndex = 0; // Reinicia el índice del renglón
  currentTiming = 0; // Reinicia el tiempo actual

  const maxEndTime = getMaxEndTime(); // Obtiene el mayor endTime de los renglones

  // Función que se ejecuta cada segundo para mostrar el renglón correspondiente
  intervalId = setInterval(() => {
    const currentLyric = lyricsData[currentIndex]; // Obtiene el objeto del renglón actual

    const timingInput = document.getElementById(currentLyric.timingInputId); // Obtiene el input de tiempo del renglón actual
    const timingValue = timingInput.value.trim(); // Obtiene el valor del input y elimina los espacios en blanco al inicio y al final

    // Verifica si se ingresó un tiempo válido en el input
    if (timingValue !== "") {
      const [start, end] = timingValue.split("-"); // Divide el valor en inicio y fin
      const startTime = parseInt(start); // Convierte el inicio en un número entero
      const endTime = parseInt(end); // Convierte el fin en un número entero

      // Verifica si   el tiempo actual está dentro del rango del renglón actual
      if (
        !isNaN(startTime) &&
        !isNaN(endTime) &&
        currentTiming >= startTime &&
        currentTiming <= endTime
      ) {
        // Si el tiempo está dentro del rango, muestra el renglón correspondiente

        lyricsSlider.textContent = currentLyric.text;
      }
      if (currentTiming === endTime) {
        currentIndex++;
      }
    }

    currentTiming++; // Incrementa el tiempo actual
    if (currentIndex) console.log(currentTiming);
    // Verifica si se llegó al final de los renglones
    if (currentTiming > maxEndTime) {
      // Verifica si el bucle está activado (checkbox marcado)
      if (loopCheckbox.checked) {
        currentIndex = 0; // Reinicia el índice para volver al inicio
        currentTiming = 0; // Reinicia el tiempo para volver al inicio
      } else {
        clearInterval(intervalId); // Detiene la ejecución del intervalo
        document.getElementById("lyricsStage3").style.display = "none"; // Oculta la etapa 3
        document.getElementById("lyricsStage1").style.display = "block"; // Muestra la etapa 1
      }
    }
  }, 1000); // Intervalo de 1 segundo
}

// Función para detener/continuar la canción
function toggleSong() {
  if (stopSongButton.textContent === "Detener") {
    stopSongButton.textContent = "Continuar"; // Cambia el texto del botón a "Continuar"
    clearInterval(intervalId); // Detiene la ejecución del intervalo
  } else {
    stopSongButton.textContent = "Detener"; // Cambia el texto del botón a "Detener"
    renderLyricsStage3(); // Vuelve a llamar a la función para continuar la canción
  }
}
