/* Jacque Platon — site behaviour: navigation, reveals, launch config, form. */
(function () {
  'use strict';

  var cfg = window.SITE_CONFIG || {};
  var doc = document;
  doc.documentElement.classList.add('js');

  /* ---------- Mobile navigation ---------- */
  var toggle = doc.querySelector('.nav-toggle');
  var links = doc.getElementById('nav-links');
  if (toggle && links) {
    var setOpen = function (open) {
      links.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Scroll reveals ---------- */
  var reveals = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Launch config: email, photo, year ---------- */
  doc.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  doc.querySelectorAll('[data-email]').forEach(function (el) {
    if (cfg.email) {
      var a = doc.createElement('a');
      a.href = 'mailto:' + cfg.email;
      a.textContent = cfg.email;
      el.replaceChildren(a);
    }
  });

  var portrait = doc.querySelector('[data-portrait]');
  if (portrait && cfg.photo) {
    var img = new Image();
    img.alt = 'Portrait of Jacque Platon';
    img.loading = 'lazy';
    img.onload = function () { portrait.replaceChildren(img); };
    img.src = cfg.photo;
  }

  /* ---------- Application form ---------- */
  var form = doc.getElementById('application');
  if (!form) return;

  var status = doc.getElementById('form-status');
  var banner = doc.getElementById('form-banner');
  var connected = Boolean(cfg.formEndpoint);
  if (banner && connected) banner.hidden = true;

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var URLISH = /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#].*)?$/i;

  // name -> validator returning an error message or ''.
  var rules = {
    business: function (v) { return v.length < 2 ? 'Enter your business name.' : ''; },
    trade: function (v) { return v ? '' : 'Select the option closest to your trade.'; },
    area: function (v) { return v.length < 2 ? 'Enter the city or region you serve.' : ''; },
    website: function (v) { return !v || URLISH.test(v) ? '' : 'Enter a web address such as yourcompany.com, or leave this blank.'; },
    challenge: function (v) { return v ? '' : 'Select your main challenge.'; },
    channels: function () {
      return form.querySelector('input[name="channels"]:checked') ? '' : 'Select at least one channel.';
    },
    investment: function () {
      return form.querySelector('input[name="investment"]:checked') ? '' : 'Select the option that best describes your readiness.';
    },
    name: function (v) { return v.length < 2 ? 'Enter your name.' : ''; },
    email: function (v) { return EMAIL.test(v) ? '' : 'Enter a valid email address, such as name@company.com.'; },
    phone: function (v) { return v.replace(/\D/g, '').length >= 7 ? '' : 'Enter a phone number, including area code.'; },
    consent: function () {
      return form.elements.consent.checked ? '' : 'Confirm that you agree to be contacted about this application.';
    }
  };

  function valueOf(name) {
    var el = form.elements[name];
    return el && typeof el.value === 'string' ? el.value.trim() : '';
  }

  function showError(name, message) {
    var err = doc.getElementById('err-' + name);
    if (err) err.textContent = message;
    var els = form.querySelectorAll('[name="' + name + '"]');
    els.forEach(function (el) {
      if (el.type === 'radio' || el.type === 'checkbox') return;
      if (message) el.setAttribute('aria-invalid', 'true');
      else el.removeAttribute('aria-invalid');
    });
    var group = form.querySelector('[data-group="' + name + '"]');
    if (group) {
      if (message) group.setAttribute('aria-invalid', 'true');
      else group.removeAttribute('aria-invalid');
    }
  }

  function validate(name) {
    var message = rules[name](valueOf(name));
    showError(name, message);
    return message;
  }

  // A blur caused by pressing on another control must not move the layout
  // (by showing an error) before that press completes, or the click is lost.
  var pointerDown = false;
  doc.addEventListener('pointerdown', function () { pointerDown = true; }, true);
  ['pointerup', 'pointercancel'].forEach(function (t) {
    doc.addEventListener(t, function () { pointerDown = false; }, true);
  });
  function afterPointer(fn) {
    if (!pointerDown) return fn();
    var run = function () {
      doc.removeEventListener('pointerup', run, true);
      doc.removeEventListener('pointercancel', run, true);
      setTimeout(fn, 0);
    };
    doc.addEventListener('pointerup', run, true);
    doc.addEventListener('pointercancel', run, true);
  }

  Object.keys(rules).forEach(function (name) {
    form.querySelectorAll('[name="' + name + '"]').forEach(function (el) {
      var evt = (el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') ? 'change' : 'blur';
      el.addEventListener(evt, function () { afterPointer(function () { validate(name); }); });
      el.addEventListener('input', function () {
        var err = doc.getElementById('err-' + name);
        if (err && err.textContent) validate(name);
      });
    });
  });

  function setStatus(kind, html) {
    status.className = 'status' + (kind ? ' status--' + kind : '');
    status.innerHTML = html;
  }

  function emailFallback() {
    return cfg.email
      ? ' You can also email <a href="mailto:' + cfg.email + '">' + cfg.email + '</a>.'
      : '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');

    var firstBad = null;
    var count = 0;
    Object.keys(rules).forEach(function (name) {
      if (validate(name)) {
        count += 1;
        if (!firstBad) firstBad = name;
      }
    });

    if (firstBad) {
      setStatus('err', count === 1
        ? 'One field needs attention before you can apply.'
        : count + ' fields need attention before you can apply.');
      var target = form.querySelector('[name="' + firstBad + '"]');
      if (target) target.focus();
      return;
    }

    // Honeypot: real people never fill this.
    if (form.elements.company_site && form.elements.company_site.value) return;

    if (!connected) {
      setStatus('err',
        '<strong>Not sent.</strong> Your answers are valid, but this form is not connected to an inbox or CRM yet, ' +
        'so nothing has been submitted or stored.' + emailFallback());
      return;
    }

    var button = form.querySelector('button[type="submit"]');
    var label = button.textContent;
    button.disabled = true;
    button.textContent = 'Sending…';

    fetch(cfg.formEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var done = doc.getElementById('form-done');
      form.hidden = true;
      done.hidden = false;
      done.focus();
    }).catch(function () {
      button.disabled = false;
      button.textContent = label;
      setStatus('err',
        '<strong>Your application could not be sent.</strong> Nothing was submitted. ' +
        'Check your connection and try again.' + emailFallback());
    });
  });
})();
