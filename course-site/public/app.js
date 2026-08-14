const app = document.querySelector("#app");
const state = JSON.parse(localStorage.getItem("oc-learning") || '{"completed":{},"reviews":[],"surveys":[],"grades":[]}');
const save = () => localStorage.setItem("oc-learning", JSON.stringify(state));
const esc = (s="") => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

function inline(s) {
  return esc(s).replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>").replace(/\*([^*]+)\*/g,"<em>$1</em>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noreferrer">$1</a>');
}
function markdown(md) {
  const lines=md.replace(/\r/g,"").split("\n"); let out="", list=false, code=false, lang="";
  const close=()=>{if(list){out+="</ul>";list=false}};
  for(const line of lines){
    if(line.startsWith("```")){close();if(!code){lang=line.slice(3);out+=`<pre><code class="language-${esc(lang)}">`;code=true}else{out+="</code></pre>";code=false}continue}
    if(code){out+=esc(line)+"\n";continue}
    const h=line.match(/^(#{1,6})\s+(.+)/); if(h){close();const n=Math.min(h[1].length+1,6);out+=`<h${n}>${inline(h[2])}</h${n}>`;continue}
    const li=line.match(/^\s*[-*+]\s+(.+)/); if(li){if(!list){out+="<ul>";list=true}out+=`<li>${inline(li[1])}</li>`;continue} close();
    if(/^---+$/.test(line.trim())){out+="<hr>";continue} if(line.startsWith("> ")){out+=`<blockquote>${inline(line.slice(2))}</blockquote>`;continue}
    if(line.trim())out+=`<p>${inline(line)}</p>`;
  } close(); return out;
}
const key=(c,l)=>`${c}:${l}`;
let data;
try{data=await fetch("courses.json").then(r=>{if(!r.ok)throw Error(r.status);return r.json()})}catch(e){app.innerHTML='<div class="empty"><h2>Chưa có dữ liệu khóa học</h2><p>Chạy <code>npm run build</code> trong thư mục <code>course-site</code>.</p></div>';throw e}

function home(){
  const total=data.courses.reduce((n,c)=>n+c.lessons.length,0);
  app.innerHTML=`<section class="hero"><img class="hero-scene" src="hero-scene.svg" alt="" aria-hidden="true"><div class="hero-content"><div class="eyebrow"><span></span> Hardware learning ecosystem</div><h1>Ideas become<br><em>real systems.</em></h1><p class="hero-copy">Học thiết kế chip, IoT và robotics qua những hành trình thực hành—từ dòng code đầu tiên đến một hệ thống hoạt động thật.</p></div><a class="hero-enroll" href="#catalog"><span>Khám phá lộ trình</span><b>↗</b></a><div class="hero-note"><small>Học liệu mở</small><strong>10 tuần</strong><span>Lý thuyết · Lab · Capstone</span></div><div class="hero-doc"><b>↗</b><span>70 bài học<br><small>Đọc trực tiếp trên web</small></span></div></section><section class="metrics"><div><strong>${String(data.courses.length).padStart(2,'0')}</strong><span>Lộ trình chuyên sâu</span></div><div><strong>${total}+</strong><span>Bài học thực hành</span></div><div><strong>03</strong><span>Hình thức đánh giá</span></div><div><strong>&lt;2m</strong><span>Bắt đầu một bài học</span></div></section><section class="catalog-head" id="catalog"><div><span class="eyebrow">Learning architecture</span><h2>Được thiết kế cho<br>người thích chế tạo.</h2></div><p>Mỗi lộ trình kết hợp kiến thức nền, thử nghiệm có hướng dẫn, phản hồi đồng đẳng và đánh giá của giáo viên.</p></section><div class="filters"><span>Khám phá ${data.courses.length} khóa học</span><input id="search" class="search" aria-label="Tìm khóa học" placeholder="Tìm khóa học…"></div><section id="courses" class="course-grid">${cards(data.courses)}</section><section class="closing"><div><span class="eyebrow">Build what matters</span><h2>Make code<br>move matter.</h2><p>Tham gia không gian học tập để gửi khảo sát, phản biện bài làm và nhận điểm từ giáo viên.</p></div><a class="btn alt" href="#/workspace">Mở không gian học tập <b>↗</b></a></section>`;
  document.querySelector("#search").oninput=e=>document.querySelector("#courses").innerHTML=cards(data.courses.filter(c=>(c.title+c.summary).toLowerCase().includes(e.target.value.toLowerCase())));
}
function cards(items){return items.map((c,i)=>{const done=c.lessons.filter(l=>state.completed[key(c.id,l.id)]).length;return `<article class="card"><div class="card-top"><span class="pill">${done}/${c.lessons.length} bài hoàn thành</span><span class="card-no">${String(i+1).padStart(2,'0')}</span></div><div class="card-mark" aria-hidden="true"><i></i><i></i><b>${c.title.includes('Chip')?'IC':c.title.includes('Drone')?'UAV':c.title.includes('Car')?'AV':'IO'}</b></div><h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p><a class="btn" href="#/course/${encodeURIComponent(c.id)}/lesson/${c.lessons[0]?.id||1}">Mở lộ trình <span>↗</span></a></article>`}).join("")||'<div class="empty">Không tìm thấy khóa học phù hợp.</div>'}
function courseView(c,l){
  const done=!!state.completed[key(c.id,l.id)];
  app.innerHTML=`<section class="course-head"><div class="breadcrumbs"><a href="#/">Khóa học</a> / ${esc(c.title)}</div><h1>${esc(c.title)}</h1><p>${c.lessons.filter(x=>state.completed[key(c.id,x.id)]).length}/${c.lessons.length} bài đã hoàn thành</p></section><div class="layout"><aside class="sidebar"><div class="eyebrow">Lộ trình học</div>${c.lessons.map(x=>`<a class="lesson-link ${x.id===l.id?'active':''}" href="#/course/${encodeURIComponent(c.id)}/lesson/${x.id}">${state.completed[key(c.id,x.id)]?'✓ ':''}Tuần ${Number(x.id)} · ${esc(x.title.replace(/^Tuần\s*\d+\s*:\s*/i,""))}</a>`).join("")}</aside><div><article class="lesson">${markdown(l.markdown)}</article><div class="actions"><button id="complete" class="btn ${done?'alt':''}">${done?'✓ Đã hoàn thành':'Đánh dấu hoàn thành'}</button><a class="btn alt" href="#/workspace?course=${encodeURIComponent(c.id)}">Gửi phản hồi & đánh giá</a></div></div></div>`;
  document.querySelector("#complete").onclick=()=>{state.completed[key(c.id,l.id)]=!done;save();courseView(c,l)};
}
const fields=(prefix)=>`<label>Tiêu chí kỹ thuật (0–10)<input name="technical" type="number" min="0" max="10" required></label><label>Quy trình & an toàn (0–10)<input name="safety" type="number" min="0" max="10" required></label><label>Trình bày & tài liệu (0–10)<input name="communication" type="number" min="0" max="10" required></label><label>Nhận xét<textarea name="comment" rows="4" placeholder="Điểm mạnh và một đề xuất cải thiện…" required></textarea></label><button class="btn" type="submit">Lưu ${prefix}</button>`;
function workspace(){
  const query=new URLSearchParams(location.hash.split("?")[1]); const selected=query.get("course")||data.courses[0]?.id;
  app.innerHTML=`<div class="eyebrow">Không gian học tập</div><h1>Phản hồi giúp tiến bộ.</h1><div class="panel"><label>Khóa học<select id="courseSelect">${data.courses.map(c=>`<option value="${esc(c.id)}" ${c.id===selected?'selected':''}>${esc(c.title)}</option>`).join("")}</select></label></div><div class="tabs"><button class="tab active" data-tab="survey">Khảo sát học viên</button><button class="tab" data-tab="peer">Đánh giá đồng đẳng</button><button class="tab" data-tab="teacher">Chấm điểm giáo viên</button><button class="tab" data-tab="records">Kết quả đã lưu</button></div><section id="tabbody"></section>`;
  const render=(name)=>{document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===name));const body=document.querySelector("#tabbody");
    if(name==="survey")body.innerHTML=`<form class="panel" data-kind="surveys"><h2>Khảo sát nhanh</h2><label>Mức độ hài lòng (1–5)<input name="rating" type="range" min="1" max="5" value="4"></label><label>Nội dung hữu ích nhất<textarea name="useful" rows="3" required></textarea></label><label>Điều nên cải thiện<textarea name="improve" rows="3" required></textarea></label><button class="btn" type="submit">Gửi khảo sát</button></form>`;
    if(name==="peer")body.innerHTML=`<form class="panel" data-kind="reviews"><h2>Đánh giá đồng đẳng</h2><label>Tên/mã bài của bạn học<input name="subject" required></label>${fields("đánh giá")}</form>`;
    if(name==="teacher")body.innerHTML=`<form class="panel" data-kind="grades"><h2>Chấm điểm giáo viên</h2><label>Tên/mã học viên<input name="subject" required></label>${fields("điểm")}</form>`;
    if(name==="records"){const rows=[...state.surveys.map(x=>({...x,type:"Khảo sát"})),...state.reviews.map(x=>({...x,type:"Đồng đẳng"})),...state.grades.map(x=>({...x,type:"Giáo viên"}))];body.innerHTML=`<div class="panel"><h2>Kết quả trên thiết bị</h2>${rows.length?rows.map(x=>`<div class="notice"><strong>${x.type}</strong> · ${new Date(x.createdAt).toLocaleString("vi-VN")}<br>${esc(x.subject||x.useful||"")}${x.score!=null?` · <b>${x.score}/10</b>`:""}</div>`).join(""):"<p>Chưa có dữ liệu.</p>"}<button id="export" class="btn alt">Xuất JSON</button></div>`;document.querySelector("#export").onclick=exportData}
    body.querySelector("form")?.addEventListener("submit",submitForm);
  }; document.querySelectorAll(".tab").forEach(x=>x.onclick=()=>render(x.dataset.tab));render("survey");
}
function submitForm(e){e.preventDefault();const form=e.currentTarget, values=Object.fromEntries(new FormData(form));const numeric=["technical","safety","communication"].filter(k=>values[k]!==undefined).map(k=>Number(values[k]));state[form.dataset.kind].push({...values,courseId:document.querySelector("#courseSelect").value,score:numeric.length?Math.round(numeric.reduce((a,b)=>a+b)/numeric.length*10)/10:undefined,createdAt:new Date().toISOString()});save();form.reset();form.insertAdjacentHTML("afterbegin",'<div class="notice">Đã lưu thành công trên thiết bị này.</div>')}
function exportData(){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.download=`opencircuit-results-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href)}
function route(){const parts=location.hash.slice(2).split(/[/?]/);if(parts[0]==="course"){const c=data.courses.find(x=>x.id===decodeURIComponent(parts[1]||""));const l=c?.lessons.find(x=>x.id===parts[3])||c?.lessons[0];return c&&l?courseView(c,l):home()}if(parts[0]==="workspace")return workspace();home()}
addEventListener("hashchange",route);route();
