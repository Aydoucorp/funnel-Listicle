// POST /api/track : evenements du tracker (par lots). Types autorises uniquement, tailles bornees, limite par IP.
var L = require('./_lib');
var TYPES = ['page_view', 'scroll_25', 'scroll_50', 'scroll_75', 'scroll_100', 'cta_click', 'quiz_start', 'quiz_answer', 'quiz_complete', 'lead', 'lead_error', 'conversion'];
module.exports = async function (req, res) {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });
  if (!L.originOk(req)) return L.json(res, 403, { error: 'origin' });
  if (!L.rate(req, 'track', 300, 600000)) return L.json(res, 429, { error: 'rate' });
  var b = L.body(req);
  var events = Array.isArray(b.events) ? b.events.slice(0, 50) : [];
  var rows = events.filter(function (e) { return e && TYPES.indexOf(e.event_type) !== -1; }).map(function (e) {
    var data = (e.event_data && typeof e.event_data === 'object') ? e.event_data : {};
    var safe = {}; Object.keys(data).slice(0, 12).forEach(function (k) { safe[L.clean(k, 30)] = typeof data[k] === 'number' ? data[k] : L.clean(data[k], 160); });
    return {
      funnel_id: L.clean(b.funnel_id || 'quiz', 30), visitor_id: L.clean(b.visitor_id, 40), event_type: e.event_type, event_data: safe,
      page_url: L.clean(e.page_url, 300), user_agent: L.clean(req.headers['user-agent'], 200), referrer: L.clean(e.referrer, 300),
      created_at: new Date().toISOString()
    };
  });
  if (!rows.length) return L.json(res, 200, { ok: true, n: 0 });
  try { await L.sb('funnel_events', 'POST', rows, { 'Prefer': 'return=minimal' }); } catch (e) { console.error(e.message); }
  return L.json(res, 200, { ok: true, n: rows.length });
};
