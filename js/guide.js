
// ---------- Theme ----------
(function(){
  var btn=document.getElementById('theme'),root=document.documentElement;
  btn.addEventListener('click',function(){
    var dark=root.dataset.theme==='dark'||(!root.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme=dark?'light':'dark';
    btn.setAttribute('aria-pressed',String(!dark));
  });
})();

// ---------- Saved checkbox progress ----------
(function(){
  var KEY='dns-guide-progress-v1';
  var boxes=[].slice.call(document.querySelectorAll('#steps input,#qr input'));
  var saved=[];
  try{saved=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){}
  boxes.forEach(function(b,i){b.checked=!!saved[i]});
  function update(){
    var steps=[].slice.call(document.querySelectorAll('#steps input'));
    var done=steps.filter(function(b){return b.checked}).length;
    var p=Math.round(done/steps.length*100);
    document.getElementById('pct').textContent=p+'%';
    document.getElementById('barfill').style.width=p+'%';
    try{localStorage.setItem(KEY,JSON.stringify(boxes.map(function(b){return b.checked})))}catch(e){}
  }
  boxes.forEach(function(b){b.addEventListener('change',update)});
  update();
})();

// ---------- Record checker ----------
(function(){
  var samples={
    'spf-ok':'v=spf1 include:_spf.mailhost.example include:_spf.crm.example ~all',
    'spf-dup':'v=spf1 include:_spf.mailhost.example ~all\nv=spf1 include:_spf.crm.example ~all',
    'spf-all':'v=spf1 include:_spf.mailhost.example +all',
    'dmarc-bad':'v=DMARC1; rua=mailto:reports@example.com',
    'dkim-ok':'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDexample'
  };
  var ta=document.getElementById('rec'),out=document.getElementById('lintOut');
  document.querySelectorAll('[data-s]').forEach(function(b){
    b.addEventListener('click',function(){ta.value=samples[b.dataset.s];run()});
  });
  document.getElementById('run').addEventListener('click',run);
  function add(type,msg){var li=document.createElement('li');li.className='r-'+type;
    li.textContent=({bad:'Error: ',warn:'Warning: ',good:'Pass: ',info:'Note: '})[type]+msg;out.appendChild(li)}
  function run(){
    out.innerHTML='';
    var raw=ta.value.trim();
    if(!raw){add('info','Paste a record first.');return}
    if(/[\u201C\u201D\u2018\u2019]/.test(raw))add('bad','Smart quotes found. Re-type or paste as plain text.');
    var lines=raw.split(/\n+/).map(function(l){return l.trim().replace(/^"|"$/g,'')});
    var lower=raw.toLowerCase();
    if(lower.indexOf('v=spf1')>-1)spf(lines);
    else if(lower.indexOf('v=dmarc1')>-1)dmarc(lines[0]);
    else if(lower.indexOf('v=dkim1')>-1||/(^|;)\s*p=/.test(lower))dkim(lines[0]);
    else add('bad','Not recognized. Records should start with v=spf1, v=DMARC1, or v=DKIM1.');
  }
  function spf(lines){
    var recs=lines.filter(function(l){return /^v=spf1/i.test(l)});
    if(recs.length>1)add('bad',recs.length+' SPF records found. Only one is allowed. Merge them into a single record.');
    if(!/^v=spf1/i.test(lines[0]))add('bad','The record must begin with v=spf1.');
    var r=recs[0]||lines[0],t=r.split(/\s+/).slice(1);
    var n=t.filter(function(x){return /^[+\-~?]?(include:|a(:|\/|$)|mx(:|\/|$)|exists:|ptr)/i.test(x)||/^redirect=/i.test(x)}).length;
    if(n>10)add('bad','About '+n+' DNS lookups. The limit is 10. Remove unused includes.');
    else add('good','About '+n+' of 10 allowed DNS lookups.');
    var all=t.filter(function(x){return /^[+\-~?]?all$/i.test(x)})[0];
    if(!all)add('warn','No "all" mechanism at the end. Add ~all or -all.');
    else if(/^\+?all$/i.test(all))add('bad','"+all" lets anyone send as this domain. Use ~all or -all.');
    else if(all[0]==='?')add('warn','"?all" is neutral and gives little protection.');
    else{add('good','Ends with '+all+'.');if(t[t.length-1]!==all)add('warn','"'+all+'" is not the last item. Mechanisms after it are ignored.')}
    if(t.some(function(x){return /^[+\-~?]?ptr/i.test(x)}))add('warn','The ptr mechanism is discouraged. Replace it with ip4 or include.');
  }
  function dmarc(r){
    var tags={};r.split(';').forEach(function(p){var kv=p.split('=');if(kv[1]!==undefined)tags[kv[0].trim().toLowerCase()]=kv.slice(1).join('=').trim()});
    if(!/^v=DMARC1/.test(r))add('bad','Must start with v=DMARC1 (case-sensitive) as the first tag.');
    if(!tags.p)add('bad','Missing the p= policy tag. Use p=none, p=quarantine, or p=reject.');
    else if(['none','quarantine','reject'].indexOf(tags.p.toLowerCase())<0)add('bad','Invalid policy "'+tags.p+'".');
    else if(tags.p==='none')add('info','p=none only monitors. Fine while testing, but it does not block spoofing.');
    else add('good','Policy is '+tags.p+'.');
    if(!tags.rua)add('warn','No rua= address, so you will not receive aggregate reports.');
    else if(!/^mailto:/i.test(tags.rua))add('bad','rua= must start with mailto:.');
    if(tags.pct&&+tags.pct<100)add('info','pct='+tags.pct+': the policy applies to only part of the mail.');
  }
  function dkim(r){
    var tags={};r.split(';').forEach(function(p){var kv=p.split('=');if(kv[1]!==undefined)tags[kv[0].trim().toLowerCase()]=kv.slice(1).join('=').trim()});
    if(tags.v&&tags.v!=='DKIM1')add('bad','v= must be DKIM1.');
    if(tags.p===undefined)add('bad','Missing p= public key.');
    else if(tags.p==='')add('bad','p= is empty, which means the key was revoked. Publish the current key.');
    else if(/\s/.test(tags.p))add('warn','Whitespace inside the key. Long keys split across quoted strings must be joined without spaces.');
    else add('good','Public key present ('+tags.p.length+' characters).');
    if(tags.k&&['rsa','ed25519'].indexOf(tags.k)<0)add('warn','Unusual key type k='+tags.k+'.');
  }
})();

// ---------- Knowledge check ----------
(function(){
  // CUSTOMIZE: edit questions. "a" is the index of the correct option.
  var Q=[
    {q:'A customer added a second SPF record for a new marketing tool. Mail now fails SPF. What is the most likely cause?',
     o:['The new tool is blocklisted','A domain may have only one SPF record','SPF records must be added to the _dmarc name','DKIM overrides SPF'],a:1,
     w:'Receivers treat multiple SPF records as a permanent error. Merge the include: entries into one record.'},
    {q:'All three records exist and look correct, but DMARC fails. What should you compare next?',
     o:['The TTL values','The MX priority','The From domain against the DKIM d= and Return-Path domains','The customer\'s mailbox size'],a:2,
     w:'DMARC needs alignment: the domain that passed SPF or DKIM must match the visible From domain.'},
    {q:'SPF, DKIM, and DMARC all pass in the headers, but a big mailbox provider still rejects the mail, citing the sending IP. What do you do?',
     o:['Ask the customer to delete the DMARC record','Change p=none to p=reject','Escalate with the headers and bounce text','Add more include: entries'],a:2,
     w:'Correct authentication with an IP reputation problem is an escalation criterion. Do not change DNS to guess at it.'}
  ];
  var box=document.getElementById('quizBox');
  Q.forEach(function(item,i){
    var d=document.createElement('div');d.className='q';
    var f=document.createElement('fieldset');
    var l=document.createElement('legend');l.textContent=(i+1)+'. '+item.q;f.appendChild(l);
    item.o.forEach(function(t,j){
      var lab=document.createElement('label');lab.className='opt';
      var r=document.createElement('input');r.type='radio';r.name='q'+i;r.value=j;
      lab.appendChild(r);lab.appendChild(document.createTextNode(t));f.appendChild(lab);
    });
    var fb=document.createElement('p');fb.className='fb';fb.id='fb'+i;f.appendChild(fb);
    d.appendChild(f);box.appendChild(d);
  });
  document.getElementById('grade').addEventListener('click',function(){
    var score=0,answered=0;
    Q.forEach(function(item,i){
      var opts=box.querySelectorAll('input[name=q'+i+']'),fb=document.getElementById('fb'+i);
      opts.forEach(function(o){o.parentNode.classList.remove('right','wrong')});
      var pick=[].filter.call(opts,function(o){return o.checked})[0];
      if(!pick){fb.textContent='Choose an answer.';return}
      answered++;
      if(+pick.value===item.a){score++;pick.parentNode.classList.add('right');fb.textContent='Correct. '+item.w}
      else{pick.parentNode.classList.add('wrong');opts[item.a].parentNode.classList.add('right');fb.textContent='Not quite. '+item.w}
    });
    document.getElementById('score').textContent=answered<Q.length?'Answer all '+Q.length+' questions to see your score.':'Score: '+score+' of '+Q.length;
  });
})();

// ---------- Highlight current section in the contents ----------
(function(){
  var links=[].slice.call(document.querySelectorAll('nav.toc a'));
  if(!('IntersectionObserver' in window))return;
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})}});
  },{rootMargin:'-20% 0px -70% 0px'});
  document.querySelectorAll('main section').forEach(function(s){io.observe(s)});
})();
