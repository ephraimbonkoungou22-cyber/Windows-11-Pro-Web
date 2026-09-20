const OWNER = "Yoann Bonkoungou";
const CREATOR = "Yoann Bonkoungou";
const TELECEL = "+226 69 08 58 84";
const VERSION = "24H2 Build 26100 · Win11 Pro Web · Gratuit";
const NEXT_VERSION = "1.0.1";
let zTop=100, windows={}, startOpen=false, widgetsOpen=false;
let subscribed=true; /* version gratuite — toujours débloqué */
let trialStart=parseInt(localStorage.getItem('w11_trial')||'0',10);
let wpMode=parseInt(localStorage.getItem('w11_wp')||'0',10);
/* Version gratuite — toutes les apps débloquées */
const VERSION_LOCKED = false;
const LOCKED_APPS = []; /* aucune app verrouillée */

/* Notifications */
let notifSettings=Object.assign({enabled:true,sound:true,system:true,updates:true,apps:true,games:true,dnd:false},(function(){try{return JSON.parse(localStorage.getItem('w11_notif')||'{}');}catch(e){return{};}})());
let notifList=[];
let notifOpen=false;
function pushNotif(title,body,cat){
  cat=cat||'system';
  if(!notifSettings.enabled||notifSettings.dnd)return;
  if(cat==='system'&&!notifSettings.system)return;
  if(cat==='updates'&&!notifSettings.updates)return;
  if(cat==='apps'&&!notifSettings.apps)return;
  if(cat==='games'&&!notifSettings.games)return;
  notifList.unshift({title:title,body:body,cat:cat,time:new Date(),read:false});
  if(notifList.length>30)notifList=notifList.slice(0,30);
  renderNotifs();
  toast('🔔 '+title);
  if(notifSettings.sound){try{var a=new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdH2Onp6em5qYlpSSkI+OjIqJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIR');a.volume=0.15;a.play().catch(function(){});}catch(e){}}
}
function renderNotifs(){
  var list=document.getElementById('notifList');
  var badge=document.getElementById('notifBadge');
  if(!list)return;
  var unread=notifList.filter(function(n){return!n.read;}).length;
  if(badge){badge.textContent=unread>9?'9+':String(unread);badge.classList.toggle('show',unread>0);}
  if(!notifList.length){list.innerHTML='<div class="notif-empty">Aucune notification</div>';return;}
  list.innerHTML=notifList.map(function(n,i){
    var t=n.time.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'});
    return '<div class="notif-item '+(n.read?'':'unread')+'" data-ni="'+i+'"><div class="n-title">'+n.title+'</div><div>'+n.body+'</div><div class="n-time">'+t+'</div></div>';
  }).join('');
  list.querySelectorAll('.notif-item').forEach(function(el){
    el.onclick=function(){var i=+el.dataset.ni;if(notifList[i])notifList[i].read=true;renderNotifs();};
  });
}
function toggleNotifCenter(){
  notifOpen=!notifOpen;
  document.getElementById('notifCenter').classList.toggle('open',notifOpen);
  if(notifOpen){notifList.forEach(function(n){n.read=true;});renderNotifs();}
}

const LANGS = {
  fr: {
    name:'Français', start:'Rechercher...', pinned:'Épinglé', settings:'Paramètres',
    about:'À propos', system:'Système', perso:'Personnalisation', time:'Heure et langue',
    sub:'Abonnement', wallpaper:'Fond d\'écran', lang:'Langue',
    home:'Accueil', insert:'Insertion', design:'Création', layout:'Mise en page', refs:'Références', view:'Affichage',
    formulas:'Formules', data:'Données', transitions:'Transitions', slideshow:'Diaporama',
    newFolder:'+ Dossier', newFile:'+ Fichier', copy:'Copier', paste:'Coller', rename:'Renommer', del:'Supprimer', open:'Ouvrir',
    save:'Enregistrer', bold:'Gras', italic:'Italique', underline:'Souligné',
    creator:'Créateur', version:'Version', owner:'Propriétaire'
  },
  en: {
    name:'English', start:'Search...', pinned:'Pinned', settings:'Settings',
    about:'About', system:'System', perso:'Personalization', time:'Time & language',
    sub:'Subscription', wallpaper:'Wallpaper', lang:'Language',
    home:'Home', insert:'Insert', design:'Design', layout:'Layout', refs:'References', view:'View',
    formulas:'Formulas', data:'Data', transitions:'Transitions', slideshow:'Slide Show',
    newFolder:'+ Folder', newFile:'+ File', copy:'Copy', paste:'Paste', rename:'Rename', del:'Delete', open:'Open',
    save:'Save', bold:'Bold', italic:'Italic', underline:'Underline',
    creator:'Creator', version:'Version', owner:'Owner'
  },
  de: {
    name:'Deutsch', start:'Suchen...', pinned:'Angeheftet', settings:'Einstellungen',
    about:'Info', system:'System', perso:'Personalisierung', time:'Zeit und Sprache',
    sub:'Abonnement', wallpaper:'Hintergrund', lang:'Sprache',
    home:'Start', insert:'Einfügen', design:'Entwurf', layout:'Layout', refs:'Referenzen', view:'Ansicht',
    formulas:'Formeln', data:'Daten', transitions:'Übergänge', slideshow:'Bildschirmpräsentation',
    newFolder:'+ Ordner', newFile:'+ Datei', copy:'Kopieren', paste:'Einfügen', rename:'Umbenennen', del:'Löschen', open:'Öffnen',
    save:'Speichern', bold:'Fett', italic:'Kursiv', underline:'Unterstrichen',
    creator:'Ersteller', version:'Version', owner:'Besitzer'
  },
  es: {
    name:'Español', start:'Buscar...', pinned:'Anclado', settings:'Configuración',
    about:'Acerca de', system:'Sistema', perso:'Personalización', time:'Hora e idioma',
    sub:'Suscripción', wallpaper:'Fondo', lang:'Idioma',
    home:'Inicio', insert:'Insertar', design:'Diseño', layout:'Disposición', refs:'Referencias', view:'Vista',
    formulas:'Fórmulas', data:'Datos', transitions:'Transiciones', slideshow:'Presentación',
    newFolder:'+ Carpeta', newFile:'+ Archivo', copy:'Copiar', paste:'Pegar', rename:'Renombrar', del:'Eliminar', open:'Abrir',
    save:'Guardar', bold:'Negrita', italic:'Cursiva', underline:'Subrayado',
    creator:'Creador', version:'Versión', owner:'Propietario'
  },
  ru: {
    name:'Русский', start:'Поиск...', pinned:'Закреплено', settings:'Параметры',
    about:'О системе', system:'Система', perso:'Персонализация', time:'Время и язык',
    sub:'Подписка', wallpaper:'Фон', lang:'Язык',
    home:'Главная', insert:'Вставка', design:'Конструктор', layout:'Макет', refs:'Ссылки', view:'Вид',
    formulas:'Формулы', data:'Данные', transitions:'Переходы', slideshow:'Показ слайдов',
    newFolder:'+ Папка', newFile:'+ Файл', copy:'Копировать', paste:'Вставить', rename:'Переименовать', del:'Удалить', open:'Открыть',
    save:'Сохранить', bold:'Жирный', italic:'Курсив', underline:'Подчёркнутый',
    creator:'Создатель', version:'Версия', owner:'Владелец'
  },
  pt: {
    name:'Português', start:'Pesquisar...', pinned:'Afixado', settings:'Definições',
    about:'Acerca de', system:'Sistema', perso:'Personalização', time:'Hora e idioma',
    sub:'Subscrição', wallpaper:'Fundo', lang:'Idioma',
    home:'Base', insert:'Inserir', design:'Design', layout:'Esquema', refs:'Referências', view:'Ver',
    formulas:'Fórmulas', data:'Dados', transitions:'Transições', slideshow:'Apresentação',
    newFolder:'+ Pasta', newFile:'+ Ficheiro', copy:'Copiar', paste:'Colar', rename:'Mudar nome', del:'Eliminar', open:'Abrir',
    save:'Guardar', bold:'Negrito', italic:'Itálico', underline:'Sublinhado',
    creator:'Criador', version:'Versão', owner:'Proprietário'
  },
  it: {
    name:'Italiano', start:'Cerca...', pinned:'Agganciato', settings:'Impostazioni',
    about:'Informazioni', system:'Sistema', perso:'Personalizzazione', time:'Ora e lingua',
    sub:'Abbonamento', wallpaper:'Sfondo', lang:'Lingua',
    home:'Home', insert:'Inserisci', design:'Progettazione', layout:'Layout', refs:'Riferimenti', view:'Visualizza',
    formulas:'Formule', data:'Dati', transitions:'Transizioni', slideshow:'Presentazione',
    newFolder:'+ Cartella', newFile:'+ File', copy:'Copia', paste:'Incolla', rename:'Rinomina', del:'Elimina', open:'Apri',
    save:'Salva', bold:'Grassetto', italic:'Corsivo', underline:'Sottolineato',
    creator:'Creatore', version:'Versione', owner:'Proprietario'
  },
  ar: {
    name:'العربية', start:'بحث...', pinned:'مثبت', settings:'الإعدادات',
    about:'حول', system:'النظام', perso:'التخصيص', time:'الوقت واللغة',
    sub:'الاشتراك', wallpaper:'خلفية', lang:'اللغة',
    home:'الصفحة الرئيسية', insert:'إدراج', design:'تصميم', layout:'تخطيط', refs:'مراجع', view:'عرض',
    formulas:'صيغ', data:'بيانات', transitions:'انتقالات', slideshow:'عرض الشرائح',
    newFolder:'+ مجلد', newFile:'+ ملف', copy:'نسخ', paste:'لصق', rename:'إعادة تسمية', del:'حذف', open:'فتح',
    save:'حفظ', bold:'غامق', italic:'مائل', underline:'تسطير',
    creator:'المنشئ', version:'الإصدار', owner:'المالك'
  }
};
let curLang = localStorage.getItem('w11_lang') || 'fr';
function t(key){ return (LANGS[curLang] && LANGS[curLang][key]) || (LANGS.fr[key]) || key; }
function setLang(code){
  if(!LANGS[code]) return;
  curLang = code;
  localStorage.setItem('w11_lang', code);
  toast(t('lang')+': '+LANGS[code].name);
  try { renderStart(); } catch(e){}
}



/* Wallpaper vivid */
const cv=document.getElementById('wpCanvas'), ctx=cv.getContext('2d');
let W,H,T=0, parts=[];
function res(){W=cv.width=innerWidth||800;H=cv.height=innerHeight||600;parts=[];for(let i=0;i<100;i++)parts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.6,vy:(Math.random()-.5)*.6,r:Math.random()*2.5+.4,h:Math.random()*360,a:Math.random()*0.8+0.2});}
function drawWp(){
  try{
  if(!ctx||!W){requestAnimationFrame(drawWp);return;}
  T++;
  const m = (wpMode||0) % 18;
  if(m===0){ctx.fillStyle='#050510';ctx.fillRect(0,0,W,H);for(let i=0;i<6;i++){const g=ctx.createRadialGradient(W*(.2+.6*Math.sin(T*.004+i)),H*(.3+.4*Math.cos(T*.003+i*1.3)),0,W/2,H/2,Math.min(W,H)*.8);g.addColorStop(0,'hsla('+(160+i*50+T*.08)+',90%,55%,.22)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}}
  else if(m===1){ctx.fillStyle='#0a0515';ctx.fillRect(0,0,W,H);ctx.strokeStyle='rgba(0,255,200,.1)';for(let x=0;x<W;x+=36){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}for(let y=0;y<H;y+=36){ctx.beginPath();ctx.moveTo(0,y+Math.sin(T*.02+y*.01)*4);ctx.lineTo(W,y+Math.sin(T*.02+y*.01)*4);ctx.stroke();}const g=ctx.createRadialGradient(W/2,H*.7,0,W/2,H*.7,H*.5);g.addColorStop(0,'rgba(255,0,150,.18)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  else if(m===2){ctx.fillStyle='rgba(12,4,4,.3)';ctx.fillRect(0,0,W,H);for(const p of parts){p.y-=1+Math.random()*2;p.x+=(Math.random()-.5)*2;if(p.y<0){p.y=H;p.x=Math.random()*W;}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fillStyle='hsla('+(p.h%40)+',100%,60%,.55)';ctx.fill();}}
  else if(m===3){ctx.fillStyle='#021018';ctx.fillRect(0,0,W,H);for(let y=0;y<8;y++){ctx.beginPath();ctx.moveTo(0,H*.35+y*28);for(let x=0;x<=W;x+=6)ctx.lineTo(x,H*.35+y*28+Math.sin(x*.012+T*.025+y)*16*(1-y*.08));ctx.strokeStyle='hsla('+(190+y*10)+',80%,'+(45+y*4)+'%,'+(.22-y*.02)+')';ctx.lineWidth=2;ctx.stroke();}}
  else if(m===4){ctx.fillStyle='#03010a';ctx.fillRect(0,0,W,H);for(const p of parts){p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,6.28);ctx.fillStyle='hsla('+p.h+',80%,70%,.45)';ctx.fill();}const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.min(W,H)*.4);g.addColorStop(0,'rgba(120,40,255,.14)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  else if(m===5){const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a0a2e');g.addColorStop(.5,'#c23a5a');g.addColorStop(1,'#f5a623');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);ctx.beginPath();ctx.arc(W*.7,H*.32,42+Math.sin(T*.02)*6,0,6.28);ctx.fillStyle='rgba(255,220,100,.9)';ctx.fill();}
  else if(m===6){ctx.fillStyle='#001a12';ctx.fillRect(0,0,W,H);for(let i=0;i<5;i++){ctx.beginPath();for(let x=0;x<=W;x+=4){const y=H/2+Math.sin(x*.01+T*.03+i)*30*(i+1)*.3+Math.cos(x*.02+T*.02)*10;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.strokeStyle='hsla('+(140+i*20)+',90%,50%,'+(.25-i*.03)+')';ctx.lineWidth=2;ctx.stroke();}}
  else if(m===7){ctx.fillStyle='#0a0a0a';ctx.fillRect(0,0,W,H);for(let i=0;i<40;i++){const x=(T*2+i*50)%(W+40)-20;const y=H*.2+(i%7)*H*.1;ctx.fillStyle='rgba(255,255,255,'+(.05+Math.sin(T*.05+i)*.03)+')';ctx.fillRect(x,y,60,2);}}
  else if(m===8){ctx.fillStyle='#100818';ctx.fillRect(0,0,W,H);for(let i=0;i<8;i++){const ang=T*.01+i*Math.PI/4;const x=W/2+Math.cos(ang)*Math.min(W,H)*.25;const y=H/2+Math.sin(ang)*Math.min(W,H)*.2;const g=ctx.createRadialGradient(x,y,0,x,y,80);g.addColorStop(0,'hsla('+(i*45)+',90%,60%,.2)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}}
  else if(m===9){ctx.fillStyle='#061020';ctx.fillRect(0,0,W,H);for(const p of parts){p.x+=p.vx*.5;p.y+=p.vy*.5+Math.sin(T*.02+p.x)*.1;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.fillStyle='rgba(100,200,255,'+p.a*.4+')';ctx.fillRect(p.x,p.y,2,2);}}
  else if(m===10){const g=ctx.createLinearGradient(0,0,W,H);g.addColorStop(0,'#0f0c29');g.addColorStop(.5,'#302b63');g.addColorStop(1,'#24243e');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(let i=0;i<3;i++){ctx.beginPath();ctx.arc(W*(.3+i*.2),H*(.4+Math.sin(T*.01+i)*.1),30+i*10,0,6.28);ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=2;ctx.stroke();}}
  else if(m===11){ctx.fillStyle='#1a0000';ctx.fillRect(0,0,W,H);for(let i=0;i<15;i++){const x=W/2+Math.sin(T*.02+i)*.3*W;const y=(T*3+i*40)%(H+50)-25;ctx.fillStyle='hsla(0,100%,'+(40+i)+'%,'+.15+')';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+30);ctx.lineTo(x+8,y+30);ctx.fill();}}
  else if(m===12){ctx.fillStyle='#001a1a';ctx.fillRect(0,0,W,H);for(let i=0;i<20;i++){const r=20+i*15+Math.sin(T*.02+i)*5;ctx.beginPath();ctx.arc(W/2,H/2,r,0,6.28);ctx.strokeStyle='hsla(170,80%,50%,'+(.15-i*.005)+')';ctx.stroke();}}
  else if(m===13){ctx.fillStyle='#120a00';ctx.fillRect(0,0,W,H);for(const p of parts){p.y+=1;p.x+=Math.sin(p.y*.02)*.5;if(p.y>H){p.y=0;p.x=Math.random()*W;}ctx.fillStyle='hsla(40,100%,60%,'+.3+')';ctx.fillRect(p.x,p.y,1.5,6);}}
  else if(m===14){ctx.fillStyle='#0a0015';ctx.fillRect(0,0,W,H);for(let i=0;i<6;i++){const g=ctx.createRadialGradient(W*Math.random(),H*Math.random(),0,W/2,H/2,Math.min(W,H)*.5);g.addColorStop(0,'hsla('+(280+i*15)+',70%,50%,.08)');g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}for(const p of parts){ctx.fillStyle='#fff';ctx.fillRect(p.x,p.y,1,1);}}
  else if(m===15){ctx.fillStyle='#001008';ctx.fillRect(0,0,W,H);for(let y=0;y<H;y+=4){const o=Math.sin(y*.02+T*.03)*20;ctx.strokeStyle='rgba(0,255,100,'+(.05+Math.sin(y*.01)*.03)+')';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W/2+o,y);ctx.lineTo(W,y);ctx.stroke();}}
  else if(m===16){const g=ctx.createRadialGradient(W/2,H/2,0,W/2,H/2,Math.min(W,H)*.6);g.addColorStop(0,'#1a0533');g.addColorStop(.5,'#0d1b4a');g.addColorStop(1,'#000');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);for(let i=0;i<12;i++){const a=T*.015+i*Math.PI/6;ctx.strokeStyle='rgba(150,100,255,.12)';ctx.beginPath();ctx.ellipse(W/2,H/2,80+i*12,40+i*6,a,0,6.28);ctx.stroke();}}
  else {ctx.fillStyle='#0c1445';ctx.fillRect(0,0,W,H);for(let i=0;i<30;i++){const x=(i*37+T)%W;const y=(i*53+T*.5)%H;const s=1+Math.sin(T*.05+i);ctx.fillStyle='rgba(255,255,200,'+(.2*s)+')';ctx.beginPath();ctx.arc(x,y,s,0,6.28);ctx.fill();}}
  }catch(e){/* fond de secours */if(ctx){ctx.fillStyle='#0a1628';ctx.fillRect(0,0,W||800,H||600);}}
  requestAnimationFrame(drawWp);
}
try{res();addEventListener('resize',res);drawWp();}catch(e){console.warn('Wallpaper init',e);}
function setWallpaper(m){wpMode=m;localStorage.setItem('w11_wp',String(m));toast('Fond change');}

function updateClock(){
  const d=new Date();
  const t=d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const dt=d.toLocaleDateString('fr-FR',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
  document.getElementById('clock').innerHTML=t+'<br>'+dt;
  const wc=document.getElementById('wClock');if(wc)wc.innerHTML='<b>'+t+'</b><br/>'+dt;
}
setInterval(updateClock,1000);updateClock();

const apps={
  explorer:{name:'Explorateur',icon:'📁',w:740,h:500},
  browser:{name:'Microsoft Edge',icon:'e',w:840,h:560},
  vscode:{name:'Visual Studio Code',icon:'VS',w:920,h:600},
  word:{name:'Word',icon:'W',w:800,h:560},
  excel:{name:'Excel',icon:'X',w:860,h:540},
  powerpoint:{name:'PowerPoint',icon:'P',w:820,h:540},
  powershell:{name:'Windows PowerShell',icon:'PS',w:700,h:420},
  terminal:{name:'Invite de commandes',icon:'>_',w:680,h:400},
  ai:{name:'Assistant IA',icon:'🤖',w:480,h:520},
  settings:{name:'Parametres',icon:'⚙️',w:760,h:560},
  notepad:{name:'Bloc-notes',icon:'📝',w:500,h:400},
  calc:{name:'Calculatrice',icon:'🔢',w:300,h:400},
  store:{name:'Microsoft Store',icon:'🛍️',w:620,h:460},
  snake:{name:'Snake',icon:'🐍',w:420,h:460},
  minecraft:{name:'Craft Mini',icon:'🧱',w:520,h:480},
  tictactoe:{name:'Morpion',icon:'⭕',w:380,h:420},
  memory:{name:'Memory',icon:'🃏',w:420,h:480},
  pong:{name:'Pong',icon:'🏓',w:520,h:420},
  paint:{name:'Paint',icon:'🎨',w:640,h:480},
  photos:{name:'Photos',icon:'🖼️',w:560,h:420},
  music:{name:'Media Player',icon:'🎵',w:460,h:340}
};
const pinned=Object.keys(apps);

function brandIco(id,sz){
  const m={word:['b-word','W'],excel:['b-excel','X'],powerpoint:['b-ppt','P'],browser:['b-edge','e'],vscode:['b-code','VS'],powershell:['b-ps','PS']};
  if(m[id])return '<span class="brand-ico '+m[id][0]+'" style="width:'+sz+'px;height:'+sz+'px;font-size:'+(sz*0.4)+'px">'+m[id][1]+'</span>';
  return apps[id]?apps[id].icon:'📦';
}

function renderDesktop(){
  const desk=document.getElementById('desktop');desk.innerHTML='';
  const items=[
    {id:'explorer',name:'Ce PC',ico:'💻'},{id:'explorer',name:'Documents',ico:'📁'},
    {id:'browser',name:'Edge',brand:1},{id:'vscode',name:'VS Code',brand:1},
    {id:'word',name:'Word',brand:1},{id:'excel',name:'Excel',brand:1},
    {id:'powerpoint',name:'PowerPoint',brand:1},{id:'ai',name:'IA',ico:'🤖'},
    {id:'snake',name:'Snake',ico:'🐍'},{id:'minecraft',name:'Craft Mini',ico:'🧱'},
    {id:'tictactoe',name:'Morpion',ico:'⭕'},{id:'memory',name:'Memory',ico:'🃏'},
    {id:'pong',name:'Pong',ico:'🏓'},{id:'paint',name:'Paint',ico:'🎨'},
    {id:'settings',name:'Parametres',ico:'⚙️'},{id:'recycle',name:'Corbeille',ico:'🗑️'}
  ];
  items.forEach(function(it){
    const el=document.createElement('div');el.className='desk-icon';
    const ico=it.brand?brandIco(it.id,32):(it.ico||'📄');
    el.innerHTML='<span class="ico">'+ico+'</span>'+it.name;
    el.ondblclick=function(){if(it.id==='recycle')openApp('recycle');else openApp(it.id);};
    el.onclick=function(e){document.querySelectorAll('.desk-icon').forEach(function(x){x.classList.remove('selected');});el.classList.add('selected');e.stopPropagation();};
    desk.appendChild(el);
  });
}
document.getElementById('desktop').onclick=function(){document.querySelectorAll('.desk-icon').forEach(function(x){x.classList.remove('selected');});};

function renderStart(){
  document.getElementById('pinnedGrid').innerHTML=pinned.map(function(id){
    return '<div class="pinned-item" onclick="openApp(\''+id+'\');closeStart()"><span class="ico">'+brandIco(id,28)+'</span>'+apps[id].name.split(' ')[0]+'</div>';
  }).join('');
}
document.getElementById('startBtn').onclick=function(e){e.stopPropagation();toggleStart();};
document.getElementById('widgetsBtn').onclick=function(e){e.stopPropagation();widgetsOpen=!widgetsOpen;document.getElementById('widgets').classList.toggle('open',widgetsOpen);};
function toggleStart(){startOpen=!startOpen;document.getElementById('startMenu').classList.toggle('open',startOpen);}
function closeStart(){startOpen=false;document.getElementById('startMenu').classList.remove('open');}
document.addEventListener('click',function(e){
  if(startOpen&&!e.target.closest('#startMenu')&&!e.target.closest('#startBtn'))closeStart();
  if(widgetsOpen&&!e.target.closest('#widgets')&&!e.target.closest('#widgetsBtn')){widgetsOpen=false;document.getElementById('widgets').classList.remove('open');}
});
document.getElementById('startSearch').oninput=function(){
  const q=this.value.toLowerCase();
  document.querySelectorAll('.pinned-item').forEach(function(el){el.style.display=el.textContent.toLowerCase().includes(q)?'':'none';});
};

/* FS */
const FS={
  'Ce PC':[
    {t:'folder',n:'Documents',loc:'Documents'},{t:'folder',n:'Telechargements',loc:'Telechargements'},
    {t:'folder',n:'Images',loc:'Images'},{t:'folder',n:'Bureau',loc:'Bureau'},
    {t:'drive',n:'Disque local (C:)',loc:'C:'},{t:'drive',n:'Disque de donnees (T:)',loc:'T:'}
  ],
  'Documents':[{t:'file',n:'Rapport.docx',ext:'docx'},{t:'file',n:'Notes.txt',ext:'txt'},{t:'file',n:'index.html',ext:'html'}],
  'Telechargements':[{t:'file',n:'Setup.exe',ext:'exe'},{t:'file',n:'archive.zip',ext:'zip'}],
  'Images':[{t:'file',n:'Photo.jpg',ext:'jpg'},{t:'file',n:'Logo.png',ext:'png'}],
  'Bureau':[{t:'file',n:'Raccourci.lnk',ext:'lnk'}],
  'C:':[{t:'folder',n:'Windows',loc:'C:/Windows'},{t:'folder',n:'Program Files',loc:'C:/Program Files'},{t:'folder',n:'Users',loc:'C:/Users'}],
  'T:':[{t:'folder',n:'Projets',loc:'T:/Projets'},{t:'file',n:'backup.bak',ext:'bak'},{t:'file',n:'data.csv',ext:'csv'}],
  'C:/Windows':[{t:'file',n:'explorer.exe',ext:'exe'},{t:'file',n:'notepad.exe',ext:'exe'}],
  'C:/Program Files':[{t:'folder',n:'Microsoft Office',loc:'C:/Program Files/Office'}],
  'C:/Users':[{t:'folder',n:OWNER,loc:'C:/Users/User'}],
  'C:/Users/User':[{t:'folder',n:'Documents',loc:'Documents'},{t:'folder',n:'Desktop',loc:'Bureau'}],
  'C:/Program Files/Office':[{t:'file',n:'WINWORD.EXE',ext:'exe'},{t:'file',n:'EXCEL.EXE',ext:'exe'}],
  'T:/Projets':[{t:'file',n:'app.py',ext:'py'},{t:'file',n:'style.css',ext:'css'},{t:'file',n:'main.js',ext:'js'}],
  'Corbeille':[]
};
let currentLoc='Ce PC', selectedFile=null, clipboard=null;

function openApp(id){
  if(id==='recycle')id='explorer';
  /* Version bloquée : certaines apps demandent 1.0.1 */
  if(VERSION_LOCKED && !subscribed && LOCKED_APPS.indexOf(id)>=0){
    showPaywall();
    toast('🔒 App verrouillée — attendez la version 1.0.1 (Yoann Bonkoungou)');
    return;
  }
  if(windows[id]&&id!=='explorer'){windows[id].el.classList.remove('minimized');focusWin(id);return;}
  if(id==='explorer'&&windows.explorer){windows.explorer.el.classList.remove('minimized');focusWin('explorer');return;}
  const app=apps[id]||{name:id,icon:'📦',w:600,h:400};
  const win=document.createElement('div');win.className='window';win.dataset.app=id;
  const sw=innerWidth,sh=innerHeight-48;
  const ww=Math.min(app.w,sw-12),hh=Math.min(app.h,sh-12);
  win.style.width=ww+'px';win.style.height=hh+'px';
  win.style.left=Math.max(0,(sw-ww)/2+(Object.keys(windows).length%5)*18)+'px';
  win.style.top=Math.max(0,(sh-hh)/2+(Object.keys(windows).length%5)*18)+'px';
  win.style.zIndex=++zTop;
  const icoHtml=brandIco(id,18);
  win.innerHTML='<div class="titlebar"><span class="title">'+icoHtml+' '+app.name+'</span><div class="controls"><button class="min">─</button><button class="max">□</button><button class="close">✕</button></div></div><div class="win-body">'+getContent(id)+'</div>';
  document.body.appendChild(win);
  windows[id]={el:win};
  win.querySelector('.close').onclick=function(){closeWin(id);};
  win.querySelector('.min').onclick=function(){win.classList.add('minimized');updateTaskbar();};
  win.querySelector('.max').onclick=function(){win.classList.toggle('maximized');};
  win.querySelector('.titlebar').onmousedown=function(e){dragStart(e,win);};
  win.querySelector('.titlebar').ontouchstart=function(e){dragStart(e,win,true);};
  win.onmousedown=function(){focusWin(id);};
  initApp(id,win);
  focusWin(id);updateTaskbar();
}
function closeWin(id){if(!windows[id])return;windows[id].el.remove();delete windows[id];updateTaskbar();}
function focusWin(id){if(!windows[id])return;windows[id].el.style.zIndex=++zTop;windows[id].el.classList.remove('minimized');updateTaskbar();}
function updateTaskbar(){document.querySelectorAll('.tb-btn[data-app]').forEach(function(b){b.classList.toggle('active',!!windows[b.dataset.app]&&!windows[b.dataset.app].el.classList.contains('minimized'));});}
document.querySelectorAll('.tb-btn[data-app]').forEach(function(b){b.onclick=function(){openApp(b.dataset.app);};});

let drag=null;
function dragStart(e,win,touch){if(win.classList.contains('maximized'))return;const ev=touch?e.touches[0]:e;drag={win:win,ox:ev.clientX-win.offsetLeft,oy:ev.clientY-win.offsetTop};focusWin(win.dataset.app);e.preventDefault();}
function dragMove(e){if(!drag)return;const ev=e.touches?e.touches[0]:e;drag.win.style.left=Math.max(0,ev.clientX-drag.ox)+'px';drag.win.style.top=Math.max(0,ev.clientY-drag.oy)+'px';}
function dragEnd(){drag=null;}
addEventListener('mousemove',dragMove);addEventListener('mouseup',dragEnd);addEventListener('touchmove',dragMove,{passive:false});addEventListener('touchend',dragEnd);

function buildSheet(){let h='<table><tr><th></th>';for(let c=0;c<12;c++)h+='<th>'+String.fromCharCode(65+c)+'</th>';h+='</tr>';for(let r=1;r<=20;r++){h+='<tr><th>'+r+'</th>';for(let c=0;c<12;c++)h+='<td contenteditable="true" data-cell="'+String.fromCharCode(65+c)+r+'"></td>';h+='</tr>';}return h+'</table>';}

function getContent(id){
  if(id==='explorer')return '<div class="explorer"><div class="exp-sidebar"><div class="item active" data-loc="Ce PC">💻 Ce PC</div><div class="item" data-loc="Documents">📁 Documents</div><div class="item" data-loc="Telechargements">⬇️ Telechargements</div><div class="item" data-loc="Images">🖼️ Images</div><div class="item" data-loc="Bureau">🖥️ Bureau</div><div class="item" data-loc="C:">💾 C:</div><div class="item" data-loc="T:">💾 T:</div><div class="item" data-loc="Corbeille">🗑️ Corbeille</div></div><div class="exp-main"><div class="exp-toolbar"><button data-act="new-folder">+ Dossier</button><button data-act="new-file">+ Fichier</button><select id="newExt"><option value="txt">.txt</option><option value="html">.html</option><option value="css">.css</option><option value="js">.js</option><option value="py">.py</option><option value="json">.json</option><option value="md">.md</option></select><button data-act="copy">Copier</button><button data-act="paste">Coller</button><button data-act="move">Déplacer</button><button data-act="rename">Renommer</button><button data-act="delete">Supprimer</button><button data-act="open">Ouvrir</button></div><div class="file-grid" id="fileGrid"></div></div></div>';
  if(id==='browser')return '<div class="browser-bar"><button data-nav="back">←</button><button data-nav="fwd">→</button><button data-nav="reload">↻</button><input class="urlBar" value="https://www.bing.com"/><button data-nav="go">➜</button></div><iframe class="browser-frame" src="https://www.bing.com" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>';
  if(id==='vscode')return '<div class="code-layout"><div class="code-side" id="codeSide"></div><div class="code-main"><div class="code-toolbar"><button class="run" data-vsc="run">▶ Run</button><button data-vsc="save">💾 Save</button><button data-vsc="theme">🎨 Theme</button><button data-vsc="format">Format</button><button data-vsc="output">Console</button><select id="codeTheme" style="margin-left:auto;background:#333;color:#fff;border:1px solid #555;border-radius:3px;padding:2px 6px;font-size:11px"><option value="dark">Dark+</option><option value="light">Light</option><option value="monokai">Monokai</option><option value="dracula">Dracula</option></select></div><div class="code-tabs" id="codeTabs"></div><textarea class="code-area" id="codeArea" spellcheck="false" placeholder="// Écrivez votre code ici..."></textarea><div class="code-output" id="codeOutput"></div><div class="code-status"><span id="codeLang">plaintext</span><span>UTF-8 · VS Code Web · Yoann Bonkoungou</span></div></div></div>';
  if(id==='word')return '<div class="ribbon" data-ribbon="word"><span class="on" data-tab="home">'+t('home')+'</span><span data-tab="insert">'+t('insert')+'</span><span data-tab="design">'+t('design')+'</span><span data-tab="layout">'+t('layout')+'</span><span data-tab="refs">'+t('refs')+'</span><span data-tab="view">'+t('view')+'</span></div><div class="toolbar" data-panel="home"><button data-cmd="undo" title="Undo">↶</button><button data-cmd="redo">↷</button><span class="sep"></span><button data-cmd="bold" title="'+t('bold')+'"><b>G</b></button><button data-cmd="italic" title="'+t('italic')+'"><i>I</i></button><button data-cmd="underline" title="'+t('underline')+'"><u>S</u></button><button data-cmd="strikeThrough"><s>abc</s></button><span class="sep"></span><select data-font><option>Calibri</option><option>Arial</option><option>Times New Roman</option><option>Georgia</option><option>Verdana</option><option>Comic Sans MS</option></select><select data-size><option value="1">8</option><option value="2">10</option><option value="3" selected>12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option><option value="7">36</option></select><input type="color" data-color value="#000000"/><input type="color" data-hilite value="#ffff00" title="Surlignage"/><span class="sep"></span><button data-cmd="justifyLeft">⬅</button><button data-cmd="justifyCenter">⬌</button><button data-cmd="justifyRight">➡</button><button data-cmd="justifyFull">☰</button><span class="sep"></span><button data-cmd="insertUnorderedList">• Liste</button><button data-cmd="insertOrderedList">1. Liste</button><button data-cmd="indent">→|</button><button data-cmd="outdent">|←</button><span class="sep"></span><button data-act="save">💾 '+t('save')+'</button><button data-act="clear">Nouveau</button><button data-act="find">🔍 Rechercher</button><button data-act="replace">Remplacer</button><button data-act="count">Compteur</button></div><div class="toolbar" data-panel="insert" style="display:none"><button data-act="img">🖼️ Image</button><button data-act="table">▦ Tableau</button><button data-act="link">🔗 Lien</button><button data-act="hr">─ Ligne</button><button data-cmd="insertHorizontalRule">Séparateur</button><button data-act="date">📅 Date</button><button data-act="page">📄 Saut de page</button><button data-act="emoji">😀 Emoji</button></div><div class="toolbar" data-panel="design" style="display:none"><button data-act="theme1">Thème Clair</button><button data-act="theme2">Thème Bleu</button><button data-act="theme3">Thème Sombre</button><button data-act="theme4">Thème Vert</button></div><div class="toolbar" data-panel="layout" style="display:none"><button data-act="m1">Marge étroite</button><button data-act="m2">Marge normale</button><button data-act="m3">Marge large</button><button data-act="orient">Orientation</button></div><div class="toolbar" data-panel="refs" style="display:none"><button data-act="sommaire">📚 Sommaire</button><button data-act="note">📎 Note de bas de page</button><button data-act="citation">❝ Citation</button></div><div class="toolbar" data-panel="view" style="display:none"><button data-act="zoomIn">Zoom +</button><button data-act="zoomOut">Zoom −</button><button data-act="zoom100">100%</button><button data-act="readonly">Mode lecture</button></div><div class="editor" contenteditable="true"><p style="text-align:center;font-size:22px"><b>Document1</b></p><p>Écrivez ici…</p></div>';

  if(id==='excel')return '<div class="ribbon" data-ribbon="excel"><span class="on" data-tab="home">'+t('home')+'</span><span data-tab="insert">'+t('insert')+'</span><span data-tab="formulas">'+t('formulas')+'</span><span data-tab="data">'+t('data')+'</span><span data-tab="view">'+t('view')+'</span></div><div class="toolbar" data-panel="home"><button data-act="bold"><b>G</b></button><button data-act="italic"><i>I</i></button><input type="color" data-cellcolor value="#000"/><span class="sep"></span><button data-act="sum">Σ Somme</button><button data-act="avg">Moyenne</button><button data-act="clear-sheet">Effacer</button><button data-act="save-sheet">💾 '+t('save')+'</button></div><div class="toolbar" data-panel="insert" style="display:none"><button data-act="addrow">+ Ligne</button><button data-act="addcol">+ Colonne</button><button data-act="chart">📊 Graphique</button></div><div class="toolbar" data-panel="formulas" style="display:none"><button data-act="sum">=SUM</button><button data-act="avg">=AVERAGE</button><button data-act="min">=MIN</button><button data-act="max">=MAX</button></div><div class="toolbar" data-panel="data" style="display:none"><button data-act="sort-asc">Tri A→Z</button><button data-act="sort-desc">Tri Z→A</button><button data-act="fill">Remplir série</button></div><div class="toolbar" data-panel="view" style="display:none"><button data-act="freeze">Figer panneau</button></div><div class="formula-bar"><span id="cellRef">A1</span><input id="formulaInput" placeholder="=A1+B1 ou =SUM(A1:A5)"/></div><div class="sheet-wrap">'+buildSheet()+'</div>';

  if(id==='powerpoint')return '<div class="ribbon" data-ribbon="ppt"><span class="on" data-tab="home">'+t('home')+'</span><span data-tab="insert">'+t('insert')+'</span><span data-tab="design">'+t('design')+'</span><span data-tab="transitions">'+t('transitions')+'</span><span data-tab="slideshow">'+t('slideshow')+'</span></div><div class="toolbar" data-panel="home"><button data-cmd="bold"><b>G</b></button><button data-cmd="italic"><i>I</i></button><button data-cmd="underline"><u>S</u></button><select data-font><option>Calibri</option><option>Arial</option><option>Georgia</option><option>Impact</option></select><select data-size><option value="4">14</option><option value="5">18</option><option value="6" selected>24</option><option value="7">36</option></select><input type="color" data-color value="#ffffff"/><span class="sep"></span><button data-act="add-slide">+ Slide</button><button data-act="save-ppt">💾 '+t('save')+'</button></div><div class="toolbar" data-panel="insert" style="display:none"><button data-act="img">🖼️ Image</button><button data-act="shape">⬡ Forme</button><button data-act="textbox">T Zone de texte</button></div><div class="toolbar" data-panel="design" style="display:none"><button data-act="bg1">Bleu</button><button data-act="bg2">Sombre</button><button data-act="bg3">Clair</button><button data-act="bg4">Gradient rose</button><button data-act="bg5">Gradient vert</button></div><div class="toolbar" data-panel="transitions" style="display:none"><button data-act="tr1">Fondu</button><button data-act="tr2">Pousser</button><button data-act="tr3">Aucune</button></div><div class="toolbar" data-panel="slideshow" style="display:none"><button data-act="play">▶ Lancer le diaporama</button></div><div class="editor" contenteditable="true" style="background:linear-gradient(135deg,#1a365d,#2b6cb0);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center"><p style="font-size:30px;font-weight:700">Titre de la diapositive</p><p style="font-size:16px;opacity:.85">Sous-titre</p></div>';

  if(id==='powershell'||id==='terminal')return '<div style="background:#012456;color:#eee;font-family:Consolas,monospace;font-size:13px;padding:10px;height:100%;overflow:auto;display:flex;flex-direction:column" class="term-wrap"><div class="term-out" style="flex:1;overflow:auto"></div><div style="display:flex;gap:4px;margin-top:6px"><span style="color:#0f0">'+(id==='powershell'?'PS C:\\Users\\'+OWNER.split(' ')[0]+'> ':'C:\\>')+'</span><input class="term-in" style="flex:1;background:transparent;border:none;color:#fff;font:inherit;outline:none"/></div></div>';
  if(id==='ai')return '<div class="ai-chat"><div class="ai-msgs" id="aiMsgs"><div class="ai-msg bot">Bonjour ! Je suis l\'assistant IA de Windows 11 (Yoann Bonkoungou). Posez-moi une question.</div></div><div class="ai-input"><input id="aiIn" placeholder="Votre message..."/><button id="aiSend">Envoyer</button></div></div>';
  if(id==='settings')return '<div class="settings-layout"><div class="settings-nav"><div class="item active" data-panel="system">Système</div><div class="item" data-panel="perso">Personnalisation</div><div class="item" data-panel="notif">Notifications</div><div class="item" data-panel="versions">Versions</div><div class="item" data-panel="time">Heure et langue</div><div class="item" data-panel="about">À propos</div><div class="item" data-panel="sub">Abonnement</div></div><div class="settings-content" id="settingsContent"></div></div>';
  if(id==='snake')return '<div class="game-area"><canvas id="snakeCv" width="360" height="360"></canvas><div style="margin-top:8px;font-size:12px">Flèches / swipe · Score: <span id="snakeScore">0</span></div><button class="pay-btn" style="max-width:120px;margin-top:8px" id="snakeStart">Jouer</button></div>';
  if(id==='minecraft')return '<div class="game-area"><canvas id="mcCv" width="400" height="320"></canvas><div style="margin-top:8px;font-size:12px">Clic = poser/casser · 1-4 couleurs</div></div>';
  if(id==='tictactoe')return '<div class="game-area"><div id="tttStatus" style="margin-bottom:12px;font-size:14px">Tour de X</div><div class="ttt-board" id="tttBoard"></div><button class="game-btn" id="tttReset" style="margin-top:14px">Nouvelle partie</button></div>';
  if(id==='memory')return '<div class="game-area"><div style="margin-bottom:10px;font-size:13px">Coups: <span id="memMoves">0</span> · Paires: <span id="memPairs">0</span>/8</div><div class="mem-grid" id="memGrid"></div><button class="game-btn" id="memReset" style="margin-top:12px">Rejouer</button></div>';
  if(id==='pong')return '<div class="game-area"><canvas id="pongCv" width="480" height="320" style="background:#0a0a12;border-radius:6px"></canvas><div style="margin-top:8px;font-size:12px">Score: <span id="pongScore">0</span> · Flèches ↑↓ · Espace = pause</div><button class="game-btn" id="pongStart">Jouer</button></div>';
  if(id==='paint')return '<div style="display:flex;flex-direction:column;height:100%;background:#2d2d2d"><div class="toolbar" style="background:#333"><button data-paint="pen">✏️</button><button data-paint="eraser">🧹</button><input type="color" id="paintColor" value="#000000"/><input type="range" id="paintSize" min="1" max="30" value="4" style="width:80px"/><button data-paint="clear">Effacer</button><button data-paint="save">💾</button></div><div style="flex:1;display:flex;align-items:center;justify-content:center;overflow:auto;padding:8px"><canvas id="paintCv" class="paint-canvas" width="560" height="380"></canvas></div></div>';
  if(id==='notepad')return '<textarea class="editor" style="background:#1e1e1e;color:#ddd;font-family:Consolas,monospace;padding:14px" placeholder="Texte..."></textarea>';
  if(id==='calc'){const keys=['C','±','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','0','0','.','='];return '<div style="padding:10px;height:100%;display:flex;flex-direction:column;background:#202020"><div id="calcDisplay" style="background:#1a1a1a;padding:12px;font-size:26px;text-align:right;border-radius:6px;margin-bottom:8px">0</div><div style="display:grid;grid-template-columns:repeat(4,1fr);gap:5px;flex:1">'+keys.map(function(k){return '<button data-calc="'+k+'" style="border:none;border-radius:6px;font-size:16px;cursor:pointer;background:'+('÷×−+='.indexOf(k)>=0?'#60cdff':'#2d2d2d')+';color:'+('÷×−+='.indexOf(k)>=0?'#000':'#fff')+'">'+k+'</button>';}).join('')+'</div></div>';}
  if(id==='store')return '<div style="padding:32px;text-align:center"><div style="font-size:40px">🛍️</div><h2 style="margin:10px 0">Microsoft Store</h2><p style="color:var(--muted);font-size:13px">Applications · Créateur: '+CREATOR+'</p><p style="color:#22c55e;font-size:12px;margin-top:6px">✓ Version gratuite</p><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:20px"><div class="widget-card" style="width:120px;cursor:pointer" onclick="openApp(\'snake\')">🐍 Snake</div><div class="widget-card" style="width:120px;cursor:pointer" onclick="openApp(\'tictactoe\')">⭕ Morpion</div><div class="widget-card" style="width:120px;cursor:pointer" onclick="openApp(\'memory\')">🃏 Memory</div><div class="widget-card" style="width:120px;cursor:pointer" onclick="openApp(\'pong\')">🏓 Pong</div><div class="widget-card" style="width:120px;cursor:pointer" onclick="openApp(\'paint\')">🎨 Paint</div><div class="widget-card" style="width:120px;cursor:pointer" onclick="openApp(\'minecraft\')">🧱 Craft</div></div></div>';
  if(id==='photos')return '<div style="padding:40px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:48px">🖼️</div><h2>Photos</h2></div>';
  if(id==='music')return '<div style="padding:40px;text-align:center;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-size:48px">🎵</div><h2>Media Player</h2><div style="font-size:24px;margin-top:12px;display:flex;gap:14px"><span onclick="toast(\'Prev\')">⏮</span><span onclick="toast(\'Play\')">▶️</span><span onclick="toast(\'Next\')">⏭</span></div></div>';
  return '';
}

/* VS Code files */
const codeFiles={
  'index.html':'<!DOCTYPE html>\n<html>\n<head>\n  <title>Mon site</title>\n  <link rel="stylesheet" href="style.css">\n</head>\n<body>\n  <h1>Bonjour</h1>\n  <script src="main.js"><\/script>\n</body>\n</html>',
  'style.css':'body {\n  font-family: system-ui;\n  background: #0f172a;\n  color: #e2e8f0;\n  padding: 2rem;\n}\nh1 { color: #60cdff; }',
  'main.js':'console.log("Hello from VS Code Web");\ndocument.querySelector("h1")?.addEventListener("click", () => alert("Clique !"));',
  'app.py':'# Python\ndef hello(name):\n    return f"Bonjour {name}"\n\nprint(hello("'+OWNER.split(' ')[0]+'"))',
  'readme.md':'# Projet\nCree avec VS Code Web — '+CREATOR
};
let currentCodeFile='index.html';

function initApp(id,win){
  if(id==='explorer'){
    const grid=win.querySelector('#fileGrid');
    let dragSrc=null;
    function moveFile(fromLoc, fromIdx, toLoc){
      if(fromLoc===toLoc)return;
      if(!FS[toLoc])FS[toLoc]=[];
      const f=FS[fromLoc][fromIdx];
      if(!f)return;
      FS[fromLoc].splice(fromIdx,1);
      if(f.t==='folder'||f.t==='drive'){
        /* keep same loc key */
      }
      FS[toLoc].push(f);
      toast(f.n+' déplacé vers '+toLoc);
      show(currentLoc);
    }
    function show(loc){
      currentLoc=loc;
      if(!FS[loc])FS[loc]=[];
      const files=FS[loc];
      grid.innerHTML=files.map(function(f,i){
        const ico=f.t==='folder'||f.t==='drive'?'📁':(f.ext==='py'?'🐍':f.ext==='html'?'🌐':f.ext==='css'?'🎨':f.ext==='js'?'📜':f.ext==='exe'?'⚙️':'📄');
        return '<div class="file-item" data-i="'+i+'" draggable="true"><span class="ico">'+ico+'</span>'+f.n+'</div>';
      }).join('')||'<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:20px">Dossier vide</div>';
      grid.querySelectorAll('.file-item').forEach(function(el){
        el.onclick=function(){grid.querySelectorAll('.file-item').forEach(function(x){x.classList.remove('selected');});el.classList.add('selected');selectedFile={loc:loc,i:+el.dataset.i,f:files[+el.dataset.i]};};
        el.ondblclick=function(){
          const f=files[+el.dataset.i];
          if(f.t==='folder'||f.t==='drive'){show(f.loc);win.querySelectorAll('.exp-sidebar .item').forEach(function(x){x.classList.toggle('active',x.dataset.loc===f.loc);});}
          else if(f.ext==='html'||f.ext==='css'||f.ext==='js'||f.ext==='py'||f.ext==='txt'||f.ext==='md'){openApp('vscode');toast('Ouvert dans VS Code: '+f.n);}
          else if(f.ext==='docx')openApp('word');
          else if(f.ext==='xlsx'||f.ext==='csv')openApp('excel');
          else toast('Ouverture de '+f.n);
        };
        el.ondragstart=function(e){
          dragSrc={loc:loc,i:+el.dataset.i,f:files[+el.dataset.i]};
          el.classList.add('dragging');
          e.dataTransfer.effectAllowed='move';
          e.dataTransfer.setData('text/plain',el.dataset.i);
        };
        el.ondragend=function(){el.classList.remove('dragging');dragSrc=null;grid.querySelectorAll('.drag-over').forEach(function(x){x.classList.remove('drag-over');});};
        el.ondragover=function(e){e.preventDefault();e.dataTransfer.dropEffect='move';const f=files[+el.dataset.i];if(f&&(f.t==='folder'||f.t==='drive'))el.classList.add('drag-over');};
        el.ondragleave=function(){el.classList.remove('drag-over');};
        el.ondrop=function(e){
          e.preventDefault();el.classList.remove('drag-over');
          if(!dragSrc)return;
          const target=files[+el.dataset.i];
          if(target&&(target.t==='folder'||target.t==='drive')){
            moveFile(dragSrc.loc,dragSrc.i,target.loc);
          }
        };
      });
    }
    show('Ce PC');
    win.querySelectorAll('.exp-sidebar .item').forEach(function(item){
      item.onclick=function(){win.querySelectorAll('.exp-sidebar .item').forEach(function(x){x.classList.remove('active');});item.classList.add('active');show(item.dataset.loc);};
      item.ondragover=function(e){e.preventDefault();item.classList.add('drag-over');};
      item.ondragleave=function(){item.classList.remove('drag-over');};
      item.ondrop=function(e){
        e.preventDefault();item.classList.remove('drag-over');
        if(dragSrc)moveFile(dragSrc.loc,dragSrc.i,item.dataset.loc);
      };
    });
    win.querySelectorAll('.exp-toolbar button').forEach(function(btn){
      btn.onclick=function(){
        const act=btn.dataset.act;
        if(act==='new-folder'){const n=prompt('Nom du dossier','Nouveau dossier');if(n){FS[currentLoc]=FS[currentLoc]||[];const path=currentLoc+'/'+n;FS[path]=FS[path]||[];FS[currentLoc].push({t:'folder',n:n,loc:path});show(currentLoc);toast('Dossier créé');}}
        if(act==='new-file'){const ext=win.querySelector('#newExt').value;const n=prompt('Nom du fichier','fichier.'+ext);if(n){FS[currentLoc]=FS[currentLoc]||[];FS[currentLoc].push({t:'file',n:n,ext:ext});if(['html','css','js','py','md','txt'].indexOf(ext)>=0)codeFiles[n]=codeFiles[n]||'';show(currentLoc);toast('Fichier créé');}}
        if(act==='copy'){if(selectedFile){clipboard=JSON.parse(JSON.stringify(selectedFile.f));toast('Copié');}else toast('Sélectionnez un élément');}
        if(act==='paste'){if(clipboard){FS[currentLoc]=FS[currentLoc]||[];FS[currentLoc].push(Object.assign({},clipboard,{n:clipboard.n+' - copie'}));show(currentLoc);toast('Collé');}else toast('Presse-papiers vide');}
        if(act==='rename'){if(selectedFile){const n=prompt('Nouveau nom',selectedFile.f.n);if(n){selectedFile.f.n=n;show(currentLoc);toast('Renommé');}}else toast('Sélectionnez');}
        if(act==='move'){if(selectedFile){const dest=prompt('Déplacer vers (Documents, Telechargements, Images, Bureau, C:, T:, Corbeille)','Documents');if(dest&&FS[dest]!==undefined){moveFile(selectedFile.loc,selectedFile.i,dest);selectedFile=null;}else if(dest)toast('Dossier inconnu');}else toast('Sélectionnez un fichier');}
        if(act==='delete'){if(selectedFile){const f=selectedFile.f;FS['Corbeille']=FS['Corbeille']||[];FS['Corbeille'].push(f);FS[selectedFile.loc].splice(selectedFile.i,1);selectedFile=null;show(currentLoc);toast('Envoyé à la Corbeille');}else toast('Sélectionnez');}
        if(act==='open'){if(selectedFile){const f=selectedFile.f;if(f.t==='folder'||f.t==='drive')show(f.loc);else toast('Ouverture '+f.n);}else toast('Sélectionnez');}
      };
    });
  }
  if(id==='browser'){
    const bar=win.querySelector('.urlBar'),frame=win.querySelector('.browser-frame');
    function go(){let url=bar.value.trim();if(!url)return;if(!/^https?:\/\//i.test(url)&&url.indexOf('.')<0)url='https://www.bing.com/search?q='+encodeURIComponent(url);else if(!/^https?:\/\//i.test(url))url='https://'+url;bar.value=url;try{frame.src=url;}catch(e){toast('Bloque');}}
    bar.addEventListener('keydown',function(e){if(e.key==='Enter')go();});
    win.querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(){const a=b.dataset.nav;if(a==='go')go();else if(a==='reload')frame.src=frame.src;else if(a==='back'){try{history.back();}catch(e){}}else if(a==='fwd'){try{history.forward();}catch(e){}}};});
  }
  if(id==='vscode'){
    const side=win.querySelector('#codeSide'),tabs=win.querySelector('#codeTabs'),area=win.querySelector('#codeArea'),lang=win.querySelector('#codeLang'),out=win.querySelector('#codeOutput');
    const themes={dark:{bg:'#1e1e1e',fg:'#d4d4d4',status:'#007acc'},light:{bg:'#ffffff',fg:'#1e1e1e',status:'#0078d4'},monokai:{bg:'#272822',fg:'#f8f8f2',status:'#a6e22e'},dracula:{bg:'#282a36',fg:'#f8f8f2',status:'#bd93f9'}};
    function renderSide(){
      side.innerHTML=Object.keys(codeFiles).map(function(f){return '<div class="fi '+(f===currentCodeFile?'on':'')+'" data-f="'+f+'">📄 '+f+'</div>';}).join('');
      side.querySelectorAll('.fi').forEach(function(el){el.onclick=function(){saveCurrent();currentCodeFile=el.dataset.f;loadFile();};});
    }
    function renderTabs(){
      tabs.innerHTML=Object.keys(codeFiles).map(function(f){return '<div class="tab '+(f===currentCodeFile?'on':'')+'" data-f="'+f+'">'+f+'</div>';}).join('')+'<div class="tab" id="newCodeTab">+</div>';
      tabs.querySelectorAll('.tab[data-f]').forEach(function(el){el.onclick=function(){saveCurrent();currentCodeFile=el.dataset.f;loadFile();};});
      const nt=tabs.querySelector('#newCodeTab');if(nt)nt.onclick=function(){const n=prompt('Nouveau fichier','nouveau.js');if(n){codeFiles[n]='';currentCodeFile=n;loadFile();}};
    }
    function loadFile(){area.value=codeFiles[currentCodeFile]||'';const ext=(currentCodeFile.split('.').pop()||'').toLowerCase();lang.textContent=ext||'plaintext';renderSide();renderTabs();}
    function saveCurrent(){codeFiles[currentCodeFile]=area.value;}
    function runCode(){
      saveCurrent();
      const ext=(currentCodeFile.split('.').pop()||'').toLowerCase();
      const code=area.value;
      out.classList.add('show');
      out.innerHTML='';
      const log=function(msg,isErr){const d=document.createElement('div');d.style.color=isErr?'#f44':'#0f0';d.textContent='> '+msg;out.appendChild(d);};
      log('Exécution de '+currentCodeFile+'...');
      try{
        if(ext==='js'||ext==='html'){
          const fakeConsole={log:function(){log(Array.prototype.slice.call(arguments).join(' '));},error:function(){log(Array.prototype.slice.call(arguments).join(' '),true);}};
          const fn=new Function('console',code);
          fn(fakeConsole);
          log('Terminé ✓');
        }else if(ext==='py'){
          log('(Simulation Python)');
          const prints=code.match(/print\s*\(([^)]+)\)/g)||[];
          prints.forEach(function(p){const m=p.match(/print\s*\((.+)\)/);if(m)log(m[1].replace(/['"]/g,''));});
          if(!prints.length)log('Aucun print() trouvé');
          log('Terminé ✓');
        }else{
          log('Exécution non supportée pour .'+ext+' (JS/Python uniquement)');
        }
      }catch(err){log('Erreur: '+err.message,true);}
      out.scrollTop=out.scrollHeight;
    }
    win.querySelectorAll('[data-vsc]').forEach(function(btn){
      btn.onclick=function(){
        const a=btn.dataset.vsc;
        if(a==='run')runCode();
        if(a==='save'){saveCurrent();toast('Enregistré: '+currentCodeFile);}
        if(a==='output')out.classList.toggle('show');
        if(a==='format'){area.value=area.value.split('\n').map(function(l){return l.trimRight();}).join('\n');saveCurrent();toast('Formaté');}
      };
    });
    const themeSel=win.querySelector('#codeTheme');
    if(themeSel)themeSel.onchange=function(){
      const th=themes[themeSel.value]||themes.dark;
      area.style.background=th.bg;area.style.color=th.fg;
      win.querySelector('.code-status').style.background=th.status;
      toast('Thème: '+themeSel.value);
    };
    area.addEventListener('input',function(){codeFiles[currentCodeFile]=area.value;});
    area.addEventListener('keydown',function(e){
      if(e.key==='Tab'){e.preventDefault();const s=area.selectionStart;area.value=area.value.slice(0,s)+'  '+area.value.slice(area.selectionEnd);area.selectionStart=area.selectionEnd=s+2;codeFiles[currentCodeFile]=area.value;}
      if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();saveCurrent();toast('Fichier enregistré: '+currentCodeFile);}
      if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();runCode();}
    });
    loadFile();
  }
  if(id==='word'||id==='powerpoint'){
    // Ribbon tabs
    win.querySelectorAll('.ribbon[data-ribbon] span[data-tab]').forEach(function(span){
      span.onclick = function(){
        const tab = span.dataset.tab;
        win.querySelectorAll('.ribbon span').forEach(function(s){s.classList.remove('on');});
        span.classList.add('on');
        win.querySelectorAll('.toolbar[data-panel]').forEach(function(tb){
          tb.style.display = (tb.dataset.panel === tab) ? 'flex' : 'none';
        });
      };
    });

    const tb=win.querySelector('.toolbar'),editor=win.querySelector('.editor');
    tb.querySelectorAll('[data-cmd]').forEach(function(btn){btn.onclick=function(){editor.focus();document.execCommand(btn.dataset.cmd,false,null);};});
    tb.querySelectorAll('[data-font]').forEach(function(sel){sel.onchange=function(){editor.focus();document.execCommand('fontName',false,sel.value);};});
    tb.querySelectorAll('[data-size]').forEach(function(sel){sel.onchange=function(){editor.focus();document.execCommand('fontSize',false,sel.value);};});
    tb.querySelectorAll('[data-color]').forEach(function(inp){inp.oninput=function(){editor.focus();document.execCommand('foreColor',false,inp.value);};});
    tb.querySelectorAll('[data-hilite]').forEach(function(inp){inp.oninput=function(){editor.focus();document.execCommand('hiliteColor',false,inp.value);};});
    tb.querySelectorAll('[data-act]').forEach(function(btn){btn.onclick=function(){
      const a=btn.dataset.act;
      if(a==='save'){localStorage.setItem('w11_word',editor.innerHTML);toast('Enregistré');}
      if(a==='clear'){editor.innerHTML='<p><br></p>';}
      if(a==='find'){const q=prompt('Rechercher :');if(q){const t=editor.innerText;const n=(t.match(new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'gi'))||[]).length;toast(n+' occurrence(s) de « '+q+' »');}}
      if(a==='replace'){const q=prompt('Texte à remplacer :');if(q){const r=prompt('Remplacer par :','');if(r!==null){editor.innerHTML=editor.innerHTML.split(q).join(r);toast('Remplacé');}}}
      if(a==='count'){const t=editor.innerText||'';const words=t.trim()?t.trim().split(/\s+/).length:0;toast(words+' mots · '+t.length+' caractères');}
      if(a==='emoji'){const e=prompt('Emoji :','😊');if(e)document.execCommand('insertText',false,e);}
      if(a==='add-slide'){editor.innerHTML='<p style="font-size:28px;font-weight:700">Nouvelle diapositive</p><p>Contenu</p>';}
      if(a==='bg1'){editor.style.background='linear-gradient(135deg,#1a365d,#2b6cb0)';editor.style.color='#fff';}
      if(a==='bg2'){editor.style.background='#1a1a2e';editor.style.color='#fff';}
      if(a==='bg3'){editor.style.background='#f7fafc';editor.style.color='#1a202c';}
      if(a==='save-ppt'){localStorage.setItem('w11_ppt',editor.innerHTML);toast('Presentation sauvee');}
        if(a==='img'){editor.focus();document.execCommand('insertImage',false,prompt('URL image','https://via.placeholder.com/200')||'');}
        if(a==='table'){editor.focus();let t='<table border="1" style="border-collapse:collapse;width:80%"><tr><td>A1</td><td>B1</td></tr><tr><td>A2</td><td>B2</td></tr></table><p></p>';document.execCommand('insertHTML',false,t);}
        if(a==='link'){const u=prompt('URL','https://');if(u)document.execCommand('createLink',false,u);}
        if(a==='hr'){document.execCommand('insertHorizontalRule');}
        if(a==='date'){document.execCommand('insertText',false,new Date().toLocaleDateString());}
        if(a==='page'){document.execCommand('insertHTML',false,'<div style="page-break-after:always;border-top:1px dashed #999;margin:16px 0"></div>');}
        if(a==='theme1'){editor.style.background='#fff';editor.style.color='#111';editor.style.fontFamily='Calibri,sans-serif';}
        if(a==='theme2'){editor.style.background='#e8f4fc';editor.style.color='#0a3d62';}
        if(a==='theme3'){editor.style.background='#1a1a2e';editor.style.color='#eee';}
        if(a==='theme4'){editor.style.background='#e8f8f0';editor.style.color='#1b4332';}
        if(a==='m1'){editor.style.padding='12px';}
        if(a==='m2'){editor.style.padding='28px 36px';}
        if(a==='m3'){editor.style.padding='48px 64px';}
        if(a==='orient'){editor.style.maxWidth=editor.style.maxWidth?'':'600px';}
        if(a==='sommaire'){document.execCommand('insertHTML',false,'<h2>Sommaire</h2><ol><li>Introduction</li><li>Développement</li><li>Conclusion</li></ol>');}
        if(a==='note'){document.execCommand('insertHTML',false,'<sup style="color:#06c">[1]</sup><p style="font-size:11px;color:#666">[1] Note de bas de page</p>');}
        if(a==='citation'){document.execCommand('insertHTML',false,'<blockquote style="border-left:3px solid #60cdff;padding-left:12px;color:#555;font-style:italic">Citation</blockquote>');}
        if(a==='zoomIn'){editor.style.fontSize=(parseFloat(editor.style.fontSize)||14)+2+'px';}
        if(a==='zoomOut'){editor.style.fontSize=Math.max(10,(parseFloat(editor.style.fontSize)||14)-2)+'px';}
        if(a==='zoom100'){editor.style.fontSize='14px';}
        if(a==='readonly'){editor.contentEditable=editor.contentEditable==='false'?'true':'false';toast(editor.contentEditable==='true'?'Edition':'Lecture');}
        if(a==='shape'){document.execCommand('insertHTML',false,'<div style="width:80px;height:80px;background:#60cdff;border-radius:8px;margin:8px"></div>');}
        if(a==='textbox'){document.execCommand('insertHTML',false,'<div style="border:1px dashed #999;padding:12px;min-width:120px">Zone de texte</div>');}
        if(a==='bg4'){editor.style.background='linear-gradient(135deg,#f093fb,#f5576c)';editor.style.color='#fff';}
        if(a==='bg5'){editor.style.background='linear-gradient(135deg,#0ba360,#3cba92)';editor.style.color='#fff';}
        if(a==='tr1'){editor.style.transition='opacity .5s';editor.style.opacity='0.3';setTimeout(function(){editor.style.opacity='1';},300);toast('Transition fondu');}
        if(a==='tr2'){editor.style.transition='transform .4s';editor.style.transform='translateX(20px)';setTimeout(function(){editor.style.transform='none';},400);toast('Transition pousser');}
        if(a==='tr3'){editor.style.transition='none';toast('Sans transition');}
        if(a==='play'){toast('Diaporama démarré');editor.requestFullscreen&&editor.requestFullscreen();}

    };});
    if(id==='word'&&localStorage.getItem('w11_word'))editor.innerHTML=localStorage.getItem('w11_word');
    if(id==='powerpoint'&&localStorage.getItem('w11_ppt'))editor.innerHTML=localStorage.getItem('w11_ppt');
    editor.addEventListener('keydown',function(e){if(e.ctrlKey||e.metaKey){if(e.key==='b'){e.preventDefault();document.execCommand('bold');}if(e.key==='i'){e.preventDefault();document.execCommand('italic');}if(e.key==='u'){e.preventDefault();document.execCommand('underline');}if(e.key==='s'){e.preventDefault();localStorage.setItem(id==='word'?'w11_word':'w11_ppt',editor.innerHTML);toast('Sauve');}}});
  }
  if(id==='excel'){
    win.querySelectorAll('.ribbon span[data-tab]').forEach(function(span){
      span.onclick=function(){
        win.querySelectorAll('.ribbon span').forEach(function(s){s.classList.remove('on');});
        span.classList.add('on');
        win.querySelectorAll('.toolbar[data-panel]').forEach(function(tb){
          tb.style.display = tb.dataset.panel===span.dataset.tab ? 'flex' : 'none';
        });
      };
    });

    const sheet=win.querySelector('.sheet-wrap'),formula=win.querySelector('#formulaInput'),ref=win.querySelector('#cellRef');
    let active=null;
    sheet.querySelectorAll('td[contenteditable]').forEach(function(td){
      td.addEventListener('focus',function(){active=td;ref.textContent=td.dataset.cell;formula.value=td.textContent;});
      td.addEventListener('input',function(){if(active===td)formula.value=td.textContent;});
    });
    formula.addEventListener('keydown',function(e){
      if(e.key==='Enter'&&active){
        let v=formula.value.trim();
        if(v.charAt(0)==='='){
          try{
            const sm=v.match(/^=SUM\(([A-Z]+)(\d+):([A-Z]+)(\d+)\)$/i);
            if(sm){let sum=0;const c1=sm[1].toUpperCase().charCodeAt(0),c2=sm[3].toUpperCase().charCodeAt(0),r1=+sm[2],r2=+sm[4];for(let c=Math.min(c1,c2);c<=Math.max(c1,c2);c++)for(let r=Math.min(r1,r2);r<=Math.max(r1,r2);r++){const cell=sheet.querySelector('td[data-cell="'+String.fromCharCode(c)+r+'"]');sum+=parseFloat(cell&&cell.textContent)||0;}active.textContent=sum;}
            else{const expr=v.slice(1).replace(/([A-Z]+)(\d+)/gi,function(_,col,row){const cell=sheet.querySelector('td[data-cell="'+col.toUpperCase()+row+'"]');return parseFloat(cell&&cell.textContent)||0;});active.textContent=Function('"use strict";return('+expr+')')();}
          }catch(err){active.textContent='#ERR';}
        }else active.textContent=v;
        formula.value=active.textContent;
      }
    });
    win.querySelectorAll('[data-act]').forEach(function(btn){btn.onclick=function(){
      const a=btn.dataset.act;
      if(a==='bold'&&active)active.style.fontWeight=active.style.fontWeight==='bold'?'':'bold';
      if(a==='italic'&&active)active.style.fontStyle=active.style.fontStyle==='italic'?'':'italic';
      if(a==='sum'&&active){const m=active.dataset.cell.match(/([A-Z]+)(\d+)/);if(m){let sum=0;for(let r=1;r<+m[2];r++){const c=sheet.querySelector('td[data-cell="'+m[1]+r+'"]');sum+=parseFloat(c&&c.textContent)||0;}active.textContent=sum;formula.value=sum;}}
      if(a==='avg'&&active){const m=active.dataset.cell.match(/([A-Z]+)(\d+)/);if(m){let sum=0,n=0;for(let r=1;r<+m[2];r++){const c=sheet.querySelector('td[data-cell="'+m[1]+r+'"]');const v=parseFloat(c&&c.textContent);if(!isNaN(v)){sum+=v;n++;}}active.textContent=n?(sum/n).toFixed(2):0;formula.value=active.textContent;}}
      if(a==='clear-sheet'){sheet.querySelectorAll('td[contenteditable]').forEach(function(td){td.textContent='';td.style.cssText='';});toast('Efface');}
      if(a==='min'&&active){const m=active.dataset.cell.match(/([A-Z]+)(\d+)/);if(m){let mn=Infinity;for(let r=1;r<+m[2];r++){const c=sheet.querySelector('td[data-cell="'+m[1]+r+'"]');const v=parseFloat(c&&c.textContent);if(!isNaN(v))mn=Math.min(mn,v);}active.textContent=mn===Infinity?0:mn;}}
        if(a==='max'&&active){const m=active.dataset.cell.match(/([A-Z]+)(\d+)/);if(m){let mx=-Infinity;for(let r=1;r<+m[2];r++){const c=sheet.querySelector('td[data-cell="'+m[1]+r+'"]');const v=parseFloat(c&&c.textContent);if(!isNaN(v))mx=Math.max(mx,v);}active.textContent=mx===-Infinity?0:mx;}}
        if(a==='addrow')toast('Ligne');
        if(a==='addcol')toast('Colonne');
        if(a==='chart')toast('Graphique');
        if(a==='sort-asc')toast('Tri A-Z');
        if(a==='sort-desc')toast('Tri Z-A');
        if(a==='fill'&&active){const m=active.dataset.cell.match(/([A-Z]+)(\d+)/);if(m){for(let r=1;r<=10;r++){const c=sheet.querySelector('td[data-cell="'+m[1]+r+'"]');if(c)c.textContent=String(r);}}toast('Serie 1-10');}
        if(a==='freeze')toast('Volet fige');
        if(a==='save-sheet'){const data={};sheet.querySelectorAll('td[contenteditable]').forEach(function(td){if(td.textContent)data[td.dataset.cell]=td.textContent;});localStorage.setItem('w11_excel',JSON.stringify(data));toast('Sauve');}
    };});
    const ci=win.querySelector('[data-cellcolor]');if(ci)ci.oninput=function(){if(active)active.style.color=ci.value;};
    try{const data=JSON.parse(localStorage.getItem('w11_excel')||'{}');Object.keys(data).forEach(function(k){const td=sheet.querySelector('td[data-cell="'+k+'"]');if(td)td.textContent=data[k];});}catch(e){}
  }
  if(id==='powershell'||id==='terminal'){
    const out=win.querySelector('.term-out'),input=win.querySelector('.term-in');
    const isPS=id==='powershell';
    out.innerHTML=isPS?'Windows PowerShell<br/>Copyright (C) Microsoft Corporation.<br/><br/>':'Microsoft Windows [Version 10.0.26100.1]<br/>(c) Microsoft Corporation.<br/><br/>';
    input.focus();
    input.addEventListener('keydown',function(e){
      if(e.key!=='Enter')return;
      const cmd=input.value.trim();const line=document.createElement('div');
      line.textContent=(isPS?'PS C:\\> ':'C:\\> ')+cmd;out.appendChild(line);
      let r='';
      const c=cmd.toLowerCase();
      if(c==='help'||c==='get-help')r='Commandes: help, dir, ls, Get-Date, date, time, ver, cls, clear, echo, whoami, hostname, Get-Process, ipconfig';
      else if(c==='dir'||c==='ls'||c==='get-childitem')r='Documents  Telechargements  Images  Bureau  C:  T:';
      else if(c==='date'||c==='get-date')r=new Date().toLocaleString('fr-FR');
      else if(c==='time')r=new Date().toLocaleTimeString('fr-FR');
      else if(c==='ver'||c==='$psversiontable')r=VERSION;
      else if(c==='cls'||c==='clear'){out.innerHTML='';input.value='';return;}
      else if(c==='whoami')r=OWNER;
      else if(c==='hostname')r='WIN11-'+OWNER.split(' ')[0].toUpperCase();
      else if(c==='ipconfig')r='IPv4: 192.168.1.42\nPasserelle: 192.168.1.1';
      else if(c==='get-process')r='explorer  chrome  code  powershell  System';
      else if(c.indexOf('echo ')===0||c.indexOf('write-output ')===0)r=cmd.replace(/^(echo|write-output)\s+/i,'');
      else if(cmd)r='Commande non reconnue: '+cmd;
      if(r){const o=document.createElement('div');o.style.whiteSpace='pre-wrap';o.textContent=r;out.appendChild(o);}
      input.value='';out.parentElement.scrollTop=out.parentElement.scrollHeight;
    });
  }
  if(id==='ai'){
    const msgs=win.querySelector('#aiMsgs'),inp=win.querySelector('#aiIn'),send=win.querySelector('#aiSend');
    function reply(q){
      q=q.toLowerCase();
      if(q.indexOf('bonjour')>=0||q.indexOf('salut')>=0)return 'Bonjour ! Comment puis-je vous aider ?';
      if(q.indexOf('nom')>=0||q.indexOf('createur')>=0||q.indexOf('qui')>=0)return 'Ce launcher a ete cree par '+CREATOR+'.';
      if(q.indexOf('heure')>=0||q.indexOf('date')>=0)return 'Il est '+new Date().toLocaleString('fr-FR');
      if(q.indexOf('code')>=0||q.indexOf('vs code')>=0)return 'Ouvrez VS Code depuis le menu Demarrer pour ecrire du HTML, CSS, JS ou Python.';
      if(q.indexOf('aide')>=0||q.indexOf('help')>=0)return 'Je peux parler du systeme, de la date, du createur, ou des applications disponibles.';
      if(q.indexOf('merci')>=0)return 'Avec plaisir !';
      return 'Je suis une IA improvisée. Créateur: '+CREATOR+'. Version: '+VERSION+'. Tout est gratuit ! Posez une autre question !';
    }
    function go(){
      const q=inp.value.trim();if(!q)return;
      const u=document.createElement('div');u.className='ai-msg user';u.textContent=q;msgs.appendChild(u);
      inp.value='';
      setTimeout(function(){const b=document.createElement('div');b.className='ai-msg bot';b.textContent=reply(q);msgs.appendChild(b);msgs.scrollTop=msgs.scrollHeight;},400);
    }
    send.onclick=go;inp.addEventListener('keydown',function(e){if(e.key==='Enter')go();});
  }
  if(id==='settings'){
    const content=win.querySelector('#settingsContent');
    function notifPanel(){
      var s=notifSettings;
      return '<h2>Notifications</h2><p>Configurer les alertes et notifications push</p>'+
        '<div class="info-card">'+
        '<div class="toggle-row"><span>Notifications activées</span><button class="toggle '+(s.enabled?'on':'')+'" data-tog="enabled"></button></div>'+
        '<div class="toggle-row"><span>Sons de notification</span><button class="toggle '+(s.sound?'on':'')+'" data-tog="sound"></button></div>'+
        '<div class="toggle-row"><span>Notifications système</span><button class="toggle '+(s.system?'on':'')+'" data-tog="system"></button></div>'+
        '<div class="toggle-row"><span>Mises à jour logicielles</span><button class="toggle '+(s.updates?'on':'')+'" data-tog="updates"></button></div>'+
        '<div class="toggle-row"><span>Applications (Word, Excel…)</span><button class="toggle '+(s.apps?'on':'')+'" data-tog="apps"></button></div>'+
        '<div class="toggle-row"><span>Jeux</span><button class="toggle '+(s.games?'on':'')+'" data-tog="games"></button></div>'+
        '<div class="toggle-row"><span>Ne pas déranger</span><button class="toggle '+(s.dnd?'on':'')+'" data-tog="dnd"></button></div>'+
        '</div>'+
        '<div class="info-card"><h3>Test</h3><p>Envoyer une notification de test</p>'+
        '<button class="pay-btn" style="max-width:200px;margin-top:8px" id="testNotif">🔔 Tester notification</button></div>';
    }
    function versionsPanel(){
      var apps=[
        {ico:'🪟',name:'Windows 11 Pro Web',ver:'24H2',status:'ok',label:'À jour'},
        {ico:'📝',name:'Word',ver:'1.0.0',status:'ok',label:'À jour'},
        {ico:'📊',name:'Excel',ver:'1.0.0',status:'ok',label:'À jour'},
        {ico:'📽️',name:'PowerPoint',ver:'1.0.0',status:'ok',label:'À jour'},
        {ico:'💻',name:'VS Code Web',ver:'1.0.0',status:'update',label:'Mise à jour dispo'},
        {ico:'🌐',name:'Microsoft Edge',ver:'1.0.0',status:'ok',label:'À jour'},
        {ico:'🎨',name:'Paint',ver:'1.0.0',status:'ok',label:'À jour'},
        {ico:'🐍',name:'Snake',ver:'1.0.0',status:'ok',label:'À jour'}
      ];
      var html='<h2>Gestion des versions</h2><p>Logiciels installés — Créateur: Yoann Bonkoungou</p>';
      html+='<div class="info-card" style="border-color:#60cdff"><h3 style="color:#60cdff">🚀 Prochaine version système</h3><p><b>1.0.1</b> — arrivera bientôt de la part de <b>Yoann Bonkoungou</b></p><p style="color:var(--muted);font-size:11px">Nouvelles fonctionnalités, corrections et améliorations.</p><button class="ver-btn" id="checkUpdates" style="margin-top:8px">Vérifier les mises à jour</button></div>';
      apps.forEach(function(a){
        html+='<div class="ver-item"><span class="ver-ico">'+a.ico+'</span><div class="ver-info"><div class="ver-name">'+a.name+'</div><div class="ver-status '+a.status+'">v'+a.ver+' · '+a.label+'</div></div>'+(a.status==='update'?'<button class="ver-btn" data-upd="'+a.name+'">Mettre à jour</button>':'')+'</div>';
      });
      html+='<div class="info-card" style="margin-top:10px"><h3>Historique des versions</h3><p style="font-size:11px;color:var(--muted)">24H2 (actuelle) · Créée par Yoann Bonkoungou<br/>1.0.1 (à venir) · Mise à jour majeure prévue</p></div>';
      return html;
    }
    var panels={
      system:'<h2>'+t('system')+'</h2><div class="info-card"><h3>Affichage</h3><p>Résolution adaptative</p></div><div class="info-card"><h3>Son</h3><p>Volume système</p></div>',
      perso:'<h2>'+t('perso')+'</h2><p>'+t('wallpaper')+' — 18</p><div class="info-card"><div class="wp-grid" style="grid-template-columns:repeat(6,1fr)"><div class="wp-opt" style="background:linear-gradient(135deg,#050510,#1a6b5a)" onclick="setWallpaper(0)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#0a0515,#ff0096)" onclick="setWallpaper(1)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#1a0505,#ff4400)" onclick="setWallpaper(2)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#021018,#00aaff)" onclick="setWallpaper(3)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#03010a,#7828ff)" onclick="setWallpaper(4)"></div><div class="wp-opt" style="background:linear-gradient(180deg,#1a0a2e,#f5a623)" onclick="setWallpaper(5)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#001a12,#00ff88)" onclick="setWallpaper(6)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#0a0a0a,#444)" onclick="setWallpaper(7)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#100818,#ff00aa)" onclick="setWallpaper(8)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#061020,#88ccff)" onclick="setWallpaper(9)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#0f0c29,#302b63)" onclick="setWallpaper(10)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#1a0000,#ff2200)" onclick="setWallpaper(11)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#001a1a,#00ffcc)" onclick="setWallpaper(12)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#120a00,#ffaa00)" onclick="setWallpaper(13)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#0a0015,#aa66ff)" onclick="setWallpaper(14)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#001008,#00ff66)" onclick="setWallpaper(15)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#1a0533,#0d1b4a)" onclick="setWallpaper(16)"></div><div class="wp-opt" style="background:linear-gradient(135deg,#0c1445,#ffeaa0)" onclick="setWallpaper(17)"></div></div></div><div class="info-card"><h3>'+t('lang')+'</h3><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'fr\')">Français</button><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'en\')">English</button><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'de\')">Deutsch</button><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'es\')">Español</button><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'ru\')">Русский</button><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'pt\')">Português</button><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'it\')">Italiano</button><button class="pay-btn" style="width:auto;padding:6px 10px;font-size:11px" onclick="setLang(\'ar\')">العربية</button></div></div>',
      notif:notifPanel(),
      versions:versionsPanel(),
      time:'<h2>'+t('time')+'</h2><div class="info-card"><h3>Date</h3><p id="setTime"></p></div>',
      about:'<h2>'+t('about')+'</h2><div class="info-card"><h3>Windows 11 Pro</h3><p><b>'+t('version')+'</b> '+VERSION+'</p><p style="color:#22c55e"><b>✓ Version gratuite</b> — toutes les apps débloquées</p><p><b>'+t('owner')+'</b> '+OWNER+'</p><p><b>'+t('creator')+'</b> '+CREATOR+'</p><p>Telecel '+TELECEL+'</p></div><div class="info-card" style="border-color:#60cdff"><h3 style="color:#60cdff">🚀 Mise à jour à venir</h3><p>Une nouvelle version arrivera bientôt de la part de <b>Yoann Bonkoungou</b>.</p><p style="color:var(--muted);font-size:11px;margin-top:6px">Restez connectés pour découvrir les prochaines fonctionnalités.</p></div>',
      sub:'<h2>'+t('sub')+'</h2><div class="info-card"><p style="color:#22c55e">✓ Gratuit — aucune restriction</p><p style="font-size:12px;color:var(--muted);margin:8px 0">Toutes les applications sont disponibles gratuitement.</p></div>'
    };
    function bindSettingsPanel(panel){
      content.querySelectorAll('.toggle[data-tog]').forEach(function(btn){
        btn.onclick=function(){
          var key=btn.dataset.tog;
          notifSettings[key]=!notifSettings[key];
          btn.classList.toggle('on',notifSettings[key]);
          try{localStorage.setItem('w11_notif',JSON.stringify(notifSettings));}catch(e){}
          toast(key+(notifSettings[key]?' activé':' désactivé'));
        };
      });
      var tn=content.querySelector('#testNotif');
      if(tn)tn.onclick=function(){pushNotif('Test','Notification de test — Yoann Bonkoungou','system');};
      var cu=content.querySelector('#checkUpdates');
      if(cu)cu.onclick=function(){
        toast('Vérification…');
        setTimeout(function(){
          pushNotif('Mises à jour','Système à jour. Version 1.0.1 bientôt disponible — Yoann Bonkoungou','updates');
          toast('Aucune mise à jour critique. 1.0.1 arrive bientôt !');
        },800);
      };
      content.querySelectorAll('[data-upd]').forEach(function(btn){
        btn.onclick=function(){
          var n=btn.dataset.upd;
          toast('Mise à jour de '+n+'…');
          setTimeout(function(){
            btn.textContent='À jour';
            btn.disabled=true;
            pushNotif('Mise à jour',n+' mis à jour avec succès','updates');
            toast(n+' · à jour ✓');
          },1000);
        };
      });
    }
    content.innerHTML=panels.system;
    win.querySelectorAll('.settings-nav .item').forEach(function(item){
      item.onclick=function(){
        win.querySelectorAll('.settings-nav .item').forEach(function(x){x.classList.remove('active');});
        item.classList.add('active');
        var p=item.dataset.panel;
        if(p==='notif')content.innerHTML=notifPanel();
        else if(p==='versions')content.innerHTML=versionsPanel();
        else content.innerHTML=panels[p]||panels.system;
        if(p==='time'){const el=content.querySelector('#setTime');if(el)el.textContent=new Date().toLocaleString('fr-FR');}
        bindSettingsPanel(p);
      };
    });
  }
  if(id==='snake'){
    const c=win.querySelector('#snakeCv'),x=c.getContext('2d');
    let snake=[{x:10,y:10}],dir={x:1,y:0},food={x:15,y:15},score=0,loop=null,cell=18;
    function draw(){x.fillStyle='#0a0a12';x.fillRect(0,0,360,360);x.fillStyle='#22c55e';snake.forEach(function(s){x.fillRect(s.x*cell,s.y*cell,cell-1,cell-1);});x.fillStyle='#ef4444';x.fillRect(food.x*cell,food.y*cell,cell-1,cell-1);}
    function tick(){
      const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
      if(h.x<0||h.x>=20||h.y<0||h.y>=20||snake.some(function(s){return s.x===h.x&&s.y===h.y;})){clearInterval(loop);loop=null;toast('Game Over: '+score);return;}
      snake.unshift(h);
      if(h.x===food.x&&h.y===food.y){score++;document.getElementById('snakeScore').textContent=score;food={x:(Math.random()*20)|0,y:(Math.random()*20)|0};}
      else snake.pop();
      draw();
    }
    win.querySelector('#snakeStart').onclick=function(){if(loop)clearInterval(loop);snake=[{x:10,y:10}];dir={x:1,y:0};score=0;document.getElementById('snakeScore').textContent=0;loop=setInterval(tick,120);};
    const kd=function(e){if(e.key==='ArrowUp'&&dir.y===0)dir={x:0,y:-1};if(e.key==='ArrowDown'&&dir.y===0)dir={x:0,y:1};if(e.key==='ArrowLeft'&&dir.x===0)dir={x:-1,y:0};if(e.key==='ArrowRight'&&dir.x===0)dir={x:1,y:0};};
    addEventListener('keydown',kd);draw();
  }
  if(id==='minecraft'){
    const c=win.querySelector('#mcCv'),x=c.getContext('2d');
    const cols=['#5a8f3c','#8b5a2b','#888','#3b82f6'];let col=0;const grid=[];
    for(let i=0;i<20;i++){grid[i]=[];for(let j=0;j<16;j++)grid[i][j]=j>12?1:(j>10&&Math.random()>.7?0:-1);}
    function draw(){const cw=20,ch=20;for(let i=0;i<20;i++)for(let j=0;j<16;j++){if(grid[i][j]<0){x.fillStyle='#87ceeb';}else x.fillStyle=cols[grid[i][j]]||'#333';x.fillRect(i*cw,j*ch,cw,ch);x.strokeStyle='rgba(0,0,0,.15)';x.strokeRect(i*cw,j*ch,cw,ch);}}
    c.onclick=function(e){const r=c.getBoundingClientRect();const i=((e.clientX-r.left)/20)|0,j=((e.clientY-r.top)/20)|0;if(i>=0&&i<20&&j>=0&&j<16){if(grid[i][j]>=0)grid[i][j]=-1;else grid[i][j]=col;draw();}};
    addEventListener('keydown',function(e){if(e.key>='1'&&e.key<='4')col=+e.key-1;});
    draw();
  }
  if(id==='calc'){
    let val='0',op=null,prev=null;const disp=win.querySelector('#calcDisplay');
    win.querySelectorAll('[data-calc]').forEach(function(btn){btn.onclick=function(){
      const k=btn.dataset.calc;
      if(k==='C'){val='0';op=null;prev=null;}
      else if(k==='±')val=String(-parseFloat(val));
      else if(k==='%')val=String(parseFloat(val)/100);
      else if('÷×−+'.indexOf(k)>=0){prev=parseFloat(val);op=k;val='0';}
      else if(k==='='){if(op!=null&&prev!=null){const b=parseFloat(val);if(op==='+')val=String(prev+b);if(op==='−')val=String(prev-b);if(op==='×')val=String(prev*b);if(op==='÷')val=b?String(prev/b):'Err';op=null;prev=null;}}
      else if(k==='.'){if(val.indexOf('.')<0)val+='.';}
      else val=val==='0'?k:val+k;
      disp.textContent=val;
    };});
  }
  if(id==='tictactoe'){
    const board=win.querySelector('#tttBoard'),status=win.querySelector('#tttStatus');
    let cells=Array(9).fill(''),turn='X',over=false;
    function render(){
      board.innerHTML='';
      cells.forEach(function(v,i){
        const c=document.createElement('div');c.className='ttt-cell';c.textContent=v;
        c.onclick=function(){
          if(over||cells[i])return;
          cells[i]=turn;
          if(checkWin(turn)){status.textContent=turn+' gagne !';over=true;}
          else if(cells.every(Boolean)){status.textContent='Match nul';over=true;}
          else{turn=turn==='X'?'O':'X';status.textContent='Tour de '+turn;}
          render();
        };
        board.appendChild(c);
      });
    }
    function checkWin(p){
      const w=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
      return w.some(function(l){return l.every(function(i){return cells[i]===p;});});
    }
    win.querySelector('#tttReset').onclick=function(){cells=Array(9).fill('');turn='X';over=false;status.textContent='Tour de X';render();};
    render();
  }
  if(id==='memory'){
    const grid=win.querySelector('#memGrid'),movesEl=win.querySelector('#memMoves'),pairsEl=win.querySelector('#memPairs');
    const symbols=['🍎','🍌','🍇','🍊','🍓','🍉','🍒','🥝'];
    let cards=[],flipped=[],moves=0,pairs=0,lock=false;
    function shuffle(){
      cards=symbols.concat(symbols).sort(function(){return Math.random()-.5;}).map(function(s,i){return {s:s,id:i,matched:false};});
      moves=0;pairs=0;flipped=[];lock=false;
      movesEl.textContent=0;pairsEl.textContent=0;
      render();
    }
    function render(){
      grid.innerHTML='';
      cards.forEach(function(c,i){
        const el=document.createElement('div');
        el.className='mem-card'+(c.matched||flipped.indexOf(i)>=0?' flipped':'');
        el.textContent=(c.matched||flipped.indexOf(i)>=0)?c.s:'❓';
        el.onclick=function(){
          if(lock||c.matched||flipped.indexOf(i)>=0||flipped.length>=2)return;
          flipped.push(i);render();
          if(flipped.length===2){
            moves++;movesEl.textContent=moves;lock=true;
            const a=cards[flipped[0]],b=cards[flipped[1]];
            if(a.s===b.s){a.matched=b.matched=true;pairs++;pairsEl.textContent=pairs;flipped=[];lock=false;if(pairs===8)toast('Bravo ! Terminé en '+moves+' coups');}
            else setTimeout(function(){flipped=[];lock=false;render();},700);
          }
        };
        grid.appendChild(el);
      });
    }
    win.querySelector('#memReset').onclick=shuffle;
    shuffle();
  }
  if(id==='paint'){
    const cv=win.querySelector('#paintCv'),ctx=cv.getContext('2d');
    let drawing=false,mode='pen',color='#000',size=4;
    ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);
    function pos(e){const r=cv.getBoundingClientRect();const sx=cv.width/r.width,sy=cv.height/r.height;const t=e.touches?e.touches[0]:e;return {x:(t.clientX-r.left)*sx,y:(t.clientY-r.top)*sy};}
    cv.onmousedown=cv.ontouchstart=function(e){e.preventDefault();drawing=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);};
    cv.onmousemove=cv.ontouchmove=function(e){if(!drawing)return;e.preventDefault();const p=pos(e);ctx.lineWidth=size;ctx.lineCap='round';ctx.strokeStyle=mode==='eraser'?'#fff':color;ctx.lineTo(p.x,p.y);ctx.stroke();ctx.beginPath();ctx.moveTo(p.x,p.y);};
    cv.onmouseup=cv.onmouseleave=cv.ontouchend=function(){drawing=false;};
    win.querySelector('#paintColor').oninput=function(){color=this.value;mode='pen';};
    win.querySelector('#paintSize').oninput=function(){size=+this.value;};
    win.querySelectorAll('[data-paint]').forEach(function(btn){
      btn.onclick=function(){
        const a=btn.dataset.paint;
        if(a==='pen')mode='pen';
        if(a==='eraser')mode='eraser';
        if(a==='clear'){ctx.fillStyle='#fff';ctx.fillRect(0,0,cv.width,cv.height);toast('Canvas effacé');}
        if(a==='save'){const a=document.createElement('a');a.download='paint.png';a.href=cv.toDataURL();a.click();toast('Image sauvegardée');}
      };
    });
  }
  if(id==='pong'){
    const c=win.querySelector('#pongCv'),x=c.getContext('2d');
    let paddle={y:130,h:60,w:10},ball={x:240,y:160,vx:3,vy:2,r:7},score=0,loop=null,paused=false;
    function draw(){
      x.fillStyle='#0a0a12';x.fillRect(0,0,480,320);
      x.fillStyle='#60cdff';x.fillRect(10,paddle.y,paddle.w,paddle.h);
      x.fillStyle='#fff';x.beginPath();x.arc(ball.x,ball.y,ball.r,0,6.28);x.fill();
      x.fillStyle='#333';for(let y=0;y<320;y+=20)x.fillRect(238,y,4,10);
    }
    function tick(){
      if(paused)return;
      ball.x+=ball.vx;ball.y+=ball.vy;
      if(ball.y<ball.r||ball.y>320-ball.r)ball.vy*=-1;
      if(ball.x-ball.r<20&&ball.y>paddle.y&&ball.y<paddle.y+paddle.h){ball.vx=Math.abs(ball.vx)+0.2;ball.vy+=(Math.random()-.5)*2;score++;document.getElementById('pongScore').textContent=score;}
      if(ball.x>480){ball.x=240;ball.y=160;ball.vx=3;ball.vy=2;score=0;document.getElementById('pongScore').textContent=0;toast('Perdu !');}
      if(ball.x<0){ball.vx=Math.abs(ball.vx);}
      draw();
    }
    win.querySelector('#pongStart').onclick=function(){
      if(loop)clearInterval(loop);
      ball={x:240,y:160,vx:3,vy:2,r:7};score=0;document.getElementById('pongScore').textContent=0;paused=false;
      loop=setInterval(tick,16);
    };
    const kd=function(e){
      if(e.key==='ArrowUp')paddle.y=Math.max(0,paddle.y-18);
      if(e.key==='ArrowDown')paddle.y=Math.min(260,paddle.y+18);
      if(e.key===' '){paused=!paused;e.preventDefault();}
    };
    addEventListener('keydown',kd);
    draw();
  }
}

function showPaywall(){document.getElementById('paywall').classList.remove('hidden');}
function hidePaywall(){document.getElementById('paywall').classList.add('hidden');}
document.querySelectorAll('.plan').forEach(function(p){p.onclick=function(){document.querySelectorAll('.plan').forEach(function(x){x.classList.remove('selected');});p.classList.add('selected');};});
document.getElementById('paySkip').onclick=function(){hidePaywall();};
document.getElementById('payConfirm').onclick=function(){hidePaywall();toast('Version gratuite — profitez !');};
function toast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(function(){t.classList.remove('show');},2500);}
document.getElementById('notifBtn').onclick=function(e){e.stopPropagation();toggleNotifCenter();};
document.getElementById('notifClear').onclick=function(){notifList=[];renderNotifs();toast('Notifications effacées');};
document.addEventListener('click',function(e){
  if(notifOpen&&!e.target.closest('#notifCenter')&&!e.target.closest('#notifBtn')){notifOpen=false;document.getElementById('notifCenter').classList.remove('open');}
});

function startOS(){
  try {
    var b=document.getElementById('boot');
    if(b) b.classList.add('hide');
    renderDesktop();
    renderStart();
    toast('Bienvenue — Gratuit · Yoann Bonkoungou');
    setTimeout(function(){
      pushNotif('Bienvenue','Windows 11 Pro Web · Version gratuite — Yoann Bonkoungou','system');
    },1200);
    setTimeout(function(){
      pushNotif('Mise à jour','Une nouvelle version arrivera bientôt de la part de Yoann Bonkoungou','updates');
      toast('🚀 Une mise à jour arrivera bientôt de la part de Yoann Bonkoungou');
    },3500);
  } catch(err) {
    console.error(err);
    var b=document.getElementById('boot');
    if(b) b.classList.add('hide');
    var d=document.getElementById('desktop');
    if(d) d.innerHTML='<div style="color:#fff;padding:24px;font-size:16px"><b>Windows 11</b><br/>Créateur: Yoann Bonkoungou<br/><br/>Erreur: '+err.message+'<br/><button onclick="location.reload()" style="margin-top:12px;padding:8px 16px;cursor:pointer">Recharger</button></div>';
  }
}
// Démarrage rapide
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){setTimeout(startOS,500);});
}else{
  setTimeout(startOS,500);
}
// Secours 1
setTimeout(function(){
  var b=document.getElementById('boot');
  if(b) b.classList.add('hide');
  var d=document.getElementById('desktop');
  if(d && !d.children.length){try{renderDesktop();renderStart();}catch(e){}}
}, 1500);
// Secours 2
setTimeout(function(){
  var b=document.getElementById('boot');
  if(b){b.style.display='none';b.classList.add('hide');}
  var d=document.getElementById('desktop');
  if(d && !d.children.length){
    d.innerHTML='<div class="desk-icon" onclick="openApp(\'explorer\')"><span class="ico">💻</span>Ce PC</div><div class="desk-icon" onclick="openApp(\'settings\')"><span class="ico">⚙️</span>Paramètres</div>';
  }
}, 2500);
document.addEventListener('contextmenu',function(e){e.preventDefault();});
