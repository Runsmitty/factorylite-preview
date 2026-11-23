import {StaticReader} from './static-reader.js';
const byId=id=>document.getElementById(id),reader=new StaticReader(new URL('./',import.meta.url));
let manifest,resources,scenario,epoch=0;
const fail=error=>{byId('error').hidden=false;byId('error').textContent='Preview unavailable: '+error.message;};
function check(id){if(id!=='factory_a'||!resources)throw new Error('Factory access denied');}
window.FactoryLitePreviewClock=()=>scenario.clock;
window.FactoryLiteHost=Object.freeze({
  boot(id){check(id);return structuredClone(resources);},
  async read(id){check(id);return structuredClone(resources);},
  async resource(id,key){check(id);const selected=epoch;if(!Object.hasOwn(resources,key))throw new Error('Demo resource unavailable');const result=await reader.read(id,resources[key]);if(selected!==epoch)throw new Error('Preview changed');return result;},
});
async function select(){
  const selected=++epoch;reader.clear();byId('error').hidden=true;resources=null;byId('board').hidden=true;byId('board').src='about:blank';
  scenario=manifest.scenarios[byId('scenario').value];if(!scenario)throw new Error('Unknown demo scenario');
  const incoming=structuredClone(scenario.resources);
  await Promise.all(['pdtiii','live-data','history%2Fembedded','daily-problems-data'].map(async key=>{incoming[key]=await reader.read('factory_a',incoming[key]);}));
  if(selected!==epoch)return;resources=incoming;
  byId('stamp').textContent='Fixture clock: '+scenario.clock+' · Asia/Bangkok · Source: generated synthetic fixture';
  byId('board').src='board.html?factory=factory_a&scenario='+encodeURIComponent(byId('scenario').value);byId('board').hidden=false;
}
byId('scenario').onchange=()=>select().catch(fail);
byId('layout').onchange=()=>document.body.classList.toggle('wide',byId('layout').value==='wide');
byId('history').onclick=()=>byId('history-dialog').showModal();
byId('load-history').onclick=async()=>{
  byId('history-status').textContent='Verifying resource digests…';byId('history-result').textContent='';
  try{
    const date=byId('history-date').value;
    const [history,stops]=await Promise.all(['history/','stops/'].map(prefix=>window.FactoryLiteHost.resource('factory_a',encodeURIComponent(prefix+date))));
    byId('history-result').textContent=JSON.stringify({date,source:'SYNTHETIC',lines:history.lines?.length??0,hourlyLines:Object.keys(history.hourly||{}).length,stops},null,2);
    byId('history-status').textContent='PASS · Digests verified · Synthetic data';
  }catch(error){byId('history-status').textContent='FAILED · '+error.message;}
};
try{
  const response=await fetch('data/manifest.json',{cache:'no-store',redirect:'error'});if(!response.ok)throw new Error('Demo manifest unavailable');
  manifest=await response.json();if(manifest.environment!=='public-synthetic-preview'||manifest.factory_id!=='factory_a')throw new Error('Invalid demo identity');
  byId('history-date').replaceChildren(...manifest.history_dates.map(date=>new Option(date,date)));
  await select();
}catch(error){fail(error);}
