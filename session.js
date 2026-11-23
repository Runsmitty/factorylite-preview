// Tokens remain in memory. Sign-out invalidates in-flight sign-in/refresh work.
export class ViewerSession {
  constructor(settings, fetcher = (...args) => fetch(...args), clock = Date.now) {
    this.settings = settings; this.fetcher = fetcher; this.clock = clock; this.clear();
  }
  clear() { this.generation = (this.generation || 0) + 1; this.id = this.refresh = null; this.refreshing = null; this.expires = 0; this.uid = null; }
  async request(refresh, body) {
    const s = this.settings;
    const base = s.mode === 'emulator' ? 'http://127.0.0.1:9099/' : 'https://';
    const host = refresh ? 'securetoken.googleapis.com/v1/token' : 'identitytoolkit.googleapis.com/v1/accounts:signInWithPassword';
    const response = await this.fetcher(base + host + '?key=' + encodeURIComponent(s.apiKey), {
      method: 'POST', redirect: 'error', referrerPolicy: 'no-referrer', signal: AbortSignal.timeout(8000),
      headers: { 'Content-Type': refresh ? 'application/x-www-form-urlencoded' : 'application/json' },
      body: refresh ? new URLSearchParams(body) : JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Sign-in session unavailable.');
    return response.json();
  }
  accept(result, refresh) {
    const id = refresh ? result.id_token : result.idToken;
    const uid = refresh ? result.user_id : result.localId;
    const ttl = Number(refresh ? result.expires_in : result.expiresIn);
    const nextRefresh = refresh ? result.refresh_token : result.refreshToken;
    if (!id || !uid || !nextRefresh || !Number.isFinite(ttl) || ttl <= 0 || (this.uid && this.uid !== uid)) {
      throw new Error('Invalid sign-in session.');
    }
    this.id = id; this.uid = uid; this.refresh = nextRefresh;
    this.expires = this.clock() + Math.max(0, ttl - 120) * 1000;
  }
  async login(email, password) {
    this.clear(); const generation = this.generation;
    const result = await this.request(false, { email, password, returnSecureToken: true });
    if (generation !== this.generation) throw new Error('Session cancelled.');
    this.accept(result, false); return this.id;
  }
  async token() {
    if (!this.id) throw new Error('Sign in required.');
    if (this.clock() < this.expires) return this.id;
    if (this.refreshing) return this.refreshing;
    const generation = this.generation;
    const work = (async () => {
      const result = await this.request(true, { grant_type: 'refresh_token', refresh_token: this.refresh });
      if (generation !== this.generation) throw new Error('Session cancelled.');
      this.accept(result, true); return this.id;
    })();
    this.refreshing = work;
    try { return await work; } finally { if (this.refreshing === work) this.refreshing = null; }
  }
}

export function settings(runtime) {
  if (!runtime) return { mode: 'emulator', apiKey: 'demo', endpoint: 'http://127.0.0.1:9000', instance: 'demo-factorylite' };
  const expected = 'https://factorylite-production-default-rtdb.asia-southeast1.firebasedatabase.app';
  if (runtime.mode === 'emulator' && ['localhost', '127.0.0.1'].includes(location.hostname)) {
    return { ...runtime, endpoint: 'http://127.0.0.1:9000', instance: 'demo-factorylite', apiKey: 'demo' };
  }
  if (runtime.mode !== 'production' || runtime.endpoint !== expected || !runtime.apiKey) throw new Error('Invalid dashboard connection configuration.');
  return runtime;
}
