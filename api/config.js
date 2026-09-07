// GET /api/config : la page et l'admin lisent la config publique (textes, couleurs, toggles). Aucun secret dedans.
// POST /api/config : enregistrement, reserve a la cle admin.
var L = require('./_lib');
var BLOCKED = ['supabaseUrl', 'supabaseAnonKey', 'adminPassword', 'funnelId'];
module.exports = async function (req, res) {
  var funnelId = L.clean((req.query && req.query.funnel_id) || (L.body(req).funnel_id) || 'quiz', 30);
  if (req.method === 'GET') {
    if (!L.rate(req, 'config', 120, 600000)) return L.json(res, 429, { error: 'rate' });
    try {
      var rows = await L.sb('funnel_config?select=config&funnel_id=eq.' + encodeURIComponent(funnelId) + '&limit=1');
      return L.json(res, 200, { config: rows && rows[0] ? rows[0].config : null });
    } catch (e) { return L.json(res, 200, { config: null }); }
  }
  if (req.method === 'POST') {
    if (!L.secretOk(req)) return L.json(res, 401, { error: 'unauthorized' });
    var b = L.body(req); var cfg = (b.config && typeof b.config === 'object') ? b.config : null;
    if (!cfg) return L.json(res, 400, { error: 'config manquante' });
    BLOCKED.forEach(function (k) { delete cfg[k]; });
    if (JSON.stringify(cfg).length > 400000) return L.json(res, 413, { error: 'config trop grande' });
    try {
      await L.sb('funnel_config', 'POST', { funnel_id: funnelId, config: cfg, updated_at: new Date().toISOString() }, { 'Prefer': 'resolution=merge-duplicates,return=minimal' });
      return L.json(res, 200, { ok: true });
    } catch (e) { return L.json(res, 502, { error: e.message }); }
  }
  return L.json(res, 405, { error: 'method' });
};
