const menuToggle=document.getElementById("menu-toggle");
const mobileMenu=document.getElementById("mobile-menu");

menuToggle?.addEventListener("click",()=>mobileMenu.classList.toggle("hidden"));

const roles=["Full-Stack Engineer","Cloud Architect","Cybersecurity Specialist"];
let i=0,j=0,del=false;
const el=document.getElementById("typing-role");

function type(){
  const w=roles[i];
  el.textContent=del?w.slice(0,j--):w.slice(0,j++);

  let speed=del?50:90;

  if(!del&&j===w.length){del=true;speed=1200}
  if(del&&j===0){del=false;i=(i+1)%roles.length}

  setTimeout(type,speed);
}
type();

window.addEventListener("pointermove",e=>{
  document.getElementById("spotlight").style.setProperty("--x",e.clientX+"px");
  document.getElementById("spotlight").style.setProperty("--y",e.clientY+"px");
});

const obs=new IntersectionObserver(e=>{
  e.forEach(x=>x.isIntersecting&&x.target.classList.add("show"));
},{threshold:.15});

document.querySelectorAll(".reveal").forEach(e=>obs.observe(e));