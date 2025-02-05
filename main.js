/*********************************
 * main.js
 * - Control de escenas, reproducción de videos,
 *   timeout de inactividad y generación de QR.
 *********************************/

// Variable global para timeout de inactividad
let inactivityTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  // No forzamos video.play() aquí, 
  // pues en mute ya se reproducirá solo sin bloqueo.

  // Detectar interacción para resetear el temporizador de inactividad
  ['click', 'touchstart', 'mousemove', 'keydown'].forEach(evt => {
    document.addEventListener(evt, resetInactivityTimer);
  });

  // Botón "Vivir la experiencia" => pasa a Escena 2
  document.getElementById('btnIniciar')
          .addEventListener('click', () => {
            switchScene('escena1', 'escena2');
          });

  // Botones del menú (Escena 2)
  document.querySelectorAll('.grid-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetScene = e.target.getAttribute('data-target');
      switchScene('escena2', targetScene);
      playSceneVideo(targetScene);
    });
  });

  // Generar los QRs en cada escena
  generateAllQRCodes();

  // Iniciar la vigilancia de inactividad
  resetInactivityTimer();
});

/**
 * Cambia de una escena a otra
 * @param {string} from - Escena que se oculta
 * @param {string} to   - Escena que se muestra
 */
function switchScene(from, to) {
  document.getElementById(from).classList.remove('active');
  document.getElementById(to).classList.add('active');
  resetInactivityTimer();
}

/**
 * Reproduce el video de la escena dada y, 
 * cuando termina, si pasan 15s sin interacción => volver a intro.
 */
function playSceneVideo(sceneId) {
  const scene = document.getElementById(sceneId);
  if (!scene) return;

  const video = scene.querySelector('video');
  if (video) {
    // Empezar el video desde cero
    video.currentTime = 0;
    video.play().catch(err => console.warn(err));

    // Al terminar el video, se inicia el conteo de 15s de inactividad
    video.onended = () => {
      resetInactivityTimer(); 
      inactivityTimer = setTimeout(() => {
        goToIntro();
      }, 15000);
    };
  }
}

/**
 * Genera los QRs de cada sección (Ventajas, Funcionalidades, EstiloVida, Receta).
 */
function generateAllQRCodes() {
  const scenes = ['Ventajas', 'Funcionalidades', 'EstiloVida', 'Receta'];
  scenes.forEach(scene => {
    const qrDiv = document.getElementById(`qr${scene}`);
    if (qrDiv) {
      new QRCode(qrDiv, {
        text: 'https://www.blackanddeckercolombia.com/licuadora-black-decker-digital-potente-1-5l-bl0976-1mdla/',
        width: 100,
        height: 100
      });
    }
  });
}

/**
 * Resetea el timer de inactividad en cada interacción.
 */
function resetInactivityTimer() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  // Aquí podríamos iniciar otro timeout global si quieres 
  // que invariablemente tras 15s se regrese a intro, 
  // pero en este ejemplo solo se inicia tras terminar un video.
}

/**
 * Vuelve a la escena 1 manualmente (sin recargar la página).
 */
function goToIntro() {
  // Ocultar todas las escenas y mostrar la 1
  document.querySelectorAll('.escena').forEach(e => e.classList.remove('active'));
  document.getElementById('escena1').classList.add('active');

  // Reiniciar video intro (en silencio, por política de autoplay)
  const introVideo = document.getElementById('introVideo');
  introVideo.currentTime = 0;
  introVideo.play().catch(err => console.warn(err));
}
