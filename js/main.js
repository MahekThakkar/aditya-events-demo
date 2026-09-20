/* Aarambh Events - vanilla JavaScript */
(function () {
  'use strict';

  var WHATSAPP_NUMBER = '919075904746'; // change to your real number (country code + number)

  /* ---------- Navbar: solid background on scroll ---------- */
  var nav = document.getElementById('mainNav');
  var toTop = document.getElementById('toTop');

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Close mobile menu after tapping a link ---------- */
  var menu = document.getElementById('navMenu');
  document.querySelectorAll('#navMenu .nav-link, #navMenu .btn').forEach(function (link) {
    link.addEventListener('click', function () {
      if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Image fallback if a dummy image fails to load ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('error', function () {
      if (img.dataset.fallback) return;
      img.dataset.fallback = '1';
      img.src = 'https://placehold.co/600x800/521a43/f0a81c?text=Aarambh+Events';
    });
  });

  /* ---------- Gallery filter ---------- */
  var filterButtons = document.querySelectorAll('.filter-btn');
  var items = document.querySelectorAll('.g-item');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.dataset.filter;
      filterButtons.forEach(function (b) { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      items.forEach(function (item) {
        item.hidden = !(filter === 'all' || item.dataset.cat === filter);
      });
    });
  });

  /* ---------- Gallery lightbox (Bootstrap modal) ---------- */
  var lightboxEl = document.getElementById('lightbox');
  var lightbox = new bootstrap.Modal(lightboxEl);
  var lbImg = document.getElementById('lightboxImg');
  var lbCap = document.getElementById('lightboxCaption');

  items.forEach(function (item) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');

    function open() {
      var thumb = item.querySelector('img');
      var caption = item.querySelector('figcaption');
      lbImg.src = item.dataset.full;
      lbImg.alt = thumb.alt;
      lbCap.textContent = caption ? caption.textContent : '';
      lightbox.show();
    }
    item.addEventListener('click', open);
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });
  lightboxEl.addEventListener('hidden.bs.modal', function () { lbImg.src = ''; });

  /* ---------- Service cards: preselect event type in the form ---------- */
  var eventSelect = document.getElementById('eventType');
  document.querySelectorAll('[data-event]').forEach(function (link) {
    link.addEventListener('click', function () {
      var wanted = link.dataset.event;
      Array.prototype.forEach.call(eventSelect.options, function (opt) {
        if (opt.text === wanted) eventSelect.value = opt.value || opt.text;
      });
    });
  });

  /* ---------- Enquiry form ---------- */
  // var form = document.getElementById('enquiryForm');
  // var success = document.getElementById('formSuccess');
  // var dateInput = document.getElementById('eventDate');
  // var phoneInput = document.getElementById('phone');

  // // Block past dates
  // var today = new Date();
  // today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  // dateInput.min = today.toISOString().split('T')[0];

  // // Digits only in phone field
  // phoneInput.addEventListener('input', function () {
  //   phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  // });

  // form.addEventListener('submit', function (e) {
  //   e.preventDefault();
  //   form.classList.add('was-validated');
  //   if (!form.checkValidity()) {
  //     var firstInvalid = form.querySelector(':invalid');
  //     if (firstInvalid) firstInvalid.focus();
  //     return;
  //   }

  //   var data = {
  //     name: document.getElementById('name').value.trim(),
  //     phone: phoneInput.value,
  //     type: eventSelect.value,
  //     date: dateInput.value,
  //     guests: document.getElementById('guests').value || 'Not sure',
  //     budget: document.getElementById('budget').value || 'Open',
  //     message: document.getElementById('message').value.trim() || '-'
  //   };

  //   /* TODO: send `data` to your backend / Formspree / EmailJS here.
  //      Example:
  //      fetch('https://formspree.io/f/your-id', {
  //        method: 'POST',
  //        headers: { 'Content-Type': 'application/json' },
  //        body: JSON.stringify(data)
  //      });
  //   */

  //   var text =
  //     'Hello Aarambh Events, I would like to plan an event.%0A' +
  //     'Name: ' + encodeURIComponent(data.name) + '%0A' +
  //     'Mobile: ' + data.phone + '%0A' +
  //     'Event: ' + encodeURIComponent(data.type) + '%0A' +
  //     'Date: ' + data.date + '%0A' +
  //     'Guests: ' + encodeURIComponent(data.guests) + '%0A' +
  //     'Budget: ' + encodeURIComponent(data.budget) + '%0A' +
  //     'Notes: ' + encodeURIComponent(data.message);

  //   document.getElementById('waLink').href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + text;
  //   document.getElementById('successName').textContent = data.name.split(' ')[0];

  //   form.hidden = true;
  //   success.hidden = false;
  //   success.focus();
  // });



  document.getElementById('enquiryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const form = this;

    // Bootstrap validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    // Get form values
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const eventType = document.getElementById('eventType').value;
    const eventDate = document.getElementById('eventDate').value;
    const guests = document.getElementById('guests').value || 'Not specified';
    const budget = document.getElementById('budget').value || 'Open to suggestions';
    const message = document.getElementById('message').value.trim() || 'No additional details';

    // Format event date
    const formattedDate = new Date(eventDate).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    // Your WhatsApp number
    // Replace this with the actual number
    const whatsappNumber = '919075904746';

    // WhatsApp message
    const whatsappMessage = `Hello, I would like to enquire about your event services.

👤 Name: ${name}
📱 Mobile: ${phone}
🎉 Event Type: ${eventType}
📅 Event Date: ${formattedDate}
👥 Expected Guests: ${guests}
💰 Budget Range: ${budget}

📝 Additional Details:
${message}

Please contact me regarding my enquiry.`;

    // Create WhatsApp URL
    const whatsappURL =
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');
  });

})();
