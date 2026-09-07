// GET /api/stats : evenements bruts d'une periode pour le dashboard admin (cle admin obligatoire). Sans email.
var L = require('./_lib');
module.exports = async function (req, res) {
  if (req.method !== 'GET') return L.json(res, 405, { error: 'method' });
  if (!L.secretOk(req)) return L.json(res, 401, { error: 'unauthorized' });
  var q = req.query || {};
  var funnelId = L.clean(q.funnel_id || 'quiz', 30);
  var start = new Date(q.start || Date.now() - 7 * 86400000); var end = new Date(q.end || Date.now() + 60000);
  if (isNaN(start) || isNaN(end)) return L.json(res, 400, { error: 'dates' });
  try {
    var rows = await L.sb('funnel_events?select=visitor_id,event_type,event_data,created_at&funnel_id=eq.' + encodeURIComponent(funnelId)
      + '&created_at=gte.' + encodeURIComponent(start.toISOString()) + '&created_at=lte.' + encodeURIComponent(end.toISOString()) + '&order=created_at.desc&limit=20000');
    return L.json(res, 200, { events: rows || [], truncated: (rows || []).length >= 20000 });
  } catch (e) { return L.json(res, 502, { error: e.message }); }
};
