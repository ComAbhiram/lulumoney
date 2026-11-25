/*
 * Live sample amounts for the "One world. Multiple currencies." section.
 *
 * Every [data-rate="CODE"] element shows what 100 OMR is worth in that currency (OMR itself
 * shows 100.000). Rates come from the open endpoint of ExchangeRate-API (no key, updated daily):
 * https://www.exchangerate-api.com/docs/free  (attribution link is in the page).
 * Rates are cached for an hour in sessionStorage. If the request fails nothing is shown:
 * amounts stay hidden and the section looks as it did before.
 */
(function () {
  'use strict';

  var SAMPLE = 100;
  var URL = 'https://open.er-api.com/v6/latest/OMR';
  var KEY = 'lulu-omr-rates';
  var TTL = 60 * 60 * 1000;

  var nodes = document.querySelectorAll('[data-rate]');
  if (!nodes.length) return;

  var fmt = new Intl.NumberFormat('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function show(rates) {
    var ok = false;
    nodes.forEach(function (n) {
      var code = n.getAttribute('data-rate');
      if (code === 'OMR') {
        n.textContent = SAMPLE.toFixed(3);
        return;
      }
      var r = rates[code];
      if (typeof r === 'number' && isFinite(r)) {
        n.textContent = fmt.format(SAMPLE * r);
        ok = true;
      }
    });
    if (ok) document.documentElement.classList.add('rates-ready');
  }

  function cached() {
    try {
      var c = JSON.parse(window.sessionStorage.getItem(KEY));
      return c && Date.now() - c.t < TTL ? c.rates : null;
    } catch (e) { return null; }
  }

  function store(rates) {
    try { window.sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), rates: rates })); } catch (e) { /* storage unavailable */ }
  }

  var hit = cached();
  if (hit) { show(hit); return; }

  var ctl = 'AbortController' in window ? new AbortController() : null;
  var timer = ctl ? window.setTimeout(function () { ctl.abort(); }, 6000) : 0;

  window.fetch(URL, ctl ? { signal: ctl.signal } : {})
    .then(function (res) { return res.ok ? res.json() : Promise.reject(new Error('rates ' + res.status)); })
    .then(function (data) {
      if (data && data.result === 'success' && data.rates) { store(data.rates); show(data.rates); }
    })
    .catch(function () { /* leave the amounts hidden */ })
    .then(function () { if (timer) window.clearTimeout(timer); });
})();
