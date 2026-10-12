(()=>{
const $=s=>document.querySelector(s),store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}}};

// 테마 토글
$('#theme').onclick=()=>{const d=document.documentElement,n=d.dataset.theme==='dark'?'light':'dark';d.dataset.theme=n;store.set('kmu-theme',n)};

// 스크롤 진행 바 + 등장 효과
const bar=$('#bar');
addEventListener('scroll',()=>{bar.style.width=scrollY/(document.body.scrollHeight-innerHeight)*100+'%'},{passive:true});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

// 타이핑 효과
const words=['집에서도','도서관에서도','카페에서도','공강 시간에도','어디서든'],tp=$('#type');
let wi=0,ci=0,del=false;
(function tick(){
 const w=words[wi];ci+=del?-1:1;tp.textContent=w.slice(0,ci);
 let ms=del?60:120;
 if(!del&&ci===w.length){del=true;ms=1400}
 else if(del&&ci===0){del=false;wi=(wi+1)%words.length;ms=300}
 setTimeout(tick,ms);
})();

// 티커
const kw=['동영상 학습','진도 관리','출석 관리','과제 제출','게시판','위키','퀴즈','메시지','강좌별 일정','과거강좌 조회'];
$('#tk').innerHTML=[...kw,...kw].map(k=>`<span>${k}</span>`).join('');

// 기능 탭
const T=[
 {n:'🎬 수강',t:'영상으로 배우고, 진도는 자동으로',d:'온라인 동영상 강의를 듣고 학습 진도를 확인해요. 다양한 문서를 볼 수 있는 뷰어도 제공됩니다.',r:[['📹','1주차 강의 영상',72],['📄','강의자료 뷰어','열기'],['🎥','실시간 화상강의','입장']]},
 {n:'💬 활동',t:'토론하고, 제출하고, 함께 정리하고',d:'게시판, 과제, 위키 같은 학습활동으로 수업에 참여해요.',r:[['💬','토론 게시판','새 글'],['📝','과제 제출','제출'],['📚','위키 정리','편집']]},
 {n:'📊 관리',t:'출석과 일정, 한 번에 챙기기',d:'출석을 관리하고 학사·강좌별 일정을 확인해요. 메시지 기능으로 소통도 가능합니다.',r:[['✅','출석 현황','확인'],['🗓️','강좌별 일정','보기'],['✉️','메시지','열기']]}
];
const tabs=$('#tabs');
T.forEach((x,i)=>{const b=document.createElement('button');b.textContent=x.n;b.role='tab';b.onclick=()=>show(i);tabs.append(b)});
function show(i){
 [...tabs.children].forEach((b,j)=>b.classList.toggle('on',i===j));
 const x=T[i];$('#pt').textContent=x.t;$('#pd').textContent=x.d;
 const m=$('#pm');m.innerHTML=x.r.map(r=>`<div class="row"><em>${r[0]}</em><span>${r[1]}</span>${typeof r[2]==='number'?`<div class="prog"><b style="width:${r[2]}%"></b></div>`:`<span class="chip" style="flex:none">${r[2]}</span>`}</div>`).join('');
 m.style.animation='none';m.offsetWidth;m.style.animation='';
}
show(0);
let auto=setInterval(()=>show((T.findIndex((_,i)=>tabs.children[i].classList.contains('on'))+1)%T.length),5000);
tabs.addEventListener('click',()=>clearInterval(auto));

// 카드 마우스 글로우
document.querySelectorAll('.card').forEach(c=>c.addEventListener('pointermove',e=>{const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')}));

// 체크리스트
const items=['ON국민 포털에서 통합ID 등록하기','eCampus에 로그인해 보기','이번 학기 수강 강좌 확인하기','이용안내 > 학생 매뉴얼 읽어보기','모바일 앱 설치하기','강좌별 일정 확인하기'];
let saved;try{saved=JSON.parse(store.get('kmu-check'))}catch(e){}
saved=Array.isArray(saved)?saved:[];
const list=$('#list'),ring=$('#ring');
items.forEach((s,i)=>{const li=document.createElement('li');li.innerHTML=`<label><input type="checkbox" ${saved.includes(i)?'checked':''}><span>${s}</span></label>`;li.querySelector('input').onchange=upd;list.append(li)});
function upd(first){
 const ch=[...list.querySelectorAll('input')],n=ch.filter(c=>c.checked).length,p=Math.round(n/items.length*100);
 $('#pct').textContent=p+'%';ring.style.strokeDashoffset=471*(1-p/100);
 $('#msg').textContent=p===100?'🎉 준비 완료! 이제 수업 들으러 가요':p>=50?'절반 넘었어요, 조금만 더!':p>0?'좋은 시작이에요 👍':'';
 store.set('kmu-check',JSON.stringify(ch.map((c,i)=>c.checked?i:-1).filter(i=>i>=0)));
 if(p===100&&first!==true)boom();
}
upd(true);

// 컨페티
function boom(){
 const cv=$('#fx'),x=cv.getContext('2d');cv.width=innerWidth;cv.height=innerHeight;
 const cols=['#4f46e5','#06b6d4','#ec4899','#f59e0b','#22c55e'];
 const ps=Array.from({length:120},()=>({x:innerWidth/2,y:innerHeight/2,vx:(Math.random()-.5)*16,vy:Math.random()*-14-2,s:4+Math.random()*6,c:cols[Math.random()*5|0],r:Math.random()*6}));
 let f=0;(function a(){x.clearRect(0,0,cv.width,cv.height);ps.forEach(p=>{p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.r+=.2;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/2,p.s,p.s*.6);x.restore()});if(++f<110)requestAnimationFrame(a);else x.clearRect(0,0,cv.width,cv.height)})();
}
})();
