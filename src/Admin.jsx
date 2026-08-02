import { supabase } from './supabase'
import Logo from './Logo'
import { useState, useEffect } from 'react'

const NAVY="#0B2545",GOLD="#C8A046",CREAM="#F8F5ED",GOLD_LIGHT="#F5EDD6";
const ADMIN_EMAIL="admin@jurijob.ma";

const DIPLOMES_CAND_LABELS={bac:"Bac",deug:"DEUG",licence:"Licence",licence_bac4:"Licence (Bac+4, ancien système)",master1:"Master I",master2:"Master II",barreau:"CAPA",doctorat:"Doctorat",autre:"Autre"};
const NIVEAUX_LABELS={stagiaire:"Stagiaire",junior:"Junior",confirme:"Confirmé",senior:"Senior",directeur:"Directeur juridique"};

const SPECS=[
  {cat:"Droit des entreprises",items:["Droit des sociétés","Droit commercial","Droit des contrats","Droit fiscal","Droit social / RH","Droit bancaire & financier","Droit de la propriété intellectuelle","Droit de la concurrence","Compliance & conformité","Droit numérique & IT","Droit des données personnelles","Droit des assurances","Droit des procédures collectives","Droit des sûretés","Droit boursier & marchés financiers","Finance islamique / Banque participative","Droit des télécommunications","Droit de la sécurité sociale"]},
  {cat:"Droit du contentieux",items:["Droit pénal des affaires","Droit pénal général","Arbitrage & MARD","Droit de l'exécution forcée","Recouvrement de créances","Droit administratif","Droit public"]},
  {cat:"Droit notarial & immobilier",items:["Droit notarial","Droit immobilier","Droit de l'urbanisme","Droit de la famille","Droit des successions"]},
  {cat:"Droit sectoriel",items:["Droit de l'énergie","Droit minier","Droit des transports & logistique","Droit de la santé & bioéthique","Droit rural & agricole","Droit du tourisme & de l'hôtellerie"]},
  {cat:"Droit international & spécialisé",items:["Droit international des affaires","Droit OHADA","Droit du sport","Droit maritime","Droit de l'environnement","Droit de la consommation","Droit humanitaire","Droit du travail international & mobilité"]},
];

/* Détecte les écrans étroits (mobile) pour adapter les styles inline.
   ⚠️ Copie conforme du hook défini dans App.jsx — toute modification doit
   être répercutée dans les deux fichiers (ou le hook extrait dans un
   fichier partagé useIsMobile.js). */
function useIsMobile(breakpoint=768){
  const [isMobile,setIsMobile]=useState(typeof window!=="undefined"?window.innerWidth<=breakpoint:false);
  useEffect(()=>{
    const onResize=()=>setIsMobile(window.innerWidth<=breakpoint);
    window.addEventListener("resize",onResize);
    onResize();
    return ()=>window.removeEventListener("resize",onResize);
  },[breakpoint]);
  return isMobile;
}

// Durée d'une expérience — même logique que calcDuree d'App.jsx (format MM/AAAA) ; renvoie "" si dates illisibles
function calcDuree(debut,fin,encours){
  if(!debut) return "";
  const p=s=>{const a=(s||"").split("/");return a.length===2?{m:parseInt(a[0],10),y:parseInt(a[1],10)}:null;};
  const d=p(debut); if(!d||!d.y) return "";
  let fObj;
  if(encours||!fin){ const n=new Date(); fObj={m:n.getMonth()+1,y:n.getFullYear()}; }
  else { fObj=p(fin); if(!fObj||!fObj.y) return ""; }
  let mois=(fObj.y-d.y)*12+(fObj.m-d.m);
  if(mois<0) return "";
  const ans=Math.floor(mois/12); mois=mois%12;
  if(ans>0&&mois>0) return `${ans} an${ans>1?"s":""} ${mois} mois`;
  if(ans>0) return `${ans} an${ans>1?"s":""}`;
  if(mois>0) return `${mois} mois`;
  return "< 1 mois";
}

// Tri antichronologique pour l'affichage : expériences (en cours d'abord, puis début décroissant), formations (année décroissante)
const moisAbs=s=>{const a=(s||"").split("/");return a.length===2?(parseInt(a[1],10)||0)*12+(parseInt(a[0],10)||0):0;};
const triExp=list=>[...(list||[])].sort((a,b)=>(!!b.encours-!!a.encours)||(moisAbs(b.debut)-moisAbs(a.debut)));
const triFo=list=>[...(list||[])].sort((a,b)=>((parseInt(b.annee,10)||0)-(parseInt(a.annee,10)||0)));

const NIV_ORDER=["stagiaire","junior","confirme","senior","directeur"];
// Rangs explicites (et non plus un simple tableau indexOf) pour permettre à deux diplômes
// d'être à égalité de niveau — ex. "licence_bac4" (ancien système, avant la réforme LMD)
// est reconnu comme équivalent à "master1".
const DIPL_RANK={bac:0,deug:1,licence:2,licence_bac4:3,master1:3,master2:4,barreau:5,notariat:6,doctorat:7};

// Normalise un nom de lieu avant comparaison : la ville est saisie en partie librement
// (option « Autre… »), donc casse, accents et espaces multiples doivent être neutralisés.
const normLieu=s=>(s||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/\s+/g," ");

// Bassins d'emploi : villes traitées comme un même marché du travail, pour ne pas
// pénaliser un candidat de Salé sur un poste à Rabat. Toute ville absente de cette
// table constitue son propre bassin. Retirer une ville = retirer une entrée.
const BASSINS=[
  {nom:"Casablanca",villes:["Casablanca","Mohammedia","Berrechid"]},
  {nom:"Rabat",villes:["Rabat","Salé","Témara","Kénitra"]},
  {nom:"Fès-Meknès",villes:["Fès","Meknès"]},
  {nom:"Tanger-Tétouan",villes:["Tanger","Tétouan"]},
  {nom:"Marseille",villes:["Marseille","Aix-en-Provence"]},
];
const BASSIN_INDEX={};
BASSINS.forEach(b=>b.villes.forEach(v=>{BASSIN_INDEX[normLieu(v)]=b.nom;}));
const bassinDe=ville=>{const n=normLieu(ville); return n?(BASSIN_INDEX[n]||n):"";};

// ── Barème : Spécialisations 35 · Langues 25 · Niveau 20 · Diplôme 10 · Géographie 10 ──
// Règle commune aux cinq dimensions :
//   • critère non renseigné côté DEMANDE  → dimension neutralisée (points pleins)
//   • donnée absente côté CANDIDAT        → 0 point
function scoreCandidat(c,d){
  let score=0; const details={};

  // ── Spécialisations (35) ──
  const specMatch=d.specs?d.specs.filter(s=>c.specs&&c.specs.includes(s)):[];
  const specScore=d.specs&&d.specs.length>0?Math.round((specMatch.length/d.specs.length)*35):35;
  score+=specScore;
  details.specs={score:specScore,max:35,matched:specMatch,total:d.specs?d.specs.length:0};

  // ── Langues (25) — le niveau déclaré n'est pas pris en compte, seule la présence compte ──
  const candLangs=(c.langues||[]).map(l=>typeof l==="string"?l:(l&&l.langue)).filter(Boolean);
  const langMatch=d.langues?d.langues.filter(l=>candLangs.includes(l)):[];
  const langScore=d.langues&&d.langues.length>0?Math.round((langMatch.length/d.langues.length)*25):25;
  score+=langScore;
  details.langues={score:langScore,max:25,matched:langMatch,total:d.langues?d.langues.length:0};

  // ── Niveau d'expérience (20) ──
  // indexOf renvoie -1 quand la valeur est absente : ce cas est désormais traité
  // explicitement, sinon un candidat sans niveau récupérait des points indus.
  const ci=NIV_ORDER.indexOf(c.niveau),di=NIV_ORDER.indexOf(d.niveau);
  let niveauScore=0;
  if(di===-1) niveauScore=20;              // demande sans niveau → neutralisé
  else if(ci===-1) niveauScore=0;          // candidat sans niveau → 0
  else if(ci===di) niveauScore=20;
  else if(ci>di) niveauScore=14;
  else if(di-ci===1) niveauScore=10;
  score+=niveauScore;
  details.niveau={score:niveauScore,max:20};

  // ── Diplôme (10) ──
  const cdi=DIPL_RANK[c.diplome],ddi=DIPL_RANK[d.diplome];
  let diplomeScore=0;
  if(d.diplome==="indifferent"||!d.diplome||ddi===undefined) diplomeScore=10;
  else if(cdi===undefined) diplomeScore=0; // diplôme candidat absent ou hors barème (« autre »)
  else if(cdi>=ddi) diplomeScore=10;
  else if(ddi-cdi===1) diplomeScore=5;
  score+=diplomeScore;
  details.diplome={score:diplomeScore,max:10};

  // ── Géographie (10) ──
  const demPays=(d.pays||"").trim(), demVille=(d.ville||"").trim();
  const candPays=(c.pays||"").trim();
  let geoScore=0, geoNote="";
  if((d.modalite||"")==="Télétravail"){ geoScore=10; geoNote="télétravail"; }
  else if(!demPays){ geoScore=10; geoNote="lieu non précisé"; }
  else if(!candPays){ geoScore=0; geoNote="pays absent"; }
  else if(normLieu(candPays)!==normLieu(demPays)){ geoScore=0; geoNote="pays différent"; }
  else if(!demVille){ geoScore=10; geoNote="même pays"; }
  else if(bassinDe(c.ville)&&bassinDe(c.ville)===bassinDe(demVille)){ geoScore=10; geoNote="même bassin"; }
  else { geoScore=5; geoNote="même pays"; }
  score+=geoScore;
  details.geo={score:geoScore,max:10,note:geoNote};

  return{score,details};
}

function scoreColor(s){
  if(s>=80) return{bg:"#F0FDF4",color:"#166534",label:"Excellent"};
  if(s>=60) return{bg:"#EFF6FF",color:"#1D4ED8",label:"Bon"};
  if(s>=40) return{bg:GOLD_LIGHT,color:"#92400E",label:"Partiel"};
  return{bg:"#F1F5F9",color:"#64748B",label:"Faible"};
}

const URGENCE_STYLE={immediat:{bg:"#FEE2E2",color:"#991B1B",label:"Immédiat"},urgent:{bg:"#FEF3C7",color:"#92400E",label:"Urgent"},normal:{bg:"#E1F5EE",color:"#0F6E56",label:"Normal"}};
const STATUT_D={en_cours:{bg:"#EFF6FF",color:"#1D4ED8",label:"En cours"},terminee:{bg:"#F0FDF4",color:"#166534",label:"Terminée"},annulee:{bg:"#F1F5F9",color:"#64748B",label:"Annulée"}};
const STATUT_C={valide:{bg:"#F0FDF4",color:"#166534",label:"Validé"},en_attente:{bg:GOLD_LIGHT,color:"#92400E",label:"En attente"},refuse:{bg:"#FEF2F2",color:"#991B1B",label:"Refusé"}};

const Badge=({bg,color,label})=><span style={{background:bg,color,fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,whiteSpace:"nowrap"}}>{label}</span>;

const Avatar=({prenom,nom,size=36})=>{
  const palettes=[GOLD_LIGHT,"#EFF6FF","#F0FDF4","#FDF4FF","#FFF7ED"];
  const h=((prenom||"")+(nom||"")).split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  return <div style={{width:size,height:size,borderRadius:"50%",background:palettes[h%palettes.length],display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.32,fontWeight:600,color:NAVY,flexShrink:0}}>{(prenom||"?")[0]}{(nom||"")[0]}</div>;
};

const ScoreRing=({score})=>{
  const{bg,color}=scoreColor(score);
  return(
    <div style={{width:48,height:48,borderRadius:"50%",background:bg,border:`2.5px solid ${color}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:14,fontWeight:700,color,lineHeight:1}}>{score}</span>
      <span style={{fontSize:9,color,opacity:.8}}>/100</span>
    </div>
  );
};

const ScoreBar=({label,score,max,note})=>(
  <div style={{marginBottom:6}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:2}}>
      <span style={{fontSize:11,color:"#718096"}}>{label}</span>
      <span style={{fontSize:11,fontWeight:500,color:NAVY,whiteSpace:"nowrap"}}>{score}/{max}{note&&<span style={{color:"#A0AEC0",marginLeft:4}}>{note}</span>}</span>
    </div>
    <div style={{height:4,background:"#E2E8F0",borderRadius:2,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${(score/max)*100}%`,background:score===max?GOLD:score>max*.6?"#60A5FA":"#CBD5E0",borderRadius:2}}/>
    </div>
  </div>
);

// Barre horizontale simple — répartition géographique
const GeoBar=({label,value,max})=>(
  <div style={{marginBottom:8}}>
    <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}>
      <span style={{fontSize:12,color:"#4A5568"}}>{label}</span>
      <span style={{fontSize:12,fontWeight:500,color:NAVY}}>{value}</span>
    </div>
    <div style={{height:8,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${max>0?(value/max)*100:0}%`,background:NAVY,borderRadius:4}}/>
    </div>
  </div>
);

// Donut SVG sans dépendance — répartition géographique
const DONUT_COLORS=[NAVY,GOLD,"#5F6C7B","#9E8F5C","#8FA3BF","#D3D1C7"];
const GeoDonut=({data})=>{
  const total=data.reduce((s,[,v])=>s+v,0);
  if(total===0) return null;
  const R=54,C=2*Math.PI*R;
  let acc=0;
  const segs=data.map(([label,value],i)=>{
    const frac=value/total;
    const seg={label,value,frac,offset:acc,color:DONUT_COLORS[i%DONUT_COLORS.length]};
    acc+=frac;
    return seg;
  });
  return(
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:18,flexWrap:"wrap"}}>
      <svg width="132" height="132" viewBox="0 0 132 132" style={{flexShrink:0}}>
        <circle cx="66" cy="66" r={R} fill="none" stroke="#E2E8F0" strokeWidth="16"/>
        {segs.map((s,i)=>(
          <circle key={i} cx="66" cy="66" r={R} fill="none" stroke={s.color} strokeWidth="16"
            strokeDasharray={`${Math.max(s.frac*C-1.5,0)} ${C}`}
            strokeDashoffset={-s.offset*C}
            transform="rotate(-90 66 66)"/>
        ))}
        <text x="66" y="62" textAnchor="middle" style={{fontSize:22,fontWeight:600,fill:NAVY}}>{total}</text>
        <text x="66" y="80" textAnchor="middle" style={{fontSize:10,fill:"#A0AEC0"}}>profils</text>
      </svg>
      <div style={{flex:1,minWidth:140}}>
        {segs.map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:7,marginBottom:5}}>
            <span style={{width:10,height:10,borderRadius:3,background:s.color,flexShrink:0}}/>
            <span style={{fontSize:12,color:"#4A5568",flex:1,minWidth:0}}>{s.label}</span>
            <span style={{fontSize:12,fontWeight:500,color:NAVY}}>{s.value}</span>
            <span style={{fontSize:11,color:"#A0AEC0",width:36,textAlign:"right"}}>{Math.round(s.frac*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Double barre demande/offre + badge pénurie/excédent — écart par spécialisation
const GapBar=({spec,demande,offre,gap,max})=>{
  const penurie=gap>0, excedent=gap<0;
  const color=penurie?"#991B1B":excedent?"#166534":"#64748B";
  const bg=penurie?"#FEF2F2":excedent?"#F0FDF4":"#F1F5F9";
  const label=penurie?`Pénurie de ${gap}`:excedent?`Excédent de ${-gap}`:"Équilibré";
  return(
    <div style={{marginBottom:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
        <span style={{fontSize:12,color:"#4A5568"}}>{spec}</span>
        <Badge bg={bg} color={color} label={label}/>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:2}}>
        <span style={{fontSize:10,color:"#A0AEC0",width:56,flexShrink:0}}>Demande {demande}</span>
        <div style={{flex:1,height:6,background:"#E2E8F0",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${max>0?(demande/max)*100:0}%`,background:GOLD,borderRadius:3}}/></div>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center"}}>
        <span style={{fontSize:10,color:"#A0AEC0",width:56,flexShrink:0}}>Offre {offre}</span>
        <div style={{flex:1,height:6,background:"#E2E8F0",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",width:`${max>0?(offre/max)*100:0}%`,background:NAVY,borderRadius:3}}/></div>
      </div>
    </div>
  );
};

// Carte de synthèse (KPI) du tableau de bord
const KpiCard=({label,value,unit,sub,dark,accent,onClick})=>(
  <div onClick={onClick} style={{background:dark?NAVY:"#fff",border:dark?"none":"1px solid #E2E8F0",borderRadius:14,padding:"16px 18px",cursor:onClick?"pointer":"default",minWidth:0}}>
    <p style={{margin:"0 0 6px",fontSize:11.5,color:dark?GOLD:"#8a7a4a",fontWeight:500,textTransform:"uppercase",letterSpacing:.5}}>{label}</p>
    <p style={{margin:0,fontSize:26,fontWeight:600,color:dark?CREAM:accent||NAVY,lineHeight:1.1,wordBreak:"break-word"}}>
      {value}{unit&&<span style={{fontSize:13,fontWeight:400,marginLeft:5,color:dark?"rgba(248,245,237,0.7)":"#718096"}}>{unit}</span>}
    </p>
    {sub&&<p style={{margin:"5px 0 0",fontSize:11,color:dark?"rgba(248,245,237,0.55)":"#A0AEC0"}}>{sub}</p>}
  </div>
);

// Enveloppe de carte du tableau de bord
const DashCard=({title,children,footnote,style})=>(
  <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:14,padding:"16px 18px",minWidth:0,...style}}>
    <p style={{fontSize:12.5,fontWeight:500,color:"#4A5568",margin:"0 0 12px"}}>{title}</p>
    {children}
    {footnote&&<p style={{fontSize:10.5,color:"#A0AEC0",margin:"10px 0 0"}}>{footnote}</p>}
  </div>
);

export default function AdminDashboard(){
  const [auth,setAuth]=useState(false);
  const [mdp,setMdp]=useState("");
  const [erreur,setErreur]=useState(false);
  const [tab,setTab]=useState("dashboard");
  const [demandes,setDemandes]=useState([]);
  const [candidats,setCandidats]=useState([]);
  const [selectedDem,setSelectedDem]=useState(null);
  const [shortlistSel,setShortlistSel]=useState([]);
  const [shortlistSent,setShortlistSent]=useState([]);
  const [expandedScore,setExpandedScore]=useState(null);
  const [loading,setLoading]=useState(true);
  const [paiements,setPaiements]=useState([]);
  const [shortlists,setShortlists]=useState([]);
  const [confirmant,setConfirmant]=useState(null);
  const [relance,setRelance]=useState(null); // null | "encours" | "termine"

// Responsive : le hook doit être appelé avant tout retour anticipé
const isMobile=useIsMobile();
const pad=isMobile?"14px":"20px";                 // marge générale des pages
const g2=isMobile?"1fr":"1fr 1fr";                // grilles à 2 colonnes
const colonnes=isMobile?"1fr":"repeat(auto-fit,minmax(320px,1fr))";

// Si une session admin est déjà active (rechargement de page), on garde l'accès
useEffect(()=>{
  supabase.auth.getSession().then(({data})=>{
    if(data.session?.user?.email===ADMIN_EMAIL) setAuth(true);
  });
},[]);

useEffect(()=>{ if(auth) chargerDonnees(); },[auth]);

// Connexion admin via un vrai compte Supabase (le mot de passe n'est plus dans le code)
const connexion = async () => {
  const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: mdp });
  if(error){ setErreur(true); } else { setAuth(true); }
};
const deconnexion = async () => { await supabase.auth.signOut(); window.location.href = "/"; };

if(!auth) return(
  <div style={{background:CREAM,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?16:24}}>
    <div style={{background:"#fff",borderRadius:16,padding:isMobile?"32px 22px":"40px 36px",maxWidth:380,width:"100%",border:"1px solid #E2E8F0",textAlign:"center",boxSizing:"border-box"}}>
      <div style={{marginBottom:24,display:"flex",justifyContent:"center"}}><Logo/></div>
      <p style={{fontSize:13,color:"#718096",margin:"0 0 20px"}}>Accès réservé à l'administrateur</p>
      <input
        type="password"
        value={mdp}
        onChange={e=>{setMdp(e.target.value);setErreur(false);}}
        onKeyDown={e=>{if(e.key==="Enter") connexion();}}
        placeholder="Mot de passe"
        style={{width:"100%",padding:"11px 14px",borderRadius:8,fontSize:14,border:`1.5px solid ${erreur?"#E53E3E":"#CBD5E0"}`,outline:"none",boxSizing:"border-box",marginBottom:8,color:"#0B2545"}}
      />
      {erreur&&<p style={{color:"#E53E3E",fontSize:12,margin:"0 0 8px"}}>Mot de passe incorrect</p>}
      <button onClick={connexion}
        style={{width:"100%",padding:"12px",borderRadius:8,background:"#0B2545",color:"#fff",border:"none",fontSize:14,cursor:"pointer",fontWeight:500,marginTop:4}}>
        Accéder au tableau de bord
      </button>
    </div>
  </div>
);
  const chargerDonnees = async () => {
    setLoading(true);
    const {data:d} = await supabase.from('demandes').select('*').order('created_at',{ascending:false});
    const {data:c} = await supabase.from('candidats').select('*').order('created_at',{ascending:false});
    const {data:pmt} = await supabase.from('paiements').select('*').order('created_at',{ascending:false});
    const {data:sl} = await supabase.from('shortlists').select('*');
    if(d) setDemandes(d);
    if(c) setCandidats(c);
    if(pmt) setPaiements(pmt);
    if(sl) setShortlists(sl);
    setLoading(false);
  };

  // ── Notifications e-mail (via la fonction serveur "notify" + Resend) ──
  const emailShell = (titre,corps) => `<div style="font-family:Arial,sans-serif;background:#F8F5ED;padding:24px"><div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #E2E8F0"><div style="background:#0B2545;padding:20px 24px"><span style="background:#C8A046;color:#0B2545;font-weight:700;font-size:16px;padding:4px 11px;border-radius:7px;letter-spacing:1px">JURIJOB</span></div><div style="padding:28px 24px;color:#0B2545"><h1 style="font-size:18px;font-weight:600;margin:0 0 14px;color:#0B2545">${titre}</h1>${corps}</div><div style="padding:16px 24px;background:#F8F5ED;color:#A0AEC0;font-size:11px;text-align:center">JURIJOB · Recrutement juridique au Maroc · jurijob.ma</div></div></div>`;

  const envoyerNotification = async (to,subject,html) => {
    if(!to) return;
    try{ await supabase.functions.invoke('notify',{body:{to,subject,html}}); }
    catch(e){ console.error('Notification e-mail non envoyée :',e); }
  };
const statP={
    total:paiements.filter(p=>p.statut==="confirme").reduce((s,p)=>s+(p.montant_total||0),0),
    confirme:paiements.filter(p=>p.statut==="confirme").length,
    en_attente:paiements.filter(p=>p.statut==="en_attente").length
  };

  const confirmerPaiement = async (p) => {
    if(!window.confirm(`Confirmer la réception du paiement de ${p.montant_total?.toLocaleString("fr-FR")} MAD de ${p.recruteur_email} ?\n\nUn e-mail sera envoyé au recruteur pour débloquer ses profils.`)) return;
    setConfirmant(p.id);
    const dateConf = new Date().toISOString();
    const { error } = await supabase.from('paiements').update({statut:'confirme',date_confirmation:dateConf}).eq('id',p.id);
    if(error){ setConfirmant(null); alert("Erreur lors de la confirmation : " + error.message); return; }
    const dem = demandes.find(d=>d.id===p.demande_id);
    const posteTxt = dem ? dem.poste : "votre demande";
    const nb = p.nb_cv;
    envoyerNotification(p.recruteur_email, `JURIJOB — Paiement confirmé, vos profils sont disponibles`,
      emailShell("Votre paiement a été confirmé ✓",
        `<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Bonjour,</p><p style="font-size:14px;line-height:1.6;margin:0 0 12px">Nous avons bien reçu votre virement de <strong>${p.montant_total?.toLocaleString("fr-FR")} MAD</strong> pour le poste <strong>${posteTxt}</strong>.</p><p style="font-size:14px;line-height:1.6;margin:0 0 12px">Vos <strong>${nb} profil${nb>1?"s":""}</strong> sont désormais accessibles dans votre espace recruteur. Vous y trouverez les coordonnées complètes des candidats sélectionnés.</p><p style="margin:22px 0 0"><a href="https://www.jurijob.ma" style="background:#C8A046;color:#0B2545;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:8px;display:inline-block">Consulter mes profils</a></p><p style="font-size:12px;color:#718096;margin:18px 0 0">Référence : ${p.reference_virement || "—"}</p>`));
    setPaiements(ps=>ps.map(x=>x.id===p.id?{...x,statut:'confirme',date_confirmation:dateConf}:x));
    setConfirmant(null);
  };

  // Liste des candidats à relancer : validés + (niveau, diplôme, ville ou pays) manquant + pas relancés depuis 7 jours
  const candidatsARelancer = candidats
    .filter(c=>c.statut==='valide')
    .map(c=>{
      const champsManquants=[];
      if(!c.niveau) champsManquants.push("votre niveau d'expérience");
      if(!c.diplome) champsManquants.push("votre diplôme le plus élevé");
      if(!c.ville) champsManquants.push("votre ville");
      if(!c.pays) champsManquants.push("votre pays");
      return {...c, champsManquants};
    })
    .filter(c=>{
      if(c.champsManquants.length===0) return false; // profil complet, on ne relance pas
      // Vérifier anti-doublon 7 jours
      if(c.date_derniere_relance){
        const j7 = 7 * 24 * 60 * 60 * 1000; // 7 jours en ms
        const ecart = Date.now() - new Date(c.date_derniere_relance).getTime();
        if(ecart < j7) return false; // relancé il y a moins de 7 jours
      }
      return true;
    });

  const relancerProfilsIncomplets = async () => {
    const nb = candidatsARelancer.length;
    if(nb === 0){ alert("Aucun candidat à relancer pour le moment."); return; }
    if(!window.confirm(`Envoyer un e-mail de relance à ${nb} candidat${nb>1?"s":""} au profil incomplet ?\n\nLes candidats déjà relancés dans les 7 derniers jours sont automatiquement exclus.`)) return;
    setRelance("encours");
    let ok = 0, ko = 0;
    const dateNow = new Date().toISOString();
    for(const c of candidatsARelancer){
      try{
        const sujet = "JURIJOB — Complétez votre profil pour maximiser vos chances";
        const listeChamps = c.champsManquants.length>1
          ? c.champsManquants.slice(0,-1).join(", ") + " et " + c.champsManquants[c.champsManquants.length-1]
          : c.champsManquants[0];
        const corps = `<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Bonjour,</p>
<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Merci d'avoir créé votre profil sur <strong>JURIJOB</strong>, la plateforme de sélection de profils juridiques au Maroc et en Afrique francophone.</p>
<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Nous avons constaté qu'il manque encore <strong>${listeChamps}</strong> à votre profil.</p>
<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Ces informations sont essentielles pour que notre algorithme puisse vous proposer aux recruteurs qui recherchent votre profil. Sans elles, vous risquez de manquer des opportunités.</p>
<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Compléter votre profil ne prend que quelques minutes :</p>
<p style="margin:22px 0"><a href="https://www.jurijob.ma" style="background:#C8A046;color:#0B2545;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:8px;display:inline-block">Compléter mon profil</a></p>
<p style="font-size:12px;color:#718096;margin:18px 0 0">Une question ? Écrivez-nous à recrutement@sentissilegal.com</p>`;
        await envoyerNotification(c.email, sujet, emailShell("Complétez votre profil ✍️", corps));
        // Envoi réussi → mise à jour date_derniere_relance
        const { error } = await supabase.from('candidats').update({date_derniere_relance: dateNow}).eq('id', c.id);
        if(!error) ok++;
        else ko++;
      } catch(e){ ko++; }
    }
    // Refresh local
    setCandidats(prev=>prev.map(c=>{
      if(candidatsARelancer.find(x=>x.id===c.id)) return {...c, date_derniere_relance: dateNow};
      return c;
    }));
    setRelance("termine");
    setTimeout(()=>setRelance(null), 5000);
    alert(`Relance terminée.\n\n✓ ${ok} envoi${ok>1?"s":""} réussi${ok>1?"s":""}\n${ko>0?`✗ ${ko} échec${ko>1?"s":""}`:""}`);
  };

  const statD={
    en_cours:demandes.filter(d=>d.statut==="en_cours").length,
  
    terminee:demandes.filter(d=>d.statut==="terminee").length,
    annulee:demandes.filter(d=>d.statut==="annulee").length
  };
  const statC={
    valide:candidats.filter(c=>c.statut==="valide").length,
    en_attente:candidats.filter(c=>c.statut==="en_attente").length,
    refuse:candidats.filter(c=>c.statut==="refuse").length
  };

  // ── Répartition géographique (tous statuts, pour photographier l'ensemble de la CVthèque) ──
  const geoCounts={};
  candidats.forEach(c=>{ const p=c.pays||"Non renseigné"; geoCounts[p]=(geoCounts[p]||0)+1; });
  const geoSorted=Object.entries(geoCounts).sort((a,b)=>b[1]-a[1]);
  const geoTop=geoSorted.slice(0,5);
  const geoAutres=geoSorted.slice(5).reduce((s,[,v])=>s+v,0);
  const geoData=geoAutres>0?[...geoTop,["Autres",geoAutres]]:geoTop;
  const geoMax=geoData.length?Math.max(...geoData.map(([,v])=>v)):1;

  // ── Écart offre / demande par spécialisation ──
  // Offre = candidats VALIDÉS uniquement (seuls profils réellement exploitables en short-list)
  // Demande = toutes les demandes reçues (y compris terminées), signal cumulé du marché
  const ALL_SPECS=SPECS.flatMap(s=>s.items);
  const offreParSpec={},demandeParSpec={};
  ALL_SPECS.forEach(s=>{ offreParSpec[s]=0; demandeParSpec[s]=0; });
  candidats.filter(c=>c.statut==="valide").forEach(c=>{ (c.specs||[]).forEach(s=>{ if(offreParSpec[s]!==undefined) offreParSpec[s]++; }); });
  demandes.forEach(d=>{ (d.specs||[]).forEach(s=>{ if(demandeParSpec[s]!==undefined) demandeParSpec[s]++; }); });
  const specGap=ALL_SPECS
    .map(s=>({spec:s,demande:demandeParSpec[s],offre:offreParSpec[s],gap:demandeParSpec[s]-offreParSpec[s]}))
    .filter(x=>x.demande>0)
    .sort((a,b)=>b.demande-a.demande||a.gap-b.gap)
    .slice(0,8);
  const specGapMax=specGap.length?Math.max(1,...specGap.map(x=>Math.max(x.demande,x.offre))):1;

  // ── Tunnel de conversion : demandes reçues → short-lists envoyées → payées ──
  const demandesTotal=demandes.length;
  const demandeIdsAvecShortlist=new Set(shortlists.map(s=>s.demande_id));
  const nbShortlistsEnvoyees=demandeIdsAvecShortlist.size;
  const demandeIdsPayees=new Set(paiements.filter(p=>p.statut==="confirme").map(p=>p.demande_id));
  const nbPayees=demandeIdsPayees.size;
  const tauxShortlist=demandesTotal>0?Math.round((nbShortlistsEnvoyees/demandesTotal)*100):0;
  const tauxPaiement=nbShortlistsEnvoyees>0?Math.round((nbPayees/nbShortlistsEnvoyees)*100):0;
  const tunnelMax=Math.max(demandesTotal,1);

  // ── Qualité des profils : part des candidats validés avec un profil de matching complet ──
  const profilsCompletsCount=candidats.filter(c=>c.statut==="valide"&&c.niveau&&c.diplome).length;
  const qualitePct=statC.valide>0?Math.round((profilsCompletsCount/statC.valide)*100):0;

  // ── Alertes opérationnelles ──
  const UN_JOUR=24*60*60*1000;
  const paiementsEnRetard=paiements.filter(p=>p.statut==="en_attente"&&(Date.now()-new Date(p.created_at).getTime())>2*UN_JOUR);
  const demandesStagnantes=demandes.filter(d=>d.statut==="en_cours"&&(Date.now()-new Date(d.created_at).getTime())>5*UN_JOUR);
  const nbAlertes=(paiementsEnRetard.length>0?1:0)+(demandesStagnantes.length>0?1:0)+(candidatsARelancer.length>0?1:0);

  const validerCandidat = async (id,s) => {
    const{error}=await supabase.from('candidats').update({statut:s}).eq('id',id);
    if(!error){
      setCandidats(cs=>cs.map(c=>c.id===id?{...c,statut:s}:c));
      if(s==="valide"){
        const c=candidats.find(x=>x.id===id);
        if(c?.email){
          envoyerNotification(c.email,"Votre profil JURIJOB a été validé",
            emailShell("Votre profil a été validé ✓",
              `<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Bonjour ${c.prenom||""},</p><p style="font-size:14px;line-height:1.6;margin:0 0 12px">Bonne nouvelle : votre profil sur JURIJOB vient d'être <strong>validé</strong> par notre équipe. Il est désormais visible par les recruteurs et pourra être proposé pour des missions correspondant à votre expertise.</p><p style="font-size:14px;line-height:1.6;margin:0 0 12px">Vous pouvez mettre à jour vos informations à tout moment depuis votre espace candidat.</p><p style="margin:22px 0 0"><a href="https://www.jurijob.ma" style="background:#C8A046;color:#0B2545;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:8px;display:inline-block">Accéder à mon espace</a></p>`));
        }
      }
    }
  };

  const cloturerDemande = async (id,s) => {
    const{error}=await supabase.from('demandes').update({statut:s}).eq('id',id);
    if(!error) setDemandes(ds=>ds.map(d=>d.id===id?{...d,statut:s}:d));
  };

  const getScoredCandidats=(dem)=>{
    return candidats
      .filter(c=>c.statut==="valide")
      .map(c=>({...c,...scoreCandidat(c,dem)}))
      .sort((a,b)=>b.score-a.score);
  };

  const ouvrirDemande=(d)=>{
    const scored=getScoredCandidats(d);
    const autoSel=scored.slice(0,d.nb_cv||d.nbCv||3).map(c=>c.id);
    setSelectedDem(d);
    setShortlistSel(autoSel);
    setExpandedScore(null);
  };

  const envoyerShortlist = async () => {
    const dem=selectedDem;
    const nb=shortlistSel.length;
    const choisis=candidats.filter(c=>shortlistSel.includes(c.id));
    const{error}=await supabase.from('shortlists').insert([{
      demande_id:dem.id,
      candidat_ids:shortlistSel,
      statut:'envoyee'
    }]);
    if(error){ alert('Erreur : '+error.message); return; }
    if(dem.recruteur_email){
      envoyerNotification(dem.recruteur_email,`Votre short-list JURIJOB — ${dem.poste}`,
        emailShell("Votre short-list est prête 📋",
          `<p style="font-size:14px;line-height:1.6;margin:0 0 12px">Bonjour ${dem.contact||""},</p><p style="font-size:14px;line-height:1.6;margin:0 0 12px">Votre demande de recrutement pour le poste de <strong>${dem.poste}</strong> a été traitée. Une short-list de <strong>${nb} profil${nb>1?"s":""}</strong>, sélectionné${nb>1?"s":""} pour leur adéquation avec vos critères, vient d'être préparée.</p><p style="font-size:14px;line-height:1.6;margin:0 0 12px">Connectez-vous à votre espace recruteur pour la consulter.</p><p style="margin:22px 0 0"><a href="https://www.jurijob.ma" style="background:#C8A046;color:#0B2545;text-decoration:none;font-weight:600;font-size:14px;padding:11px 22px;border-radius:8px;display:inline-block">Voir ma short-list</a></p>`));
    }
    setShortlistSent(sl=>[...sl,{
      demId:dem.id,
      entreprise:dem.entreprise,
      poste:dem.poste,
      contact:dem.contact,
      candidats:choisis,
      date:new Date().toLocaleDateString("fr-FR")
    }]);
    await cloturerDemande(dem.id,"terminee");
    setSelectedDem(null);
    setShortlistSel([]);
    setTab("shortlists");
  };

  const navItems=[
    {id:"dashboard",icon:"⊞",label:"Vue d'ensemble",court:"Vue"},
    {id:"demandes",icon:"📋",label:"Demandes",court:"Demandes"},
    {id:"cvtheque",icon:"👥",label:"CVthèque",court:"CVthèque"},
    {id:"shortlists",icon:"📤",label:"Short-lists",court:"Short-lists"},
    {id:"paiements",icon:"💳",label:"Paiements",court:"Paiements"},
  ];

  const Header=()=>(
    <div style={{background:NAVY,padding:isMobile?"0 14px":"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52,gap:8}}>
      <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
        <Logo variant="light"/>
        {!isMobile&&<span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Admin</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:NAVY,flexShrink:0}}>MS</div>
        {!isMobile&&<span style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>M. Sentissi</span>}
        <button onClick={deconnexion} style={{marginLeft:isMobile?0:8,background:"rgba(255,255,255,0.1)",border:"none",color:"rgba(255,255,255,0.75)",fontSize:12,padding:"6px 11px",borderRadius:6,cursor:"pointer",whiteSpace:"nowrap"}}>{isMobile?"Sortir":"Déconnexion"}</button>
      </div>
    </div>
  );

  // Sur mobile, les 5 onglets ne tiennent pas : la barre défile horizontalement
  const Nav=()=>(
    <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",padding:isMobile?"0 10px":"0 20px",gap:4,overflowX:"auto",WebkitOverflowScrolling:"touch"}}>
      {navItems.map(n=>(
        <button key={n.id} onClick={()=>{setTab(n.id);setSelectedDem(null);}} style={{padding:isMobile?"12px 9px":"11px 12px",fontSize:12.5,cursor:"pointer",background:"none",border:"none",borderBottom:`2.5px solid ${tab===n.id?GOLD:"transparent"}`,color:tab===n.id?NAVY:"#718096",fontWeight:tab===n.id?500:400,display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap",flexShrink:0}}>
          <span style={{fontSize:14}}>{n.icon}</span>{isMobile?n.court:n.label}
        </button>
      ))}
    </div>
  );

  const renderDashboard=()=>(
    <div style={{padding:pad,display:"flex",flexDirection:"column",gap:16,maxWidth:1100,margin:"0 auto",width:"100%",boxSizing:"border-box"}}>
      <div>
        <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Tableau de bord</p>
        <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:0}}>Bonjour, M. Sentissi 👋</h2>
        <p style={{fontSize:13,color:"#718096",margin:"4px 0 0"}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
      </div>
      {loading&&<p style={{color:"#718096",fontSize:13}}>Chargement des données...</p>}

      {/* ── Ligne de KPI ── */}
      <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(auto-fit,minmax(160px,1fr))",gap:12}}>
        <KpiCard dark label="CVthèque" value={candidats.length}
          sub={`${statC.valide} validé${statC.valide>1?"s":""} · ${statC.en_attente} en attente`}/>
        <KpiCard label="Demandes en cours" value={statD.en_cours}
          sub={`${statD.terminee} terminée${statD.terminee>1?"s":""} · ${statD.annulee} annulée${statD.annulee>1?"s":""}`}/>
        <KpiCard label="Encaissé" value={statP.total.toLocaleString("fr-FR")} unit="MAD"
          sub={`${statP.confirme} paiement${statP.confirme>1?"s":""} confirmé${statP.confirme>1?"s":""}`}
          accent="#166534"/>
        <KpiCard label="Alertes actives" value={nbAlertes}
          sub={statP.en_attente>0?`dont ${statP.en_attente} paiement${statP.en_attente>1?"s":""} en attente`:"tout est à jour"}
          accent={nbAlertes>0?GOLD:"#166534"}
          onClick={nbAlertes>0?()=>{const el=document.getElementById("bloc-alertes");if(el) el.scrollIntoView({behavior:"smooth"});}:undefined}/>
      </div>

      {/* ── Graphiques : écart offre/demande + répartition géographique ── */}
      <div style={{display:"grid",gridTemplateColumns:colonnes,gap:16}}>
        <DashCard title="⚖️ Écart offre / demande par spécialisation"
          footnote={specGap.length>0?"Spécialisations effectivement demandées, triées par fréquence · Demande = total des demandes reçues · Offre = profils validés dans la CVthèque":null}>
          {specGap.length===0&&<p style={{fontSize:12,color:"#A0AEC0",margin:0}}>Pas encore assez de demandes ou de profils validés pour calculer les écarts.</p>}
          {specGap.map(x=><GapBar key={x.spec} {...x} max={specGapMax}/>)}
        </DashCard>
        <DashCard title={`🌍 Répartition géographique — ${candidats.length} profils`}>
          {geoData.length===0&&<p style={{fontSize:12,color:"#A0AEC0",margin:0}}>Aucun profil pour le moment.</p>}
          {geoData.length>0&&<GeoDonut data={geoData}/>}
          <div style={{marginTop:14}}>
            {geoData.map(([pays,count])=><GeoBar key={pays} label={pays} value={count} max={geoMax}/>)}
          </div>
        </DashCard>
      </div>

      {/* ── Tunnel de conversion + qualité des profils ── */}
      <div style={{display:"grid",gridTemplateColumns:colonnes,gap:16}}>
        <DashCard title="📊 Tunnel de conversion"
          footnote="Les pourcentages sont calculés par rapport à l'étape précédente. Ne mesure pas si le recruteur a finalisé une embauche — cette information n'est pas suivie par JURIJOB.">
          {[["Demandes reçues",demandesTotal,null],["Short-lists envoyées",nbShortlistsEnvoyees,tauxShortlist],["Payées",nbPayees,tauxPaiement]].map(([label,val,taux],i)=>(
            <div key={label} style={{marginBottom:i<2?10:0}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:8,marginBottom:3}}>
                <span style={{fontSize:12,color:"#4A5568"}}>{label}</span>
                <span style={{fontSize:12,fontWeight:500,color:NAVY,whiteSpace:"nowrap"}}>{val}{taux!==null&&<span style={{color:"#A0AEC0",marginLeft:6}}>({taux}%)</span>}</span>
              </div>
              <div style={{height:10,background:"#E2E8F0",borderRadius:5,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${(val/tunnelMax)*100}%`,background:i===2?"#166534":i===1?GOLD:NAVY,borderRadius:5}}/>
              </div>
            </div>
          ))}
        </DashCard>
        <DashCard title="✅ Qualité des profils"
          footnote="Un profil incomplet perd jusqu'à 30 points sur 100 dans l'algorithme de scoring (niveau + diplôme).">
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4,flexWrap:"wrap",gap:4}}>
            <span style={{fontSize:12,color:"#4A5568"}}>Profils validés avec matching complet (niveau + diplôme)</span>
            <span style={{fontSize:12,fontWeight:500,color:NAVY,whiteSpace:"nowrap"}}>{profilsCompletsCount}/{statC.valide} ({qualitePct}%)</span>
          </div>
          <div style={{height:10,background:"#E2E8F0",borderRadius:5,overflow:"hidden"}}>
            <div style={{height:"100%",width:`${qualitePct}%`,background:qualitePct>=70?"#166534":qualitePct>=40?GOLD:"#991B1B",borderRadius:5}}/>
          </div>
        </DashCard>
      </div>

      {/* ── Alertes opérationnelles ── */}
      {(paiementsEnRetard.length>0||demandesStagnantes.length>0||candidatsARelancer.length>0)&&(
        <DashCard title="🔔 Alertes opérationnelles" style={{scrollMarginTop:16}}>
          <div id="bloc-alertes" style={{display:"flex",flexDirection:"column",gap:8}}>
            {paiementsEnRetard.length>0&&(
              <div onClick={()=>setTab("paiements")} style={{background:"#FEF2F2",borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <span style={{fontSize:12.5,color:"#991B1B"}}>💳 {paiementsEnRetard.length} paiement{paiementsEnRetard.length>1?"s":""} en attente depuis plus de 48h</span>
                <span style={{fontSize:11,color:"#991B1B",flexShrink:0}}>Voir →</span>
              </div>
            )}
            {demandesStagnantes.length>0&&(
              <div onClick={()=>setTab("demandes")} style={{background:GOLD_LIGHT,borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <span style={{fontSize:12.5,color:"#92400E"}}>📋 {demandesStagnantes.length} demande{demandesStagnantes.length>1?"s":""} en cours depuis plus de 5 jours sans short-list</span>
                <span style={{fontSize:11,color:"#92400E",flexShrink:0}}>Voir →</span>
              </div>
            )}
            {candidatsARelancer.length>0&&(
              <div onClick={()=>setTab("cvtheque")} style={{background:"#EFF6FF",borderRadius:10,padding:"10px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <span style={{fontSize:12.5,color:"#1D4ED8"}}>📧 {candidatsARelancer.length} profil{candidatsARelancer.length>1?"s":""} incomplet{candidatsARelancer.length>1?"s":""} à relancer</span>
                <span style={{fontSize:11,color:"#1D4ED8",flexShrink:0}}>Voir →</span>
              </div>
            )}
          </div>
        </DashCard>
      )}

      {/* ── Demandes urgentes ── */}
      {demandes.filter(d=>d.statut==="en_cours"&&d.urgence!=="normal").length>0&&(
        <div style={{background:"#FFF7ED",border:"1px solid #FCD34D",borderRadius:14,padding:"14px 18px"}}>
          <p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:"#92400E"}}>⚡ Demandes urgentes à traiter</p>
          {demandes.filter(d=>d.statut==="en_cours"&&d.urgence!=="normal").map(d=>(
            <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,marginBottom:8}}>
              <div style={{minWidth:0}}><p style={{margin:0,fontSize:13,color:NAVY,fontWeight:500,wordBreak:"break-word"}}>{d.poste}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{d.entreprise}</p></div>
              <button onClick={()=>{ouvrirDemande(d);setTab("demandes");}} style={{padding:"7px 14px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12,cursor:"pointer",fontWeight:500,flexShrink:0}}>Traiter</button>
            </div>
          ))}
        </div>
      )}

      {/* ── Short-lists récentes ── */}
      {shortlistSent.length>0&&(
        <DashCard title="Short-lists récentes">
          {shortlistSent.slice(-3).reverse().map((sl,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"8px 0",borderBottom:i<Math.min(shortlistSent.length,3)-1?"1px solid #F0F4F8":"none"}}>
              <div style={{minWidth:0}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{sl.poste}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{sl.entreprise} · {sl.candidats.length} profils · {sl.date}</p></div>
              <Badge bg="#F0FDF4" color="#166534" label="Envoyée"/>
            </div>
          ))}
        </DashCard>
      )}
    </div>
  );

  const renderDemandes=()=>{
    if(selectedDem){
      const scored=getScoredCandidats(selectedDem);
      const totalValides=scored.length;
      const nbCv=selectedDem.nb_cv||selectedDem.nbCv||3;
      return(
        <div style={{padding:pad}}>
          <button onClick={()=>{setSelectedDem(null);setShortlistSel([]);}} style={{background:"none",border:"none",color:"#718096",fontSize:13,cursor:"pointer",marginBottom:14,padding:0}}>← Retour aux demandes</button>
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:isMobile?"14px":"16px 18px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:12,flexWrap:"wrap"}}>
              <div style={{minWidth:0}}><p style={{margin:"0 0 3px",fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,wordBreak:"break-all"}}>{selectedDem.id}</p><h3 style={{margin:"0 0 3px",fontSize:15,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{selectedDem.poste}</h3><p style={{margin:0,fontSize:12,color:"#718096",wordBreak:"break-word"}}>{selectedDem.entreprise} · {selectedDem.contact}{selectedDem.recruteur_email?` · ${selectedDem.recruteur_email}`:""}</p></div>
              {URGENCE_STYLE[selectedDem.urgence]&&<Badge {...URGENCE_STYLE[selectedDem.urgence]}/>}
            </div>
            <div style={{display:"grid",gridTemplateColumns:g2,gap:8}}>
              {[["Niveau",selectedDem.niveau],["Diplôme",selectedDem.diplome],["Lieu du poste",[selectedDem.ville,selectedDem.pays].filter(Boolean).join(", ")||"non précisé"],["Langues",(selectedDem.langues||[]).join(", ")],["CV demandés",`${nbCv} profils`],["Modalité",selectedDem.modalite||"—"]].map(([k,v])=>(
                <div key={k} style={{background:CREAM,borderRadius:8,padding:"8px 12px"}}><p style={{margin:"0 0 2px",fontSize:11,color:"#A0AEC0"}}>{k}</p><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{v}</p></div>
              ))}
            </div>
            <div style={{marginTop:10}}><p style={{fontSize:11,color:"#A0AEC0",margin:"0 0 6px"}}>Spécialisations requises</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{(selectedDem.specs||[]).map(s=><span key={s} style={{background:GOLD_LIGHT,color:NAVY,fontSize:11,padding:"3px 10px",borderRadius:20}}>{s}</span>)}</div></div>
          </div>
          <div style={{background:"#EFF6FF",borderRadius:10,padding:isMobile?"12px 14px":"12px 16px",marginBottom:14,display:"flex",alignItems:"flex-start",gap:10}}>
            <span style={{fontSize:16}}>🤖</span>
            <div>
              <p style={{margin:"0 0 3px",fontSize:13,fontWeight:500,color:NAVY}}>Matching automatique activé</p>
              <p style={{margin:0,fontSize:12,color:"#4A5568"}}>{totalValides} profil{totalValides>1?"s":""} analysé{totalValides>1?"s":""}. Les <strong>{Math.min(nbCv,totalValides)} meilleurs scores</strong> ont été pré-sélectionnés.</p>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,marginBottom:10,flexWrap:"wrap"}}>
            <p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>Résultats classés par pertinence</p>
            {shortlistSel.length>0&&<span style={{background:GOLD_LIGHT,color:NAVY,fontSize:11,fontWeight:500,padding:"3px 10px",borderRadius:20}}>{shortlistSel.length} sélectionné{shortlistSel.length>1?"s":""}</span>}
          </div>
          {scored.length===0&&<p style={{fontSize:13,color:"#A0AEC0",padding:"20px 0",textAlign:"center"}}>Aucun candidat validé dans la CVthèque.</p>}
          {scored.map((c,idx)=>{
            const sel=shortlistSel.includes(c.id);
            const sc=scoreColor(c.score);
            const expanded=expandedScore===c.id;
            return(
              <div key={c.id} style={{background:sel?"#EFF6FF":"#fff",border:`1.5px solid ${sel?NAVY:"#E2E8F0"}`,borderRadius:11,padding:isMobile?"12px 10px":"14px",marginBottom:10}}>
                <div style={{display:"flex",gap:isMobile?7:10,alignItems:"flex-start"}}>
                  <div onClick={()=>setShortlistSel(sl=>sl.includes(c.id)?sl.filter(x=>x!==c.id):[...sl,c.id])}
                    style={{width:22,height:22,borderRadius:4,border:`2px solid ${sel?NAVY:"#CBD5E0"}`,background:sel?NAVY:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:13,cursor:"pointer"}}>
                    {sel&&<span style={{color:"#fff",fontSize:12,lineHeight:1}}>✓</span>}
                  </div>
                  <div style={{width:22,height:22,borderRadius:"50%",background:idx<nbCv?NAVY:CREAM,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:idx<nbCv?"#fff":"#A0AEC0",flexShrink:0,marginTop:13}}>#{idx+1}</div>
                  {/* L'avatar est masqué sur mobile : 40 px de large pris sur une colonne déjà étroite */}
                  {!isMobile&&<Avatar prenom={c.prenom||""} nom={c.nom||""} size={40}/>}
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                      <div style={{minWidth:0}}>
                        <p style={{margin:"0 0 1px",fontSize:14,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{c.prenom} {c.nom}</p>
                        <p style={{margin:0,fontSize:12,color:"#718096",wordBreak:"break-word"}}>{c.titre} · {c.ville}{c.diplome?` · ${DIPLOMES_CAND_LABELS[c.diplome]||c.diplome}`:""}{c.niveau?` · ${NIVEAUX_LABELS[c.niveau]||c.niveau}`:""}</p>
                      </div>
                      <ScoreRing score={c.score}/>
                    </div>
                    {(c.formations||[]).length>0&&<div style={{margin:"6px 0 0"}}><p style={{margin:"0 0 2px",fontSize:10,fontWeight:500,color:"#4A5568"}}>🎓 Formation</p>{triFo(c.formations).slice(0,2).map((fo,i)=><p key={i} style={{margin:"0 0 1px",fontSize:10,color:"#718096",wordBreak:"break-word"}}>{fo.diplome}{fo.etab?` — ${fo.etab}`:""}{fo.annee?` (${fo.annee})`:""}</p>)}{(c.formations||[]).length>2&&<p style={{margin:0,fontSize:9,color:"#A0AEC0"}}>+ {(c.formations||[]).length-2} autre(s)</p>}</div>}
                    {(c.experiences||[]).length>0&&<div style={{margin:"4px 0 0"}}><p style={{margin:"0 0 2px",fontSize:10,fontWeight:500,color:"#4A5568"}}>💼 Expérience</p>{triExp(c.experiences).slice(0,2).map((e,i)=>{const du=calcDuree(e.debut,e.fin,e.encours);return <p key={i} style={{margin:"0 0 1px",fontSize:10,color:"#718096",wordBreak:"break-word"}}>{e.poste}{e.org?` — ${e.org}`:""}{e.debut?` (${e.debut}${e.encours?" – en cours":e.fin?` – ${e.fin}`:""}${du?` · ${du}`:""})`:""}</p>;})}{(c.experiences||[]).length>2&&<p style={{margin:0,fontSize:9,color:"#A0AEC0"}}>+ {(c.experiences||[]).length-2} autre(s)</p>}</div>}
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,margin:"8px 0 6px"}}>
                      {(c.specs||[]).filter(s=>(selectedDem.specs||[]).includes(s)).map(s=><span key={s} style={{background:GOLD_LIGHT,color:NAVY,fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:500}}>✓ {s}</span>)}
                      {(c.specs||[]).filter(s=>!(selectedDem.specs||[]).includes(s)).map(s=><span key={s} style={{background:CREAM,color:"#718096",fontSize:11,padding:"2px 8px",borderRadius:20}}>{s}</span>)}
                    </div>
                    <p style={{margin:"0 0 6px",fontSize:12,color:"#718096",wordBreak:"break-word"}}>🌍 {(c.langues||[]).map(l=>typeof l==="string"?l:l.langue).filter(Boolean).join(", ")} · 💰 {c.salaire} · 📅 {c.disponibilite}{(c.modalites||[]).length>0?` · 🏢 ${(c.modalites||[]).join(" / ")}`:""}</p>
                    <button onClick={()=>setExpandedScore(expanded?null:c.id)} style={{background:"none",border:"none",fontSize:12,color:"#718096",cursor:"pointer",padding:"4px 0",textDecoration:"underline"}}>
                      {expanded?"Masquer le détail":"Voir le détail du score →"}
                    </button>
                    {expanded&&(
                      <div style={{background:CREAM,borderRadius:8,padding:"12px",marginTop:8}}>
                        <ScoreBar label="Spécialisations" score={c.details.specs.score} max={35} note={`${c.details.specs.matched.length}/${c.details.specs.total} domaines`}/>
                        <ScoreBar label="Langues" score={c.details.langues.score} max={25} note={`${c.details.langues.matched.length}/${c.details.langues.total} langues`}/>
                        <ScoreBar label="Niveau d'expérience" score={c.details.niveau.score} max={20}/>
                        <ScoreBar label="Diplôme" score={c.details.diplome.score} max={10}/>
                        <ScoreBar label="Géographie" score={c.details.geo.score} max={10} note={c.details.geo.note}/>
                        <div style={{display:"flex",justifyContent:"space-between",gap:8,paddingTop:8,borderTop:"1px solid #E2E8F0",marginTop:4}}>
                          <span style={{fontSize:12,fontWeight:500,color:NAVY}}>Score total</span>
                          <span style={{fontSize:13,fontWeight:600,color:scoreColor(c.score).color,whiteSpace:"nowrap"}}>{c.score}/100 — {scoreColor(c.score).label}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {shortlistSel.length>0&&(
            <div style={{position:"sticky",bottom:0,background:"#fff",borderTop:"1px solid #E2E8F0",padding:"12px 0 0",marginTop:8}}>
              <button onClick={envoyerShortlist} style={{width:"100%",padding:"13px",borderRadius:9,background:GOLD,color:NAVY,border:"none",fontSize:14,cursor:"pointer",fontWeight:600}}>
                📤 Générer et envoyer la short-list ({shortlistSel.length} profil{shortlistSel.length>1?"s":""})
              </button>
            </div>
          )}
        </div>
      );
    }
    return(
      <div style={{padding:pad}}>
        <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Gestion</p>
        <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 18px"}}>Demandes recruteurs</h2>
        {demandes.length===0&&!loading&&<p style={{color:"#A0AEC0",fontSize:13,textAlign:"center",padding:"32px 0"}}>Aucune demande pour le moment.</p>}
        {["en_cours","terminee","annulee"].map(statut=>{
          const list=demandes.filter(d=>d.statut===statut);
          if(!list.length) return null;
          return(
            <div key={statut} style={{marginBottom:20}}>
              <p style={{fontSize:12,fontWeight:500,color:"#4A5568",margin:"0 0 8px",display:"flex",alignItems:"center",gap:8}}><Badge {...STATUT_D[statut]}/><span>{list.length} demande{list.length>1?"s":""}</span></p>
              {list.map(d=>(
                <div key={d.id} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4,flexWrap:"wrap"}}><span style={{fontSize:11,color:"#A0AEC0",wordBreak:"break-all"}}>{d.id}</span>{URGENCE_STYLE[d.urgence]&&<Badge {...URGENCE_STYLE[d.urgence]}/>}</div>
                    <p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{d.poste}</p>
                    <p style={{margin:0,fontSize:12,color:"#718096",wordBreak:"break-word"}}>{d.entreprise} · {d.contact} · {new Date(d.created_at).toLocaleDateString("fr-FR")}</p>
                    <p style={{margin:"3px 0 0",fontSize:12,color:"#718096"}}>📁 {d.nb_cv} CV · {(d.langues||[]).join(", ")}{d.ville?` · 📍 ${d.ville}${d.pays&&d.pays!=="Maroc"?`, ${d.pays}`:""}`:""}</p>
                  </div>
                  {statut==="en_cours"&&(
                    <div style={{display:"flex",flexDirection:isMobile?"row":"column",gap:6,flexShrink:0,flexBasis:isMobile?"100%":"auto"}}>
                      <button onClick={()=>ouvrirDemande(d)} style={{padding:"9px 14px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12,cursor:"pointer",fontWeight:500,whiteSpace:"nowrap",flex:isMobile?1:"none"}}>Traiter →</button>
                      <button onClick={()=>cloturerDemande(d.id,"annulee")} style={{padding:"9px 14px",borderRadius:7,background:"transparent",color:"#718096",border:"1px solid #E2E8F0",fontSize:12,cursor:"pointer",flex:isMobile?1:"none"}}>Annuler</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCvtheque=()=>(
    <div style={{padding:pad}}>
      <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Modération</p>
      <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 18px"}}>CVthèque — {candidats.length} profils</h2>
      {candidatsARelancer.length > 0 && (
        <div style={{background:GOLD_LIGHT,border:`1px solid ${GOLD}`,borderRadius:10,padding:"12px 16px",marginBottom:16,display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:isMobile?"100%":200}}>
            <p style={{margin:"0 0 3px",fontSize:13,fontWeight:600,color:NAVY}}>📧 Profils incomplets à relancer : {candidatsARelancer.length}</p>
            <p style={{margin:0,fontSize:11.5,color:"#92400E"}}>Candidats validés dont le niveau, le diplôme, la ville ou le pays n'est pas renseigné (exclus : relancés dans les 7 derniers jours).</p>
          </div>
          <button onClick={relancerProfilsIncomplets} disabled={relance==="encours"} style={{padding:"11px 16px",borderRadius:7,background:relance==="encours"?"#E2E8F0":NAVY,color:relance==="encours"?"#A0AEC0":"#fff",border:"none",fontSize:12.5,cursor:relance==="encours"?"default":"pointer",fontWeight:600,whiteSpace:"nowrap",width:isMobile?"100%":"auto"}}>
            {relance==="encours" ? "Envoi en cours…" : `Relancer les ${candidatsARelancer.length} profils`}
          </button>
        </div>
      )}
      {candidats.length===0&&!loading&&<p style={{color:"#A0AEC0",fontSize:13,textAlign:"center",padding:"32px 0"}}>Aucun candidat pour le moment.</p>}
      {["en_attente","valide","refuse"].map(statut=>{
        const list=candidats.filter(c=>c.statut===statut);
        if(!list.length) return null;
        return(
          <div key={statut} style={{marginBottom:20}}>
            <p style={{fontSize:12,fontWeight:500,color:"#4A5568",margin:"0 0 8px",display:"flex",alignItems:"center",gap:8}}><Badge {...STATUT_C[statut]}/><span>{list.length} profil{list.length>1?"s":""}</span></p>
            {list.map(c=>(
              <div key={c.id} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,padding:isMobile?"12px":"14px",marginBottom:8}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start",flexWrap:"wrap"}}>
                  <Avatar prenom={c.prenom||""} nom={c.nom||""}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{c.prenom} {c.nom}</p>
                    <p style={{margin:"0 0 6px",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{c.titre} · {c.ville}{c.pays&&c.pays!=="Maroc"?`, ${c.pays}`:""}{c.diplome?` · ${DIPLOMES_CAND_LABELS[c.diplome]||c.diplome}`:""}{c.niveau?` · ${NIVEAUX_LABELS[c.niveau]||c.niveau}`:""}</p>
                    {(c.formations||[]).length>0&&<div style={{margin:"0 0 6px"}}><p style={{margin:"0 0 3px",fontSize:11,fontWeight:500,color:"#4A5568"}}>🎓 Formation</p>{triFo(c.formations).slice(0,3).map((fo,i)=><p key={i} style={{margin:"0 0 2px",fontSize:11,color:"#718096",wordBreak:"break-word"}}>{fo.diplome}{fo.etab?` — ${fo.etab}`:""}{fo.annee?` (${fo.annee})`:""}</p>)}{(c.formations||[]).length>3&&<p style={{margin:0,fontSize:10,color:"#A0AEC0"}}>+ {(c.formations||[]).length-3} autre(s)</p>}</div>}
                    {(c.experiences||[]).length>0&&<div style={{margin:"0 0 6px"}}><p style={{margin:"0 0 3px",fontSize:11,fontWeight:500,color:"#4A5568"}}>💼 Expérience</p>{triExp(c.experiences).slice(0,3).map((e,i)=>{const du=calcDuree(e.debut,e.fin,e.encours);return <p key={i} style={{margin:"0 0 2px",fontSize:11,color:"#718096",wordBreak:"break-word"}}>{e.poste}{e.org?` — ${e.org}`:""}{e.debut?` (${e.debut}${e.encours?" – en cours":e.fin?` – ${e.fin}`:""}${du?` · ${du}`:""})`:""}</p>;})}{(c.experiences||[]).length>3&&<p style={{margin:0,fontSize:10,color:"#A0AEC0"}}>+ {(c.experiences||[]).length-3} autre(s)</p>}</div>}
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:5}}>{(c.specs||[]).map(s=><span key={s} style={{background:CREAM,color:NAVY,fontSize:11,padding:"2px 8px",borderRadius:20}}>{s}</span>)}</div>
                    <p style={{margin:0,fontSize:12,color:"#718096",wordBreak:"break-word"}}>🌍 {(c.langues||[]).map(l=>typeof l==="string"?l:l.langue).filter(Boolean).join(", ")} · 💰 {c.salaire} · 📅 {c.disponibilite}{(c.modalites||[]).length>0?` · 🏢 ${(c.modalites||[]).join(" / ")}`:""}</p>
                    <p style={{margin:"5px 0 0",fontSize:12,color:NAVY,fontWeight:500,wordBreak:"break-word"}}>📞 {c.tel||"non renseigné"} · ✉️ {c.email||"non renseigné"}</p>
                  </div>
                  <div style={{display:"flex",flexDirection:isMobile?"row":"column",gap:6,flexShrink:0,flexBasis:isMobile?"100%":"auto"}}>
                    {statut==="en_attente"&&<><button onClick={()=>validerCandidat(c.id,"valide")} style={{padding:"9px 12px",borderRadius:7,background:"#F0FDF4",color:"#166534",border:"1px solid #BBF7D0",fontSize:12,cursor:"pointer",fontWeight:500,flex:isMobile?1:"none"}}>✓ Valider</button><button onClick={()=>validerCandidat(c.id,"refuse")} style={{padding:"9px 12px",borderRadius:7,background:"#FEF2F2",color:"#991B1B",border:"1px solid #FECACA",fontSize:12,cursor:"pointer",flex:isMobile?1:"none"}}>✕ Refuser</button></>}
                    {statut==="refuse"&&<button onClick={()=>validerCandidat(c.id,"en_attente")} style={{padding:"9px 12px",borderRadius:7,background:CREAM,color:NAVY,border:"1px solid #E2E8F0",fontSize:12,cursor:"pointer",flex:isMobile?1:"none"}}>↩ Remettre</button>}
                    {statut==="valide"&&<button onClick={()=>validerCandidat(c.id,"refuse")} style={{padding:"9px 12px",borderRadius:7,background:"transparent",color:"#718096",border:"1px solid #E2E8F0",fontSize:12,cursor:"pointer",flex:isMobile?1:"none"}}>Archiver</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  const renderShortlists=()=>(
    <div style={{padding:pad}}>
      <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Historique</p>
      <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 18px"}}>Short-lists envoyées</h2>
      {!shortlistSent.length&&<p style={{fontSize:13,color:"#A0AEC0",textAlign:"center",padding:"32px 0"}}>Aucune short-list générée pour le moment.<br/>Traitez une demande pour en créer une.</p>}
      {shortlistSent.map((sl,i)=>(
        <div key={i} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,overflow:"hidden",marginBottom:16}}>
          <div style={{background:NAVY,padding:isMobile?"12px 14px":"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <div style={{minWidth:0}}><p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:"#fff",wordBreak:"break-word"}}>{sl.poste}</p><p style={{margin:0,fontSize:12,color:"rgba(255,255,255,0.6)",wordBreak:"break-word"}}>{sl.entreprise} · {sl.contact} · {sl.date}</p></div>
            <Badge bg={GOLD_LIGHT} color={NAVY} label={`${sl.candidats.length} profils`}/>
          </div>
          <div style={{padding:isMobile?"12px 14px":"14px 18px"}}>
            {sl.candidats.map((c,j)=>(
              <div key={c.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:j<sl.candidats.length-1?"1px solid #F0F4F8":"none"}}>
                <Avatar prenom={c.prenom||""} nom={c.nom||""} size={36}/>
                <div style={{flex:1,minWidth:0}}><p style={{margin:"0 0 2px",fontSize:13,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{j+1}. {c.prenom} {c.nom}</p><p style={{margin:0,fontSize:12,color:"#718096",wordBreak:"break-word"}}>{c.titre} · {c.niveau} · {c.disponibilite}</p></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderPaiements = () => (
    <div style={{padding:pad}}>
      <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Trésorerie</p>
      <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 18px"}}>Paiements — {paiements.length}</h2>
      {paiements.length===0 && !loading && <p style={{color:"#A0AEC0",fontSize:13,textAlign:"center",padding:"32px 0"}}>Aucun paiement pour le moment.</p>}
      {["en_attente","confirme"].map(statut=>{
        const list = paiements.filter(p=>p.statut===statut);
        if(!list.length) return null;
        const styleSt = statut==="en_attente"
          ? {bg:GOLD_LIGHT,color:"#92400E",label:"En attente de confirmation"}
          : {bg:"#F0FDF4",color:"#166534",label:"Confirmé"};
        return (
          <div key={statut} style={{marginBottom:20}}>
            <p style={{fontSize:12,fontWeight:500,color:"#4A5568",margin:"0 0 8px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><Badge {...styleSt}/><span>{list.length} paiement{list.length>1?"s":""}</span></p>
            {list.map(p=>{
              const dem = demandes.find(d=>d.id===p.demande_id);
              const enCours = confirmant === p.id;
              return (
                <div key={p.id} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,padding:isMobile?"12px 14px":"14px 16px",marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:"wrap"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{margin:"0 0 2px",fontSize:15,fontWeight:600,color:NAVY}}>{p.montant_total?.toLocaleString("fr-FR")} MAD <span style={{fontSize:12,color:"#718096",fontWeight:400,marginLeft:6}}>({p.nb_cv} × {p.montant_unitaire?.toLocaleString("fr-FR")} MAD)</span></p>
                      <p style={{margin:"0 0 2px",fontSize:12,color:NAVY,wordBreak:"break-word"}}>📧 {p.recruteur_email}</p>
                      {dem && <p style={{margin:0,fontSize:12,color:"#718096",wordBreak:"break-word"}}>📋 {dem.poste} — {dem.entreprise}</p>}
                      <p style={{margin:"4px 0 0",fontSize:11,color:"#A0AEC0",wordBreak:"break-word"}}>Réf. {p.reference_virement || "—"} · {p.mode_paiement} · Signalé le {new Date(p.created_at).toLocaleDateString("fr-FR")}{p.date_confirmation && <span> · Confirmé le {new Date(p.date_confirmation).toLocaleDateString("fr-FR")}</span>}</p>
                    </div>
                    {statut==="en_attente" && (
                      <button onClick={()=>confirmerPaiement(p)} disabled={enCours} style={{padding:"11px 16px",borderRadius:7,background:enCours?"#E2E8F0":"#166534",color:enCours?"#A0AEC0":"#fff",border:"none",fontSize:12.5,cursor:enCours?"default":"pointer",fontWeight:600,whiteSpace:"nowrap",width:isMobile?"100%":"auto"}}>{enCours ? "Confirmation…" : "✓ Confirmer"}</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );

  const content=tab==="dashboard"?renderDashboard():tab==="demandes"?renderDemandes():tab==="cvtheque"?renderCvtheque():tab==="paiements"?renderPaiements():renderShortlists();

  return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Header/><Nav/>
      <div style={{flex:1}}>{content}</div>
    </div>
  );
}