// ===== FILE VARIAN PRESET: LENTUR - tali sudah terkunci ke 'lentur' =====
// Rename jadi team.js lalu timpa /js/team.js
(() => {
  const slides = [...document.querySelectorAll('[data-member-slide]')];
  const controls = [...document.querySelectorAll('[data-member-step]')];
  const activeMember = document.querySelector('[data-active-member]');
  if (!slides.length || controls.length !== 2 || !activeMember) return;

  let currentIndex = 0;

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    document.body.classList.add('team-motion-ready');
    const motionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    }, { threshold: 0.12 });
    slides.forEach((slide) => motionObserver.observe(slide));
    slides[0].classList.add('is-visible');
  }

  const showMember = (index) => {
    currentIndex = Math.max(0, Math.min(slides.length - 1, index));
    slides[currentIndex].scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
      block: 'start',
    });
    updateControls();
  };

  const updateControls = () => {
    activeMember.textContent = String(currentIndex + 1).padStart(2, '0');
    controls.forEach((button) => {
      const direction = Number(button.dataset.memberStep);
      button.disabled = direction < 0 ? currentIndex === 0 : currentIndex === slides.length - 1;
    });
  };

  controls.forEach((button) => {
    button.addEventListener('click', () => showMember(currentIndex + Number(button.dataset.memberStep)));
  });

  const canMoveBackground = window.matchMedia('(pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canMoveBackground) {
    slides.forEach((slide) => {
      let frameId = 0;
      let pendingPoint = null;

      const resetBackground = () => {
        pendingPoint = null;
        if (frameId) window.cancelAnimationFrame(frameId);
        frameId = 0;
        slide.classList.remove('cursor-active');
        ['pointer-x', 'pointer-y', 'orbit-x', 'orbit-y', 'orbit-reverse-x', 'orbit-reverse-y']
          .forEach((property) => slide.style.removeProperty(`--${property}`));
        ['grid-offset-x', 'grid-offset-y']
          .forEach((property) => document.body.style.removeProperty(`--${property}`));
      };

      slide.addEventListener('pointermove', (event) => {
        if (event.pointerType !== 'mouse') return;
        pendingPoint = { x: event.clientX, y: event.clientY };
        if (frameId) return;

        frameId = window.requestAnimationFrame(() => {
          frameId = 0;
          if (!pendingPoint) return;
          const { x, y } = pendingPoint;
          pendingPoint = null;
          const bounds = slide.getBoundingClientRect();
          const horizontal = Math.max(-1, Math.min(1, ((x - bounds.left) / bounds.width - 0.5) * 2));
          const vertical = Math.max(-1, Math.min(1, ((y - bounds.top) / bounds.height - 0.5) * 2));
          const pointerX = Math.max(0, Math.min(100, ((x - bounds.left) / bounds.width) * 100));
          const pointerY = Math.max(0, Math.min(100, ((y - bounds.top) / bounds.height) * 100));

          slide.classList.add('cursor-active');
          slide.style.setProperty('--pointer-x', `${pointerX.toFixed(2)}%`);
          slide.style.setProperty('--pointer-y', `${pointerY.toFixed(2)}%`);
          slide.style.setProperty('--orbit-x', `${(horizontal * 18).toFixed(1)}px`);
          slide.style.setProperty('--orbit-y', `${(vertical * 14).toFixed(1)}px`);
          slide.style.setProperty('--orbit-reverse-x', `${(horizontal * -10).toFixed(1)}px`);
          slide.style.setProperty('--orbit-reverse-y', `${(vertical * -8).toFixed(1)}px`);
          document.body.style.setProperty('--grid-offset-x', `${(horizontal * 6).toFixed(1)}px`);
          document.body.style.setProperty('--grid-offset-y', `${(vertical * 6).toFixed(1)}px`);
        });
      });

      slide.addEventListener('pointerleave', resetBackground);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    currentIndex = slides.indexOf(visible.target);
    updateControls();
  }, { threshold: [0.45, 0.65, 0.85] });

  slides.forEach((slide) => observer.observe(slide));
  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.target.closest('a,button,input,textarea,select')) return;
    if (event.key === 'ArrowDown' || event.key === 'PageDown') {
      event.preventDefault();
      showMember(currentIndex + 1);
    }
    if (event.key === 'ArrowUp' || event.key === 'PageUp') {
      event.preventDefault();
      showMember(currentIndex - 1);
    }
  });

  updateControls();
})();

/* Live lanyard tracking. Measure the strap and real card-hole marker in visual-local
   coordinates, then keep the rope endpoints and clip aligned during card movement.
*/
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let LANYARD_PRESET = 'kaku';
  const LANYARD_PRESETS = {
    kaku:   { label:'Kaku',   gravity:0.04, damping:0.9,   iterations:12, spring:48, springDamping:10, swayAmp:0.002, swaySpeed:0.75, dragFollow:0.45, dragBoost:0.05, ropeSlack:0, ropeWidth:19 },
    lentur: { label:'Lentur', gravity:0.12, damping:0.92,  iterations:8,  spring:30, springDamping:6,  swayAmp:0.006, swaySpeed:1.1,  dragFollow:0.34, dragBoost:0.1,  ropeSlack:1, ropeWidth:19 },
    pelan:  { label:'Pelan',  gravity:0.06, damping:0.96,  iterations:12, spring:24, springDamping:8,  swayAmp:0.004, swaySpeed:0.5,  dragFollow:0.35, dragBoost:0.05, ropeSlack:0, ropeWidth:19 },
  };
  const getPreset = () => LANYARD_PRESETS[LANYARD_PRESET] || LANYARD_PRESETS.lentur;
  let P = getPreset();
  document.querySelectorAll('[data-lanyard-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const n = btn.dataset.lanyardPreset; if (!LANYARD_PRESETS[n]) return;
      LANYARD_PRESET = n; P = getPreset();
      document.querySelectorAll('[data-lanyard-preset]').forEach((b) => b.classList.toggle('is-active', b === btn));
      document.querySelectorAll('[data-lanyard-root]').forEach((v) => v.dispatchEvent(new CustomEvent('lanyard-kick', { bubbles:true })));
    });
    btn.classList.toggle('is-active', btn.dataset.lanyardPreset === LANYARD_PRESET);
  });

  const roots = [...document.querySelectorAll('[data-lanyard-root]')];
  if (!roots.length) return;

  roots.forEach((visual) => {
    const card = visual.querySelector('[data-id-card]');
    const hole = card && card.querySelector('.id-card-hole');
    const svg = visual.querySelector('.lanyard-svg');
    const bgPath = visual.querySelector('.lanyard-rope-bg');
    const edgePath = visual.querySelector('.lanyard-rope-edge');
    const textPathEl = visual.querySelector('[id^="lanyard-text-path-"]'); // path untuk textPath CAM • PROPERTY
    const label = null; // v3: span label lama tidak dipakai, teks sudah di SVG
    const clip = visual.querySelector('.lanyard-clip');
    const lanyardEl = visual.querySelector('.member-lanyard');
    const slide = visual.closest('[data-member-slide]');
    const copy = slide && slide.querySelector('.member-copy');
    const eyebrow = copy && copy.querySelector('.member-eyebrow');
    const memberName = copy && copy.querySelector('.member-name');
    if (!card || !hole || !svg || !bgPath) return;
    if (!reducedMotion) visual.classList.add('has-rope');

    const ROPE_POINTS = 12;
    let rope = [];
    let angle = 0, angVel = 0;
    let drag = null, hoverTilt = 0, isVisible = true, animationRunning = false;
    let lastTime = performance.now();
    let idleT = Math.random() * Math.PI * 2;
    let REST_LEN = 110, holeRest = { x: 0, y: 0 }, anchorPt = { x: 0, y: 0 };

    visual.addEventListener('lanyard-kick', () => { angVel += 1.4; });

    const visualRect = () => visual.getBoundingClientRect();
    const toVisualPoint = (clientX, clientY, rect = visualRect()) => {
      const scaleX = visual.offsetWidth / (rect.width || visual.offsetWidth || 1);
      const scaleY = visual.offsetHeight / (rect.height || visual.offsetHeight || 1);
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    };
    const getAnchorPoint = (rect = visualRect()) => {
      if (!lanyardEl) return { x: visual.offsetWidth / 2, y: 0 };
      const bounds = lanyardEl.getBoundingClientRect();
      return toVisualPoint(bounds.left + bounds.width / 2, bounds.top, rect);
    };
    const getHolePoint = (rect = visualRect()) => {
      const bounds = hole.getBoundingClientRect();
      return toVisualPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, rect);
    };

    const syncLayout = () => {
      const rect = visualRect();
      if (eyebrow) {
        const bounds = eyebrow.getBoundingClientRect();
        const point = toVisualPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2, rect);
        visual.style.setProperty('--lanyard-anchor-y', `${point.y}px`);
      }
      if (memberName) {
        const bounds = memberName.getBoundingClientRect();
        const point = toVisualPoint(bounds.left, bounds.top, rect);
        visual.style.setProperty('--lanyard-card-top', `${point.y}px`);
      }
    };

    const measureRest = () => {
      const prev = card.style.transform;
      syncLayout();
      card.style.transform = 'translateX(-50%)';
      const holeStyle = getComputedStyle(hole);
      card.style.transformOrigin = `50% ${parseFloat(holeStyle.top) + hole.offsetHeight / 2}px`;
      const rect = visualRect();
      anchorPt = getAnchorPoint(rect);
      holeRest = getHolePoint(rect);
      REST_LEN = Math.hypot(holeRest.x - anchorPt.x, holeRest.y - anchorPt.y) || 110;
      card.style.transform = prev;
    };
    measureRest();
    if (reducedMotion) return;

    const resetRope = () => {
      measureRest();
      rope = [];
      for (let i = 0; i < ROPE_POINTS; i++) {
        const t = i / (ROPE_POINTS - 1);
        const x = anchorPt.x + (holeRest.x - anchorPt.x) * t;
        const y = anchorPt.y + (holeRest.y - anchorPt.y) * t;
        rope.push({ x, y, px: x, py: y });
      }
    };
    resetRope();

    const ropePath = (pts) => {
      if (pts.length < 2) return '';
      let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
        const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
      }
      return d;
    };

    const step = (now) => {
      const dt = Math.min(0.032, (now - lastTime) / 1000 || 0.016);
      lastTime = now;
      if (!isVisible) { animationRunning = false; return; }
      const rect = visualRect();
      const visualW = visual.offsetWidth;
      const visualH = visual.offsetHeight;
      const currentAnchor = getAnchorPoint(rect);
      const ax = currentAnchor.x, ay = currentAnchor.y;
      P = getPreset();

      let holeX, holeY;
      if (drag) {
        let dx = drag.x - ax, dy = drag.y - ay;
        const dist = Math.hypot(dx, dy) || 1;
        const maxDist = REST_LEN + 16 + P.ropeSlack;
        if (dist > maxDist) { dx = dx / dist * maxDist; dy = dy / dist * maxDist; }
        const targetAngle = Math.atan2(dx, dy);
        angle += (targetAngle - angle) * P.dragFollow;
        angVel = (targetAngle - angle) * 8;
        // Drag langsung menentukan posisi lubang: drag.x/y adalah posisi lubang yang diinginkan
        // Tapi drag diukur dari kursor di tengah card, jadi koreksi: lubang = drag - (tengah card - lubang)
        // Sederhananya: lubang = anchor + (drag - anchor) yang sudah dibatasi
        holeX = ax + dx; holeY = ay + dy;
      } else {
        idleT += dt * P.swaySpeed;
        const sway = Math.sin(idleT) * P.swayAmp;
        const spring = -angle * P.spring - angVel * P.springDamping;
        angVel += (spring + sway * P.spring) * dt;
        angle += angVel * dt;
        holeX = ax + Math.sin(angle) * REST_LEN;
        holeY = ay + Math.cos(angle) * REST_LEN;
      }

      const deg = (angle * 57.3 + hoverTilt).toFixed(2);
      const offsetX = holeX - holeRest.x;
      const offsetY = holeY - holeRest.y;
      card.style.transform = `translateX(-50%) translate(${offsetX.toFixed(1)}px, ${offsetY.toFixed(1)}px) rotate(${deg}deg)`;
      const trackedHole = getHolePoint(rect);
      holeX = trackedHole.x;
      holeY = trackedHole.y;

      // Pin the rope endpoints to the live strap anchor and the card's actual hole each frame.
      rope[0].x = ax; rope[0].y = ay; rope[0].px = ax; rope[0].py = ay;
      const last = rope[rope.length - 1];
      last.x = holeX; last.y = holeY; last.px = holeX; last.py = holeY;
      for (let i = 1; i < rope.length - 1; i++) {
        const p = rope[i];
        const vx = (p.x - p.px) * P.damping, vy = (p.y - p.py) * P.damping;
        p.px = p.x; p.py = p.y;
        p.x += vx; p.y += vy + P.gravity;
        if (drag) { p.x += drag.vx * 0.12; p.y += drag.vy * 0.12; }
      }
      const seg = (REST_LEN + P.ropeSlack) / (ROPE_POINTS - 1);
      for (let k = 0; k < P.iterations; k++) {
        for (let i = 0; i < rope.length - 1; i++) {
          const a = rope[i], b = rope[i + 1];
          let dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 1;
          const diff = (d - seg) / d;
          if (i === 0) { b.x -= dx * diff; b.y -= dy * diff; }
          else if (i === rope.length - 2) { a.x += dx * diff; a.y += dy * diff; }
          else { a.x += dx * diff * 0.5; a.y += dy * diff * 0.5; b.x -= dx * diff * 0.5; b.y -= dy * diff * 0.5; }
        }
        rope[0].x = ax; rope[0].y = ay;
        rope[rope.length - 1].x = holeX; rope[rope.length - 1].y = holeY;
      }

      // Gambar tali: ujungnya PERSIS di hole
      const d = ropePath(rope);
      bgPath.setAttribute('d', d);
      // v3: teks ikut path tali yang sama -> teks tidak bisa keluar jalur
      if (textPathEl) textPathEl.setAttribute('d', d);
      bgPath.setAttribute('stroke-width', P.ropeWidth);
      if (edgePath) edgePath.setAttribute('d', d);
      const topY = Math.min(ay, 0) - 8;
      const svgH = visualH - topY + 8;
      svg.style.top = topY + 'px';
      svg.style.height = svgH + 'px';
      svg.setAttribute('viewBox', `0 ${topY} ${visualW} ${svgH}`);
      svg.setAttribute('width', visualW);
      svg.setAttribute('height', svgH);

      // v3: label span tidak dipakai lagi, teks sudah menempel di path tali via <textPath>
      // Jadi tidak ada lagi perhitungan mid-point yang bisa meleset.
      // Clip TEPAT di lubang: center clip = hole
      if (clip) {
        clip.style.left = holeX + 'px';
        clip.style.top = holeY + 'px';
        clip.style.transform = `translate(-50%,-50%) rotate(${(angle * 57.3).toFixed(1)}deg)`;
      }

      animationRunning = true;
      requestAnimationFrame(step);
    };
    const toLocal = (e) => {
      return toVisualPoint(e.clientX, e.clientY);
    };
    // Drag: kita drag LUBANGNYA, bukan tengah card. Jadi hitung offset kursor -> lubang saat pointerdown
    let dragOffset = { x: 0, y: 0 };
    card.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const p = toLocal(e);
      // Posisi lubang saat ini (dari transform terakhir) = holeRest + offset card
      // Kita ambil dari rope terakhir agar akurat
      const curHole = rope[rope.length - 1] || holeRest;
      dragOffset = { x: p.x - curHole.x, y: p.y - curHole.y };
      drag = { x: curHole.x, y: curHole.y, lastX: curHole.x, lastY: curHole.y, vx: 0, vy: 0 };
      card.classList.add('is-dragging');
      card.setPointerCapture?.(e.pointerId);
      e.preventDefault();
    });
    card.addEventListener('pointermove', (e) => {
      if (!drag) {
        const r = card.getBoundingClientRect();
        const cx = (e.clientX - (r.left + r.width / 2)) / r.width;
        hoverTilt = Math.max(-6, Math.min(6, cx * 8));
        card.classList.add('is-hovering');
        return;
      }
      const p = toLocal(e);
      // Lubang = kursor - offset saat grab (jadi card tidak loncat)
      const nx = p.x - dragOffset.x, ny = p.y - dragOffset.y;
      drag.vx = nx - drag.lastX; drag.vy = ny - drag.lastY;
      drag.lastX = nx; drag.lastY = ny; drag.x = nx; drag.y = ny;
    });
    const endDrag = () => {
      if (!drag) return;
      angVel += drag.vx * P.dragBoost;
      drag = null;
      card.classList.remove('is-dragging');
      hoverTilt = 0;
    };
    card.addEventListener('pointerup', endDrag);
    card.addEventListener('pointercancel', endDrag);
    card.addEventListener('pointerleave', () => { if (!drag) { hoverTilt = 0; card.classList.remove('is-hovering'); } });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { angVel -= 1.2; e.preventDefault(); }
      if (e.key === 'ArrowRight') { angVel += 1.2; e.preventDefault(); }
    });
    const startAnimation = () => {
      if (reducedMotion || !isVisible || animationRunning) return;
      animationRunning = true;
      requestAnimationFrame(step);
    };
    const updateLayout = () => resetRope();
    visual.addEventListener('transitionend', (event) => {
      if (event.propertyName === 'transform') updateLayout();
    });
    if (copy) {
      copy.addEventListener('transitionend', (event) => {
        if (event.propertyName === 'transform') updateLayout();
      });
    }
    if (slide && 'IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          isVisible = en.isIntersecting;
          if (isVisible) {
            if (!reducedMotion) angVel += 0.12;
            lastTime = performance.now();
            updateLayout();
            startAnimation();
          }
        });
      }, { threshold: 0.2 }).observe(slide);
    }
    if (!reducedMotion) step(performance.now());
    window.addEventListener('resize', updateLayout);
  });
})();
