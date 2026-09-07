(function () {
  'use strict';
  var CFG = window.FUNNEL_CONFIG || {};
  var visitorId = 'v-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
  var scrollMilestones = { 25: false, 50: false, 75: false, 100: false };
  var base = (CFG.apiBase || '').replace(/\/$/, '');
  var queue = []; var timer = null;

  // Meta Pixel
  if (CFG.metaPixelId) {
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', CFG.metaPixelId);
    window.fbq('track', 'PageView');
  }
  // Google Analytics
  if (CFG.gaId) {
    var s = document.createElement('script'); s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + CFG.gaId; document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', CFG.gaId);
  }

  function flush(useBeacon) {
    if (!queue.length) return;
    var body = JSON.stringify({ funnel_id: CFG.funnelId || 'quiz', visitor_id: visitorId, events: queue.splice(0, 50) });
    var url = base + '/api/track';
    if (useBeacon && navigator.sendBeacon) { try { navigator.sendBeacon(url, new Blob([body], { type: 'application/json' })); return; } catch (e) {} }
    try { fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: body, keepalive: true }).catch(function () {}); } catch (e) {}
  }

  function track(type, data) {
    queue.push({ event_type: type, event_data: data || {}, page_url: location.href, referrer: document.referrer || null, created_at: new Date().toISOString() });
    clearTimeout(timer); timer = setTimeout(function () { flush(false); }, 800);
    if (window.fbq && CFG.metaPixelId) {
      if (type === 'lead') window.fbq('track', 'Lead', data || {});
      else if (type === 'quiz_start') window.fbq('trackCustom', 'QuizStart', data || {});
      else if (type === 'quiz_complete') window.fbq('trackCustom', 'QuizComplete', data || {});
      else if (type === 'cta_click') window.fbq('trackCustom', 'CtaClick', data || {});
    }
    if (window.gtag && CFG.gaId) window.gtag('event', type, data || {});
  }
  window.addEventListener('pagehide', function () { flush(true); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') flush(true); });

  track('page_view', { path: location.pathname, search: location.search });

  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    setTimeout(function () {
      ticking = false;
      var h = document.documentElement;
      var max = (h.scrollHeight - h.clientHeight) || 1;
      var pct = Math.round((window.scrollY / max) * 100);
      [25, 50, 75, 100].forEach(function (m) { if (!scrollMilestones[m] && pct >= m) { scrollMilestones[m] = true; track('scroll_' + m, { pct: pct }); } });
    }, 200);
  }, { passive: true });

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]'); if (!el) return;
    track('cta_click', { cta: el.getAttribute('data-cta'), text: (el.textContent || '').trim().substring(0, 80) });
  });

  window.FunnelTracker = { track: track, visitorId: visitorId, flush: flush };
})();
