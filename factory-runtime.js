/* Factory-scoped transport for the owner-authorized legacy UI. No legacy network access. */
(() => {
  'use strict';
  const query = new URLSearchParams(location.search);
  const id = query.get('factory') || 'factory_a';
  const factory = window.FACTORYLITE_FACTORIES.factories.find(item => item.id === id);
  if (!factory) throw new Error('Unknown factory');
  if (factory.timezone !== 'Asia/Bangkok') throw new Error('Legacy calculation policy currently verified only for Asia/Bangkok');
  const preview = false; // This public artifact uses a synthetic read-only host only.
  const host = parent !== window && parent.FactoryLiteHost;
  if (!preview && !host) throw new Error('Authenticated FactoryLite host is required');
  let resources = preview ? (window.__FACTORYLITE_TEST_RESOURCES__ || synthetic(factory)) : host.boot(id);
  const nativeFetch = window.fetch.bind(window);
  const canonical = path => decodeURIComponent(path).replace(/^\/+/, '').replace(/^__legacy__\//, '').replace(/\.json$/, '');
  const key = path => encodeURIComponent(path).replace(/\./g, '%2E');
  function resource(path) {
    path = canonical(path);
    if (Object.hasOwn(resources, key(path))) return resources[key(path)];
    const parts = path.split('/');
    for (let n = parts.length - 1; n > 0; n--) {
      let value = resources[key(parts.slice(0,n).join('/'))];
      if (value == null) continue;
      for (const part of parts.slice(n)) value = value?.[part];
      return value ?? null;
    }
    return null;
  }
  async function update() { if (!preview) resources = await host.read(id); }
  function reply(value, status = 200) { return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json' } }); }
  window.FactoryLite = { factory, preview, resource, resourceKey: key };
  window.AICONFIG = { proxyUrl: '/__legacy__/ai' };
  window.fetch = async (input, options = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    const method = (options.method || input?.method || 'GET').toUpperCase();
    if (url.origin !== location.origin) throw new Error('External legacy transport is disabled');
    const routed = url.pathname.startsWith('/__legacy__/') || /\/history\//.test(url.pathname) || /\/api\/ai/.test(url.pathname);
    if (!routed) {
      if (method !== 'GET' || !/\.(js|css|png|webmanifest)$/.test(url.pathname)) throw new Error('Unknown transport route');
      return nativeFetch(input, options);
    }
    const path = canonical(url.pathname.replace(/^.*?\/history\//, 'history/'));
    if (path === 'health') return reply({ok:preview}, preview ? 200 : 503);
    if (/^(ai|api\/ai)(\/|$)/.test(path)) {
      if (!preview) return reply({ error: 'No approved FactoryLite AI provider configured' }, 503);
      return reply({ answer: 'Synthetic FactoryLite preview. No external AI provider was contacted.', conversation_id: 'synthetic-preview' });
    }
    if (method !== 'GET') {
      if (!preview) return reply({ error: 'Viewer writes are denied; a scoped operator workflow is required' }, 403);
      resources[key(path)] = options.body ? JSON.parse(options.body) : null;
      return reply(resources[key(path)]);
    }
    await update();
    let value = resource(path);
    if(value?.__archive__ && !preview) value=await host.resource(id,key(path));
    return value == null ? reply({ error: 'No authorized resource for this factory' }, 404) : reply(value);
  };
  // Authenticated protected data is never persisted in browser localStorage.
  const persistent = window.localStorage;
  const memory = new Map();
  const prefix = 'factorylite-clone:' + id + ':';
  Object.defineProperty(window, 'localStorage', { value: {
    getItem: k => preview ? persistent.getItem(prefix+k) : memory.get(String(k)) ?? null,
    setItem: (k,v) => preview ? persistent.setItem(prefix+k,String(v)) : memory.set(String(k),String(v)),
    removeItem: k => preview ? persistent.removeItem(prefix+k) : memory.delete(String(k)),
    clear: () => { if (!preview) memory.clear(); else Object.keys(persistent).filter(k=>k.startsWith(prefix)).forEach(k=>persistent.removeItem(k)); },
    key: i => (preview ? Object.keys(persistent).filter(k=>k.startsWith(prefix)).map(k=>k.slice(prefix.length)) : [...memory.keys()])[i] ?? null,
    get length() { return preview ? Object.keys(persistent).filter(k=>k.startsWith(prefix)).length : memory.size; },
  }});
  window.EventSource = class extends EventTarget {
    constructor(url) {
      super(); this.url = url; this.readyState = 1;
      const emit = async () => {
        try { await update(); const path=canonical(new URL(url,location.href).pathname);let value=resource(path);if(value?.__archive__&&!preview)value=await host.resource(id,key(path));const event = new MessageEvent('put', { data: JSON.stringify({ path: '/', data: value }) }); this.dispatchEvent(event); }
        catch { this.dispatchEvent(new Event('error')); }
      };
      this.timer = setInterval(emit,60000); setTimeout(emit,50);
    }
    close() { clearInterval(this.timer); this.readyState = 2; }
  };
  function synthetic(config) {
    const now = new Date();
    const stamp = new Intl.DateTimeFormat('sv-SE', { timeZone: config.timezone, year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false }).format(now);
    const day = stamp.slice(0,10);
    const lines = config.line_registry.map((line,i) => ({ name: line.legacy_name, actual: 1000+i*23, plan: 1400+i*17, target:8600, cb:-400+i*6, cum:1000+i*23, eff:71.4+i*.5, status:i===4?'STALLED':'RUNNING', stalled:i===4, pushed:stamp,time:'21-Nov-1' }));
    const hourly = Object.fromEntries(lines.map((line,i) => [line.name.replace(/\./g,''), [800,900,1000,1010,1100,1200,1300,1400,1500,1510,1600,1700,1720,1820,1920,2020].map((h,j)=>({h,actual:j*(100+i),plan:j*140,d:day}))]));
    const put = (path,value) => [encodeURIComponent(path).replace(/\./g,'%2E'),value];
    return Object.fromEntries([
      put('pdtiii',{mode:'synthetic',updatedAt:stamp,source:'synthetic',lines,hourly}),
      put('pdtiii_extra',{lines:[],hourly:{}}), put('pdtiii_att',{rows:[],savedAt:0}),
      put('pdtiii_daily_problems',{}),put('analysis/hc',{}),put('pdtiii_night',{}),
      put('history/index',[day]),put('history/'+day,{date:day,lines,hourly}),
      put('history/analytics',{schemaVersion:2,days:[],workshops:[],lines:[]}),
      put('history/embedded',[]),put('live-data',{}),put('daily-problems-data',{}),
      put('sqdip/current',{}),put('dm_meeting/PRO2',{lines:[],probs:[],hours:[]}),
    ]);
  }
})();
