import {StaticReader} from './static-reader.js?v=75ce0cb1cb9d7a36';
import {ViewerSession} from './session.js?v=75ce0cb1cb9d7a36';
import {acceptSqlFeed, FeedAccessError, FirebasePreviewFeed, maxSyncAgeMs} from './firebase-preview-feed.js?v=75ce0cb1cb9d7a36';
const byId=id=>document.getElementById(id),reader=new StaticReader(new URL('./',import.meta.url));
const assetVersion=new URL(import.meta.url).searchParams.get('v');
let manifest,resources,scenario,epoch=0,liveFeed=null,liveReceipt=null,liveStatus=null,signInAttempt=0,polling=false;
let language='zh';
try {if(sessionStorage.getItem('factorylite-language')==='en')language='en';} catch{}
const issueReports=new Map();
let issueScope='',issueStops=[],issueRequest=0;
const issueLabels={
  en:['Key Issues','Close','Line','Issue','Add preview report','Synthetic preview. Reports stay in this tab and are not sent to Firebase or PDTIII.','No issues for this workday.','Synthetic stop','Preview report','Original PDTIII DM App (external)'],
  zh:['主要问题','关闭','线体','问题','添加预览报告','此处为模拟预览。报告仅保留在本标签页，不会发送至 Firebase 或 PDTIII。','此生产日暂无问题。','模拟停机','预览报告','原版 PDTIII DM App（外部链接）'],
};
function renderIssues(){
  const [title,close,line,issue,add,notice,empty,stopLabel,reportLabel,original]=issueLabels[language];
  for(const [id,text] of Object.entries({'open-issues':title,'issues-title':title,'issues-close':close,
    'issues-add':add,'issues-notice':notice,'issues-original':original}))byId(id).textContent=text;
  byId('issues-line-label').firstChild.nodeValue=line+' ';
  byId('issues-summary-label').firstChild.nodeValue=issue+' ';
  byId('issues-date-label').firstChild.nodeValue=language==='en'?'Workday ':'生产日 ';
  const list=byId('issues-list');
  const reports=issueReports.get(issueScope)||[];
  list.replaceChildren();
  for(const [tag,item] of [...reports.map(x=>[reportLabel,x]),...issueStops.map(x=>[stopLabel,x])]){
    const row=document.createElement('li');
    row.textContent=tag+' · '+item.line+' — '+(item.summary||item.detail||item.code||'');
    list.append(row);
  }
  byId('issues-status').textContent=list.children.length?'':empty;
}
async function loadIssues(workday){
  const request=++issueRequest;
  const currentEpoch=epoch;
  issueScope=(liveFeed?'firebase:':'fixture:')+workday;
  issueStops=[];
  renderIssues();
  const stopResource=resources?.['stops%2F'+workday];
  if(!stopResource)return;
  try{
    const values=await reader.read('factory_a',stopResource);
    if(request===issueRequest&&currentEpoch===epoch&&Array.isArray(values)){
      issueStops=values;renderIssues();
    }
  }catch{/* Manual preview reports remain available. */}
}
byId('issues-date').onchange=()=>loadIssues(byId('issues-date').value);
byId('open-issues').onclick=()=>{
  const clock=Date.parse(scenario?.clock);
  const workday=Number.isFinite(clock)?new Date(clock+(7-8)*3600000).toISOString().slice(0,10):'';
  const dates=[...new Set([workday,...[...byId('history-date').options].map(option=>option.value)].filter(Boolean))];
  byId('issues-date').replaceChildren(...dates.map(date=>new Option(date,date)));
  const names=[...new Set((resources?.pdtiii?.lines||[]).map(line=>line.name).filter(Boolean))];
  byId('issues-line').replaceChildren(...names.map(name=>new Option(name,name)));
  byId('issues-add').disabled=!names.length;
  byId('issues-summary').value='';
  byId('issues-dialog').showModal();
  return loadIssues(byId('issues-date').value);
};
byId('issues-form').onsubmit=event=>{
  event.preventDefault();
  const line=byId('issues-line').value,summary=byId('issues-summary').value.trim();
  if(!line||!summary||!issueScope)return;
  issueReports.set(issueScope,[{line,summary},...(issueReports.get(issueScope)||[])]);
  byId('issues-summary').value='';
  renderIssues();
};
const fail=error=>{byId('error').hidden=false;byId('error').textContent='Preview unavailable: '+error.message;};
function check(id){if(id!=='factory_a'||!resources)throw new Error('Factory access denied');}
function boardUrl(scenarioId){
  const url=new URL('board.html',import.meta.url);
  url.searchParams.set('factory','factory_a');
  if(scenarioId)url.searchParams.set('scenario',scenarioId);
  if(assetVersion)url.searchParams.set('v',assetVersion);
  return url;
}
function hideBoard(){
  ++issueRequest;issueStops=[];issueScope='';
  if(byId('issues-dialog').open)byId('issues-dialog').close();
  renderIssues();
  ++epoch;reader.clear();resources=null;byId('board').hidden=true;byId('board').src='about:blank';
}
function renderLiveStatus(){
  const stale=liveReceipt&&Date.now()-liveReceipt.syncedAt>=maxSyncAgeMs;
  const receipt=liveReceipt?' · Sequence '+liveReceipt.sequence+' · Last sync: '+new Date(liveReceipt.syncedAt).toLocaleString()+' · '+(stale?'STALE':'Fresh'):'';
  byId('stamp').textContent='Firebase · SQL Server Express · SYNTHETIC · '+liveStatus+receipt;
}
window.FactoryLitePreviewClock=()=>scenario.clock;
window.FactoryLiteHost=Object.freeze({
  getLanguage(){return language;},
  setLanguage(value){
    if(value!=='en'&&value!=='zh')return;
    language=value;
    renderIssues();
    try{sessionStorage.setItem('factorylite-language',value);}catch{}
  },
  boot(id){check(id);return structuredClone(resources);},
  async read(id){check(id);return structuredClone(resources);},
  async resource(id,key){check(id);const selected=epoch;if(!Object.hasOwn(resources,key))throw new Error('Demo resource unavailable');const result=await reader.read(id,resources[key]);if(selected!==epoch)throw new Error('Preview changed');return result;},
});
renderIssues();
async function select(){
  const selected=++epoch;reader.clear();byId('error').hidden=true;resources=null;byId('board').hidden=true;byId('board').src='about:blank';
  scenario=manifest.scenarios[byId('scenario').value];if(!scenario)throw new Error('Unknown demo scenario');
  byId('history-date').replaceChildren(...manifest.history_dates.map(date=>new Option(date,date)));
  const incoming=structuredClone(scenario.resources);
  await Promise.all(['pdtiii','live-data','history%2Fembedded','daily-problems-data'].map(async key=>{incoming[key]=await reader.read('factory_a',incoming[key]);}));
  if(selected!==epoch)return;resources=incoming;
  byId('stamp').textContent='Fixture clock: '+scenario.clock+' · Asia/Bangkok · Source: generated synthetic fixture';
  byId('board').src=boardUrl(byId('scenario').value);byId('board').hidden=false;
}
function showLive(document, label){
  const live=acceptSqlFeed(document);
  ++epoch;reader.clear();resources=live.resources;scenario={clock:live.clock};
  byId('error').hidden=true;
  byId('history-date').replaceChildren(...live.dates.map(date=>new Option(date,date)));
  if(label){
    byId('stamp').textContent=label+' · SYNTHETIC · Sequence '+live.sequence+' · Last sync: '+new Date(live.syncedAt).toLocaleString();
  }else{
    liveReceipt=live;liveStatus='Connected';renderLiveStatus();
  }
  byId('board').src=boardUrl();byId('board').hidden=false;
}
byId('open-live').onclick=async()=>{
  byId('live-dialog').showModal();
  if(byId('firebase-key').value||!['localhost','127.0.0.1'].includes(location.hostname))return;
  try{
    const response=await fetch('viewer-local.json',{cache:'no-store',redirect:'error'});
    if(response.ok){
      const {apiKey}=await response.json();
      if(typeof apiKey==='string'&&!byId('firebase-key').value)byId('firebase-key').value=apiKey;
    }
  }catch{/* A manually entered Web API key remains available. */}
};
byId('fixture-mode').onclick=()=>{
  ++signInAttempt;liveFeed?.clear();liveFeed=null;liveReceipt=null;liveStatus=null;
  byId('live-dialog').close();byId('scenario').disabled=false;select().catch(fail);
};
byId('live-form').onsubmit=async event=>{
  event.preventDefault();
  const attempt=++signInAttempt;
  liveFeed?.clear();liveFeed=null;liveReceipt=null;
  hideBoard();byId('error').hidden=true;byId('scenario').disabled=true;
  liveStatus='Connecting';renderLiveStatus();
  const feed=new FirebasePreviewFeed(new ViewerSession({mode:'production',apiKey:byId('firebase-key').value}));
  try{
    const signedIn=feed.session.login(byId('viewer-email').value,byId('viewer-password').value);
    byId('viewer-password').value='';
    await signedIn;
    const document=await feed.read();
    if(attempt!==signInAttempt){feed.clear();return;}
    feed.changed(document);
    showLive(document);
    liveFeed=feed;byId('live-dialog').close();
  }catch(error){
    feed.clear();if(attempt!==signInAttempt)return;
    liveStatus=error instanceof FeedAccessError?'Permission denied':'Connection failed';renderLiveStatus();
    byId('live-dialog').close();fail(error);
  }
};
setInterval(async()=>{
  const feed=liveFeed;if(!feed||polling)return;
  polling=true;
  try{
    const document=await feed.read();
    if(feed!==liveFeed)return;
    if(feed.changed(document))showLive(document);
    else{liveStatus='Connected';renderLiveStatus();byId('error').hidden=true;}
  }catch(error){
    if(feed!==liveFeed)return;
    if(error instanceof FeedAccessError){
      feed.clear();liveFeed=null;liveReceipt=null;hideBoard();liveStatus='Permission denied';
    }else{
      liveStatus=navigator.onLine?'Disconnected · Last verified snapshot':'Offline · Last verified snapshot';
    }
    renderLiveStatus();fail(error);
  }finally{polling=false;}
},15000);
window.addEventListener('offline',()=>{
  if(!liveFeed)return;
  liveStatus='Offline · Last verified snapshot';renderLiveStatus();
});
byId('scenario').onchange=()=>select().catch(fail);
byId('layout').onchange=()=>document.body.classList.toggle('wide',byId('layout').value==='wide');
byId('history').onclick=()=>byId('history-dialog').showModal();
byId('load-history').onclick=async()=>{
  byId('history-status').textContent='Loading synthetic history and stops…';byId('history-result').textContent='';
  try{
    const date=byId('history-date').value;
    const [history,stops]=await Promise.all(['history/','stops/'].map(prefix=>window.FactoryLiteHost.resource('factory_a',encodeURIComponent(prefix+date))));
    const analytics=resources?.['history%2Fanalytics'];
    const summary=Array.isArray(analytics?.days)?analytics.days.find(day=>day.date===date):null;
    byId('history-result').textContent=JSON.stringify({date,source:'SYNTHETIC',lines:history.lines?.length??0,
      hourlyLines:Object.keys(history.hourly||{}).length,stops,...(summary?.modelTotals?{models:summary.modelTotals}: {})},null,2);
    byId('history-status').textContent='PASS · Synthetic data';
  }catch(error){byId('history-status').textContent='FAILED · '+error.message;}
};
try{
  const response=await fetch('data/manifest.json',{cache:'no-store',redirect:'error'});if(!response.ok)throw new Error('Demo manifest unavailable');
  manifest=await response.json();if(manifest.environment!=='public-synthetic-preview'||manifest.factory_id!=='factory_a')throw new Error('Invalid demo identity');
  if(new URLSearchParams(location.search).has('local-sql')&&['127.0.0.1','localhost'].includes(location.hostname)){
    const snapshot=await fetch('sql-demo.json',{cache:'no-store',redirect:'error'});
    if(!snapshot.ok)throw new Error('Local SQL snapshot unavailable');
    byId('scenario').disabled=true;showLive(await snapshot.json(),'Local SQL snapshot · offline test');
  }else{
  await select();
  }
}catch(error){fail(error);}
