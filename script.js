// Кнопка музыки. Отдельный JavaScript нужен только для неё:
// браузеры не разрешают запускать звук на сайте без нажатия человека.

const music = document.getElementById("bgMusic");
// Громкость музыки: 0 — без звука, 1 — максимум.
const MUSIC_VOLUME = 0.35;

if (music) {
  music.volume = MUSIC_VOLUME;
}
const musicButton = document.getElementById("musicButton");
const musicStatus = document.getElementById("musicStatus");
const bgVideo = document.querySelector(".bg-video");

function updateMusicButton() {
  if (!music || !musicButton) return;

  const isPlaying = !music.paused && !music.ended;
  musicButton.setAttribute("aria-pressed", String(isPlaying));
musicButton.textContent = isPlaying ? "❚❚" : "Сначала тык сюда";
}

function showMusicFileError() {
  if (musicStatus) {
    musicStatus.textContent = "Не удалось включить музыку. Проверь файл: images/песня.mp3";
  }
  updateMusicButton();
}

if (music && musicButton && musicStatus) {
  musicButton.addEventListener("click", async () => {
    if (!music.paused) {
      music.pause();
      musicStatus.textContent = "";
      updateMusicButton();
      return;
    }

    musicButton.disabled = true;
    musicStatus.textContent = "Включаю музыку…";

    try {
      await music.play();

      // Заодно пробуем запустить фоновое видео, если браузер его остановил.
      if (bgVideo && bgVideo.paused) {
        bgVideo.play().catch(() => {});
      }

      musicStatus.textContent = "❚❚";
    } catch (error) {
      showMusicFileError();
    } finally {
      musicButton.disabled = false;
      updateMusicButton();
    }
  });

  music.addEventListener("play", updateMusicButton);
  music.addEventListener("pause", updateMusicButton);
  music.addEventListener("ended", () => {
    musicStatus.textContent = "Музыка закончилась. Нажми кнопку, чтобы послушать ещё раз.";
    updateMusicButton();
  });
  music.addEventListener("error", showMusicFileError);

  // Если файл уже успел не загрузиться до подключения скрипта.
  if (music.error) {
    showMusicFileError();
  }

  updateMusicButton();
}
// Увеличение снимков 1–3 по нажатию.
const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const snapshotButtons = document.querySelectorAll(".snapshot-button");
let lastSnapshotButton = null;

function closeLightbox() {
  if (imageLightbox && imageLightbox.open) {
    imageLightbox.close();
  }
}

if (imageLightbox && lightboxImage && lightboxClose) {
  snapshotButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const image = button.querySelector("img");
      if (!image) return;

      lastSnapshotButton = button;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;

      // Если старый браузер не умеет <dialog>, открываем снимок отдельной вкладкой.
      if (typeof imageLightbox.showModal !== "function") {
        window.open(lightboxImage.src, "_blank");
        return;
      }

      imageLightbox.showModal();
      document.body.classList.add("lightbox-open");
      lightboxClose.focus({ preventScroll: true });
    });
  });

  // Крестик в правом верхнем углу.
  lightboxClose.addEventListener("click", closeLightbox);

  // Закрытие по нажатию на тёмную область вокруг снимка.
  imageLightbox.addEventListener("click", (event) => {
    if (event.target === imageLightbox) {
      closeLightbox();
    }
  });

  imageLightbox.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");
    lightboxImage.alt = "";

    if (lastSnapshotButton) {
      lastSnapshotButton.focus({ preventScroll: true });
      lastSnapshotButton = null;
    }
  });
}