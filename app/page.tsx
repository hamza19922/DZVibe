"use client";

import {useState} from "react";
import {BookOpen, CalendarDays, ClipboardList, Users, BarChart3, FileText, Search, Plus, CheckCircle2, Clock3} from "lucide-react";

const items=[
  {id:"home",label:"الرئيسية",icon:BarChart3},
  {id:"lessons",label:"الدروس",icon:BookOpen},
  {id:"classes",label:"الأقسام والتلاميذ",icon:Users},
  {id:"planning",label:"التخطيط",icon:CalendarDays},
  {id:"assessment",label:"التقييم",icon:ClipboardList},
  {id:"resources",label:"الموارد",icon:FileText},
];

export default function Home(){
 const [active,setActive]=useState("home");
 const [search,setSearch]=useState("");
 const title=items.find(x=>x.id===active)?.label||"الرئيسية";
 return <main className="shell">
   <aside className="sidebar">
    <div className="brand"><div className="logo">د</div><div><b>أستاذة العلوم</b><span>دلالجة</span></div></div>
    <nav>{items.map(({id,label,icon:Icon})=><button className={active===id?"nav active":"nav"} onClick={()=>setActive(id)} key={id}><Icon size={20}/><span>{label}</span></button>)}</nav>
    <div className="teacherCard"><div className="avatar">د</div><div><b>أستاذة العلوم الطبيعية</b><small>الطور المتوسط • 2 و 4 متوسط</small></div></div>
   </aside>
   <section className="content">
    <header><div><p className="eyebrow">لوحة الأستاذة</p><h1>{title}</h1><p className="muted">نظّمي دروسك، أقسامك وتقييماتك في مكان واحد.</p></div>
      <div className="headerActions"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="بحث سريع..." /></div><button className="primary"><Plus size={18}/> إضافة جديد</button></div>
    </header>
    {active==="home" ? <Dashboard/> : <Section id={active} search={search}/>}
    <footer>HAMZA BOUGUERRA <span>•</span> أستاذة العلوم الطبيعية دلالجة</footer>
   </section>
 </main>
}

function Dashboard(){
 const stats=[["الأقسام","4","مجموع الأقسام"],["التلاميذ","126","مسجلون"],["الدروس","24","هذا الفصل"],["التقييمات","8","قيد المتابعة"]];
 return <><div className="hero"><div><span className="pill">2026 / 2027</span><h2>أهلاً أستاذة دلالجة 👋</h2><p>كل أدواتك اليومية للعلوم الطبيعية في لوحة واحدة بسيطة.</p></div><div className="heroIcon">🔬</div></div>
 <div className="stats">{stats.map(s=><div className="stat" key={s[0]}><span>{s[0]}</span><strong>{s[1]}</strong><small>{s[2]}</small></div>)}</div>
 <div className="grid">
  <div className="panel"><div className="panelHead"><h3>برنامج اليوم</h3><span>الأحد</span></div>
   <div className="schedule"><div className="time">08:00</div><div><b>علوم الطبيعة والحياة</b><p>2 متوسط • النشاطات العلمية</p></div><CheckCircle2 className="ok"/></div>
   <div className="schedule"><div className="time">10:00</div><div><b>علوم الطبيعة والحياة</b><p>4 متوسط • مراجعة وتطبيقات</p></div><Clock3 className="clock"/></div>
  </div>
  <div className="panel"><div className="panelHead"><h3>اختصارات</h3></div><div className="shortcuts">
   {["إضافة درس","تسجيل حضور","إدخال علامة","إنشاء تخطيط"].map(x=><button key={x}><Plus size={17}/>{x}</button>)}
  </div></div>
 </div></>
}

function Section({id,search}:{id:string,search:string}){
 const data:{[key:string]:[string,string][]}={
 lessons:[["التنفس عند الإنسان","4 متوسط"],["التحولات الغذائية","4 متوسط"],["الوسط الحي","2 متوسط"],["التكاثر عند النباتات","2 متوسط"]],
 classes:[["2 متوسط • 1","32 تلميذا"],["2 متوسط • 2","31 تلميذا"],["4 متوسط • 1","31 تلميذا"],["4 متوسط • 2","32 تلميذا"]],
 planning:[["الأسبوع 1","التنفس والتبادلات الغازية"],["الأسبوع 2","التحولات الغذائية"],["الأسبوع 3","المناعة"],["الأسبوع 4","المراجعة"]],
 assessment:[["فرض الفصل الأول","4 متوسط • جاهز"],["نشاط تقويمي","2 متوسط • مسودة"],["اختبار الفصل","4 متوسط • قريب"],["متابعة المكتسبات","2 متوسط • مستمر"]],
 resources:[["ملخصات الدروس","24 ملفاً"],["تمارين تطبيقية","18 ملفاً"],["وثائق وتجارب","12 ملفاً"],["نماذج فروض","9 ملفات"]]
 };
 const rows=data[id]||[];
 const filtered=rows.filter(r=>r.join(" ").includes(search));
 return <div className="panel large"><div className="panelHead"><div><h3>{titleMap[id]}</h3><p className="muted">إدارة منظمة وسريعة.</p></div><button className="primary"><Plus size={18}/> إضافة</button></div>
 <div className="rows">{filtered.map((r,i)=><div className="row" key={i}><div className="rowIcon">{i+1}</div><div><b>{r[0]}</b><p>{r[1]}</p></div><button className="ghost">فتح</button></div>)}</div></div>
}
const titleMap:{[key:string]:string}={lessons:"الدروس",classes:"الأقسام والتلاميذ",planning:"التخطيط الأسبوعي",assessment:"التقييم والمتابعة",resources:"الموارد التعليمية"};