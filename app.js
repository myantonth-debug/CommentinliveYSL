const $ = id => document.getElementById(id);
const PHOTOS = ["01","02","03","04","05","06"].map(n => `images/${n}.jpg`);
const CATS = ["ทั้งหมด", ...Object.keys(COMMENTS)];
let cat = "ทั้งหมด", deck = [], last = "", pi = 0;

const pool = () => cat === "ทั้งหมด" ? Object.values(COMMENTS).flat() : COMMENTS[cat];
function shuffle(a){ a = [...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

function draw(){
  if(!deck.length){ deck = shuffle(pool()); if(deck[deck.length-1]===last && deck.length>1) deck.unshift(deck.pop()); }
  last = deck.pop();
  $("text").textContent = last;
  $("count").textContent = `เหลือในรอบนี้ ${deck.length} / ${pool().length}`;
  swapPhoto();
  if($("autocopy").checked) copy();
}
function swapPhoto(){
  const img = $("photo"); pi = (pi + 1) % PHOTOS.length;
  img.classList.add("fade");
  setTimeout(() => { img.src = PHOTOS[pi]; img.onload = () => img.classList.remove("fade"); }, 350);
}
async function copy(){
  if(!last) return;
  try{ await navigator.clipboard.writeText(last); }
  catch{ const t=document.createElement("textarea"); t.value=last; document.body.appendChild(t); t.select(); document.execCommand("copy"); t.remove(); }
  const b = $("copy"); b.textContent = "คัดลอกแล้ว"; setTimeout(() => b.textContent = "คัดลอก", 1200);
}
CATS.forEach(c => {
  const b = document.createElement("button");
  b.type = "button"; b.textContent = c; b.setAttribute("aria-pressed", c===cat);
  b.onclick = () => { cat = c; deck = []; [...$("tabs").children].forEach(x => x.setAttribute("aria-pressed", x===b)); draw(); };
  $("tabs").appendChild(b);
});
$("next").onclick = draw; $("copy").onclick = copy;
document.addEventListener("keydown", e => {
  if((e.key===" "||e.key==="Enter") && !["BUTTON","INPUT"].includes(document.activeElement.tagName)){ e.preventDefault(); draw(); }
});
$("count").textContent = `${pool().length} คอมเมนต์`;
