/* ============================================================
   GOLDPULSE — app.js
   Chart engine + UI interactions (vanilla JS, no dependencies)
   ============================================================ */
(function () {
  'use strict';

  var DATA = (window.XAU_DATA && window.XAU_DATA.candles) || [];
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var SVGNS = 'http://www.w3.org/2000/svg';

  /* ---------- Format helpers (vi-VN style) ---------- */
  function fmt(n, dec) {
    if (n === null || n === undefined || isNaN(n)) return '—';
    dec = dec === undefined ? 1 : dec;
    var s = Number(n).toFixed(dec);
    var parts = s.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return parts.join(',');
  }
  function fmtDate(iso) {
    var m = ['/01', '/02', '/03', '/04', '/05', '/06', '/07', '/08', '/09', '/10', '/11', '/12'];
    var p = iso.split('-');
    return p[2] + m[+p[1] - 1] + '/' + p[0];
  }

  /* ============================================================
     CANDLESTICK CHART
     ============================================================ */
  var KEY_LEVELS = [
    { p: 4698, label: 'R3', type: 'res' },
    { p: 4554, label: 'R2', type: 'res' },
    { p: 4367, label: 'R1 · Kháng cự then chốt', type: 'res' },
    { p: 4245, label: 'S1 · Hỗ trợ then chốt', type: 'sup' },
    { p: 4190, label: 'FLIP · Ngưỡng phân kỳ', type: 'sup' },
    { p: 4168, label: 'S3', type: 'sup' },
    { p: 4040, label: 'S4', type: 'sup' },
    { p: 4001, label: 'FV · Giá hợp lý', type: 'fv' }
  ];

  var state = {
    range: '1M',
    layers: { sma20: true, sma50: true, levels: true, volume: true }
  };

  var chart = $('#priceChart');
  var wrap = $('#chartWrap');
  var tip = $('#chartTip');

  function el(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    if (attrs) Object.keys(attrs).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }

  function visibleCandles() {
    return state.range === '1M' ? DATA.slice(-22) : DATA.slice(-70);
  }

  function renderChart(animate) {
    if (!chart || !DATA.length) return;
    var data = visibleCandles();
    var W = Math.max(wrap.clientWidth, 320);
    var H = W < 560 ? 320 : (W < 900 ? 380 : 440);
    var padL = 10, padR = 58, padT = 18, padB = 24;
    var volH = state.layers.volume ? Math.round(H * 0.16) : 0;
    var priceH = H - padT - padB - volH - (volH ? 14 : 0);

    // Scale
    var lo = Infinity, hi = -Infinity;
    data.forEach(function (c) {
      lo = Math.min(lo, c.l); hi = Math.max(hi, c.h);
      if (state.layers.sma20 && c.sma20) { lo = Math.min(lo, c.sma20); hi = Math.max(hi, c.sma20); }
      if (state.layers.sma50 && c.sma50) { lo = Math.min(lo, c.sma50); hi = Math.max(hi, c.sma50); }
    });
    if (state.layers.levels) {
      KEY_LEVELS.forEach(function (lv) {
        if (lv.p > lo - 40 && lv.p < hi + 40) { lo = Math.min(lo, lv.p); hi = Math.max(hi, lv.p); }
      });
    }
    var pad = (hi - lo) * 0.06;
    lo -= pad; hi += pad;

    var step = (W - padL - padR) / data.length;
    var cw = Math.max(2.2, Math.min(11, step * 0.62));
    function x(i) { return padL + i * step + step / 2; }
    function y(p) { return padT + (hi - p) / (hi - lo) * priceH; }

    chart.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    chart.setAttribute('width', W);
    chart.setAttribute('height', H);
    chart.innerHTML = '';

    // ---- Grid + Y labels
    var ticks = 5;
    for (var t = 0; t <= ticks; t++) {
      var p = lo + (hi - lo) * (t / ticks);
      var gy = y(p);
      var line = el('line', { x1: padL, x2: W - padR, y1: gy, y2: gy, stroke: 'rgba(148,163,184,.08)', 'stroke-width': 1 });
      chart.appendChild(line);
      var lab = el('text', { x: W - padR + 8, y: gy + 4, fill: '#77869c', 'font-size': 10.5, 'font-family': 'Inter, sans-serif' });
      lab.textContent = fmt(p, 0);
      chart.appendChild(lab);
    }

    // ---- X labels
    var labelEvery = Math.ceil(data.length / 7);
    data.forEach(function (c, i) {
      if (i % labelEvery !== 0 && i !== data.length - 1) return;
      var tx = el('text', { x: x(i), y: H - 6, fill: '#77869c', 'font-size': 10, 'text-anchor': 'middle', 'font-family': 'Inter, sans-serif' });
      tx.textContent = fmtDate(c.d);
      chart.appendChild(tx);
    });

    // ---- Key levels
    if (state.layers.levels) {
      KEY_LEVELS.forEach(function (lv) {
        if (lv.p < lo || lv.p > hi) return;
        var ly = y(lv.p);
        var col = lv.type === 'res' ? '#f6465d' : (lv.type === 'fv' ? '#f7d070' : '#2ebd85');
        chart.appendChild(el('line', {
          x1: padL, x2: W - padR, y1: ly, y2: ly,
          stroke: col, 'stroke-width': 1, 'stroke-dasharray': '5 5', opacity: 0.55
        }));
        var tag = el('text', { x: padL + 6, y: ly - 5, fill: col, 'font-size': 10, 'font-weight': 700, 'font-family': 'Inter, sans-serif', opacity: 0.95 });
        tag.textContent = lv.label;
        chart.appendChild(tag);
      });
    }

    // ---- Volume
    var maxVol = 0;
    data.forEach(function (c) { maxVol = Math.max(maxVol, c.v); });
    var volTop = H - padB - volH;
    if (state.layers.volume) {
      chart.appendChild(el('line', { x1: padL, x2: W - padR, y1: volTop, y2: volTop, stroke: 'rgba(148,163,184,.12)', 'stroke-width': 1 }));
      data.forEach(function (c, i) {
        var vh = (c.v / maxVol) * (volH - 4);
        var col = c.c >= c.o ? 'rgba(46,189,133,.35)' : 'rgba(246,70,93,.35)';
        chart.appendChild(el('rect', {
          x: x(i) - cw / 2, y: volTop + volH - vh, width: cw, height: Math.max(vh, 1),
          fill: col, rx: 1
        }));
      });
    }

    // ---- SMA lines
    function smaPath(key, color) {
      var d = '', started = false;
      data.forEach(function (c, i) {
        var v = c[key];
        if (v === null || v === undefined) return;
        d += (started ? ' L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
        started = true;
      });
      if (!started) return;
      var path = el('path', { d: d, fill: 'none', stroke: color, 'stroke-width': 1.8, 'stroke-linejoin': 'round', opacity: 0.9 });
      chart.appendChild(path);
      if (animate) {
        var len = path.getTotalLength ? path.getTotalLength() : 0;
        if (len) {
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          path.style.transition = 'stroke-dashoffset 1.1s ease .25s';
          requestAnimationFrame(function () { path.style.strokeDashoffset = '0'; });
        }
      }
    }
    if (state.layers.sma20) smaPath('sma20', '#f7d070');
    if (state.layers.sma50) smaPath('sma50', '#7dd3fc');

    // ---- Candles
    var g = el('g');
    chart.appendChild(g);
    data.forEach(function (c, i) {
      var up = c.c >= c.o;
      var col = up ? '#2ebd85' : '#f6465d';
      var grp = el('g');
      grp.appendChild(el('line', { x1: x(i), x2: x(i), y1: y(c.h), y2: y(c.l), stroke: col, 'stroke-width': 1.1 }));
      var bodyH = Math.max(Math.abs(y(c.o) - y(c.c)), 1.4);
      var body = el('rect', {
        x: x(i) - cw / 2, y: Math.min(y(c.o), y(c.c)), width: cw, height: bodyH,
        fill: up ? 'rgba(46,189,133,.85)' : 'rgba(246,70,93,.85)', stroke: col, 'stroke-width': 0.8, rx: 1
      });
      grp.appendChild(body);
      if (animate) {
        grp.style.opacity = '0';
        grp.style.transition = 'opacity .5s ease';
        grp.style.transitionDelay = (i * 12) + 'ms';
      }
      g.appendChild(grp);
    });
    if (animate) requestAnimationFrame(function () {
      $$('g', g).forEach(function (grp) { grp.style.opacity = '1'; });
    });

    // ---- Crosshair group
    var cross = el('g', { id: 'cross', visibility: 'hidden' });
    var vLine = el('line', { y1: padT, y2: H - padB, stroke: 'rgba(233,238,247,.35)', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
    var hLine = el('line', { x1: padL, x2: W - padR, stroke: 'rgba(233,238,247,.35)', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
    var hTag = el('rect', { x: W - padR + 2, width: padR - 4, height: 17, rx: 4, fill: '#f7d070' });
    var hTagTxt = el('text', { x: W - padR + 6, fill: '#1a1405', 'font-size': 10.5, 'font-weight': 700, 'font-family': 'Inter, sans-serif' });
    cross.appendChild(vLine); cross.appendChild(hLine); cross.appendChild(hTag); cross.appendChild(hTagTxt);
    chart.appendChild(cross);

    chart._geom = { W: W, H: H, padL: padL, padR: padR, padT: padT, padB: padB, step: step, x: x, y: y, data: data, lo: lo, hi: hi };
  }

  /* ---------- Chart interactions ---------- */
  function chartMove(ev) {
    if (!chart._geom) return;
    var g = chart._geom;
    var rect = chart.getBoundingClientRect();
    var px = (ev.clientX - rect.left) * (g.W / rect.width);
    var py = (ev.clientY - rect.top) * (g.H / rect.height);
    var i = Math.round((px - g.padL - g.step / 2) / g.step);
    i = Math.max(0, Math.min(g.data.length - 1, i));
    var c = g.data[i];
    var cx = g.x(i);

    var cross = $('#cross', chart);
    if (!cross) return;
    cross.setAttribute('visibility', 'visible');
    var lines = cross.getElementsByTagName('line');
    lines[0].setAttribute('x1', cx); lines[0].setAttribute('x2', cx);
    lines[1].setAttribute('y1', py); lines[1].setAttribute('y2', py);
    var price = g.hi - (py - g.padT) / (g.H - g.padT - g.padB) * (g.hi - g.lo);
    var tagRect = cross.getElementsByTagName('rect')[0];
    var tagTxt = cross.getElementsByTagName('text')[0];
    var ty = Math.max(g.padT, Math.min(py - 8, g.H - g.padB - 17));
    tagRect.setAttribute('y', ty);
    tagTxt.setAttribute('y', ty + 12);
    tagTxt.textContent = fmt(price, 1);

    // Tooltip
    tip.hidden = false;
    $('#tipDate').textContent = fmtDate(c.d) + '/' + c.d.slice(0, 4);
    $('#tipOpen').textContent = fmt(c.o);
    $('#tipHigh').textContent = fmt(c.h);
    $('#tipLow').textContent = fmt(c.l);
    $('#tipClose').textContent = fmt(c.c);
    $('#tipVol').textContent = (c.v / 1000).toFixed(1).replace('.', ',') + 'K';
    var tw = tip.offsetWidth, th = tip.offsetHeight;
    var left = (cx / g.W) * rect.width + 18;
    if (left + tw > rect.width - 6) left = (cx / g.W) * rect.width - tw - 18;
    tip.style.left = Math.max(6, left) + 'px';
    tip.style.top = Math.max(6, (py / g.H) * rect.height - th / 2) + 'px';
  }
  function chartLeave() {
    var cross = $('#cross', chart);
    if (cross) cross.setAttribute('visibility', 'hidden');
    if (tip) tip.hidden = true;
  }
  if (chart) {
    chart.addEventListener('pointermove', chartMove);
    chart.addEventListener('pointerleave', chartLeave);
  }

  /* ---------- Tabs & toggles ---------- */
  $$('.tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.tab').forEach(function (b) { b.classList.remove('is-active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      state.range = btn.dataset.range;
      renderChart(true);
    });
  });
  $$('.toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.dataset.layer;
      state.layers[key] = !state.layers[key];
      btn.classList.toggle('is-active', state.layers[key]);
      renderChart(false);
    });
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { renderChart(false); }, 150);
  });

  /* ============================================================
     LEVELS VISUALIZATION
     ============================================================ */
  function buildLevels() {
    var host = $('#levelsViz');
    if (!host) return;
    var max = 4780, min = 3950, cur = 4321;
    function pos(p) { return ((max - p) / (max - min)) * 100; }

    // Decision zone
    var zone = document.createElement('div');
    zone.className = 'levels__zone';
    zone.style.top = pos(4367) + '%';
    zone.style.height = (pos(4245) - pos(4367)) + '%';
    zone.innerHTML = '<span>VÙNG QUYẾT ĐỊNH 4.245 – 4.367</span>';
    host.appendChild(zone);

    KEY_LEVELS.forEach(function (lv, idx) {
      var row = document.createElement('div');
      row.className = 'level-row level-row--' + lv.type + (idx % 2 ? ' level-row--right' : '');
      row.style.top = pos(lv.p) + '%';
      var tag = document.createElement('span');
      tag.className = 'level-row__tag';
      tag.innerHTML = lv.label + ' <small>' + fmt(lv.p, 0) + '</small>';
      if (idx % 2) tag.style.marginLeft = 'auto', tag.style.marginRight = '14px';
      row.appendChild(tag);
      host.appendChild(row);
    });

    // Current price marker
    var marker = document.createElement('div');
    marker.className = 'price-marker';
    marker.style.top = pos(cur) + '%';
    marker.innerHTML = '<span class="price-marker__tag">GIÁ HIỆN TẠI · 4.321</span>';
    host.appendChild(marker);
  }

  /* ============================================================
     BIAS GAUGE
     ============================================================ */
  function initGauge() {
    var arc = $('#gaugeArc');
    var needle = $('#gaugeNeedle');
    if (!arc || !needle) return;
    var len = Math.PI * 100; // semicircle r=100
    var bias = 0.35; // 0 = giảm mạnh, 1 = tăng mạnh
    arc.style.strokeDasharray = len + ' ' + len;
    arc.style.strokeDashoffset = len;
    arc.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.3,1) .3s';
    needle.style.transition = 'transform 1.4s cubic-bezier(.2,.8,.3,1) .3s';
    setTimeout(function () {
      arc.style.strokeDashoffset = String(len * (1 - 0.5));
      needle.setAttribute('transform', 'rotate(' + (-90 + bias * 180) + ' 120 124)');
    }, 350);
  }

  /* ============================================================
     SIMULATED REFERENCE PRICE (nav pill)
     ============================================================ */
  function initTickerPrice() {
    var navPrice = $('#navPrice');
    var navChange = $('#navChange');
    if (!navPrice) return;
    var base = 4321.0;
    var weekAgo = 4416.0;
    var cur = base;
    setInterval(function () {
      cur += (Math.random() - 0.5) * 1.6;
      cur = Math.max(4300, Math.min(4345, cur));
      navPrice.textContent = fmt(cur, 1);
      var chg = ((cur - weekAgo) / weekAgo) * 100;
      navChange.textContent = (chg >= 0 ? '+' : '') + chg.toFixed(2).replace('.', ',') + '%';
      navChange.classList.toggle('down', chg < 0);
      navChange.classList.toggle('up', chg >= 0);
    }, 2200);
  }

  /* ============================================================
     TICKER: nhân bản nội dung để vòng lặp liền mạch
     ============================================================ */
  function initTicker() {
    var track = $('#tickerTrack');
    if (!track) return;
    var group = track.firstElementChild;
    if (group) {
      var clone = group.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    }
  }

  /* ============================================================
     NAV: scroll state, mobile menu, active link
     ============================================================ */
  function initNav() {
    var nav = $('#nav');
    var burger = $('#navBurger');
    var links = $('#navLinks');
    var toTop = $('#toTop');

    function onScroll() {
      var y = window.scrollY || window.pageYOffset;
      nav.classList.toggle('is-scrolled', y > 12);
      toTop.classList.toggle('is-visible', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    burger.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', links).forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Active link
    var sections = $$('main section[id]');
    var linkMap = {};
    $$('a', links).forEach(function (a) {
      linkMap[a.getAttribute('href').slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove('is-active'); });
          var a = linkMap[en.target.id];
          if (a) a.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ============================================================
     REVEAL ON SCROLL
     ============================================================ */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ============================================================
     SCENARIO DETAILS
     ============================================================ */
  function initScenarios() {
    $$('.scen').forEach(function (card) {
      var btn = $('.scen__more', card);
      var detail = $('.scen__detail', card);
      if (!btn || !detail) return;
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = detail.hidden;
        detail.hidden = !open;
        btn.setAttribute('aria-expanded', String(open));
        btn.innerHTML = (open ? 'Thu gọn ' : 'Chi tiết kế hoạch ') + '<span>+</span>';
      });
    });
  }

  /* ============================================================
     NEWSLETTER + TOAST
     ============================================================ */
  var toastTimer;
  function showToast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-visible'); }, 3600);
  }
  function initNewsletter() {
    var form = $('#newsletterForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = $('#newsletterEmail').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Vui lòng nhập email hợp lệ.');
        return;
      }
      showToast('✓ Đã đăng ký! Bản tin demo sẽ gửi vào Chủ nhật tới.');
      form.reset();
    });
  }

  /* ============================================================
     SMOOTH ANCHOR (with fixed header offset fallback)
     ============================================================ */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     INIT
     ============================================================ */
  function init() {
    buildLevels();
    renderChart(true);
    initGauge();
    initTicker();
    initTickerPrice();
    initNav();
    initReveal();
    initScenarios();
    initNewsletter();
    initAnchors();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
