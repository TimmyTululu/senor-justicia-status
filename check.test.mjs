import test from 'node:test';
import assert from 'node:assert/strict';
import {checkAvailability} from './check.mjs';
const fixture=async(url,options)=>{
 if(url.endsWith('/justicia/')){assert.equal(options.redirect,'manual');return new Response(null,{status:307,headers:{location:'/'}});}
 if(url.endsWith('/api/justice-feedback'))return new Response(JSON.stringify({ok:false}),{status:options?.method==='POST'?400:405,headers:{'content-type':'application/json','cache-control':'no-store'}});
 if(url.endsWith('/api/justice-assistant'))return new Response(JSON.stringify({error:'invalid'}),{status:options.method==='POST'?400:405,headers:{'content-type':'application/json','cache-control':'no-store'}});
 if(url.includes('/assets/'))return new Response('asset',{headers:{'content-type':'text/javascript'}});
 return new Response('<title>Señor Justicia</title><h1>Chat de Justicia</h1><script src="/assets/app.js"></script>',{headers:{'content-type':'text/html'}});
};
test('transport checker stays independent of model calls and never submits a real turn',async()=>{
 const calls=[];const result=await checkAvailability({fetcher:async(url,options)=>{calls.push({url,options});return fixture(url,options);}});
 assert.equal(result.ok,true);assert.equal(result.modelTested,false);
 assert.deepEqual(calls.filter(c=>c.options.method==='POST').map(c=>JSON.parse(c.options.body)),[{messages:[]},{}]);
});
test('transport checker detects masked asset failure, disabled API and missing product HTML',async()=>{
 for(const fault of ['asset','api','content'])await assert.rejects(()=>checkAvailability({fetcher:async(url,options)=>{
  if(fault==='asset'&&url.includes('/assets/'))return new Response('<html>fallback</html>',{headers:{'content-type':'text/html'}});
  if(fault==='api'&&url.endsWith('/api/justice-assistant'))return new Response('unavailable',{status:503});
  if(fault==='content'&&url==='https://senorjusticia.org/')return new Response('<title>Wrong site</title>',{headers:{'content-type':'text/html'}});
  return fixture(url,options);
 }}));
});

test('legacy chat redirect must target the same-origin homepage with its expected status',async()=>{
 for(const [status,location] of [[200,'/'],[307,'/la-serie/'],[307,'https://example.com/'],[307,null]]){
  await assert.rejects(()=>checkAvailability({fetcher:async(url,options)=>url.endsWith('/justicia/')?new Response(null,{status,headers:location?{location}:{}}):fixture(url,options)}));
 }
});
test('feedback validation remains private and rejects invalid submissions',async()=>{
 for(const fault of ['cache','body'])await assert.rejects(()=>checkAvailability({fetcher:async(url,options)=>{
  if(url.endsWith('/api/justice-feedback')&&options.method==='POST')return new Response(JSON.stringify({ok:fault==='body'}),{status:400,headers:{'cache-control':fault==='cache'?'public':'no-store'}});
  return fixture(url,options);
 }}));
});
