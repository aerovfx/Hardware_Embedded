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
  app.innerHTML=`<section class="hero"><div class="signal-art" aria-hidden="true"><i></i><i></i><i></i><i></i><div class="chip">RP<br>2040</div></div><div class="hero-content"><div class="eyebrow"><span></span> Học bằng cách tự tay chế tạo</div><h1>Build systems.<br><em>Shape the future.</em></h1><p class="hero-copy">Từ transistor đầu tiên đến robot tự hành—một hệ sinh thái học tập mở cho thế hệ kỹ sư phần cứng tiếp theo.</p><a class="btn hero-btn" href="#catalog">Khám phá khóa học <b>↗</b></a></div><div class="hero-note"><b>01—10</b><span>Mỗi khóa học là một hành trình thực hành 10 tuần.</span></div></section><section class="metrics"><div><strong>${data.courses.length}</strong><span>Lộ trình chuyên sâu</span></div><div><strong>${total}</strong><span>Bài học thực hành</span></div><div><strong>03</strong><span>Hình thức đánh giá</span></div><div><strong>100%</strong><span>Học liệu mở</span></div></section><section class="catalog-head" id="catalog"><div><span class="eyebrow">Hệ sinh thái học tập</span><h2>Kiến thức để tạo ra<br>thế giới hữu hình.</h2></div><p>Chọn một lộ trình, hoàn thành các thử thách và nhận phản hồi từ bạn học lẫn giáo viên.</p></section><div class="filters"><input id="search" class="search" aria-label="Tìm khóa học" placeholder="Tìm trong ${data.courses.length} lộ trình…"></div><section id="courses" class="course-grid">${cards(data.courses)}</section><section class="closing"><div><span class="eyebrow">Bắt đầu hành trình</span><h2>Từ code đến<br>chuyển động thật.</h2></div><a class="btn alt" href="#/workspace">Mở không gian học tập ↗</a></section>`;
  document.querySelector("#search").oninput=e=>document.querySelector("#courses").innerHTML=cards(data.courses.filter(c=>(c.title+c.summary).toLowerCase().includes(e.target.value.toLowerCase())));
}
function cards(items){return items.map(c=>{const done=c.lessons.filter(l=>state.completed[key(c.id,l.id)]).length;return `<article class="card"><span class="pill">${done}/${c.lessons.length} bài hoàn thành</span><h3>${esc(c.title)}</h3><p>${esc(c.summary)}</p><a class="btn" href="#/course/${encodeURIComponent(c.id)}/lesson/${c.lessons[0]?.id||1}">Vào khóa học →</a></article>`}).join("")||'<div class="empty">Không tìm thấy khóa học phù hợp.</div>'}
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
