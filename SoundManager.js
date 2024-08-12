let bgmusic;
let click;
let snapSound;

export function preloadSounds(scene) {
  // Preload audio files
  scene.load.audio('bgmusic', './assets/sfx/bgmusic.mp3');
  scene.load.audio('click', './assets/sfx/select.wav');
scene.load.audio('snapSound', './assets/sfx/gameclick.wav');

}

export function createSounds(scene) {
  // Create sound objects
  bgmusic = scene.sound.add('bgmusic');
  click = scene.sound.add('click');
  snapSound = scene.sound.add('snapSound');

  // Play background music on loop
  bgmusic.play({ loop: true });
}

export function playClickSound() {
  if (click) {
    click.play();
  }
}

export function playSnapSound() {
    if (snapSound) {
      snapSound.play();
    }
  }

export function stopBackgroundMusic() {
  if (bgmusic) {
    bgmusic.stop();
  }
}
