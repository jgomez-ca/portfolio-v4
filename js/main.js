// CUSTOMIZE: gallery items. Images point to your v2 site; copy them into assets/img/portfolio/ and change the base path later.
var BASE='https://jgomez-ca.github.io/portfolio-v2/assets/img/portfolio/';
var WORK=[
{t:'Colffee Cup',c:'Web',n:'Coffee shop website',f:'portfolio-3.jpg',u:'https://jgomez-ca.github.io/ColffeeCup/'},
{t:'AC Room Finder',c:'Web',n:'Room lookup app',f:'portfolio-1.jpg',u:'https://jgomez-ca.github.io/RoomFinder/'},
{t:'Colfee Cup Design Brief',c:'Web',n:'UX concept',f:'portfolio-2.jpg'},
{t:'Urban Design: Renovation Plan',c:'Design',n:'Urban design',f:'portfolio-6.jpg'},
{t:'Water Body and Green Belt Restoration',c:'Design',n:'Urban design',f:'portfolio-8.jpg'},
{t:'Projects and Drafts',c:'Design',n:'Technical drawings',f:'portfolio-11.jpg'},
{t:'Gardenia Flower Shop',c:'Design',n:'Logo concept',f:'portfolio-4.jpg'},
{t:'Holy Mary Statue',c:'Photography',n:'Photography',f:'portfolio-5.jpg'},
{t:'Muisca Skull: Indigenous Display',c:'Photography',n:'Photography',f:'portfolio-7.jpg'},
{t:'Nature & City',c:'Photography',n:'Photography',f:'portfolio-9.jpg'},
{t:'Church',c:'Photography',n:'Photography',f:'portfolio-10.jpg'}
];
(function(){
  var root=document.documentElement,tb=document.getElementById('theme');
  tb.addEventListener('click',function(){
    var dark=root.dataset.theme==='dark'||(!root.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme=dark?'light':'dark';tb.setAttribute('aria-pressed',String(!dark));
  });
  var gal=document.getElementById('gal'),dlg=document.getElementById('lb'),big=document.getElementById('lbimg');
  WORK.forEach(function(w){
    var fig=document.createElement('figure');fig.dataset.c=w.c;
    var b=document.createElement('button');b.type='button';b.className='thumb';b.setAttribute('aria-label','View larger: '+w.t);
    var img=document.createElement('img');img.src=BASE+w.f;img.alt=w.t+' ('+w.n+')';img.loading='lazy';
    b.appendChild(img);b.addEventListener('click',function(){big.src=img.src;big.alt=img.alt;dlg.showModal()});
    var cap=document.createElement('figcaption');
    cap.innerHTML='<b></b><span></span>';cap.firstChild.textContent=w.t;cap.lastChild.textContent=w.n;
    if(w.u){var a=document.createElement('a');a.href=w.u;a.textContent=' Visit site';cap.lastChild.appendChild(a)}
    fig.appendChild(b);fig.appendChild(cap);gal.appendChild(fig);
  });
  document.querySelectorAll('.filters button').forEach(function(btn){
    btn.addEventListener('click',function(){
      document.querySelectorAll('.filters button').forEach(function(x){x.setAttribute('aria-pressed',String(x===btn))});
      gal.querySelectorAll('figure').forEach(function(f){f.hidden=btn.dataset.f!=='All'&&f.dataset.c!==btn.dataset.f});
    });
  });
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  var links=[].slice.call(document.querySelectorAll('nav a[href^="#"]'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)links.forEach(function(a){a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('main section[id]').forEach(function(s){io.observe(s)});
  }
  document.getElementById('yr').textContent=new Date().getFullYear();
})();
