// POST /api/subscribe : lead du quiz -> groupe MailerLite du chemin -> table funnel_leads (cle service, cote serveur)
var L = require('./_lib');

function groupFor(segment, niveau) {
  var seg = String(segment || '').toUpperCase(); var lv = String(niveau || '').toUpperCase();
  return process.env['ML_GROUP_' + seg + '_' + lv] || process.env['ML_GROUP_' + seg] || process.env.ML_GROUP_DEFAULT || '';
}

async function mailerlite(email, prenom, groupId, extra) {
  var token = process.env.MAILERLITE_TOKEN;
  if (!token) throw new Error('MAILERLITE_TOKEN manquant');
  var base = { email: email, fields: { name: prenom }, groups: groupId ? [String(groupId)] : [] };
  var full = JSON.parse(JSON.stringify(base));
  if (process.env.ML_SEND_FIELDS !== '0') {
    full.fields.segment = extra.segment; full.fields.niveau = extra.niveau; full.fields.score = String(extra.score); full.fields.guide_want = extra.want || '';
  }
  var call = async function (b) {
    var r = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(b)
    });
    return { ok: r.ok, status: r.status, txt: await r.text() };
  };
  var r = await call(full);
  if (!r.ok && r.status === 422 && /field/i.test(r.txt)) r = await call(base);
  if (!r.ok) throw new Error('MailerLite ' + r.status + ' : ' + r.txt.substring(0, 200));
}

module.exports = async function (req, res) {
  if (req.method === 'OPTIONS') { res.statusCode = 204; return res.end(); }
  if (req.method !== 'POST') return L.json(res, 405, { error: 'method' });
  if (!L.originOk(req)) return L.json(res, 403, { error: 'origin' });
  if (!L.rate(req, 'subscribe', 20, 600000)) return L.json(res, 429, { error: 'rate' });

  var b = L.body(req);
  if (b.website) return L.json(res, 200, { ok: true }); // honeypot rempli = bot, on fait semblant
  var email = L.clean(b.email, 120).trim().toLowerCase();
  var prenom = L.clean(b.prenom, 60).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || !prenom) return L.json(res, 400, { error: 'invalid' });
  var segment = L.clean(b.segment, 20); var niveau = L.clean(b.niveau, 20); var score = parseInt(b.score, 10) || 0;
  var answers = Array.isArray(b.answers) ? b.answers.slice(0, 12).map(function (a) {
    return { q: L.clean(a.q, 6), opt: parseInt(a.opt, 10) || 0, tag: L.clean(a.tag, 40), pts: parseInt(a.pts, 10) || 0 };
  }) : [];
  var want = (answers.filter(function (a) { return /^want=/.test(a.tag); })[0] || {}).tag;

  try { await mailerlite(email, prenom, groupFor(segment, niveau), { segment: segment, niveau: niveau, score: score, want: want }); }
  catch (e) { console.error(e.message); return L.json(res, 502, { error: 'mailerlite' }); }

  try {
    await L.sb('funnel_leads', 'POST', {
      funnel_id: L.clean(b.funnel_id || 'quiz', 30), visitor_id: L.clean(b.visitor_id, 40), prenom: prenom, email: email,
      segment: segment, niveau: niveau, score: score, answers: answers, page_url: L.clean(b.page_url, 300), created_at: new Date().toISOString()
    }, { 'Prefer': 'return=minimal' });
  } catch (e) { console.error('supabase', e.message); }
  return L.json(res, 200, { ok: true });
};
