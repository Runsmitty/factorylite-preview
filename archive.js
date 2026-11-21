const bytes = text => new TextEncoder().encode(text);
const sha = async text => [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const canonical = value => JSON.stringify(Object.fromEntries(Object.keys(value).sort().map(k=>[k,value[k]])));
export function validateArchiveManifest(factory,m) {
  if (!/^[a-z][a-z0-9_]{0,63}$/.test(factory) || !Array.isArray(m.chunks) || !m.chunks.length || m.chunks.length>512 || !Number.isInteger(m.byte_count) || m.byte_count<=0 || m.byte_count>16000000 || !/^[0-9a-f]{64}$/.test(m.sha256)) throw new Error('Invalid history manifest');
}
export async function verifyArchiveChunk(factory,id,text) {
  if(bytes(text).length>200000) throw new Error('History chunk exceeds cap');
  const chunk=JSON.parse(text), b=chunk.body;
  if(b?.factory_id!==factory || b.schema_version!==1 || b.kind!=='json_chunk' || typeof b.payload!=='string' || b.payload.length>60000 || await sha(canonical(b))!==id || chunk.receipt?.digest!==id || chunk.receipt.byte_count!==bytes(canonical(b)).length) throw new Error('History integrity rejected');
  return b.payload;
}
export async function verifyArchiveResource(manifest,parts) {
  const text=parts.join('');
  if(bytes(text).length!==manifest.byte_count || await sha(text)!==manifest.sha256) throw new Error('History resource integrity rejected');
  return JSON.parse(text);
}
