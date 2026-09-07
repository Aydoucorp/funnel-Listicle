// Helpers partages. Fichier prefixe par _ : Vercel ne l'expose pas comme route.
var crypto = require('crypto');
var RATE = {};

function json(res, status, body) { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); }
function body(req) { var b = req.body; if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } } return b || {}; }
function ip(req) { return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'ip'; }
function rate(req, bucket, max, windowMs) {
  var k = bucket + ':' + ip(req); var now = Date.now();
  RATE[k] = (RATE[k] || []).filter(function (t) { return now - t < windowMs; });
  if (RATE[k].length >= max) return false;
  RATE[k].push(now); return true;
}
function originOk(req) {
  var list = (process.env.ALLOWED_ORIGINS || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
  if (!list.length) return true;
  var o = req.headers.origin || (req.headers.referer ? req.headers.referer.split('/').slice(0, 3).join('/') : '');
  return list.indexOf(o) !== -1;
}
function secretOk(req, provided) {
  var expected = process.env.ADMIN_SECRET || '';
  var given = provided !== undefined ? provided : (req.headers['x-admin-secret'] || '');
  if (!expected || expected.length < 16 || typeof given !== 'string') return false;
  var a = Buffer.from(given); var b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
async function sb(path, method, payload, extraHeaders) {
  var url = process.env.SUPABASE_URL; var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('supabase non configure');
  var r = await fetch(url.replace(/\/$/, '') + '/rest/v1/' + path, {
    method: method || 'GET',
    headers: Object.assign({ 'apikey': key, 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' }, extraHeaders || {}),
    body: payload ? JSON.stringify(payload) : undefined
  });
  var txt = await r.text(); var data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
  if (!r.ok) throw new Error('supabase ' + r.status + ' ' + String(txt).substring(0, 200));
  return data;
}
function clean(s, n) { return String(s == null ? '' : s).substring(0, n); }
module.exports = { json: json, body: body, rate: rate, originOk: originOk, secretOk: secretOk, sb: sb, clean: clean };
