import {validateArchiveManifest,verifyArchiveChunk,verifyArchiveResource} from './archive.js?v=75ce0cb1cb9d7a36';
export class StaticReader {
  constructor(base){this.base=new URL(base);if(this.base.origin!==location.origin)throw new Error('Same-origin demo required');this.clear();}
  clear(){this.generation=(this.generation||0)+1;this.cache=new Map();}
  async read(factory,value){
    if(factory!=='factory_a')throw new Error('Factory access denied');
    if(!value?.__archive__)return structuredClone(value);
    const m=value.__archive__,epoch=this.generation;validateArchiveManifest(factory,m);
    if(this.cache.has(m.sha256))return structuredClone(this.cache.get(m.sha256));
    const parts=[];
    for(const id of m.chunks){
      if(!/^[0-9a-f]{64}$/.test(id))throw new Error('Invalid history chunk identity');
      const response=await fetch(new URL('data/chunks/'+id+'.json',this.base),{cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error('Demo history unavailable');
      parts.push(await verifyArchiveChunk(factory,id,await response.text()));
      if(epoch!==this.generation)throw new Error('Preview changed');
    }
    const result=await verifyArchiveResource(m,parts);
    if(this.cache.size>=4)this.cache.clear();this.cache.set(m.sha256,result);return structuredClone(result);
  }
}
