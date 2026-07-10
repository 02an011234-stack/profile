document.getElementById("year").textContent = new Date().getFullYear();

const themeToggle = document.getElementById("themeToggle");
const copyEmailBtn = document.getElementById("copyEmailBtn");
const downloadResumeBtn = document.getElementById("downloadResumeBtn");
const copyToast = document.getElementById("copyToast");
const progressBar = document.getElementById("scrollProgress");
const loadingScreen = document.getElementById("loadingScreen");
const typedText = document.getElementById("typedText");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll(".counter");
const barFills = document.querySelectorAll(".bar-fill");
const canvas = document.getElementById("matrixCanvas");
const ctx = canvas?.getContext("2d");

const textToType = "시스템의 빈틈을 찾아 안전을 구축하는 정보보안 엔지니어 안소영입니다.";

const applyTheme = (theme) => {
  document.body.dataset.theme = theme;
  localStorage.setItem("resume-theme", theme);
  if (themeToggle) {
    themeToggle.textContent = theme === "light" ? "☀" : "☾";
    themeToggle.setAttribute("aria-label", theme === "light" ? "다크 모드로 변경" : "라이트 모드로 변경");
  }
};

const savedTheme = localStorage.getItem("resume-theme");
applyTheme(savedTheme || "dark");

themeToggle?.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
});

const showToast = (message) => {
  if (!copyToast) return;
  copyToast.textContent = message;
  copyToast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => {
    copyToast.classList.remove("show");
  }, 1800);
};

copyEmailBtn?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("security@resume.dev");
    showToast("이메일이 복사되었습니다.");
  } catch (error) {
    showToast("복사에 실패했습니다.");
  }
});

downloadResumeBtn?.addEventListener("click", () => {
  const resumeText = `Soyoung Ahn\nInformation Security Engineer\nEmail: security@resume.dev\nGitHub: https://github.com/secure-kyu\nSpecialties: Application Security, Cloud Security, Threat Detection, Incident Response`;
  const blob = new Blob([resumeText], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "soyoung-ahn-resume.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("이력서 파일이 다운로드되었습니다.");
});

const createRipple = (event) => {
  const button = event.currentTarget;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  button.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
};

[".btn", ".icon-btn", ".contact-item", ".nav-link"].forEach((selector) => {
  document.querySelectorAll(selector).forEach((element) => {
    element.addEventListener("click", createRipple);
  });
});

const navLinks = document.querySelectorAll('a[href^="#"]');
navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = document.querySelector(targetId);
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const width = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
  if (progressBar) {
    progressBar.style.width = `${width}%`;
  }
});

const typeText = () => {
  if (!typedText) return;
  let index = 0;
  const speed = 55;
  const interval = window.setInterval(() => {
    typedText.textContent = textToType.slice(0, index);
    index += 1;
    if (index > textToType.length) {
      window.clearInterval(interval);
    }
  }, speed);
};

typeText();

const animateCounters = () => {
  counters.forEach((counter) => {
    const target = Number(counter.dataset.target || 0);
    const suffix = counter.dataset.suffix || "";
    const duration = 1200;
    const startTime = performance.now();

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const value = Math.floor(progress * target);
      counter.textContent = `${value}${suffix}`;
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        counter.textContent = `${target}${suffix}`;
      }
    };

    window.requestAnimationFrame(step);
  });
};

const animateBars = () => {
  const barItems = document.querySelectorAll(".skill-bar-item");
  
  barItems.forEach((item) => {
    const strong = item.querySelector(".bar-meta strong");
    const bar = item.querySelector(".bar-fill");
    
    if (strong && bar) {
      const target = parseInt(bar.dataset.width || "0");
      const suffix = strong.dataset.suffix || "%";
      const duration = 1200;
      const startTime = performance.now();
      
      const animateValue = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        strong.textContent = `${value}${suffix}`;
        
        if (progress < 1) {
          window.requestAnimationFrame(animateValue);
        } else {
          strong.textContent = `${target}${suffix}`;
        }
      };
      
      bar.style.width = `${target}%`;
      window.requestAnimationFrame(animateValue);
    }
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        if (entry.target.classList.contains("reveal")) {
          animateCounters();
          animateBars();
        }
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => observer.observe(item));

const resizeCanvas = () => {
  if (!canvas || !ctx) return;
  const ratio = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const matrixChars = "01";
let columns = Math.floor(window.innerWidth / 15);
let drops = Array(columns).fill(1);

const drawMatrix = () => {
  if (!canvas || !ctx) return;
  ctx.fillStyle = document.body.dataset.theme === "light" ? "rgba(248, 250, 252, 0.06)" : "rgba(2, 8, 20, 0.07)";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.font = "14px monospace";
  ctx.fillStyle = document.body.dataset.theme === "light" ? "rgba(3, 105, 161, 0.9)" : "rgba(45, 212, 191, 0.9)";

  for (let i = 0; i < drops.length; i += 1) {
    const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    const x = i * 15;
    const y = drops[i] * 15;
    ctx.fillText(text, x, y);
    if (y > window.innerHeight && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += 1;
  }

  window.requestAnimationFrame(drawMatrix);
};

resizeCanvas();
columns = Math.floor(window.innerWidth / 15);
drops = Array(columns).fill(1);
drawMatrix();

window.addEventListener("resize", () => {
  resizeCanvas();
  columns = Math.floor(window.innerWidth / 15);
  drops = Array(columns).fill(1);
});

window.setTimeout(() => {
  loadingScreen?.classList.add("hidden");
}, 1400);
