/**
 * EYSI CLICKS — Opaque-Box E2E Test Harness
 * Pure Node.js DOM parser, environment simulator, CSS parser, and assertion helpers.
 * Zero external dependencies.
 */

const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const INDEX_HTML_PATH = path.join(PROJECT_ROOT, 'index.html');
const STYLES_CSS_PATH = path.join(PROJECT_ROOT, 'styles.css');
const APP_JS_PATH = path.join(PROJECT_ROOT, 'app.js');

// ── 1. LIGHTWEIGHT DOM IMPLEMENTATION ──

class ClassList {
  constructor(element) {
    this._element = element;
  }

  _getClasses() {
    const cls = this._element.getAttribute('class') || '';
    return cls.trim().split(/\s+/).filter(Boolean);
  }

  _setClasses(classes) {
    if (classes.length === 0) {
      this._element.removeAttribute('class');
    } else {
      this._element.setAttribute('class', classes.join(' '));
    }
  }

  add(...tokens) {
    const set = new Set(this._getClasses());
    for (const t of tokens) if (t) set.add(t);
    this._setClasses([...set]);
  }

  remove(...tokens) {
    const set = new Set(this._getClasses());
    for (const t of tokens) set.delete(t);
    this._setClasses([...set]);
  }

  toggle(token, force) {
    const set = new Set(this._getClasses());
    let shouldAdd;
    if (force !== undefined) {
      shouldAdd = Boolean(force);
    } else {
      shouldAdd = !set.has(token);
    }
    if (shouldAdd) set.add(token);
    else set.delete(token);
    this._setClasses([...set]);
    return shouldAdd;
  }

  contains(token) {
    return this._getClasses().includes(token);
  }

  toString() {
    return this._element.getAttribute('class') || '';
  }
}

class DOMNode {
  constructor(nodeType, nodeName) {
    this.nodeType = nodeType; // 1: Element, 3: Text, 8: Comment, 9: Document
    this.nodeName = nodeName;
    this.childNodes = [];
    this.parentElement = null;
    this.ownerDocument = null;
  }

  appendChild(child) {
    if (child.parentElement) {
      child.parentElement.removeChild(child);
    }
    child.parentElement = this;
    if (this.ownerDocument) {
      child._setOwnerDocument(this.ownerDocument);
    }
    this.childNodes.push(child);
    return child;
  }

  _setOwnerDocument(doc) {
    this.ownerDocument = doc;
    for (const c of this.childNodes) {
      c._setOwnerDocument(doc);
    }
  }

  removeChild(child) {
    const idx = this.childNodes.indexOf(child);
    if (idx !== -1) {
      this.childNodes.splice(idx, 1);
      child.parentElement = null;
    }
    return child;
  }

  get children() {
    return this.childNodes.filter(n => n.nodeType === 1);
  }

  get textContent() {
    return this.childNodes.map(n => n.textContent).join('');
  }

  set textContent(val) {
    this.childNodes = [new DOMTextNode(String(val))];
    this.childNodes[0].parentElement = this;
  }
}

class DOMTextNode extends DOMNode {
  constructor(text) {
    super(3, '#text');
    this._text = text;
  }

  get textContent() {
    return this._text;
  }

  set textContent(val) {
    this._text = String(val);
  }
}

class DOMElement extends DOMNode {
  constructor(tagName) {
    super(1, tagName.toUpperCase());
    this.tagName = tagName.toUpperCase();
    this.attributes = new Map();
    this.classList = new ClassList(this);
    this.listeners = new Map();
    this.style = {};
    this._dataset = null;
  }

  setAttribute(name, value) {
    this.attributes.set(name.toLowerCase(), String(value));
  }

  getAttribute(name) {
    const val = this.attributes.get(name.toLowerCase());
    return val !== undefined ? val : null;
  }

  hasAttribute(name) {
    return this.attributes.has(name.toLowerCase());
  }

  removeAttribute(name) {
    this.attributes.delete(name.toLowerCase());
  }

  get id() {
    return this.getAttribute('id') || '';
  }

  set id(val) {
    this.setAttribute('id', val);
  }

  get className() {
    return this.getAttribute('class') || '';
  }

  set className(val) {
    this.setAttribute('class', val);
  }

  get src() {
    return this.getAttribute('src') || '';
  }

  set src(val) {
    this.setAttribute('src', val);
  }

  get alt() {
    return this.getAttribute('alt') || '';
  }

  set alt(val) {
    this.setAttribute('alt', val);
  }

  get title() {
    return this.getAttribute('title') || '';
  }

  set title(val) {
    this.setAttribute('title', val);
  }

  get href() {
    return this.getAttribute('href') || '';
  }

  set href(val) {
    this.setAttribute('href', val);
  }

  get type() {
    return this.getAttribute('type') || '';
  }

  set type(val) {
    this.setAttribute('type', val);
  }

  get tabIndex() {
    const val = this.getAttribute('tabindex');
    return val !== null ? parseInt(val, 10) : -1;
  }

  set tabIndex(val) {
    this.setAttribute('tabindex', String(val));
  }

  get dataset() {
    if (!this._dataset) {
      this._dataset = new Proxy(this, {
        get(target, prop) {
          const attr = 'data-' + String(prop).replace(/([A-Z])/g, '-$1').toLowerCase();
          return target.getAttribute(attr);
        },
        set(target, prop, val) {
          const attr = 'data-' + String(prop).replace(/([A-Z])/g, '-$1').toLowerCase();
          target.setAttribute(attr, String(val));
          return true;
        }
      });
    }
    return this._dataset;
  }

  get innerHTML() {
    return serializeNodes(this.childNodes);
  }

  set innerHTML(html) {
    this.childNodes = [];
    if (!html) return;
    const parsed = parseHTMLFragment(html);
    for (const child of parsed) {
      this.appendChild(child);
    }
  }

  addEventListener(type, callback, options) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type).push({ callback, options });
  }

  removeEventListener(type, callback) {
    const list = this.listeners.get(type);
    if (!list) return;
    this.listeners.set(type, list.filter(item => item.callback !== callback));
  }

  get loading() {
    return this.getAttribute('loading') || '';
  }

  set loading(val) {
    this.setAttribute('loading', val);
  }

  get decoding() {
    return this.getAttribute('decoding') || '';
  }

  set decoding(val) {
    this.setAttribute('decoding', val);
  }

  dispatchEvent(event) {
    event.target = this;
    event.currentTarget = this;
    // Call property handler e.g. onclick, onerror
    const propHandler = this['on' + event.type];
    if (typeof propHandler === 'function') {
      try {
        propHandler.call(this, event);
      } catch (err) {
        console.error(`Error in on${event.type} handler:`, err);
      }
    }
    const list = this.listeners.get(event.type) || [];
    for (const { callback } of list) {
      try {
        callback.call(this, event);
      } catch (err) {
        console.error(`Error in ${event.type} event listener:`, err);
      }
    }
    // Bubble up if bubbles is true
    if (event.bubbles && this.parentElement) {
      this.parentElement.dispatchEvent(event);
    }
    return !event.defaultPrevented;
  }

  click() {
    const event = {
      type: 'click',
      target: this,
      currentTarget: this,
      bubbles: true,
      cancelable: true,
      defaultPrevented: false,
      preventDefault() { this.defaultPrevented = true; },
      stopPropagation() { this.bubbles = false; }
    };
    this.dispatchEvent(event);
    const onclickStr = this.getAttribute('onclick');
    if (onclickStr && globalThis.window) {
      try {
        // Execute inline handler in window context
        const fn = new Function('event', onclickStr);
        fn.call(this, event);
      } catch (err) {}
    }
  }

  focus() {
    if (this.ownerDocument) {
      this.ownerDocument.activeElement = this;
    }
    this.dispatchEvent({
      type: 'focus',
      target: this,
      currentTarget: this,
      bubbles: false,
      cancelable: false
    });
  }

  blur() {
    if (this.ownerDocument && this.ownerDocument.activeElement === this) {
      this.ownerDocument.activeElement = null;
    }
    this.dispatchEvent({
      type: 'blur',
      target: this,
      currentTarget: this,
      bubbles: false,
      cancelable: false
    });
  }

  scrollIntoView() {}

  querySelector(selector) {
    return querySelectorOne(this, selector);
  }

  querySelectorAll(selector) {
    return querySelectorAllNodes(this, selector);
  }
}

function serializeNodes(nodes) {
  let str = '';
  for (const node of nodes) {
    if (node.nodeType === 3) {
      str += node.textContent;
    } else if (node.nodeType === 1) {
      const tag = node.tagName.toLowerCase();
      str += `<${tag}`;
      for (const [k, v] of node.attributes.entries()) {
        str += ` ${k}="${v.replace(/"/g, '&quot;')}"`;
      }
      const voidTags = ['img', 'br', 'hr', 'input', 'link', 'meta'];
      if (voidTags.includes(tag)) {
        str += '>';
      } else {
        str += `>${serializeNodes(node.childNodes)}</${tag}>`;
      }
    }
  }
  return str;
}

// ── 2. HTML PARSER ──

function parseHTMLFragment(html) {
  const root = new DOMElement('div');
  parseHTMLInto(html, root);
  return root.childNodes;
}

function parseHTMLInto(html, container) {
  let pos = 0;
  let currentParent = container;

  const voidTags = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
  ]);

  while (pos < html.length) {
    if (html.startsWith('<!--', pos)) {
      const end = html.indexOf('-->', pos + 4);
      pos = end === -1 ? html.length : end + 3;
      continue;
    }

    if (html.startsWith('<!DOCTYPE', pos) || html.startsWith('<!doctype', pos)) {
      const end = html.indexOf('>', pos);
      pos = end === -1 ? html.length : end + 1;
      continue;
    }

    if (html[pos] === '<') {
      // Closing tag
      if (html[pos + 1] === '/') {
        const closeEnd = html.indexOf('>', pos + 2);
        if (closeEnd !== -1) {
          const closeTag = html.slice(pos + 2, closeEnd).trim().toLowerCase();
          pos = closeEnd + 1;
          // Traverse up to matching parent
          let p = currentParent;
          while (p && p !== container) {
            if (p.tagName && p.tagName.toLowerCase() === closeTag) {
              currentParent = p.parentElement || container;
              break;
            }
            p = p.parentElement;
          }
          continue;
        }
      }

      // Opening or self-closing tag
      const tagMatch = html.slice(pos).match(/^<([a-zA-Z0-9\-]+)([^>]*)>/);
      if (tagMatch) {
        const rawTagName = tagMatch[1];
        const rawAttrs = tagMatch[2];
        pos += tagMatch[0].length;

        const elem = new DOMElement(rawTagName);
        parseAttributes(rawAttrs, elem);

        currentParent.appendChild(elem);

        const isSelfClosing = rawAttrs.trim().endsWith('/') || voidTags.has(rawTagName.toLowerCase());
        const isSpecialScriptOrStyle = rawTagName.toLowerCase() === 'script' || rawTagName.toLowerCase() === 'style';

        if (isSpecialScriptOrStyle) {
          const endTag = `</${rawTagName.toLowerCase()}>`;
          const endIdx = html.toLowerCase().indexOf(endTag, pos);
          if (endIdx !== -1) {
            const rawContent = html.slice(pos, endIdx);
            elem.appendChild(new DOMTextNode(rawContent));
            pos = endIdx + endTag.length;
          }
        } else if (!isSelfClosing) {
          currentParent = elem;
        }
        continue;
      }
    }

    // Text content
    const nextTag = html.indexOf('<', pos);
    const textChunk = nextTag === -1 ? html.slice(pos) : html.slice(pos, nextTag);
    pos = nextTag === -1 ? html.length : nextTag;
    if (textChunk) {
      currentParent.appendChild(new DOMTextNode(decodeHTMLEntities(textChunk)));
    }
  }
}

function parseAttributes(attrString, elem) {
  const attrRegex = /([a-zA-Z0-9_\-:]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = attrRegex.exec(attrString)) !== null) {
    const name = match[1];
    if (name === '/') continue;
    const value = match[2] !== undefined ? match[2] :
                  match[3] !== undefined ? match[3] :
                  match[4] !== undefined ? match[4] : '';
    elem.setAttribute(name, decodeHTMLEntities(value));
  }
}

function decodeHTMLEntities(str) {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// ── 3. SELECTOR ENGINE ──

function matchesSelector(elem, selector) {
  if (elem.nodeType !== 1) return false;
  selector = selector.trim();

  // Comma separated
  if (selector.includes(',')) {
    return selector.split(',').some(s => matchesSelector(elem, s.trim()));
  }

  // Descendant selector (e.g. 'nav a', '.cat-tabs button')
  const parts = selector.split(/\s+/);
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1];
    if (!matchesSimpleSelector(elem, lastPart)) return false;
    let curr = elem.parentElement;
    for (let i = parts.length - 2; i >= 0; i--) {
      const part = parts[i];
      let matched = false;
      while (curr) {
        if (matchesSimpleSelector(curr, part)) {
          matched = true;
          curr = curr.parentElement;
          break;
        }
        curr = curr.parentElement;
      }
      if (!matched) return false;
    }
    return true;
  }

  return matchesSimpleSelector(elem, selector);
}

function matchesSimpleSelector(elem, sel) {
  sel = sel.trim();
  if (sel === '*' || sel === '') return true;

  // Handle :not(...)
  const notMatch = sel.match(/^([^:]*):not\((.+)\)$/);
  if (notMatch) {
    const base = notMatch[1];
    const negated = notMatch[2];
    if (base && !matchesSimpleSelector(elem, base)) return false;
    return !matchesSimpleSelector(elem, negated);
  }

  // Parse tag, id, classes, and attribute selectors
  // e.g. "button.cat-tab.active[aria-selected="true"]"
  const regex = /^([a-zA-Z0-9\-]+)?(#([a-zA-Z0-9_\-]+))?((?:\.[a-zA-Z0-9_\-]+)*)((?:\[[^\]]+\])*)$/;
  const m = sel.match(regex);
  if (!m) {
    // Fallback: check attribute directly if format is [attr="val"]
    if (sel.startsWith('[') && sel.endsWith(']')) {
      return matchAttr(elem, sel.slice(1, -1));
    }
    return false;
  }

  const tag = m[1];
  const id = m[3];
  const classes = m[4];
  const attrs = m[5];

  if (tag && elem.tagName.toLowerCase() !== tag.toLowerCase()) return false;
  if (id && elem.id !== id) return false;
  if (classes) {
    const reqClasses = classes.split('.').filter(Boolean);
    for (const c of reqClasses) {
      if (!elem.classList.contains(c)) return false;
    }
  }
  if (attrs) {
    const attrMatches = attrs.match(/\[[^\]]+\]/g) || [];
    for (const a of attrMatches) {
      if (!matchAttr(elem, a.slice(1, -1))) return false;
    }
  }

  return true;
}

function matchAttr(elem, rawAttr) {
  const m = rawAttr.match(/^([a-zA-Z0-9_\-]+)(?:([\^$*~|]?=)"?([^"]*)"?)?$/);
  if (!m) return false;
  const name = m[1];
  const op = m[2];
  const val = m[3];

  if (!elem.hasAttribute(name)) return false;
  if (op === undefined) return true;

  const actual = elem.getAttribute(name);
  if (op === '=') return actual === val;
  if (op === '*=') return actual.includes(val);
  if (op === '^=') return actual.startsWith(val);
  if (op === '$=') return actual.endsWith(val);
  return false;
}

function querySelectorOne(root, selector) {
  for (const child of root.children) {
    if (matchesSelector(child, selector)) return child;
    const found = querySelectorOne(child, selector);
    if (found) return found;
  }
  return null;
}

function querySelectorAllNodes(root, selector) {
  const result = [];
  function search(node) {
    for (const child of node.children) {
      if (matchesSelector(child, selector)) {
        result.push(child);
      }
      search(child);
    }
  }
  search(root);
  return result;
}

// ── 4. DOCUMENT & ENVIRONMENT LOADER ──

function createDOMEnvironment() {
  const htmlContent = fs.readFileSync(INDEX_HTML_PATH, 'utf-8');
  const docRoot = new DOMElement('html');
  parseHTMLInto(htmlContent, docRoot);

  const htmlElem = docRoot.tagName === 'HTML' ? docRoot : docRoot.querySelector('html') || docRoot;
  const bodyElem = htmlElem.querySelector('body') || htmlElem;
  const headElem = htmlElem.querySelector('head') || htmlElem;

  // LocalStorage mock
  const storage = new Map();
  const localStorage = {
    getItem(k) { return storage.has(k) ? storage.get(k) : null; },
    setItem(k, v) { storage.set(k, String(v)); },
    removeItem(k) { storage.delete(k); },
    clear() { storage.clear(); }
  };

  const listeners = new Map();
  const doc = {
    documentElement: htmlElem,
    body: bodyElem,
    head: headElem,
    activeElement: null,
    getElementById(id) {
      return htmlElem.querySelector('#' + id);
    },
    querySelector(sel) {
      if (matchesSelector(htmlElem, sel)) return htmlElem;
      return htmlElem.querySelector(sel);
    },
    querySelectorAll(sel) {
      const list = htmlElem.querySelectorAll(sel);
      if (matchesSelector(htmlElem, sel)) {
        return [htmlElem, ...list];
      }
      return list;
    },
    createElement(tagName) {
      const el = new DOMElement(tagName);
      el.ownerDocument = doc;
      return el;
    },
    addEventListener(type, cb) {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(cb);
    },
    removeEventListener(type, cb) {
      const list = listeners.get(type);
      if (list) listeners.set(type, list.filter(fn => fn !== cb));
    },
    dispatchEvent(evt) {
      const list = listeners.get(evt.type) || [];
      for (const fn of list) fn(evt);
    }
  };

  docRoot._setOwnerDocument(doc);

  const winListeners = new Map();
  const win = {
    document: doc,
    localStorage,
    location: {
      href: 'https://EysiClicks-portfolio-2026.great-site.net/',
      origin: 'https://EysiClicks-portfolio-2026.great-site.net',
      pathname: '/',
      search: '',
      hash: ''
    },
    addEventListener(type, cb) {
      if (!winListeners.has(type)) winListeners.set(type, []);
      winListeners.get(type).push(cb);
    },
    removeEventListener(type, cb) {
      const list = winListeners.get(type);
      if (list) winListeners.set(type, list.filter(fn => fn !== cb));
    },
    dispatchEvent(evt) {
      const list = winListeners.get(evt.type) || [];
      for (const fn of list) fn(evt);
    },
    history: {
      replaceState(_state, _title, url) {
        if (typeof url === 'string') {
          win.location.href = url;
          const u = new URL(url, 'https://EysiClicks-portfolio-2026.great-site.net/');
          win.location.search = u.search;
          win.location.hash = u.hash;
        } else if (url && url.href) {
          win.location.href = url.href;
          win.location.search = url.search;
          win.location.hash = url.hash;
        }
      },
      pushState(_state, _title, url) {
        this.replaceState(_state, _title, url);
      }
    },
    scrollTo() {},
    requestAnimationFrame(cb) { return setTimeout(cb, 0); },
    cancelAnimationFrame(id) { clearTimeout(id); },
    setTimeout(...args) {
      const id = setTimeout(...args);
      activeTimeouts.add(id);
      return id;
    },
    clearTimeout(id) {
      activeTimeouts.delete(id);
      clearTimeout(id);
    },
    setInterval(...args) {
      const id = setInterval(...args);
      activeIntervals.add(id);
      return id;
    },
    clearInterval(id) {
      activeIntervals.delete(id);
      clearInterval(id);
    },
    Intl,
    URL,
    URLSearchParams,
    Image: class {
      constructor() { this.src = ''; }
    },
    matchMedia() {
      return { matches: false, addEventListener() {}, removeEventListener() {} };
    },
    IntersectionObserver: class {
      constructor(cb) { this._cb = cb; }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  };

  const activeTimeouts = new Set();
  const activeIntervals = new Set();

  function teardown() {
    for (const t of activeTimeouts) clearTimeout(t);
    activeTimeouts.clear();
    for (const i of activeIntervals) clearInterval(i);
    activeIntervals.clear();
  }

  return { window: win, document: doc, rawHTML: htmlContent, teardown };
}

function loadAppEnvironment() {
  const env = createDOMEnvironment();
  const appJsCode = fs.readFileSync(APP_JS_PATH, 'utf-8');

  const sandbox = {
    window: env.window,
    document: env.document,
    localStorage: env.window.localStorage,
    location: env.window.location,
    history: env.window.history,
    setTimeout: env.window.setTimeout,
    clearTimeout: env.window.clearTimeout,
    setInterval: env.window.setInterval,
    clearInterval: env.window.clearInterval,
    requestAnimationFrame: env.window.requestAnimationFrame,
    cancelAnimationFrame: env.window.cancelAnimationFrame,
    matchMedia: env.window.matchMedia,
    IntersectionObserver: env.window.IntersectionObserver,
    Image: env.window.Image,
    URL: env.window.URL,
    URLSearchParams,
    Intl,
    console,
    globalThis: env.window
  };
  env.window.window = env.window;
  env.window.globalThis = env.window;

  const context = vm.createContext(sandbox);
  vm.runInContext(appJsCode, context);

  return {
    window: env.window,
    document: env.document,
    context,
    eval(expr) {
      return vm.runInContext(expr, context);
    },
    teardown() {
      env.teardown();
    }
  };
}

// ── 5. CSS TOKENS & CONTRAST CALCULATOR ──

function parseCSSFile() {
  const css = fs.readFileSync(STYLES_CSS_PATH, 'utf-8');
  return {
    raw: css,
    extractTokens(theme = 'light') {
      const targetBlock = theme === 'dark' ?
        css.match(/html\[data-theme="dark"\]\s*\{([^}]+)\}/) :
        css.match(/(?::root,\s*html\[data-theme="light"\]|:root)\s*\{([^}]+)\}/);

      const tokens = {};
      if (targetBlock) {
        const lines = targetBlock[1].split(';');
        for (const line of lines) {
          const match = line.match(/--([a-zA-Z0-9_\-]+)\s*:\s*(.+)/);
          if (match) {
            tokens[`--${match[1].trim()}`] = match[2].trim();
          }
        }
      }
      return tokens;
    }
  };
}

/**
 * Parses color string (#hex, rgb, rgba) and computes RGBA.
 */
function parseColor(str) {
  str = str.trim();
  if (str.startsWith('#')) {
    const hex = str.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1.0
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1.0
      };
    }
  }
  const rgbMatch = str.match(/^rgba?\(\s*([0-9.]+)\s*,\s*([0-9.]+)\s*,\s*([0-9.]+)(?:\s*,\s*([0-9.]+))?\s*\)$/);
  if (rgbMatch) {
    return {
      r: parseFloat(rgbMatch[1]),
      g: parseFloat(rgbMatch[2]),
      b: parseFloat(rgbMatch[3]),
      a: rgbMatch[4] !== undefined ? parseFloat(rgbMatch[4]) : 1.0
    };
  }
  return null;
}

/**
 * Composite foreground over background.
 */
function blendOver(fg, bg) {
  const a = fg.a;
  return {
    r: Math.round(fg.r * a + bg.r * (1 - a)),
    g: Math.round(fg.g * a + bg.g * (1 - a)),
    b: Math.round(fg.b * a + bg.b * (1 - a)),
    a: 1.0
  };
}

/**
 * WCAG 2.2 Relative Luminance and Contrast Ratio calculation.
 */
function sRGBtoLin(c) {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function relativeLuminance(rgb) {
  const R = sRGBtoLin(rgb.r);
  const G = sRGBtoLin(rgb.g);
  const B = sRGBtoLin(rgb.b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function calculateContrastRatio(colorAStr, colorBStr) {
  const bg = parseColor(colorBStr);
  let fg = parseColor(colorAStr);
  if (!bg || !fg) return null;
  if (fg.a < 1.0) {
    fg = blendOver(fg, bg);
  }
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── 6. TEST ASSERTION & RUNNER HELPERS ──

class AssertionContext {
  constructor(tierName) {
    this.tierName = tierName;
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    const start = Date.now();
    try {
      fn();
      const duration = Date.now() - start;
      this.tests.push({ name, status: 'PASS', duration });
      this.passed++;
    } catch (err) {
      const duration = Date.now() - start;
      this.tests.push({ name, status: 'FAIL', duration, error: err.message, stack: err.stack });
      this.failed++;
    }
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      const formatVal = val => {
        if (val && typeof val === 'object') {
          if (val.tagName) return `<${val.tagName.toLowerCase()}${val.id ? '#' + val.id : ''}${val.className ? '.' + val.className.split(' ').join('.') : ''}>`;
          try { return JSON.stringify(val); } catch { return String(val); }
        }
        return JSON.stringify(val);
      };
      throw new Error(`${message || 'Values not equal'} — Expected: ${formatVal(expected)}, Actual: ${formatVal(actual)}`);
    }
  }

  assertGreaterOrEqual(actual, expected, message) {
    if (actual < expected) {
      throw new Error(`${message || 'Value too small'} — Expected >= ${expected}, Actual: ${actual}`);
    }
  }

  assertMatches(actual, regex, message) {
    if (!regex.test(actual)) {
      throw new Error(`${message || 'String does not match pattern'} — Actual: "${actual}", Pattern: ${regex}`);
    }
  }
}

module.exports = {
  createDOMEnvironment,
  loadAppEnvironment,
  parseCSSFile,
  calculateContrastRatio,
  AssertionContext,
  PROJECT_ROOT,
  INDEX_HTML_PATH,
  STYLES_CSS_PATH,
  APP_JS_PATH
};
