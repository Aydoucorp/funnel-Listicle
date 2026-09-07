// POST /api/auth : verifie la cle admin cote serveur (comparaison a temps constant, limite a 10 essais / 15 min / IP)
var L = require('./_lib');
module.exports = async function (req, res) {
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });
  if (!L.rate(req, 'auth', 10, 900000)) return L.json(res, 429, { error: 'trop d essais, reessaie dans 15 minutes' });
  var b = L.body(req);
  if (!L.secretOk(req, String(b.secret || ''))) return L.json(res, 401, { error: 'unauthorized' });
  return L.json(res, 200, { ok: true });
};
