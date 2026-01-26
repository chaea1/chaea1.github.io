// script.js
(function () {

  /* =========================
     Element references
     ========================= */
  const loader = document.getElementById('loader');
  const dot = loader?.querySelector('.dot');
  const introText = document.getElementById('intro-text');
  const greeting = document.getElementById('greeting');
  const first = document.getElementById('first-name');
  const last = document.getElementById('last-name');
  const caret = document.getElementById('caret');
  const content = document.getElementById('content');
  const cursor = document.querySelector('.custom-cursor');

  const introPlayed = sessionStorage.getItem('introPlayed');
  const hasIntro = loader && dot && content;

  let introFinished = false;

  /* =========================
     Intro logic (main page only)
     ========================= */
  if (hasIntro) {
    document.documentElement.classList.add('is-loading');
    document.body.classList.add('is-loading');

    window.addEventListener('load', () => {
      if (introPlayed) {
        finishIntroInstantly();
      } else {
        playIntro();
        sessionStorage.setItem('introPlayed', 'true');

        setTimeout(() => {
          window.addEventListener('click', finishIntroInstantly, { once: true });
        }, 500);
      }
    });
  } else {
    // pages without intro
    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
  }

  /* =========================
     Core intro control
     ========================= */
  function playIntro() {
    startDotExpansion();
    startTypingSequence();
    fadeGreeting();
    revealSite();
    cleanup();
  }

  function finishIntroInstantly() {
    if (introFinished || !loader || !content) return;
    introFinished = true;

    loader.classList.remove('expand', 'black');
    loader.classList.add('hide');
    loader.style.display = 'none';

    content.classList.remove('is-hidden');
    content.classList.add('reveal');

    if (caret) caret.style.display = 'none';

    document.documentElement.classList.remove('is-loading');
    document.body.classList.remove('is-loading');
  }

  /* =========================
     Loader animations
     ========================= */
  function startDotExpansion() {
    requestAnimationFrame(() => {
      loader.classList.add('expand');
    });
  }

  function startTypingSequence() {
    setTimeout(() => {
      if (introFinished) return;
      loader.classList.add('black');
      if (introText) introText.style.opacity = '1';
      typeSlow();
    }, 2000);
  }

  function fadeGreeting() {
    setTimeout(() => {
      if (introFinished) return;
      if (greeting) greeting.style.opacity = '0';
    }, 5200);
  }

  function revealSite() {
    setTimeout(() => {
      if (introFinished) return;
      content.classList.remove('is-hidden');
      content.classList.add('reveal');
      loader.classList.add('hide');
    }, 6500);
  }

  function cleanup() {
    setTimeout(() => {
      if (introFinished) return;
      loader.style.display = 'none';
      document.documentElement.classList.remove('is-loading');
      document.body.classList.remove('is-loading');
    }, 6800);
  }

  /* =========================
     Typing effect
     ========================= */
  function typeSlow() {
    const greetingText = 'Hi. I am';
    const firstName = 'Rebecca';
    const lastName = 'Law.';

    if (greeting) greeting.textContent = '';
    if (first) first.textContent = '';
    if (last) last.textContent = '';

    let g = 0, f = 0, l = 0;
    const speed = 120;

    const interval = setInterval(() => {
      if (introFinished) {
        clearInterval(interval);
        return;
      }

      if (g < greetingText.length) {
        greeting.textContent += greetingText[g++];
        return;
      }
      if (f < firstName.length) {
        first.textContent += firstName[f++];
        return;
      }
      if (l < lastName.length) {
        last.textContent += lastName[l++];
        return;
      }

      clearInterval(interval);
      if (caret) caret.style.display = 'none';
    }, speed);
  }

  /* =========================
     Smooth custom cursor
     ========================= */
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    if (!cursor) return;

    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* =========================
     Page transition (projects)
     ========================= */
  const transition = document.getElementById('page-transition');

  document.querySelectorAll('a.project-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (!transition) return;

      const href = link.getAttribute('href');
      transition.classList.add('active');

      setTimeout(() => {
        window.location.href = href;
      }, 600);
    });
  });

  window.addEventListener('load', () => {
    if (transition) transition.classList.remove('active');
  });

  /* =========================
     Project banner scroll fade
     ========================= */
  const banner = document.querySelector('.projects-banner');

  window.addEventListener('scroll', () => {
    if (!banner) return;

    const rect = banner.getBoundingClientRect();
    const fadeEnd = window.innerHeight * 0.5;

    const progress = Math.min(Math.max((fadeEnd - rect.top) / fadeEnd, 0), 1);

    const blur = 12 * (1 - progress);
    const opacity = 0.2 * (1 - progress);

    banner.style.backdropFilter = `blur(${blur}px)`;
    banner.style.webkitBackdropFilter = `blur(${blur}px)`;
    banner.style.background = `rgba(255, 255, 255, ${opacity})`;
  });

  /* =========================
     Reveal on scroll
     ========================= */
  const revealSections = document.querySelectorAll('.reveal-on-scroll');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  revealSections.forEach(section => observer.observe(section));

  /* =========================
     About page transition
     ========================= */
  const aboutTransition = document.getElementById('about-transition');

  document.querySelectorAll('a.about-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      if (!aboutTransition) return;

      const href = link.getAttribute('href');
      aboutTransition.classList.add('active');

      setTimeout(() => {
        window.location.href = href;
      }, 450);
    });
  });

  window.addEventListener('load', () => {
    if (aboutTransition) aboutTransition.classList.remove('active');
  });
  
  /* =========================
   Mobile + desktop tap / click skip
   ========================= */
function skipIntroOnInteraction() {
  if (introFinished) return;
  finishIntroInstantly();
}

if (loader) {
  // Desktop click
  loader.addEventListener('click', skipIntroOnInteraction);

  // Mobile tap (fires immediately, no delay)
  loader.addEventListener('touchstart', skipIntroOnInteraction, {
    passive: true
  });
}


})();


/*china house design process */
// design-process.js
// Scroll reveal + active state for Option A cards

(function () {
  const cards = document.querySelectorAll(".dp-card");
  if (!cards.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  cards.forEach((card) => observer.observe(card));

  // Active card based on scroll position
  function updateActiveCard() {
    let active = null;
    const midpoint = window.innerHeight * 0.45;

    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top <= midpoint && rect.bottom >= midpoint) {
        active = card;
      }
      card.classList.remove("is-active");
    });

    if (active) active.classList.add("is-active");
  }

  window.addEventListener("scroll", updateActiveCard, { passive: true });
  window.addEventListener("resize", updateActiveCard, { passive: true });

  // init
  updateActiveCard();
})();

/*fade in/out for CH page */
const hero = document.getElementById("chHero");

window.addEventListener("load", () => {
  hero.style.opacity = 1;
});

window.addEventListener("scroll", () => {
  const fadePoint = window.innerHeight;
  hero.style.opacity = Math.max(0, 1 - window.scrollY / fadePoint);
});

/* notification */
const toast = document.getElementById("siteToast");
const closeBtn = document.getElementById("toastClose");

// show after a short delay
window.addEventListener("load", () => {
  setTimeout(() => toast.classList.add("show"), 400);
});

// close
closeBtn.addEventListener("click", () => {
  toast.classList.remove("show");
});

const cta = document.querySelector(".site-toast__btn");

cta.addEventListener("click", () => {
  toast.classList.remove("show");
});


