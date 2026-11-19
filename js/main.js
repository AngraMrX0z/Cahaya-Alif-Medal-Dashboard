(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const overlay = document.createElement('div');
  overlay.className = 'page-transition-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.append(overlay);

  const finishEntrance = () => {
    overlay.classList.remove('is-entering');
    overlay.hidden = true;
  };

  if (reducedMotion) {
    overlay.hidden = true;
  } else {
    overlay.classList.add('is-entering');
    overlay.addEventListener('animationend', finishEntrance, { once: true });
    window.setTimeout(finishEntrance, 900);
  }

  let navigating = false;
  document.addEventListener('click', (event) => {
    if (reducedMotion || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
      || !(event.target instanceof Element)) return;

    const link = event.target.closest('a[href]');
    if (!link || link.hasAttribute('download')
      || (link.target && link.target !== '_self')
      || link.relList.contains('external')) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin
      || (destination.pathname === window.location.pathname
        && destination.search === window.location.search)) return;

    event.preventDefault();
    if (navigating) return;
    navigating = true;
    overlay.hidden = false;
    overlay.classList.remove('is-entering');
    overlay.classList.add('is-leaving');
    window.setTimeout(() => window.location.assign(destination.href), 400);
  });

  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    navigating = false;
    overlay.classList.remove('is-entering', 'is-leaving');
    overlay.hidden = true;
  });
})();

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasIntersectionObserver = 'IntersectionObserver' in window;

if (!reducedMotion && hasIntersectionObserver && document.querySelector('.site-header')) {
  document.body.classList.add('motion-ready');
  const entranceItems = document.querySelectorAll(
    '.site-header .nav-wrap, main > section, .hero-copy, .hero-visual, .area-about-layout, '
    + '.section-heading, .property-card, .section-kicker, .type-tabs, .product-card, '
    + '.product-head, .grid-top, .interior-box, .photos figure, .promo-strip, '
    + '.contact-inner, .floating-whatsapp, .footer-inner',
  );
  const entranceObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-entered', entry.isIntersecting);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

  entranceItems.forEach((item) => {
    item.classList.add('entrance-reveal');
    entranceObserver.observe(item);
  });
}

const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.getElementById('main-nav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });
}

const agentDialog = document.getElementById('agentDialog');
const openAgents = document.getElementById('openAgents');
const closeAgents = document.getElementById('closeAgents');

if (agentDialog) {
  if (openAgents) openAgents.addEventListener('click', () => agentDialog.showModal());
  if (closeAgents) closeAgents.addEventListener('click', () => agentDialog.close());
  agentDialog.addEventListener('click', (event) => {
    if (event.target === agentDialog) agentDialog.close();
  });
}

const typeTabs = document.querySelectorAll('[data-type-tab]');
const typePanels = document.querySelectorAll('[data-type-panel]');
typeTabs.forEach((button) => {
  button.addEventListener('click', () => {
    const selectedType = button.dataset.typeTab;
    typeTabs.forEach((tab) => {
      const isActive = tab === button;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
    typePanels.forEach((panel) => {
      panel.hidden = panel.dataset.typePanel !== selectedType;
    });
  });
});

const contactForm = document.getElementById('contactForm');
const interestSelect = contactForm?.querySelector('select[name="minat"]');
const agentLinks = agentDialog?.querySelectorAll('.agent-options a') || [];

const syncInterestSelection = (card, chip) => {
  if (!interestSelect) return;

  const propertyName = card.querySelector('.property-title')?.textContent.trim();
  const propertyType = chip?.textContent.trim();
  if (!propertyName || !propertyType) return;

  const selectedValue = `${propertyName}|${propertyType}`;
  if ([...interestSelect.options].some((option) => option.value === selectedValue)) {
    interestSelect.value = selectedValue;
  }
};

const showAgentDialogFor = (propertyName, propertyType) => {
  const message = `Halo, saya ingin bertanya tentang properti ${propertyName}, tipe ${propertyType} di Rancamanyar.`;
  agentLinks.forEach((link) => {
    const phone = link.dataset.phone;
    if (phone) link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  });
  if (agentDialog && !agentDialog.open) agentDialog.showModal();
};

document.querySelectorAll('.property-card').forEach((card) => {
  const track = card.querySelector('.type-track');
  if (!track) return;

  const image = card.querySelector('.property-image img');
  const detail = card.querySelector('.property-detail');
  const price = card.querySelector('.property-bottom strong');
  const chips = [...track.querySelectorAll('.type-chip')];

  const selectType = (chip) => {
    chips.forEach((item) => {
      const isActive = item === chip;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-pressed', String(isActive));
    });

    if (detail && chip.dataset.detail) detail.textContent = chip.dataset.detail;
    if (price && chip.dataset.price) price.textContent = chip.dataset.price;
    if (image && chip.dataset.image) {
      image.src = chip.dataset.image;
      image.alt = `${card.querySelector('.property-title')?.textContent.trim() || 'Properti'} ${chip.textContent.trim()}`;
    }
    syncInterestSelection(card, chip);
    showAgentDialogFor(
      card.querySelector('.property-title')?.textContent.trim() || 'properti',
      chip.textContent.trim(),
    );
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      selectType(chip);
    });
  });

  const scrollTrack = (direction) => {
    const activeChip = track.querySelector('.type-chip.is-active');
    const step = activeChip ? activeChip.getBoundingClientRect().width + 8 : 160;
    track.scrollBy({ left: direction * step, behavior: reducedMotion ? 'instant' : 'smooth' });
  };

  const previous = card.querySelector('.type-prev');
  const next = card.querySelector('.type-next');
  if (previous) previous.addEventListener('click', () => scrollTrack(-1));
  if (next) next.addEventListener('click', () => scrollTrack(1));

  const inquiryLink = card.querySelector('.property-bottom a[href="#kontak"]');
  if (inquiryLink) {
    inquiryLink.addEventListener('click', () => {
      syncInterestSelection(card, track.querySelector('.type-chip.is-active'));
    });
  }
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const [propertyName, propertyType] = String(formData.get('minat')).split('|');
    const message = `Halo, saya ${formData.get('nama')} (${formData.get('wa')}), alamat ${formData.get('alamat')}. Saya tertarik dengan properti ${propertyName}, tipe ${propertyType} di Rancamanyar.`;
    window.open(`https://wa.me/6282120776124?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}