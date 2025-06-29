let scrolled = false;
const sidebar = document.querySelector('.sidebar');
let startY;
window.addEventListener('wheel', (e) => {
  if (!scrolled && e.deltaY > 0) {
    document.getElementById('container').style.transform = 'translateY(-100vh)';
    scrolled = true;
    setTimeout(() => {
      sidebar.classList.add('show');
    }, 500);
  } else if (scrolled && e.deltaY < 0) {
    const mainContent = document.querySelector('.main-transition-content');
    if (mainContent.scrollTop === 0) {
      document.getElementById('container').style.transform = 'translateY(0)';
      scrolled = false;
      sidebar.classList.remove('show');
    }
  }
});
window.addEventListener('touchstart', e => {
  startY = e.touches[0].clientY;
});
window.addEventListener('touchend', e => {
  let endY = e.changedTouches[0].clientY;
  if (!scrolled && startY - endY > 50) {
    document.getElementById('container').style.transform = 'translateY(-100vh)';
    scrolled = true;
    setTimeout(() => {
      sidebar.classList.add('show');
    }, 500);
  } else if (scrolled && endY - startY > 50) {
    const mainContent = document.querySelector('.main-transition-content');
    if (mainContent.scrollTop === 0) {
      document.getElementById('container').style.transform = 'translateY(0)';
      scrolled = false;
      sidebar.classList.remove('show');
    }
  }
});
document.querySelectorAll('.entry').forEach(entry => {
  entry.addEventListener('mouseenter', () => {
    entry.style.animationPlayState = 'paused';
  });
  entry.addEventListener('mouseleave', () => {
    entry.style.animationPlayState = 'running';
  });
});
let currentLineIndex = -1;
let isLyricsPlaying = false;
let lyricsStartTime = 0;
let lyricsPausedTime = 0;
let lyricsAnimationId;
const lyricsLines = document.querySelectorAll('.lyrics-line');
const progressBar = document.getElementById('progressBar');
const lyricsScrollContent = document.getElementById('lyricsScrollContent');
const totalDuration = 30; 
const lyricsData = Array.from(lyricsLines).map(line => ({
  element: line,
  time: parseFloat(line.dataset.time)
}));
function updateLyricsDisplay() {
  if (!isLyricsPlaying) return;
  const currentTime = (Date.now() - lyricsStartTime) / 1000 + lyricsPausedTime;
  const progress = Math.min((currentTime / totalDuration) * 100, 100);
  if (progressBar) {
    progressBar.style.width = progress + '%';
  }
  let newCurrentIndex = -1;
  for (let i = 0; i < lyricsData.length; i++) {
    if (currentTime >= lyricsData[i].time) {
      newCurrentIndex = i;
    } else {
      break;
    }
  }
  if (newCurrentIndex !== currentLineIndex) {
    currentLineIndex = newCurrentIndex;
    updateLyricsStyles();
    scrollToCurrentLine();
  }
  if (currentTime >= totalDuration) {
    isLyricsPlaying = false;
    const playBtn = document.querySelector('.control-btn');
    if (playBtn) playBtn.textContent = '播放';
    return;
  }
  lyricsAnimationId = requestAnimationFrame(updateLyricsDisplay);
}
function updateLyricsStyles() {
  lyricsLines.forEach((line, index) => {
    line.classList.remove('current', 'next', 'prev', 'far');  
    if (index === currentLineIndex) {
      line.classList.add('current');
    } else if (index === currentLineIndex + 1) {
      line.classList.add('next');
    } else if (index === currentLineIndex - 1) {
      line.classList.add('prev');
    } else {
      line.classList.add('far');
    }
  });
}
function scrollToCurrentLine() {
  if (currentLineIndex >= 0 && lyricsScrollContent) {
    const currentLine = lyricsLines[currentLineIndex];
    if (currentLine) {
      const containerHeight = 250;
      const lineOffsetTop = currentLine.offsetTop;
      const lineHeight = currentLine.offsetHeight;
      const scrollTop = lineOffsetTop - (containerHeight / 2) + (lineHeight / 2);
      lyricsScrollContent.style.transform = `translateY(-${Math.max(0, scrollTop)}px)`;
    }
  }
}
function playLyrics() {
  const btn = document.querySelector('.control-btn');
  if (!isLyricsPlaying) {
    isLyricsPlaying = true;
    lyricsStartTime = Date.now();
    if (btn) btn.textContent = '暂停';
    updateLyricsDisplay();
  } else {
    isLyricsPlaying = false;
    lyricsPausedTime += (Date.now() - lyricsStartTime) / 1000;
    if (btn) btn.textContent = '播放';
    if (lyricsAnimationId) {
      cancelAnimationFrame(lyricsAnimationId);
    }
  }
}
function restartLyrics() {
  isLyricsPlaying = false;
  currentLineIndex = -1;
  lyricsPausedTime = 0;
  if (lyricsAnimationId) {
    cancelAnimationFrame(lyricsAnimationId);
  }
  if (progressBar) {
    progressBar.style.width = '0%';
  }
  if (lyricsScrollContent) {
    lyricsScrollContent.style.transform = 'translateY(0px)';
  }
  lyricsLines.forEach(line => {
    line.classList.remove('current', 'next', 'prev', 'far');
    line.classList.add('far');
  });
  const playBtn = document.querySelector('.control-btn');
  if (playBtn) playBtn.textContent = '播放';
}
document.addEventListener('DOMContentLoaded', function() {
  lyricsLines.forEach(line => {
    line.classList.add('far');
  });
});
const audio = document.getElementById('bgm');
const btn = document.getElementById('music-btn');
btn.addEventListener('click', function () {
  if (audio.paused) {
    audio.play();
    btn.classList.add('playing');
  } else {
    audio.pause();
    btn.classList.remove('playing');
  }
});
const starContainer = document.getElementById('star-container');
function createStar() {
  const star = document.createElement('div');
  star.classList.add('star');
  star.style.left = Math.random() * 100 + 'vw';
  star.style.top = '-50px';
  star.style.zIndex = '1';
  const size = Math.random() * 15 + 8;
  star.style.width = size + 'px';
  star.style.height = size + 'px';
  const duration = Math.random() * 3 + 2;
  star.style.animationDuration = duration + 's';
  starContainer.appendChild(star);
  setTimeout(() => {
    star.remove();
  }, duration * 1000);
}
setInterval(createStar, 200);
function initSidebarAutoHide() {
    const sidebar = document.querySelector('.sidebar');
    const footer = document.querySelector('.footer');
    const mainContent = document.querySelector('.main-transition-content');
    if (!sidebar || !footer || !mainContent) return;
    sidebar.style.transition = 'transform 0.5s ease-in-out';
    const triggerDistance = 1200;
    function handleScroll() {
        const scrollTop = mainContent.scrollTop;
        const containerHeight = mainContent.clientHeight;
        const scrollHeight = mainContent.scrollHeight;
        const distanceFromBottom = scrollHeight - (scrollTop + containerHeight);
        if (sidebar.classList.contains('show')) {
            if (distanceFromBottom <= triggerDistance) {
                sidebar.style.transform = 'translateY(-50%) translateX(1150px)';
            } else {
                sidebar.style.transform = 'translateY(-50%) translateX(0)';
            }
        }
    }
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }
    mainContent.addEventListener('scroll', requestTick);
}
document.addEventListener('DOMContentLoaded', function() {
    initSidebarAutoHide();
});
sidebar.style.transition = 'transform 0.5s ease-in-out';