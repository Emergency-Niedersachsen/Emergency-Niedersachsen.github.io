(() => {
  const tabs = document.querySelectorAll('.nav .nav-link');
  const sections = document.querySelectorAll('.tab-content');

  function openTab(id) {
    sections.forEach(s => s.classList.add('d-none'));
    const el = document.getElementById(id);
    if (el) el.classList.remove('d-none');
    tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    AOS.refresh();
  }

  tabs.forEach(t => t.addEventListener('click', () => openTab(t.dataset.tab)));
  document.querySelectorAll('[data-tablink]').forEach(el => el.addEventListener('click', e => { e.preventDefault(); openTab(el.getAttribute('data-tablink')); }));

  // Load Sneaks dynamically
  fetch('/data/sneaks.json')
    .then(r => r.json())
    .then(data => {
      const sneakList = document.getElementById('sneakList');
      sneakList.innerHTML = '';
      data.forEach((s, i) => {
        const col = document.createElement('div');
        col.className = 'col-md-4';
        col.innerHTML = `
          <div class="card glass-card p-2" data-aos="fade-up" data-aos-delay="${i * 100}">
            <img src="${s.img}" class="card-img-top rounded" alt="${s.title}">
            <div class="card-body text-muted small">
              <div class="fw-bold">${s.title}</div>
              <div>${s.desc}</div>
            </div>
          </div>`;
        sneakList.appendChild(col);
      });
      AOS.refresh();
    })
    .catch(err => console.error('Failed to load sneaks:', err));

  // Load Events dynamically
  fetch('/data/event.json')
    .then(r => r.json())
    .then(data => {
      const eventsList = document.getElementById('eventsList');
      const nextEventTime = document.getElementById('nextEventTime');
      const nextEventStatus = document.getElementById('nextEventStatus');
      eventsList.innerHTML = '';

      let nextEvent = null;
      data.forEach((e, i) => {
        if (!nextEvent && e.status === 'Open') nextEvent = e;

        const col = document.createElement('div');
        col.className = 'col-12 mb-3';
        col.innerHTML = `
          <div class="card glass-card p-3 d-flex flex-column gap-2" data-aos="fade-up" data-aos-delay="${i * 100}">
            <img src="${e.img || 'https://via.placeholder.com/120x80'}" class="rounded" style="width:100%;height:auto;object-fit:cover">
            <div class="fw-bold">${e.title}</div>
            <div class="text-muted small">${e.date}</div>
            <span class="badge bg-${e.status === 'Open' ? 'success' : 'danger'}">${e.status}</span>
            <a href="${e.joinLink}" class="btn btn-primary">Join</a>
          </div>`;
        eventsList.appendChild(col);
      });

      if (nextEvent) {
        nextEventTime.textContent = nextEvent.date;
        nextEventStatus.textContent = nextEvent.status;
        nextEventStatus.className = `badge bg-${nextEvent.status === 'Open' ? 'success' : 'danger'}`;
      }

      AOS.refresh();
    })
    .catch(err => console.error('Failed to load events:', err));

  const socialContainer = document.getElementById('socialContainer');
  socialContainer.innerHTML = `
    <div style="flex:1;min-width:350px;max-width:350px;">
      <iframe src="https://discord.com/widget?id=1348699922240897115&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
    </div>
    `;
})();