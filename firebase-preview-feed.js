const endpoint='https://factorylite-production-default-rtdb.asia-southeast1.firebasedatabase.app';
const viewerUid='e5SIEodx9DPcD8sWjmq8fkjpUsH3';
export const maxSyncAgeMs=5*60*1000;

export class FeedAccessError extends Error {}

export function acceptSqlFeed(document){
  const live=document?.live,receipt=document?.sync_status,legacy=live?.legacy;
  if(live?.factory_id!=='factory_a'||live.schema_version!==2||live.synthetic!==true||
     live.source_mode!=='sql_server_express'||legacy?.factory_id!=='factory_a'||legacy.schema_version!==1||
     !Array.isArray(legacy.resources?.pdtiii?.lines)||!Number.isFinite(Date.parse(live.source_clock))||
     !Number.isSafeInteger(receipt?.publish_sequence)||receipt.publish_sequence<1||
     !Number.isFinite(receipt.last_success_at)||receipt.last_success_at<=0||
     receipt.last_success_at>Date.now()+60000||!/^[a-f0-9]{64}$/.test(receipt.digest)){
    throw new Error('Expected a versioned Factory A synthetic SQL feed.');
  }
  const resources={...legacy.resources};
  const historyKey='history%2Fanalytics';
  if(typeof resources[historyKey]==='string'){
    if(resources[historyKey].length>2000000)throw new Error('History index exceeds reader limit.');
    const index=JSON.parse(resources[historyKey]);
    if(index?.schemaVersion!==2||!Array.isArray(index.days))throw new Error('Invalid SQL history index.');
    resources[historyKey]=index;
  }
  const dates=resources['history%2Findex']||[], stopDates=new Set(resources['stops%2Findex']||[]);
  for(const date of dates){
    const key='stops%2F'+date;
    if(!stopDates.has(date)&&!Object.hasOwn(resources,key))resources[key]=[];
  }
  return {resources,clock:live.source_clock,dates,
    syncedAt:receipt.last_success_at,sequence:receipt.publish_sequence};
}

export class FirebasePreviewFeed {
  constructor(session){this.session=session;this.sequence=0;this.digest=null;}
  clear(){this.session.clear();}
  async read(){
    const token=await this.session.token();
    if(this.session.uid!==viewerUid)throw new FeedAccessError('Factory A Viewer account required.');
    const response=await fetch(endpoint+'/factorylite/factories/factory_a.json?auth='+encodeURIComponent(token),{
      cache:'no-store',redirect:'error',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(8000),
    });
    if(response.status===401||response.status===403)throw new FeedAccessError('Firebase Viewer permission denied.');
    if(!response.ok)throw new Error('Firebase Viewer read unavailable.');
    return response.json();
  }
  changed(document){
    acceptSqlFeed(document);
    const {publish_sequence,digest}=document.sync_status;
    if(publish_sequence<this.sequence||(publish_sequence===this.sequence&&this.digest!==digest)){
      throw new Error('Firebase snapshot version regressed.');
    }
    if(this.sequence===publish_sequence)return false;
    this.sequence=publish_sequence;this.digest=digest;return true;
  }
}
