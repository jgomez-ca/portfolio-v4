// CUSTOMIZE: gallery items. Images point to your old sites; copy them into assets/img/ and change the paths later.
// Items with a "d" field (customer, challenge, tools, links) show a "Project details" toggle.
var BASE='https://jgomez-ca.github.io/portfolio-v2/assets/img/portfolio/';
var PRJ='https://jgomez-ca.github.io/portfolio-v3/assets/img/projects/';
var WORK=[
{t:'AC Room Finder',c:'Web',n:'Web development',i:PRJ+'acRoomFinder.png',d:{
  who:'Algonquin College wanted a tool that helps the college community find a room that suits their academic needs.',
  why:'Keep to the brand guidelines while adding PHP to make the site dynamic.',
  tools:'HTML, CSS, JavaScript, PHP, MySQL, WordPress, Illustrator, Photoshop',
  links:[['Search page','https://jgomez-ca.github.io/RoomFinder/'],['Result page','https://jgomez-ca.github.io/RoomFinder/result-page.html']]}},
{t:'The Universe Today',c:'Web',n:'Web development',i:PRJ+'universeToday.png',d:{
  who:'An esoteric store wanted to showcase cosmic events to promote its products.',
  why:'Use the NASA API to retrieve the picture of the day, its title, and a short description.',
  tools:'HTML, CSS, JavaScript, Canva, Illustrator'}},
{t:'Colffee Cup',c:'Web',n:'Web design',i:PRJ+'colffeeCup.png',d:{
  who:'A family business, established in 2000, wanted to expand to other cities and start producing tea for export.',
  why:'The idea started in December 2019 and stopped at the mockup stage when the pandemic began.',
  tools:'HTML, CSS, mockups',
  links:[['Website mockup','https://jgomez-ca.github.io/ColffeeCup/'],['Design ideas',PRJ+'colffeeCup2.jpg']]}},
{t:'Personal Blog',c:'Web',n:'Web design and WordPress',i:PRJ+'anaelvia8a.png',d:{
  who:'A local politician wanted to present her ideas and break convention by using pink as her main color.',
  why:'Design a defiant but serious image to launch her platform.',
  tools:'HTML, CSS, PHP, MySQL, WordPress, CorelDRAW',
  links:[['Current page','https://anaelvia8a.wordpress.com']]}},
{t:'Colfee Cup Design Brief',c:'Web',n:'UX concept',i:BASE+'portfolio-2.jpg'},
{t:'Urban Design: Renovation Plan',c:'Design',n:'Urban design',i:BASE+'portfolio-6.jpg'},
{t:'Water Body and Green Belt Restoration',c:'Design',n:'Urban design',i:BASE+'portfolio-8.jpg'},
{t:'Projects and Drafts',c:'Design',n:'Technical drawings',i:BASE+'portfolio-11.jpg'},
{t:'Gardenia Flower Shop',c:'Design',n:'Logo concept',i:BASE+'portfolio-4.jpg'},
{t:'Holy Mary Statue',c:'Photography',n:'Photography',i:BASE+'portfolio-5.jpg'},
{t:'Muisca Skull: Indigenous Display',c:'Photography',n:'Photography',i:BASE+'portfolio-7.jpg'},
{t:'Nature & City',c:'Photography',n:'Photography',i:BASE+'portfolio-9.jpg'},
{t:'Church',c:'Photography',n:'Photography',i:BASE+'portfolio-10.jpg'}
];
(function(){
  var root=document.documentElement,tb=document.getElementById('theme');
  tb.addEventListener('click',function(){
    var dark=root.dataset.theme==='dark'||(!root.dataset.theme&&matchMedia('(prefers-color-scheme: dark)').matches);
    root.dataset.theme=dark?'light':'dark';tb.setAttribute('aria-pressed',String(!dark));
  });
  var gal=document.getElementById('gal'),dlg=document.getElementById('lb'),big=document.getElementById('lbimg');
  function line(label,text){var p=document.createElement('p'),b=document.createElement('b');b.textContent=label+': ';p.appendChild(b);p.appendChild(document.createTextNode(text));return p}
  WORK.forEach(function(w){
    var fig=document.createElement('figure');fig.dataset.c=w.c;
    var b=document.createElement('button');b.type='button';b.className='thumb';b.setAttribute('aria-label','View larger: '+w.t);
    var img=document.createElement('img');img.src=w.i;img.alt=w.t+' ('+w.n+')';img.loading='lazy';
    b.appendChild(img);b.addEventListener('click',function(){big.src=img.src;big.alt=img.alt;dlg.showModal()});
    var cap=document.createElement('figcaption');
    var t=document.createElement('b');t.textContent=w.t;var n=document.createElement('span');n.textContent=w.n;
    cap.appendChild(t);cap.appendChild(n);
    if(w.d){
      var det=document.createElement('details'),sm=document.createElement('summary');sm.textContent='Project details';
      det.appendChild(sm);det.appendChild(line('Customer',w.d.who));det.appendChild(line('Challenge',w.d.why));det.appendChild(line('Tools',w.d.tools));
      if(w.d.links){var p=document.createElement('p');w.d.links.forEach(function(l){var a=document.createElement('a');a.href=l[1];a.textContent=l[0];p.appendChild(a)});det.appendChild(p)}
      cap.appendChild(det);
    }
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
