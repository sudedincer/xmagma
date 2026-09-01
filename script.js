const video = document.getElementById("backgroundVideo");
const audioGate = document.getElementById("audioGate");
const soundToggle = document.getElementById("soundToggle");

let audioEnabled = false;

function setSoundToggleState(label, ariaLabel) {
  soundToggle.setAttribute("aria-label", ariaLabel);
  soundToggle.dataset.state = label;
}

async function playWithAudio() {
  video.muted = false;
  video.volume = 1;

  try {
    await video.play();
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
  video.muted = true;

  try {
    await video.play();
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

window.addEventListener("load", async () => {
  setSoundToggleState("Sound Off", "Sesi aç");
  await playMutedFallback();
});
