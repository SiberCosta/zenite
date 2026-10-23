/* Zénite · motor de páginas (pequeno, sem dependências).
   Cria o HTML a partir dos dados de cada página e atualiza só o que muda. */
(function () {
  'use strict';
  var SVG = 'http://www.w3.org/2000/svg';
  var refs = [];

  function flat(a, out) {
    out = out || [];
    for (var i = 0; i < a.length; i++) {
      var x = a[i];
      if (x == null || x === false || x === true) continue;
      if (Array.isArray(x)) flat(x, out);
      else out.push(typeof x === 'object' ? x : String(x));
    }
    return out;
  }
  function h(t, p, c) { return { t: t, p: p || {}, c: flat(c || []) }; }
  function s(x) { return x == null ? '' : String(x); }

  function isText(el) {
    var tag = el.tagName;
    if (tag === 'TEXTAREA') return true;
    return tag === 'INPUT' && !/^(radio|checkbox|button|submit|file|range|color)$/i.test(el.getAttribute('type') || '');
  }

  function setProps(el, oldP, newP) {
    var k, keys = {};
    for (k in oldP) keys[k] = 1;
    for (k in newP) keys[k] = 1;
    var events = [];
    for (k in keys) {
      if (k === 'ref' || k === 'value' || k === 'checked') continue;
      if (k.slice(0, 2) === 'on') { events.push(k); continue; }
      var o = oldP[k], n = newP[k];
      if (o === n && el._init) continue;
      if (n == null || n === false) el.removeAttribute(k);
      else el.setAttribute(k, n === true ? '' : n);
    }
    el._h = el._h || {};
    events.forEach(function (k) {
      var name = k.slice(2).toLowerCase(), cap = false;
      if (/capture$/.test(name) && name !== 'capture') { cap = true; name = name.slice(0, -7); }
      if (name === 'change' && isText(el)) name = 'input';
      var id = name + (cap ? '!' : '');
      if (!el._h.hasOwnProperty(id)) {
        el.addEventListener(name, function (e) { var f = el._h[id]; if (typeof f === 'function') f(e); }, cap);
      }
      el._h[id] = newP[k];
    });
    el._init = true;
  }
  function setValue(el, p) {
    if ('value' in p) { var v = s(p.value); if (el.value !== v) el.value = v; }
    if ('checked' in p) el.checked = !!p.checked;
  }

  function create(v, svg) {
    if (typeof v === 'string') return document.createTextNode(v);
    svg = svg || v.t === 'svg';
    var el = svg ? document.createElementNS(SVG, v.t) : document.createElement(v.t);
    setProps(el, {}, v.p);
    for (var i = 0; i < v.c.length; i++) el.appendChild(create(v.c[i], svg));
    setValue(el, v.p);
    if (typeof v.p.ref === 'function') refs.push([v.p.ref, el]);
    return el;
  }

  function patch(el, o, n, svg) {
    if (typeof o === 'string' || typeof n === 'string' || o.t !== n.t) {
      if (typeof o === 'string' && typeof n === 'string') { if (o !== n) el.nodeValue = n; return el; }
      var ne = create(n, svg || (typeof n !== 'string' && n.t === 'svg'));
      el.parentNode.replaceChild(ne, el);
      return ne;
    }
    svg = svg || n.t === 'svg';
    setProps(el, o.p, n.p);
    var oc = o.c, nc = n.c, i;
    for (i = 0; i < nc.length; i++) {
      if (i < oc.length) patch(el.childNodes[i], oc[i], nc[i], svg);
      else el.appendChild(create(nc[i], svg));
    }
    for (i = oc.length - 1; i >= nc.length; i--) el.removeChild(el.childNodes[i]);
    setValue(el, n.p);
    return el;
  }

  function flushRefs() { var r = refs; refs = []; r.forEach(function (x) { x[0](x[1]); }); }

  function DCLogic(props) { this.props = props || {}; this.state = this.state || {}; }
  DCLogic.prototype.setState = function (part) {
    var add = typeof part === 'function' ? part(this.state, this.props) : part;
    this.state = Object.assign({}, this.state, add);
    this._schedule();
  };
  DCLogic.prototype.forceUpdate = function () { this._schedule(); };
  DCLogic.prototype._schedule = function () {
    var self = this;
    if (self._queued || !self._tpl) return;
    self._queued = true;
    Promise.resolve().then(function () { self._queued = false; self._draw(); });
  };
  DCLogic.prototype._draw = function () {
    var nv = this._tpl(this.renderVals() || {});
    if (!this._v) {
      this._root.innerHTML = '';
      this._dom = create(nv);
      this._root.appendChild(this._dom);
      this._v = nv;
      flushRefs();
      if (this.componentDidMount) this.componentDidMount();
    } else {
      this._dom = patch(this._dom, this._v, nv);
      this._v = nv;
      flushRefs();
      if (this.componentDidUpdate) this.componentDidUpdate();
    }
  };

  function mount(C, tpl, root) {
    var inst = new C({});
    inst._tpl = tpl;
    inst._root = root;
    inst._draw();
    window.addEventListener('pagehide', function () { if (inst.componentWillUnmount) inst.componentWillUnmount(); });
    return inst;
  }

  window.ZDC = { h: h, s: s, DCLogic: DCLogic, mount: mount };
})();
