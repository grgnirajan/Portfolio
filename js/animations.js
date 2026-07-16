// ---- Preloader ----
(function runPreloader() {
  var preloader = document.getElementById('preloader');
  var fill = document.getElementById('preloaderFill');
  var percentEl = document.getElementById('preloaderPercent');
  var htmlEl = document.documentElement;
  var reduced = prefersReducedMotion();

  function reveal() {
    htmlEl.classList.remove('is-loading');
    preloader.classList.add('hide');
    document.body.classList.add('page-loaded');
    setTimeout(function () {
      if (preloader && preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 800);
  }

  if (reduced) {
    reveal();
    return;
  }

  var progress = 0;
  var duration = 1400; // ms, approximate
  var start = null;

  function tick(ts) {
    if (!start) start = ts;
    var elapsed = ts - start;
    progress = Math.min(100, Math.round((elapsed / duration) * 100));
    fill.style.width = progress + '%';
    percentEl.textContent = progress + '%';
    if (progress < 100) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(reveal, 250);
    }
  }
  requestAnimationFrame(tick);
})();

// ---- Hero particle network background ----
(function initHeroCanvas() {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var hero = document.getElementById('hero');
  var reduced = prefersReducedMotion();

  var particles = [];
  var mouse = { x: null, y: null };
  var width, height, dpr;

  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var count = Math.min(70, Math.round((width * height) / 16000));
    particles = [];
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.4 + 0.6
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      if (mouse.x !== null) {
        var dx = p.x - mouse.x, dy = p.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          var force = ((120 - dist) / 120) * 0.03;
          p.vx += (dx / (dist || 1)) * force;
          p.vy += (dy / (dist || 1)) * force;
        }
      }

      p.vx *= 0.995;
      p.vy *= 0.995;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,245,245,0.55)';
      ctx.fill();
    }

    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var pa = particles[a], pb = particles[b];
        var ddx = pa.x - pb.x, ddy = pa.y - pb.y;
        var d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.strokeStyle = 'rgba(245,245,245,' + (0.14 * (1 - d / 130)) + ')';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(step);
  }

  resize();
  window.addEventListener('resize', resize);
  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  if (!reduced) {
    requestAnimationFrame(step);
  } else {
    step(); // draw a single static frame
  }
})();

// ---- Scroll reveal ----
(function initScrollReveal() {
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();

// ---- Count-up animation for stat numbers ----
(function initCountUp() {
  var statStrip = document.querySelector('.stat-strip');
  if (!statStrip) return;
  var nums = statStrip.querySelectorAll('.stat-num');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1100;
    var start = null;

    function tick(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var value = Math.round(eased * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          nums.forEach(animateCount);
          countIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countIo.observe(statStrip);
  } else {
    nums.forEach(function (el) {
      el.textContent = (el.getAttribute('data-count') || '0') + (el.getAttribute('data-suffix') || '');
    });
  }
})();

// ---- Active nav link highlight while scrolling ----
(function initActiveNav() {
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = Array.prototype.map.call(navLinks, function (link) {
    return document.querySelector(link.getAttribute('href'));
  });

  function updateActiveNav() {
    var scrollPos = window.scrollY + window.innerHeight * 0.4;
    var current = 0;
    sections.forEach(function (sec, i) {
      if (sec && sec.offsetTop <= scrollPos) current = i;
    });
    navLinks.forEach(function (link, i) {
      link.style.color = i === current ? 'var(--text-0)' : '';
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();
})();
