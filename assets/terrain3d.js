/* ==========================================================================
   terrain3d.js — Bản đồ địa hình 3D Việt Nam (MapLibre GL JS)
   --------------------------------------------------------------------------
   - Nghiêng / xoay / thu phóng như Google Earth (chuột phải hoặc Ctrl + kéo để nghiêng-xoay)
   - Địa hình 3D thật từ DEM Terrarium (AWS Open Data – Mapzen/Joerd), không cần API key
   - Chế độ quả cầu (globe), quay quanh, độ nhấn địa hình, đổi lớp nền, bay tới địa danh
   Dùng: <script src="assets/terrain3d.js"></script> rồi VN3D.init({ container:'map3d' });
   ========================================================================== */
(function (global) {
  'use strict';

  /* ------------------------------- Nguồn dữ liệu ------------------------- */
  var TERRARIUM = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
  var ESRI_IMG  = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
  var OFM       = 'https://tiles.openfreemap.org/styles/';
  var OPENTOPO  = [
    'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
    'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
    'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
  ];

  var DEM_SOURCE = {
    type: 'raster-dem', tiles: [TERRARIUM], encoding: 'terrarium', tileSize: 256, maxzoom: 13,
    attribution: 'DEM: <a href="https://registry.opendata.aws/terrain-tiles/">Mapzen/Joerd (AWS Open Data)</a>'
  };

  var SKY = {
    'sky-color': '#0e1c2a',
    'sky-horizon-blend': 0.55,
    'horizon-color': '#e3c58a',
    'horizon-fog-blend': 0.55,
    'fog-color': '#c9b48c',
    'fog-ground-blend': 0.7,
    'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 7, 0.6, 11, 0]
  };

  var BASEMAPS = [
    { id: 'sat',   name: '🛰️ Vệ tinh',  kind: 'raster', tileSize: 256, maxzoom: 18,
      tiles: [ESRI_IMG], attribution: 'Ảnh: Esri, Maxar, Earthstar Geographics', bg: '#050a0f' },
    { id: 'topo',  name: '🏔️ Địa hình', kind: 'raster', tileSize: 256, maxzoom: 17,
      tiles: OPENTOPO, attribution: '&copy; OpenStreetMap, <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)', bg: '#0b1410' },
    { id: 'dark',  name: '🌙 Tối',      kind: 'style', url: OFM + 'dark' },
    { id: 'light', name: '☀️ Sáng',     kind: 'style', url: OFM + 'liberty' }
  ];

  /* Điểm bay tới: [tên, lat, lng, zoom, pitch, bearing] */
  var PLACES = [
    ['Fansipan',        22.3033, 103.7750, 12.4, 72, -25],
    ['Sa Pa',           22.3364, 103.8438, 12.6, 68,  20],
    ['Vịnh Hạ Long',    20.9100, 107.1833, 12.2, 66, -40],
    ['Hà Giang – Mã Pí Lèng', 23.2400, 105.4100, 12.0, 70, 35],
    ['Đà Nẵng – Hải Vân', 16.1917, 108.1306, 12.2, 68, -55],
    ['Nha Trang',       12.2388, 109.1967, 12.0, 64,  25],
    ['Đà Lạt',          11.9404, 108.4583, 12.2, 66, -30],
    ['TP.HCM',          10.7769, 106.7009, 12.4, 62,  15],
    ['Phú Quốc',        10.2300, 103.9600, 11.6, 64, -20],
    ['Cà Mau',           9.1769, 105.1500, 11.8, 66,  30],
    ['Toàn quốc',       16.6000, 106.6000,  5.2, 55, -18]
  ];

  var PEAKS = [
    ['Fansipan', 3143, 22.3033, 103.7750], ['Pu Si Lung', 3076, 22.5167, 102.9167],
    ['Putaleng', 3049, 22.4275, 103.4069], ['Kỳ Quan San', 3046, 22.5083, 103.6103],
    ['Tả Liên Sơn', 2996, 22.3833, 103.5833], ['Tà Xùa', 2865, 21.3908, 104.3214],
    ['Ngọc Linh', 2598, 15.0611, 107.9838], ['Phu Hoạt', 2452, 19.2397, 104.5842],
    ['Tây Côn Lĩnh', 2419, 22.8333, 104.9167], ['Chư Yang Sin', 2405, 12.4000, 108.4167],
    ['Langbiang', 2167, 12.0417, 108.4331], ['Bà Đen', 986, 11.3667, 106.1667]
  ];

  var CITIES = [
    ['Hà Nội', 21.0278, 105.8342], ['Hải Phòng', 20.8449, 106.6881], ['TP.HCM', 10.7769, 106.7009],
    ['Cần Thơ', 10.0452, 105.7469], ['Đà Nẵng', 16.0544, 108.2022], ['Huế', 16.4637, 107.5909],
    ['Vinh', 18.6796, 105.6813], ['Nha Trang', 12.2388, 109.1967], ['Đà Lạt', 11.9404, 108.4583],
    ['Buôn Ma Thuột', 12.6667, 108.0500], ['Pleiku', 13.9833, 108.0000], ['Quy Nhơn', 13.7829, 109.2196],
    ['Hạ Long', 20.9500, 107.0833], ['Lào Cai', 22.4809, 103.9757], ['Vũng Tàu', 10.3460, 107.0843],
    ['Cà Mau', 9.1769, 105.1500]
  ];

  var ISLANDS = [
    ['Phú Quốc', 10.2300, 103.9600], ['Cát Bà', 20.7833, 107.0500], ['Côn Đảo', 8.6833, 106.6167],
    ['Bạch Long Vĩ', 20.1333, 107.7167], ['Lý Sơn', 15.3833, 109.1167], ['Phú Quý', 10.5167, 108.9333],
    ['Quần đảo Hoàng Sa', 16.5000, 112.0000], ['Quần đảo Trường Sa', 9.5000, 114.0000]
  ];

  var VIEW = { center: [106.6, 16.6], zoom: 5.2, pitch: 55, bearing: -18 };

  /* ================================ TIỆN ÍCH ============================== */
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function rasterStyle(bm) {
    return {
      version: 8,
      sources: {
        base: { type: 'raster', tiles: bm.tiles, tileSize: bm.tileSize || 256, maxzoom: bm.maxzoom || 18, attribution: bm.attribution }
      },
      layers: [
        { id: 'base-bg', type: 'background', paint: { 'background-color': bm.bg || '#08121a' } },
        { id: 'base', type: 'raster', source: 'base' }
      ]
    };
  }

  /* ================================ APP ================================== */
  function init(opts) {
    opts = opts || {};
    var container = document.getElementById(opts.container || 'map3d');
    if (!container) return null;

    var wrap = el('div', 't3d-wrap');
    var mapEl = el('div', 't3d-map');
    wrap.appendChild(mapEl);
    container.innerHTML = '';
    container.appendChild(wrap);

    /* --- Lớp phủ tải / lỗi --- */
    var loading = el('div', 't3d-loading', '<div class="t3d-spinner"></div><div>Đang dựng địa hình 3D Việt Nam…</div>');
    wrap.appendChild(loading);

    function fail(msg) {
      loading.classList.remove('t3d-hide');
      loading.innerHTML = '<div class="t3d-err">' + msg + '</div>';
    }

    if (typeof global.maplibregl === 'undefined') {
      fail('Không tải được thư viện bản đồ 3D (MapLibre GL JS) — cần kết nối Internet. ' +
           'Bạn vẫn có thể xem <a href="vietnam-terrain-map.html">bản đồ địa hình 2D</a>.');
      return null;
    }
    /* Kiểm tra WebGL */
    try {
      var probe = document.createElement('canvas');
      if (!(probe.getContext('webgl2') || probe.getContext('webgl'))) throw new Error('no webgl');
    } catch (e) {
      fail('Trình duyệt không hỗ trợ WebGL nên không thể hiển thị bản đồ 3D. ' +
           'Hãy thử Chrome/Edge/Firefox mới, hoặc xem <a href="vietnam-terrain-map.html">bản đồ địa hình 2D</a>.');
      return null;
    }

    var state = {
      basemap: opts.basemap || 'sat',
      exaggeration: 1.6,
      terrainOn: true,
      orbit: false,
      globe: false
    };

    var maplibregl = global.maplibregl;
    var first = BASEMAPS[0];
    BASEMAPS.forEach(function (b) { if (b.id === state.basemap) first = b; });

    var map = new maplibregl.Map({
      container: mapEl,
      style: first.kind === 'raster' ? rasterStyle(first) : first.url,
      center: VIEW.center,
      zoom: VIEW.zoom - 0.9,
      pitch: VIEW.pitch,
      bearing: VIEW.bearing,
      maxPitch: 85,
      minZoom: 2.2,
      maxZoom: 18,
      antialias: true,
      cooperativeGestures: true,       /* Ctrl + cuộn để zoom, không "cướp" cuộn trang */
      attributionControl: { compact: true }
    });
    global.__vn3d = map;

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showCompass: true, showZoom: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ maxWidth: 110, unit: 'metric' }), 'bottom-right');
    if (maplibregl.FullscreenControl) map.addControl(new maplibregl.FullscreenControl(), 'top-right');

    /* --------------------- Nền địa hình + bầu trời ------------------------ */
    function firstSymbolId() {
      var layers = (map.getStyle() && map.getStyle().layers) || [];
      for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') return layers[i].id;
      }
      return undefined;
    }

    function applyOverlays() {
      try {
        if (!map.getSource('dem')) map.addSource('dem', JSON.parse(JSON.stringify(DEM_SOURCE)));
        if (state.terrainOn) {
          map.setTerrain({ source: 'dem', exaggeration: state.exaggeration });
        } else {
          map.setTerrain(null);
        }
        if (!map.getLayer('vn-hillshade')) {
          var hs = {
            id: 'vn-hillshade', type: 'hillshade', source: 'dem',
            paint: {
              'hillshade-exaggeration': 0.28,
              'hillshade-shadow-color': '#16211c',
              'hillshade-highlight-color': '#f6ecd2',
              'hillshade-accent-color': '#7a6634',
              'hillshade-illumination-direction': 315
            }
          };
          var before = firstSymbolId();
          if (before) map.addLayer(hs, before); else map.addLayer(hs);
        }
        /* Bầu trời / khí quyển */
        if (typeof map.setSky === 'function') {
          map.setSky(SKY);
        } else if (!map.getLayer('vn-sky')) {
          map.addLayer({ id: 'vn-sky', type: 'sky', paint: SKY });
        }
      } catch (err) {
        /* Bỏ qua: một số phiên bản không hỗ trợ thuộc tính này */
      }
    }
    map.on('style.load', applyOverlays);

    /* Hiệu ứng mở đầu: bay vào Việt Nam */
    map.on('load', function () {
      loading.classList.add('t3d-hide');
      setTimeout(function () { loading.style.display = 'none'; }, 600);
      map.flyTo({ center: VIEW.center, zoom: VIEW.zoom, pitch: VIEW.pitch, bearing: VIEW.bearing, duration: 4200, essential: true });
      /* Nhãn: ẩn bớt khi zoom xa */
      var sync = function () {
        var z = map.getZoom();
        wrap.classList.toggle('t3d-lowzoom', z < 6.4);
        wrap.classList.toggle('t3d-farzoom', z < 4.6);
      };
      sync();
      map.on('zoom', sync);
    });

    var errShown = false;
    map.on('error', function (e) {
      if (errShown) return;
      var msg = (e && e.error && e.error.message) || '';
      if (/style|sprite|glyph/i.test(msg)) {
        errShown = true;
        showNote('Một phần dữ liệu nền bản đồ không tải được (mạng chặn hoặc quá tải). Hãy thử đổi lớp nền khác.');
      }
    });

    /* ------------------------------- Marker ------------------------------ */
    function makeMarker(cls, labelCls, label, html) {
      var node = el('div', 't3d-marker');
      var dot = el('div', cls);
      node.appendChild(dot);
      if (label) node.appendChild(el('div', labelCls, label));
      return { node: node, html: html };
    }

    function addMarker(lat, lng, node, html, flyOpts) {
      var mk = new maplibregl.Marker({ element: node, anchor: 'center' }).setLngLat([lng, lat]);
      if (html) mk.setPopup(new maplibregl.Popup({ offset: 16, closeButton: false }).setHTML(html));
      mk.addTo(map);
      node.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (flyOpts) map.flyTo(flyOpts);
      });
      return mk;
    }

    PEAKS.forEach(function (p) {
      var html = '<h4>▲ ' + p[0] + '</h4><div><span class="k">Độ cao:</span> <b>' + p[1].toLocaleString('vi-VN') + ' m</b></div>';
      var m = makeMarker('t3d-peak-dot', 't3d-peak-label', p[0] + '<b>' + p[1].toLocaleString('vi-VN') + ' m</b>', html);
      addMarker(p[2], p[3], m.node, html, { center: [p[3], p[2]], zoom: 12.2, pitch: 72, duration: 2600, essential: true });
    });

    CITIES.forEach(function (c) {
      var html = '<h4>' + c[0] + '</h4><div class="k">' + c[1].toFixed(3) + '°N, ' + c[2].toFixed(3) + '°E</div>';
      var m = makeMarker('t3d-city-dot', 't3d-city-label', c[0], html);
      addMarker(c[1], c[2], m.node, html, { center: [c[2], c[1]], zoom: 12.0, pitch: 65, duration: 2200, essential: true });
    });

    ISLANDS.forEach(function (i) {
      var html = '<h4>🏝️ ' + i[0] + '</h4><div class="k">' + i[1].toFixed(3) + '°N, ' + i[2].toFixed(3) + '°E</div>' +
                 (/Hoàng Sa|Trường Sa/.test(i[0]) ? '<div class="k">Vị trí tham khảo cho khu vực quần đảo.</div>' : '');
      var m = makeMarker('t3d-island-dot', 't3d-island-label', i[0], html);
      addMarker(i[1], i[2], m.node, html, { center: [i[2], i[1]], zoom: 10.5, pitch: 60, duration: 2400, essential: true });
    });

    /* ------------------------------- Panel ------------------------------- */
    var panel = document.getElementById(opts.panel || 'map3d-panel');
    var noteEl = null;
    function showNote(text) {
      if (!noteEl) return;
      noteEl.innerHTML = text;
    }

    if (panel) {
      panel.className = 't3d-panel';
      panel.innerHTML = '';

      var head = el('div', 't3d-head');
      head.appendChild(el('h3', null, 'Khám phá Việt Nam 3D'));
      var collapse = el('button', 't3d-toggle-panel', '▾');
      collapse.type = 'button';
      collapse.title = 'Thu gọn / mở rộng';
      collapse.addEventListener('click', function () {
        panel.classList.toggle('t3d-collapsed');
        collapse.textContent = panel.classList.contains('t3d-collapsed') ? '▸' : '▾';
      });
      head.appendChild(collapse);
      panel.appendChild(head);

      var body = el('div', 't3d-body');
      panel.appendChild(body);

      /* Lớp nền */
      var g1 = el('div', 't3d-group');
      g1.appendChild(el('div', 't3d-label', '<span>Lớp nền</span>'));
      var chips1 = el('div', 't3d-chips');
      var chipEls = {};
      BASEMAPS.forEach(function (b) {
        var c = el('button', 't3d-chip', b.name);
        c.type = 'button';
        if (b.id === state.basemap) c.classList.add('active');
        c.addEventListener('click', function () { setBasemap(b.id); });
        chips1.appendChild(c);
        chipEls[b.id] = c;
      });
      g1.appendChild(chips1);
      body.appendChild(g1);

      /* Bay tới */
      var g2 = el('div', 't3d-group');
      g2.appendChild(el('div', 't3d-label', '<span>Bay tới</span>'));
      var chips2 = el('div', 't3d-chips');
      PLACES.forEach(function (p) {
        var c = el('button', 't3d-chip', p[0]);
        c.type = 'button';
        c.addEventListener('click', function () {
          map.flyTo({ center: [p[2], p[1]], zoom: p[3], pitch: p[4], bearing: p[5], duration: 3200, essential: true });
        });
        chips2.appendChild(c);
      });
      g2.appendChild(chips2);
      body.appendChild(g2);

      /* Độ nhấn địa hình */
      var g3 = el('div', 't3d-group');
      g3.appendChild(el('div', 't3d-label', '<span>Độ nhấn địa hình</span><b id="t3d-exag-val">×1.6</b>'));
      var exag = el('input', 't3d-range');
      exag.type = 'range'; exag.min = '0.4'; exag.max = '3'; exag.step = '0.1'; exag.value = String(state.exaggeration);
      exag.addEventListener('input', function () {
        state.exaggeration = parseFloat(exag.value);
        document.getElementById('t3d-exag-val').textContent = '×' + state.exaggeration.toFixed(1);
        if (state.terrainOn) { try { map.setTerrain({ source: 'dem', exaggeration: state.exaggeration }); } catch (e) {} }
      });
      g3.appendChild(exag);
      body.appendChild(g3);

      /* Độ nghiêng */
      var g4 = el('div', 't3d-group');
      g4.appendChild(el('div', 't3d-label', '<span>Độ nghiêng</span><b id="t3d-pitch-val">55°</b>'));
      var pitch = el('input', 't3d-range');
      pitch.type = 'range'; pitch.min = '0'; pitch.max = '85'; pitch.step = '1'; pitch.value = String(VIEW.pitch);
      pitch.addEventListener('input', function () {
        document.getElementById('t3d-pitch-val').textContent = Math.round(pitch.value) + '°';
        map.easeTo({ pitch: parseFloat(pitch.value), duration: 120 });
      });
      g4.appendChild(pitch);
      body.appendChild(g4);

      /* Nút chức năng */
      var g5 = el('div', 't3d-group');
      var btns = el('div', 't3d-btns');

      var bOrbit = el('button', 't3d-btn', '🔄 Quay quanh');
      bOrbit.type = 'button';
      bOrbit.addEventListener('click', function () { toggleOrbit(); });
      btns.appendChild(bOrbit);

      var bTerrain = el('button', 't3d-btn active', '⛰️ Địa hình 3D');
      bTerrain.type = 'button';
      bTerrain.addEventListener('click', function () {
        state.terrainOn = !state.terrainOn;
        bTerrain.classList.toggle('active', state.terrainOn);
        try {
          if (state.terrainOn) map.setTerrain({ source: 'dem', exaggeration: state.exaggeration });
          else map.setTerrain(null);
        } catch (e) {}
      });
      btns.appendChild(bTerrain);

      var bGlobe = el('button', 't3d-btn', '🌍 Quả cầu');
      bGlobe.type = 'button';
      if (typeof map.setProjection !== 'function') {
        bGlobe.disabled = true; bGlobe.style.opacity = '.45'; bGlobe.title = 'Không hỗ trợ ở phiên bản này';
      }
      bGlobe.addEventListener('click', function () { toggleGlobe(); });
      btns.appendChild(bGlobe);

      var bReset = el('button', 't3d-btn', '⟲ Đặt lại');
      bReset.type = 'button';
      bReset.addEventListener('click', function () {
        map.flyTo({ center: VIEW.center, zoom: VIEW.zoom, pitch: VIEW.pitch, bearing: VIEW.bearing, duration: 2800, essential: true });
        if (state.globe) toggleGlobe();
      });
      btns.appendChild(bReset);
      g5.appendChild(btns);
      body.appendChild(g5);

      noteEl = el('div', 't3d-note',
        'Kéo để di chuyển · <b style="color:#d4af37">chuột phải</b> (hoặc Ctrl + kéo) để nghiêng và xoay · ' +
        'Ctrl + cuộn để thu phóng. Địa hình dựng từ DEM Terrarium (AWS Open Data). ' +
        'Xem thêm <a href="vietnam-terrain-map.html">bản đồ địa hình 2D</a>.');
      body.appendChild(noteEl);

      function toggleOrbit() {
        state.orbit = !state.orbit;
        bOrbit.classList.toggle('active', state.orbit);
        map.stop();
        if (state.orbit) {
          map.rotateTo(map.getBearing() + 360, { duration: 90000, easing: function (t) { return t; } });
        }
      }

      function toggleGlobe() {
        if (typeof map.setProjection !== 'function') return;
        state.globe = !state.globe;
        bGlobe.classList.toggle('active', state.globe);
        map.setProjection({ type: state.globe ? 'globe' : 'mercator' });
        if (state.globe) {
          map.flyTo({ center: [106.6, 16.6], zoom: 2.6, pitch: 20, bearing: 0, duration: 2600, essential: true });
        } else {
          map.flyTo({ center: VIEW.center, zoom: VIEW.zoom, pitch: VIEW.pitch, bearing: VIEW.bearing, duration: 2600, essential: true });
        }
      }

      /* Đồng bộ slider khi người dùng xoay/nghiêng trực tiếp trên bản đồ */
      map.on('pitchend', function () {
        var v = Math.round(map.getPitch());
        pitch.value = String(v);
        var lbl = document.getElementById('t3d-pitch-val');
        if (lbl) lbl.textContent = v + '°';
      });

      /* Bảng điều khiển thu gọn mặc định trên màn hình nhỏ */
      if (global.innerWidth < 700) {
        panel.classList.add('t3d-collapsed');
        collapse.textContent = '▸';
      }

      function setBasemap(id) {
        var bm = null;
        BASEMAPS.forEach(function (b) { if (b.id === id) bm = b; });
        if (!bm) return;
        state.basemap = id;
        Object.keys(chipEls).forEach(function (k) { chipEls[k].classList.toggle('active', k === id); });
        map.setStyle(bm.kind === 'raster' ? rasterStyle(bm) : bm.url, { diff: false });
        /* applyOverlays() sẽ tự chạy lại nhờ sự kiện style.load */
      }
    }

    /* --------------------------- Gợi ý & resize --------------------------- */
    var hint = document.getElementById(opts.hint || 'map3d-hint');
    if (hint) {
      setTimeout(function () { hint.classList.add('t3d-hide'); }, 12000);
    }

    function resize() { try { map.resize(); } catch (e) {} }
    global.addEventListener('resize', resize);
    if (global.ResizeObserver) { new ResizeObserver(resize).observe(wrap); }
    setTimeout(resize, 400);
    /* Tạm dừng quay khi tab bị ẩn để tiết kiệm pin */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { if (state.orbit) { map.stop(); state.orbit = false; } }
    });

    return {
      map: map,
      flyTo: function (place) {
        PLACES.forEach(function (p) {
          if (p[0] === place) map.flyTo({ center: [p[2], p[1]], zoom: p[3], pitch: p[4], bearing: p[5], duration: 3000, essential: true });
        });
      },
      setBasemap: function (id) {
        var bm = null;
        BASEMAPS.forEach(function (b) { if (b.id === id) bm = b; });
        if (bm) map.setStyle(bm.kind === 'raster' ? rasterStyle(bm) : bm.url, { diff: false });
      },
      setExaggeration: function (v) {
        state.exaggeration = v;
        try { map.setTerrain({ source: 'dem', exaggeration: v }); } catch (e) {}
      }
    };
  }

  global.VN3D = { init: init, BASEMAPS: BASEMAPS, PLACES: PLACES };
})(window);
