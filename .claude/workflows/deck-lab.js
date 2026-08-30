/* ── the deck lab ──
   Renders candidate ENTRANCES for the workout deck's second level —
   what happens when you press a kind card and the exercises arrive —
   over the real sheet, and writes one strip per candidate.

   Run it from the repo root: `node .claude/workflows/deck-lab.js`.
   Edit OPTS to propose; the strips land in the scratchpad.

   Motion is the whole subject, so a still is not a proposal: each
   candidate is captured at three moments of its own curve, exact
   rather than sampled on a timer — the animations are paused and
   their currentTime is set, so the frames are the same three points
   on every run and on every machine.

   Rendered over the REAL sheet at 390x844, and cropped to the deck at
   1:1. A comparison sheet that scales a treatment down understates
   how loud it is; this repo has made that mistake once already. */
const http=require('http'),fs=require('fs'),path=require('path'),url=require('url');
const {PNG}=require('pngjs');
/* The repo root, from here rather than from wherever node was
   started — tests/lib.js is what finds a browser, and hardcoding a
   path is what makes a harness stop working on another machine. */
const ROOT=path.resolve(__dirname,'..','..');
const lib=require(path.join(ROOT,'tests','lib.js'));
/* Wherever this is run from. A hardcoded scratchpad path is a path
   that belongs to one session. */
const D=path.join(require('os').tmpdir(),'deck-lab');
fs.mkdirSync(D,{recursive:true});
const T={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2'};

/* Each option is one keyframe set plus how long it runs. The class the
   app would add is `is-turning`, on the DECK, so a rule can reach the
   front card alone or the whole hand. */
const OPTS = [
  { id:'a', name:'Hard cut (today)', css:'', dur:0 },
  { id:'b', name:'The front card alone, lifting',
    css:`@keyframes tB{from{translate:0 14px;opacity:0}to{translate:0 0;opacity:1}}
         .wc-deck.is-turning .wc.is-front{animation:tB .2s cubic-bezier(.22,1,.36,1) both}`, dur:200 },
  { id:'c', name:'A lateral page, under the chips',
    css:`@keyframes tC{from{translate:46px 0;opacity:0}to{translate:0 0;opacity:1}}
         .wc-deck.is-turning .wc.is-front{animation:tC .24s cubic-bezier(.3,.9,.3,1) both}`, dur:240 },
  { id:'d', name:'A short fold, no re-deal',
    css:`@keyframes tD{from{scale:.93;rotate:-3deg;opacity:0}to{scale:1;rotate:0deg;opacity:1}}
         .wc-deck.is-turning .wc.is-front{animation:tD .26s cubic-bezier(.22,1,.36,1) both;transform-origin:14% 88%}`, dur:260 },
  { id:'e', name:'The whole hand tightening',
    css:`@keyframes tE1{from{translate:0 10px;opacity:0}to{translate:0 0;opacity:1}}
         @keyframes tE2{from{translate:6px 4px;scale:.99}to{translate:0 0;scale:1}}
         .wc-deck.is-turning .wc.is-front{animation:tE1 .22s cubic-bezier(.22,1,.36,1) both}
         .wc-deck.is-turning .wc.b1{animation:tE2 .3s cubic-bezier(.22,1,.36,1) both .03s}
         .wc-deck.is-turning .wc.b2{animation:tE2 .3s cubic-bezier(.22,1,.36,1) both}`, dur:300 },
];
const AT=[0,.28,.62];

const srv=http.createServer((rq,rs)=>{let f=path.join(ROOT,decodeURIComponent(url.parse(rq.url).pathname));
  if(fs.existsSync(f)&&fs.statSync(f).isDirectory())f=path.join(f,'index.html');
  if(!fs.existsSync(f)){rs.writeHead(404);return rs.end();}
  rs.writeHead(200,{'content-type':T[path.extname(f)]||'application/octet-stream'});rs.end(fs.readFileSync(f));});

(async()=>{
  await new Promise(r=>srv.listen(0,r));
  const B='http://127.0.0.1:'+srv.address().port;
  const b=await lib.chromium.launch({executablePath:lib.chrome()});
  for(const o of OPTS){
    const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,locale:'en-GB'});
    const p=await ctx.newPage();
    await p.goto(B+'/schedule/',{waitUntil:'networkidle'});
    await p.evaluate(()=>{localStorage.setItem('sched.net.v1',JSON.stringify({on:false}));localStorage.setItem('sched.view.v1','tally');});
    await p.reload({waitUntil:'networkidle'});await p.waitForTimeout(400);
    if(o.css) await p.addStyleTag({content:o.css});
    await p.click('[data-item="t"]');await p.waitForTimeout(900);
    await p.click('.wc.is-front');await p.waitForTimeout(120);
    const box=await p.evaluate(()=>{const d=document.querySelector('.wc-deck').getBoundingClientRect();
      return {x:Math.max(0,d.x-16),y:Math.max(0,d.y-14),width:Math.min(390,d.width+32),height:d.height+34};});
    const shots=[];
    for(const t of AT){
      await p.evaluate(([css,ms,frac])=>{
        const deck=document.querySelector('.wc-deck');
        deck.classList.remove('is-turning');
        void deck.offsetWidth;
        if(css) deck.classList.add('is-turning');
        deck.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=ms*frac;});
      },[o.css,o.dur,t]);
      await p.waitForTimeout(60);
      shots.push(PNG.sync.read(await p.screenshot({clip:box})));
    }
    /* One strip, three frames, 1:1 with a gutter of the page's own
       ground so the cards do not touch. */
    const gap=18*2, W=shots[0].width, H=shots[0].height;
    const out=new PNG({width:W*3+gap*2,height:H});
    for(let i=0;i<3;i++) PNG.bitblt(shots[i],out,0,0,W,H,i*(W+gap),0);
    fs.writeFileSync(path.join(D,'deck-'+o.id+'.png'),PNG.sync.write(out));
    console.log(o.id,o.name,'->',W+'x'+H,'x3');
    await ctx.close();
  }
  await b.close();srv.close();
})();
