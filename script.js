const video = document.getElementById("backgroundVideo");
const audioGate = document.getElementById("audioGate");
const soundToggle = document.getElementById("soundToggle");
const playbackRate = 0.5;

let audioEnabled = false;
let firstInteractionHandled = false;

function applyPlaybackRate() {
  video.defaultPlaybackRate = playbackRate;
  video.playbackRate = playbackRate;
}

applyPlaybackRate();

function setSoundToggleState(label, ariaLabel) {
  soundToggle.setAttribute("aria-label", ariaLabel);
  soundToggle.dataset.state = label;
}

async function playWithAudio() {
  applyPlaybackRate();
  video.muted = false;
  video.volume = 1;

  try {
    await video.play();
    applyPlaybackRate();
    audioEnabled = true;
    audioGate.classList.add("hidden");
    setSoundToggleState("Sound On", "Sesi kapat");
  } catch (error) {
    audioEnabled = false;
    audioGate.classList.remove("hidden");
    setSoundToggleState("Enable Sound", "Sesi aç");
  }
}

async function playMutedFallback() {
  applyPlaybackRate();
  video.muted = true;

  try {
    await video.play();
    applyPlaybackRate();
  } catch (error) {
    // If even muted autoplay fails, the overlay remains as the manual start path.
    audioGate.classList.remove("hidden");
  }
}

audioGate.addEventListener("click", async () => {
  await playWithAudio();
});

soundToggle.addEventListener("click", async () => {
  if (audioEnabled) {
    video.muted = true;
    audioEnabled = false;
    setSoundToggleState("Sound Off", "Sesi aç");
    return;
  }

  await playWithAudio();
});

video.addEventListener("loadedmetadata", applyPlaybackRate);
video.addEventListener("play", applyPlaybackRate);
video.addEventListener("ratechange", () => {
  if (video.playbackRate !== playbackRate) {
    applyPlaybackRate();
  }
});

document.addEventListener(
  "pointerdown",
  async (event) => {
    if (firstInteractionHandled || event.target.closest("#soundToggle")) {
      return;
    }

    firstInteractionHandled = true;
    await playWithAudio();
  },
  { capture: true }
);

window.addEventListener("load", async () => {
  await playWithAudio();

  if (!audioEnabled) {
    await playMutedFallback();
  }
});
