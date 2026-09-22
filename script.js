const video = document.getElementById("backgroundVideo");
const playbackRate = 0.5;

function applyPlaybackRate() {
  video.defaultPlaybackRate = playbackRate;
  video.playbackRate = playbackRate;
  video.muted = true;
  video.volume = 0;
}

applyPlaybackRate();

async function playMutedFallback() {
  applyPlaybackRate();
  video.muted = true;
  video.volume = 0;

  try {
    await video.play();
    applyPlaybackRate();
  } catch (error) {
    // The browser may block autoplay; the video can still start from native heuristics later.
  }
}

video.addEventListener("loadedmetadata", applyPlaybackRate);
video.addEventListener("play", applyPlaybackRate);
video.addEventListener("ratechange", () => {
  if (video.playbackRate !== playbackRate) {
    applyPlaybackRate();
  }
});

window.addEventListener("load", async () => {
  await playMutedFallback();
});
