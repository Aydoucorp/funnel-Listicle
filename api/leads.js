// GET /api/leads : lecture des leads pour l'admin (cle admin obligatoire, cle service Supabase cote serveur)
var L = require('./_lib');
module.exports = async function (req, res) {
  if (req.method !== 'GET') return L.json(res, 405, { error: 'method' });
  if (!L.secretOk(req)) return L.json(res, 401, { error: 'unauthorized' });
  var funnelId = L.clean((req.query && req.query.funnel_id) || 'quiz', 30);
  try {
    var rows = await L.sb('funnel_leads?select=created_at,prenom,email,segment,niveau,score,answers&funnel_id=eq.' + encodeURIComponent(funnelId) + '&order=created_at.desc&limit=2000');
    return L.json(res, 200, { leads: rows || [] });
  } catch (e) { return L.json(res, 502, { error: e.message }); }
};
