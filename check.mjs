// Public transport/assets check. No API key, model calls or citizen telemetry.
import {pathToFileURL} from 'node:url';
export async function checkAvailability({fetcher=fetch}={}){
 const origin='https://senorjusticia.org',checks=[];
 async function check(path,expected,options={}){
  const started=Date.now();
  const response=await fetcher(origin+path,{redirect:'error',...options,signal:AbortSignal.timeout(12000)});
  checks.push({path,status:response.status,elapsedMs:Date.now()-started});
  if(response.status!==expected)throw Error('Unexpected status for '+path+': '+response.status);
  return response;
 }
 for(const path of ['/','/justicia/']){
  const response=await check(path,200);
  if(!response.headers.get('content-type')?.includes('text/html'))throw Error('Expected HTML for '+path);
  const html=await response.text();
  if(!/Señor Justicia/.test(html)||path==='/justicia/'&&!/Chat de Justicia/.test(html))throw Error('Expected product content missing for '+path);
  const assets=[...new Set([...html.matchAll(/(?:src|href)=["'](\/assets\/[^"']+\.(?:js|css))["']/g)].map(match=>match[1]))];
  if(!assets.length||assets.length>12)throw Error('Unexpected asset manifest for '+path);
  for(const asset of assets){
   const r=await check(asset,200);
   if(r.headers.get('content-type')?.includes('text/html'))throw Error('HTML fallback instead of asset: '+asset);
  }
 }
 await check('/api/justice-assistant',405);
 const validation=await check('/api/justice-assistant',400,{method:'POST',headers:{'Content-Type':'application/json','Origin':origin},body:JSON.stringify({messages:[]})});
 if(!validation.headers.get('cache-control')?.includes('no-store'))throw Error('API response caching enabled');
 if(typeof (await validation.json()).error!=='string')throw Error('API validation response missing');
 return {ok:true,checkedAt:new Date().toISOString(),modelTested:false,checks};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 try{console.log(JSON.stringify(await checkAvailability()));}
 catch(error){console.error(JSON.stringify({ok:false,error:error.message}));process.exitCode=1;}
}
