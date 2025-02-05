/*********************************
 * main.js
 * Manejo de escenas, reproducción de videos,
 * y timeout de inactividad por escena.
 *********************************/

// 1. Definir los tiempos de inactividad para cada escena (en milisegundos).
const SCENE_INACTIVITY_LIMITS = {
  escena1: 55000,         // 55 seg en la intro
  escena2: 15000,         // 15 seg menú
  ventajas: 70000,        // 70 seg Ventajas
  funcionalidades: 65000, // 65 seg Funcionalidades
  estiloVida: 40000,      // 40 seg Estilo de vida
  receta: 70000           // 70 seg Receta
};

// 2. Variables globales
let inactivityTimer = null;
let currentScene = 'escena1'; // Empezamos en escena1

document.addEventListener('DOMContentLoaded', () => {
  // Intentar reproducir con audio en la Escena 1 (puede ser bloqueado en algunos navegadores).
  const introVideo = document.getElementById('introVideo');
  if (introVideo) {
    introVideo.play().catch(err => console.warn('Autoplay con audio bloqueado:', err));
  }

  // Detectar interacción para resetear la inactividad
  ['click', 'touchstart', 'mousemove', 'keydown'].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer);
  });

  // Botón para pasar a Escena 2
  const btnIniciar = document.getElementById('btnIniciar');
  if (btnIniciar) {
    btnIniciar.addEventListener('click', () => {
      switchScene('escena1', 'escena2');
    });
  }

  // Botones del menú (Escena 2)
  document.querySelectorAll('.grid-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetScene = e.target.getAttribute('data-target');
      switchScene('escena2', targetScene);
      playSceneVideo(targetScene);
    });
  });

  // Botones "Volver" en las escenas
  document.querySelectorAll('.btn-volver').forEach(btn => {
    btn.addEventListener('click', () => {
      // Regresa a Escena 2 (el menú)
      switchScene(currentScene, 'escena2');
    });
  });

  // Generar QRs
  generateAllQRCodes();

  // Iniciar timer de inactividad (escena1)
  resetInactivityTimer();
});

/**
 * Cambia de una escena a otra.
 */
function switchScene(from, to) {
  // Pausar todos los videos para que no se queden sonando
  pauseAllVideos();

  // Quitar 'active' de la escena anterior
  document.getElementById(from)?.classList.remove('active');
  // Mostrar la escena nueva
  document.getElementById(to)?.classList.add('active');

  currentScene = to;
  resetInactivityTimer();
}

/**
 * Pausa todos los videos del DOM
 */
function pauseAllVideos() {
  document.querySelectorAll('video').forEach(video => {
    video.pause();
    video.currentTime = 0;
  });
}

/**
 * Reproduce el video de la escena dada
 */
function playSceneVideo(sceneId) {
  const scene = document.getElementById(sceneId);
  if (!scene) return;

  const video = scene.querySelector('video');
  if (video) {
    video.currentTime = 0;
    video.play().catch(err => console.warn(err));
  }
}

/**
 * Generar QRs en las escenas que los tengan
 */
function generateAllQRCodes() {
  // Nuevo link con utms, etc.
  const newLink = "https://www.blackanddeckercolombia.com/licuadora-black-decker-digital-potente-1-5l-bl0976-1mdla/p?utm_source=google&utm_medium=cpc_pmax&utm_campaign=sisr_prueba&utm_content=pmax&gad_source=1&gclid=CjwKCAiAtYy9BhBcEiwANWQQL4cxgaTZSOXOa7rachiGUWP6spsbMFw7u3ZsZBoRSS4CnyQrye4mSRoCiYQQAvD_BwE";

  ['Ventajas','Funcionalidades','EstiloVida','Receta'].forEach(scene => {
    const qrDiv = document.getElementById(`qr${scene}`);
    if (qrDiv) {
      new QRCode(qrDiv, {
        text: newLink,
        width: 150,
        height: 150
      });
    }
  });
}

/**
 * Resetea el timer de inactividad según la escena actual
 */
function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }

  const timeLimit = SCENE_INACTIVITY_LIMITS[currentScene] || 15000;
  inactivityTimer = setTimeout(() => {
    goToIntro();
  }, timeLimit);
}

/**
 * Regresa a escena1 con audio (si el navegador lo permite)
 */
function goToIntro() {
  pauseAllVideos();

  // Ocultar todas las escenas
  document.querySelectorAll('.escena').forEach(e => e.classList.remove('active'));

  // Mostrar Escena1
  document.getElementById('escena1')?.classList.add('active');
  currentScene = 'escena1';

  // Forzar reproducción del introVideo con audio
  const introVideo = document.getElementById('introVideo');
  if (introVideo) {
    introVideo.currentTime = 0;
    introVideo.play().catch(err => console.warn('Autoplay con audio bloqueado:', err));
  }

  resetInactivityTimer();
}
