import { supabase } from './supabase'
import AdminDashboard from './Admin'
import Logo from './Logo'
import { useState, useEffect } from "react";

// Assets
import casaImage from './assets/casa-finance-city.jpg'
import handshakeImage from './assets/handshake.jpg'

const NAVY = "#0B2545";
const GOLD = "#C8A046";
const CREAM = "#F8F5ED";
const GOLD_LIGHT = "#F5EDD6";
const NAVY2 = "#1a3a6b";

/* ───── DONNÉES COMMUNES ───── */
const SPECS=[
  {cat:"Droit des entreprises",items:["Droit des sociétés","Droit commercial","Droit des contrats","Droit fiscal","Droit social / RH","Droit bancaire & financier","Droit de la propriété intellectuelle","Droit de la concurrence","Compliance & conformité","Droit numérique & IT","Droit des données personnelles","Droit des assurances","Droit des procédures collectives","Droit des sûretés","Droit boursier & marchés financiers","Finance islamique / Banque participative","Droit des télécommunications","Droit de la sécurité sociale"]},
  {cat:"Droit du contentieux",items:["Droit pénal des affaires","Droit pénal général","Arbitrage & MARD","Droit de l'exécution forcée","Recouvrement de créances","Droit administratif","Droit public"]},
  {cat:"Droit notarial & immobilier",items:["Droit notarial","Droit immobilier","Droit de l'urbanisme","Droit de la famille","Droit des successions"]},
  {cat:"Droit sectoriel",items:["Droit de l'énergie","Droit minier","Droit des transports & logistique","Droit de la santé & bioéthique","Droit rural & agricole","Droit du tourisme & de l'hôtellerie"]},
  {cat:"Droit international & spécialisé",items:["Droit international des affaires","Droit OHADA","Droit du sport","Droit maritime","Droit de l'environnement","Droit de la consommation","Droit humanitaire","Droit du travail international & mobilité"]},
];
const LGLIST=["Arabe","Français","Anglais","Espagnol","Allemand","Italien","Portugais","Amazigh","Mandarin"];
const NIVLG=["Notions","Intermédiaire","Courant","Bilingue","Langue maternelle"];
const FOURCH=["Moins de 5 000 MAD/mois","5 000 – 8 000 MAD/mois","8 000 – 12 000 MAD/mois","12 000 – 18 000 MAD/mois","18 000 – 25 000 MAD/mois","25 000 – 35 000 MAD/mois","Plus de 35 000 MAD/mois"];
const CONTRATS=["CDI","CDD","Stage","Freelance / Consulting","Associé(e)","Collaborateur libéral"];
const DISPOS=["Immédiatement","Sous 1 mois","Sous 3 mois","En veille passive"];
const MODALITES=["Présentiel","Hybride","Télétravail"];
const NIVEAUX_RH=[{val:"stagiaire",label:"Stagiaire",sub:"0 an"},{val:"junior",label:"Junior",sub:"1 – 3 ans"},{val:"confirme",label:"Confirmé",sub:"3 – 7 ans"},{val:"senior",label:"Senior",sub:"7 – 12 ans"},{val:"directeur",label:"Directeur juridique",sub:"12 ans +"}];
const DIPLOMES_RH=[{val:"licence",label:"Licence en droit"},{val:"licence_bac4",label:"Licence (ancien système, Bac+4)"},{val:"master1",label:"Master I"},{val:"master2",label:"Master II / DESA"},{val:"doctorat",label:"Doctorat"},{val:"barreau",label:"Diplôme du Barreau"},{val:"notariat",label:"Notariat"},{val:"indifferent",label:"Indifférent"}];
const LANGUES_RH=["Arabe","Français","Anglais","Espagnol","Allemand","Italien","Mandarin"];
const STEPS_C=["Identité","Formation","Expériences","Spécialisations","Langues","Préférences","Aperçu"];
const STEPS_R=["Votre profil","Genre & Langues","Expérience & Diplôme","Spécialisation","Confirmation"];

/* ── Listes pour la saisie guidée (candidat) ── */
const PAYS=["Maroc","France","Algérie","Tunisie","Mauritanie","Sénégal","Côte d'Ivoire","Mali","Burkina Faso","Bénin","Togo","Niger","Guinée","Cameroun","Gabon","Congo (Brazzaville)","RD Congo","Tchad","Madagascar","Belgique","Suisse","Canada","Autre"];
const VILLES={
  "Maroc":["Casablanca","Rabat","Salé","Témara","Marrakech","Fès","Tanger","Tétouan","Meknès","Oujda","Kénitra","Agadir","Mohammedia","El Jadida","Settat","Béni Mellal","Khouribga","Nador","Safi","Khémisset","Berrechid","Larache","Taza","Errachidia","Laâyoune","Dakhla"],
  "France":["Paris","Lyon","Marseille","Toulouse","Bordeaux","Lille","Nantes","Strasbourg","Montpellier","Rennes","Nice","Grenoble","Aix-en-Provence"],
  "Algérie":["Alger","Oran","Constantine","Annaba"],
  "Tunisie":["Tunis","Sfax","Sousse"],
  "Sénégal":["Dakar","Thiès","Saint-Louis"],
  "Côte d'Ivoire":["Abidjan","Yamoussoukro","Bouaké"],
  "Cameroun":["Yaoundé","Douala"],
  "Mali":["Bamako"],
  "Burkina Faso":["Ouagadougou","Bobo-Dioulasso"],
  "Bénin":["Cotonou","Porto-Novo"],
  "Togo":["Lomé"],
  "Niger":["Niamey"],
  "Guinée":["Conakry"],
  "Gabon":["Libreville"],
  "Congo (Brazzaville)":["Brazzaville","Pointe-Noire"],
  "RD Congo":["Kinshasa","Lubumbashi"],
  "Mauritanie":["Nouakchott"],
  "Madagascar":["Antananarivo"],
};
const TITRES=["Étudiant(e) en droit","Stagiaire juridique","Juriste junior","Juriste","Juriste d'entreprise","Juriste d'affaires","Juriste contentieux","Juriste senior","Juriste contrats / Contract Manager","Juriste corporate","Juriste droit social / RH","Juriste bancaire","Juriste assurance","Juriste immobilier","Juriste propriété intellectuelle","Juriste compliance","Juriste & Gestionnaire de sinistres","Juriste transport & logistique","Juriste recouvrement","Juriste données personnelles / DPO","Avocat(e)","Avocat(e) stagiaire","Élève-avocat(e)","Notaire","Notaire stagiaire","Clerc de notaire","Assistant(e) juridique / Paralegal","Compliance Officer / Conformité","Risk & Compliance Manager","Fiscaliste","Responsable juridique","Directeur(trice) juridique","Secrétaire général(e)","Consultant(e) juridique","Arbitre / Médiateur(trice)","Magistrat(e)","Huissier de justice","Enseignant(e)-chercheur(se) en droit"];
const DIPLOMES_CAND=[
  {val:"bac",label:"Baccalauréat"},
  {val:"deug",label:"DEUG / Bac+2"},
  {val:"licence",label:"Licence"},
  {val:"licence_bac4",label:"Licence (ancien système, Bac+4)"},
  {val:"master1",label:"Master I"},
  {val:"master2",label:"Master II / DESA / DESS / DEA"},
  {val:"barreau",label:"CAPA (avocat — France)"},
  {val:"doctorat",label:"Doctorat"},
  {val:"autre",label:"Autre"},
];
const ECOLES=[
  "Université Mohammed V de Rabat — FSJES Agdal","Université Mohammed V de Rabat — FSJES Souissi","Université Hassan II de Casablanca — FSJES Aïn Chock","Université Hassan II de Casablanca — FSJES Mohammedia","Université Cadi Ayyad — FSJES Marrakech","Université Ibn Tofaïl — FSJES Kénitra","Université Abdelmalek Essaâdi — FSJES Tanger / Tétouan","Université Sidi Mohamed Ben Abdellah — FSJES Fès","Université Mohammed Premier — FSJES Oujda","Université Ibn Zohr — FSJES Agadir","Université Hassan 1er — FSJES Settat","Université Moulay Ismaïl — FSJES Meknès","Université Chouaïb Doukkali — FSJES El Jadida","Université Sultan Moulay Slimane — FSJES Béni Mellal","Université Internationale de Rabat (UIR)","Université Internationale de Casablanca (UIC)","Université Mundiapolis — Casablanca","ISCAE — Casablanca / Rabat",
  "Université Paris 1 Panthéon-Sorbonne","Université Paris 2 Panthéon-Assas","Université Paris Nanterre","Université Paris Cité","Université Paris-Saclay","Université Paris-Est Créteil (UPEC)","Université Sorbonne Paris Nord","Université de Versailles Saint-Quentin (UVSQ)","CY Cergy Paris Université","Université Gustave Eiffel","Sciences Po Paris","Université Aix-Marseille","Université Jean Moulin Lyon 3","Université Lumière Lyon 2","Université de Bordeaux","Université de Montpellier","Université Toulouse 1 Capitole","Université de Strasbourg","Université de Lille","Université de Rennes 1","Université de Nantes","Université Grenoble Alpes","Université Côte d'Azur (Nice)","Université de Lorraine","Université de Bourgogne (Dijon)","Université Clermont Auvergne","Université de Caen Normandie","Université de Rouen Normandie","Université de Poitiers","Université de Limoges","Université de Tours","Université d'Orléans","Université de Reims Champagne-Ardenne","Université de Franche-Comté (Besançon)","Université de Pau et des Pays de l'Adour","Université de Bretagne Occidentale (Brest)","Université de Perpignan Via Domitia","Université de Picardie Jules Verne (Amiens)","Université Savoie Mont Blanc","Université de La Rochelle","Université d'Avignon",
  "Université catholique de Louvain (UCLouvain)","Université libre de Bruxelles (ULB)","Université de Liège (ULiège)","Université de Namur (UNamur)","UCLouvain Saint-Louis Bruxelles",
  "Université Cheikh Anta Diop (UCAD), Dakar","Université Félix Houphouët-Boigny, Abidjan","Université de Yaoundé II (Soa)","Université de Douala","Université des Sciences Juridiques et Politiques de Bamako (USJPB)","Université Thomas Sankara (Ouagadougou)","Université Joseph Ki-Zerbo (Ouagadougou)","Université d'Abomey-Calavi","Université de Lomé","Université Abdou Moumouni (Niamey)","Université Omar Bongo (Libreville)","Université Marien Ngouabi (Brazzaville)","Université de Kinshasa (UNIKIN)","Université de Lubumbashi","Université Général Lansana Conté de Sonfonia (Conakry)","Université de Nouakchott","Université d'Antananarivo","Université de Tunis El Manar — Faculté de droit de Tunis","Faculté de droit de Sfax","Université d'Alger 1 — Faculté de droit (Ben Aknoun)","Université d'Oran",
];

let uid=50; const nid=()=>++uid;

/* Détecte les écrans étroits (mobile) pour adapter les styles inline.
   Seuil 768px = tablette/mobile. Écoute le redimensionnement de la fenêtre. */
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
const iSt={padding:"8px 11px",borderRadius:7,fontSize:13,border:"1.5px solid #CBD5E0",background:"#fff",color:NAVY,outline:"none",width:"100%",boxSizing:"border-box"};
const Inp=({val,onChange,ph,style,filter})=><input value={val} onChange={e=>onChange(filter?filter(e.target.value):e.target.value)} placeholder={ph} style={{...iSt,...style}}/>;
const Lbl=({t,r})=><label style={{fontSize:12,fontWeight:500,color:"#4A5568",display:"block",marginBottom:5}}>{t}{r&&<span style={{color:GOLD,marginLeft:3}}>*</span>}</label>;
const Pill=({active,onClick,children})=><button onClick={onClick} style={{padding:"6px 13px",borderRadius:20,fontSize:12.5,cursor:"pointer",background:active?NAVY:"transparent",color:active?"#fff":NAVY,border:`1.5px solid ${active?NAVY:"#CBD5E0"}`,fontWeight:active?500:400}}>{children}</button>;
const SecTitle=({t})=><p style={{fontSize:11,fontWeight:500,color:GOLD,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 10px",borderBottom:`1px solid ${CREAM}`,paddingBottom:6}}>{t}</p>;

/* Calcule la durée entre deux dates MM/AAAA (ou « en cours ») */
const calcDuree=(debut,fin,encours)=>{
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
};

/* Tri antichronologique pour l'affichage : expériences (en cours d'abord, puis début décroissant), formations (année décroissante) */
const moisAbs=s=>{const a=(s||"").split("/");return a.length===2?(parseInt(a[1],10)||0)*12+(parseInt(a[0],10)||0):0;};
const triExp=list=>[...(list||[])].sort((a,b)=>(!!b.encours-!!a.encours)||(moisAbs(b.debut)-moisAbs(a.debut)));
const triFo=list=>[...(list||[])].sort((a,b)=>((parseInt(b.annee,10)||0)-(parseInt(a.annee,10)||0)));

/* Menu déroulant avec option « Autre… » qui révèle un champ libre */
function SelectOuAutre({value,options,onChange,ph}){
  const known=options.includes(value);
  const [autre,setAutre]=useState(value!=="" && !known);
  return(
    <>
      <select value={autre?"__autre__":value} onChange={e=>{const v=e.target.value; if(v==="__autre__"){setAutre(true);onChange("");}else{setAutre(false);onChange(v);}}} style={{...iSt,cursor:"pointer"}}>
        <option value="">— Sélectionner —</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
        <option value="__autre__">Autre…</option>
      </select>
      {autre&&<input value={value} onChange={e=>onChange(e.target.value)} placeholder={ph||"Précisez"} style={{...iSt,marginTop:8}}/>}
    </>
  );
}

/* ───── ÉCRAN DE CHARGEMENT ───── */
function Chargement(){
  return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <Logo/>
      <p style={{fontSize:13,color:"#718096"}}>Chargement…</p>
    </div>
  );
}

/* ═══════════════════════════════════════
   LANDING PAGE — Édition claire
═══════════════════════════════════════ */
function Landing({onChoose}){
  useEffect(()=>{
    if(!document.getElementById('gfont-jurijob-landing')){
      const l=document.createElement('link'); l.id='gfont-jurijob-landing'; l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
      document.head.appendChild(l);
    }
  },[]);
  const ff = "'Inter',system-ui,sans-serif";
  const fs = "'Cormorant Garamond',Georgia,serif";
  const [hov,setHov] = useState(null);
  const isMobile = useIsMobile();

  const cardStyle = (key) => ({
    background:"#fff",
    border:`1px solid ${hov===key?"#C8A046":"#E2E8F0"}`,
    borderRadius:10,
    padding:"22px 20px",
    transition:"all .2s",
    transform:hov===key?"translateY(-2px)":"none",
    boxShadow:hov===key?"0 8px 20px rgba(11,37,69,0.06)":"none",
    cursor:"default"
  });

  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c"}}>
      {/* NAV */}
      <nav style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:isMobile?"0 16px":"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center",height:64,position:"sticky",top:0,zIndex:10}}>
        <Logo size="header"/>
        <div style={{display:"flex",alignItems:"center",gap:isMobile?10:24}}>
          {!isMobile&&<button onClick={()=>onChoose("services")} style={{background:"none",border:"none",color:"#4A5568",fontSize:13,cursor:"pointer",fontFamily:ff}}>Services</button>}
          {!isMobile&&<button onClick={()=>onChoose("faq")} style={{background:"none",border:"none",color:"#4A5568",fontSize:13,cursor:"pointer",fontFamily:ff}}>FAQ</button>}
          <button onClick={()=>onChoose("candidat")} style={{background:"transparent",color:NAVY,border:`1.5px solid ${NAVY}`,borderRadius:6,padding:isMobile?"7px 12px":"8px 17px",fontSize:isMobile?12:13,fontWeight:500,cursor:"pointer",fontFamily:ff}}>{isMobile?"Candidat":"Espace Candidat"}</button>
          <button onClick={()=>onChoose("recruteur")} style={{background:NAVY,color:"#fff",border:"none",borderRadius:6,padding:isMobile?"8px 13px":"9px 18px",fontSize:isMobile?12:13,fontWeight:500,cursor:"pointer",fontFamily:ff}}>{isMobile?"Recruteur":"Espace Recruteur"}</button>
        </div>
      </nav>

      {/* HERO avec photo Casa Finance City en arrière-plan */}
      <section style={{position:"relative",overflow:"hidden",minHeight:"min(560px,75vh)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`url(${casaImage})`,backgroundSize:"cover",backgroundPosition:"center"}} aria-hidden="true"/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, rgba(11,37,69,0.92) 0%, rgba(11,37,69,0.78) 50%, rgba(26,58,107,0.72) 100%)"}} aria-hidden="true"/>
        <div style={{position:"relative",zIndex:2,padding:isMobile?"56px 20px":"80px 32px",maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 18px",fontWeight:500,fontFamily:ff}}>Recrutement juridique · Maroc & Afrique francophone</p>
          <h1 style={{fontFamily:fs,fontSize:isMobile?32:52,lineHeight:1.15,color:"#fff",fontWeight:500,margin:"0 auto 18px",letterSpacing:isMobile?-0.5:-0.8,maxWidth:760,textShadow:"0 2px 12px rgba(0,0,0,0.25)"}}>
            Le recrutement juridique,<br/>à la hauteur de <em style={{color:GOLD,fontStyle:"italic",fontWeight:500}}>vos exigences.</em>
          </h1>
          <p style={{fontSize:15,lineHeight:1.7,color:"rgba(255,255,255,0.82)",maxWidth:580,margin:"0 auto 36px",fontWeight:300,fontFamily:ff}}>
            JURIJOB identifie les meilleurs profils juridiques pour les directions juridiques et RH des grandes structures, au Maroc et en Afrique francophone. Discrétion, expertise, sélection sur mesure.
          </p>
          <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center",flexDirection:isMobile?"column":"row",alignItems:"center"}}>
            <button onClick={()=>onChoose("recruteur")} onMouseEnter={()=>setHov("cta1")} onMouseLeave={()=>setHov(null)}
              style={{background:hov==="cta1"?"#d4ad4f":GOLD,color:NAVY,fontWeight:600,fontSize:13.5,padding:"13px 28px",borderRadius:7,cursor:"pointer",border:"none",letterSpacing:.2,transition:"all .2s",transform:hov==="cta1"?"translateY(-2px)":"none",boxShadow:hov==="cta1"?"0 8px 20px rgba(200,160,70,0.3)":"none",fontFamily:ff,width:isMobile?"100%":"auto",maxWidth:isMobile?320:"none"}}>
              Je recrute un juriste → Déposer une demande
            </button>
            <button onClick={()=>onChoose("candidat")} onMouseEnter={()=>setHov("cta2")} onMouseLeave={()=>setHov(null)}
              style={{background:hov==="cta2"?"#F1F5F9":"#fff",color:NAVY,fontWeight:600,fontSize:13.5,padding:"13px 28px",borderRadius:7,cursor:"pointer",border:"none",letterSpacing:.2,transition:"all .2s",transform:hov==="cta2"?"translateY(-2px)":"none",boxShadow:hov==="cta2"?"0 8px 20px rgba(255,255,255,0.25)":"none",fontFamily:ff,width:isMobile?"100%":"auto",maxWidth:isMobile?320:"none"}}>
              Je suis juriste → Créer mon profil
            </button>
          </div>
        </div>
      </section>

      {/* CHIFFRES */}
      <section style={{padding:"36px 32px",borderTop:"1px solid #E2E8F0",borderBottom:"1px solid #E2E8F0",background:"#fff"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:24,textAlign:"center"}}>
          {[
            ["48h","Délai short-list garanti"],
            ["24 ans","D'expérience juridique"],
            ["Maroc + Afrique","Couverture géographique"]
          ].map(([v,l])=>(
            <div key={l}>
              <p style={{fontFamily:fs,fontSize:36,color:NAVY,fontWeight:500,margin:"0 0 6px",lineHeight:1,letterSpacing:-0.5}}>{v}</p>
              <p style={{fontSize:10.5,color:"#718096",textTransform:"uppercase",letterSpacing:1.4,margin:0,fontFamily:ff}}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* POURQUOI JURIJOB */}
      <section style={{padding:"56px 32px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{marginBottom:36,textAlign:"center"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 10px",fontWeight:500,fontFamily:ff}}>Pourquoi JURIJOB</p>
          <h2 style={{fontFamily:fs,fontSize:32,color:NAVY,fontWeight:500,margin:"0 0 10px",letterSpacing:-0.4}}>Une alternative aux plateformes RH généralistes.</h2>
          <p style={{fontSize:14,color:"#4A5568",margin:"0 auto",maxWidth:620,fontFamily:ff,fontWeight:300,lineHeight:1.6}}>Pensée par et pour les juristes, JURIJOB s'appuie sur 24 ans d'expérience en direction juridique et sur le réseau d'un leader des juristes d'entreprise au Maroc, riche de plusieurs dizaines de milliers de contacts professionnels.</p>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:16}}>
          <div onMouseEnter={()=>setHov("c1")} onMouseLeave={()=>setHov(null)} style={cardStyle("c1")}>
            <div style={{width:32,height:32,background:GOLD_LIGHT,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:GOLD,fontSize:16,fontWeight:600,fontFamily:fs}}>§</div>
            <h3 style={{fontFamily:fs,fontSize:19,color:NAVY,fontWeight:600,margin:"0 0 8px"}}>Une expertise terrain</h3>
            <p style={{fontSize:13,color:"#4A5568",lineHeight:1.65,margin:0,fontFamily:ff}}>Chaque short-list est validée par un ex-Directeur juridique ayant lui-même recruté des dizaines de juristes au Maroc et en Afrique. La sélection comprend les codes du métier.</p>
          </div>
          <div onMouseEnter={()=>setHov("c2")} onMouseLeave={()=>setHov(null)} style={cardStyle("c2")}>
            <div style={{width:32,height:32,background:GOLD_LIGHT,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:GOLD,fontSize:16,fontWeight:600,fontFamily:fs}}>◆</div>
            <h3 style={{fontFamily:fs,fontSize:19,color:NAVY,fontWeight:600,margin:"0 0 8px"}}>Confidentialité absolue</h3>
            <p style={{fontSize:13,color:"#4A5568",lineHeight:1.65,margin:0,fontFamily:ff}}>Hébergement sécurisé, accès aux profils strictement limité aux paiements confirmés, aucune diffusion publique. Conforme à la loi marocaine 09-08.</p>
          </div>
          <div onMouseEnter={()=>setHov("c3")} onMouseLeave={()=>setHov(null)} style={cardStyle("c3")}>
            <div style={{width:32,height:32,background:GOLD_LIGHT,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:GOLD,fontSize:16,fontWeight:600,fontFamily:fs}}>○</div>
            <h3 style={{fontFamily:fs,fontSize:19,color:NAVY,fontWeight:600,margin:"0 0 8px"}}>Sélection sur mesure</h3>
            <p style={{fontSize:13,color:"#4A5568",lineHeight:1.65,margin:0,fontFamily:ff}}>Spécialisations, langues, séniorité, formation : chaque critère est pris en compte. Une short-list courte et qualifiée, pas un déluge de CV.</p>
          </div>
          <div onMouseEnter={()=>setHov("c4")} onMouseLeave={()=>setHov(null)} style={cardStyle("c4")}>
            <div style={{width:32,height:32,background:GOLD_LIGHT,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:GOLD,fontSize:16,fontWeight:600,fontFamily:fs}}>⊙</div>
            <h3 style={{fontFamily:fs,fontSize:19,color:NAVY,fontWeight:600,margin:"0 0 8px"}}>100% juridique</h3>
            <p style={{fontSize:13,color:"#4A5568",lineHeight:1.65,margin:0,fontFamily:ff}}>Juristes d'entreprise, juristes en cabinet, notaires, compliance officers, fiscalistes. Aucune dilution dans un catalogue généraliste.</p>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section style={{padding:"56px 32px",background:"#F8F5ED",borderTop:"1px solid #E2E8F0",borderBottom:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{marginBottom:32,textAlign:"center"}}>
            <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 10px",fontWeight:500,fontFamily:ff}}>Notre approche</p>
            <h2 style={{fontFamily:fs,fontSize:32,color:NAVY,fontWeight:500,margin:0,letterSpacing:-0.4}}>Un processus simple et supervisé.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:18}}>
            {[
              {n:"01",t:"Vous déposez votre demande",d:"Critères précis : spécialisation, niveau, langues, diplôme. Quelques minutes suffisent."},
              {n:"02",t:"Notre équipe sélectionne",d:"Recherche dans la CVthèque et le réseau professionnel. Évaluation manuelle de chaque profil."},
              {n:"03",t:"Vous recevez votre short-list",d:"Sous 48 heures ouvrées. Profils qualifiés et coordonnées complètes après confirmation du paiement."}
            ].map(s=>(
              <div key={s.n} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,padding:"22px 20px"}}>
                <p style={{fontFamily:fs,fontSize:28,color:GOLD,fontWeight:500,margin:"0 0 10px",lineHeight:1}}>{s.n}</p>
                <h3 style={{fontFamily:fs,fontSize:17,color:NAVY,fontWeight:600,margin:"0 0 8px"}}>{s.t}</h3>
                <p style={{fontSize:12.5,color:"#4A5568",lineHeight:1.6,margin:0,fontFamily:ff}}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOC FONDATEUR / SLA */}
      <section style={{padding:"56px 32px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{background:"#fff",border:`1px solid ${GOLD_LIGHT}`,borderRadius:12,padding:"32px 36px",display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:NAVY,color:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:fs,fontSize:28,fontWeight:600,flexShrink:0}}>MS</div>
          <div style={{flex:1,minWidth:280}}>
            <p style={{color:GOLD,fontSize:10.5,letterSpacing:2,textTransform:"uppercase",margin:"0 0 6px",fontWeight:500,fontFamily:ff}}>Fondateur</p>
            <h3 style={{fontFamily:fs,fontSize:22,color:NAVY,fontWeight:600,margin:"0 0 4px",letterSpacing:-0.2}}>Mohammed Sentissi</h3>
            <p style={{fontSize:13,color:"#4A5568",margin:"0 0 12px",fontFamily:ff,lineHeight:1.5}}>Expert juridique, ex-Directeur juridique de holdings au Maroc et en Afrique. Président élu de l'Association marocaine des juristes d'entreprise — AMJE (en cours de constitution). Fondateur de Sentissi Legal Advisory.</p>
            <p style={{fontFamily:fs,fontSize:15,color:NAVY,fontStyle:"italic",fontWeight:500,margin:0,lineHeight:1.5,borderLeft:`2px solid ${GOLD}`,paddingLeft:14}}>« Recruter un juriste, ce n'est pas remplir un poste. C'est trouver la personne qui parlera la langue du droit et celle de votre entreprise. »</p>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section style={{padding:"64px 32px",background:NAVY,textAlign:"center"}}>
        <div style={{maxWidth:640,margin:"0 auto"}}>
          <h2 style={{fontFamily:fs,fontSize:32,color:"#fff",fontWeight:500,margin:"0 0 14px",letterSpacing:-0.4}}>Identifiez votre prochain <em style={{color:GOLD,fontStyle:"italic"}}>talent juridique.</em></h2>
          <p style={{fontSize:14,color:"rgba(255,255,255,0.6)",margin:"0 0 28px",lineHeight:1.6,fontFamily:ff,fontWeight:300}}>Décrivez votre besoin en quelques minutes. Nous vous recontactons sous 48 heures avec une short-list qualifiée.</p>
          <button onClick={()=>onChoose("recruteur")} onMouseEnter={()=>setHov("ctaf")} onMouseLeave={()=>setHov(null)}
            style={{background:hov==="ctaf"?"#d4ad4f":GOLD,color:NAVY,fontWeight:600,fontSize:13.5,padding:"14px 32px",borderRadius:7,cursor:"pointer",border:"none",letterSpacing:.2,transition:"all .2s",fontFamily:ff}}>
            Démarrer ma recherche →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#fff",padding:"24px 32px",borderTop:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Logo size="compact"/>
            <span style={{fontSize:11,color:"#A0AEC0",fontFamily:ff}}>© 2026 — Smart Recrutement Juridique</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <button onClick={()=>onChoose("services")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Services</button>
            <button onClick={()=>onChoose("faq")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>FAQ</button>
            <button onClick={()=>onChoose("legal")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Mentions légales</button>
            <span style={{fontSize:12,color:"#4A5568",fontFamily:ff}}>recrutement@sentissilegal.com</span>
            <button onClick={()=>onChoose("admin")} style={{background:"none",border:"none",color:"#A0AEC0",fontSize:10.5,cursor:"pointer",fontFamily:ff}}>Admin</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   Traduction des messages d'erreur Supabase
═══════════════════════════════════════ */
const FR_ERR={
  "Invalid login credentials":"E-mail ou mot de passe incorrect.",
  "Email not confirmed":"Votre e-mail n'a pas encore été confirmé. Vérifiez votre boîte de réception (et le dossier « Autres »/spam).",
  "User already registered":"Un compte existe déjà avec cette adresse e-mail.",
  "Password should be at least 6 characters":"Le mot de passe doit contenir au moins 6 caractères.",
  "Unable to validate email address: invalid format":"Adresse e-mail invalide.",
  "For security purposes, you can only request this after 60 seconds.":"Pour des raisons de sécurité, patientez 60 secondes avant de réessayer.",
};
const frMsg = m => FR_ERR[m] || m;

/* ═══════════════════════════════════════
   CONNEXION RECRUTEUR (e-mail / mot de passe)
═══════════════════════════════════════ */
function AuthRecruteur({onBack,onSwitch}){
  const [mode,setMode]=useState("login"); // "login" | "signup" | "reset"
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [entreprise,setEntreprise]=useState("");
  const [contact,setContact]=useState("");
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);

  const submit=async()=>{
    setMsg(""); setBusy(true);
    try{
      if(mode==="signup"){
        const {error}=await supabase.auth.signUp({email,password:pwd,options:{data:{entreprise,contact,role:'recruteur'}}});
        if(error){ setMsg(frMsg(error.message)); }
        else { setMsg("Compte créé ✔ Un e-mail de confirmation vous a été envoyé : validez-le puis connectez-vous."); setMode("login"); }
      } else if(mode==="reset"){
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
        if(error){ setMsg(frMsg(error.message)); }
        else { setMsg("✔ Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé. Pensez à vérifier le dossier « Autres »/spam."); }
      } else {
        const {error}=await supabase.auth.signInWithPassword({email,password:pwd});
        if(error){ setMsg(frMsg(error.message)); }
        // succès : la session déclenche automatiquement l'ouverture de l'espace recruteur
      }
    } catch(e){ setMsg(frMsg(e.message)); }
    setBusy(false);
  };

  const invalide = busy||!email.trim()||(mode!=="reset"&&!pwd.trim())||(mode==="signup"&&!entreprise.trim());
  const titre = mode==="login"?"Connexion":mode==="signup"?"Créer un compte":"Mot de passe oublié";
  const cta = busy?"…":(mode==="login"?"Se connecter":mode==="signup"?"Créer mon compte":"Envoyer le lien");

  return(
    <div style={{background:CREAM,minHeight:"100vh"}}>
      <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Accueil</button>
      </div>
      <div style={{padding:"40px 16px",maxWidth:420,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",padding:"28px 26px"}}>
          <p style={{fontSize:12,color:GOLD,fontWeight:500,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Espace Recruteur</p>
          <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:"0 0 20px"}}>{titre}</h2>
          {mode==="reset"&&<p style={{fontSize:12.5,color:"#718096",margin:"-8px 0 16px",lineHeight:1.5}}>Saisissez votre e-mail : vous recevrez un lien pour définir un nouveau mot de passe.</p>}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {mode==="signup"&&<div><Lbl t="Entreprise / Cabinet" r/><input value={entreprise} onChange={e=>setEntreprise(e.target.value)} placeholder="Nom de votre structure" style={iSt}/></div>}
            {mode==="signup"&&<div><Lbl t="Nom du contact RH"/><input value={contact} onChange={e=>setContact(e.target.value)} placeholder="Prénom Nom" style={iSt}/></div>}
            <div><Lbl t="E-mail professionnel" r/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="vous@entreprise.com" style={iSt}/></div>
            {mode!=="reset"&&<div><Lbl t="Mot de passe" r/><input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••" style={iSt}/></div>}
            {mode==="login"&&<button onClick={()=>{setMode("reset");setMsg("");}} style={{background:"none",border:"none",color:"#718096",fontSize:12,cursor:"pointer",padding:0,textAlign:"right",textDecoration:"underline",marginTop:-6}}>Mot de passe oublié ?</button>}
            {msg&&<p style={{fontSize:12.5,color:msg.includes("✔")?"#2F855A":"#E53E3E",margin:0,lineHeight:1.5}}>{msg}</p>}
            <button onClick={submit} disabled={invalide} style={{padding:"11px",borderRadius:8,fontSize:14,cursor:busy?"default":"pointer",background:invalide?"#E2E8F0":NAVY,color:invalide?"#A0AEC0":"#fff",border:"none",fontWeight:500}}>{cta}</button>
          </div>
          <p style={{fontSize:12.5,color:"#718096",textAlign:"center",marginTop:18}}>
            {mode==="reset"
              ? <button onClick={()=>{setMode("login");setMsg("");}} style={{background:"none",border:"none",color:GOLD,fontWeight:500,cursor:"pointer",fontSize:12.5}}>← Retour à la connexion</button>
              : <>{mode==="login"?"Pas encore de compte ? ":"Vous avez déjà un compte ? "}
                  <button onClick={()=>{setMode(mode==="login"?"signup":"login");setMsg("");}} style={{background:"none",border:"none",color:GOLD,fontWeight:500,cursor:"pointer",fontSize:12.5}}>
                    {mode==="login"?"Créer un compte":"Se connecter"}
                  </button></>}
          </p>
          <div style={{borderTop:"1px solid #F0F4F8",marginTop:16,paddingTop:14,textAlign:"center"}}>
            <p style={{fontSize:12.5,color:"#718096",margin:0}}>Vous êtes juriste et cherchez un poste ?{" "}
              <button onClick={onSwitch} style={{background:"none",border:"none",color:NAVY,fontWeight:600,cursor:"pointer",fontSize:12.5,textDecoration:"underline"}}>Créer mon profil candidat →</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   COMPTE / RÔLE NON CORRESPONDANT
═══════════════════════════════════════ */
function RoleMismatch({email,actualLabel,intendedLabel,onContinue,onLogout}){
  return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:16,padding:"36px 32px",maxWidth:440,width:"100%",border:"1px solid #E2E8F0",textAlign:"center"}}>
        <div style={{width:56,height:56,borderRadius:"50%",background:GOLD_LIGHT,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>⚠️</div>
        <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 12px"}}>Ce compte est un compte {actualLabel}</h2>
        <p style={{color:"#718096",fontSize:13.5,lineHeight:1.6,margin:"0 0 8px"}}>L'adresse <strong>{email}</strong> est déjà associée à un espace <strong>{actualLabel}</strong>, alors que vous tentez d'accéder à l'espace <strong>{intendedLabel}</strong>.</p>
        <p style={{color:"#A0AEC0",fontSize:12.5,lineHeight:1.6,margin:"0 0 22px"}}>Une même adresse e-mail ne peut avoir qu'un seul rôle. Pour être à la fois candidat et recruteur, utilisez deux adresses différentes.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <button onClick={onContinue} style={{padding:"11px",borderRadius:8,fontSize:14,cursor:"pointer",background:NAVY,color:"#fff",border:"none",fontWeight:500}}>Accéder à mon espace {actualLabel}</button>
          <button onClick={onLogout} style={{padding:"10px",borderRadius:8,fontSize:13,cursor:"pointer",background:"transparent",color:NAVY,border:"1.5px solid #CBD5E0"}}>Se déconnecter et changer de compte</button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CONNEXION CANDIDAT (Google OU e-mail/mot de passe)
═══════════════════════════════════════ */
function AuthCandidat({onBack,onGoogle,onSwitch}){
  const [mode,setMode]=useState("login"); // "login" | "signup"
  const [email,setEmail]=useState("");
  const [pwd,setPwd]=useState("");
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);

  const submit=async()=>{
    setMsg(""); setBusy(true);
    try{
      if(mode==="signup"){
        const {error}=await supabase.auth.signUp({email,password:pwd,options:{data:{role:'candidat'}}});
        if(error){ setMsg(frMsg(error.message)); }
        else { setMsg("Compte créé ✔ Un e-mail de confirmation vous a été envoyé : validez-le puis connectez-vous."); setMode("login"); }
      } else if(mode==="reset"){
        const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin});
        if(error){ setMsg(frMsg(error.message)); }
        else { setMsg("✔ Si un compte existe pour cette adresse, un e-mail de réinitialisation vient d'être envoyé. Pensez à vérifier le dossier « Autres »/spam."); }
      } else {
        const {error}=await supabase.auth.signInWithPassword({email,password:pwd});
        if(error){ setMsg(frMsg(error.message)); }
        // succès : la session ouvre automatiquement l'espace candidat
      }
    } catch(e){ setMsg(frMsg(e.message)); }
    setBusy(false);
  };

  const invalide = busy||!email.trim()||(mode!=="reset"&&!pwd.trim());
  const titre = mode==="login"?"Connexion":mode==="signup"?"Créer un compte":"Mot de passe oublié";
  const cta = busy?"…":(mode==="login"?"Se connecter":mode==="signup"?"Créer mon compte":"Envoyer le lien");

  return(
    <div style={{background:CREAM,minHeight:"100vh"}}>
      <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Accueil</button>
      </div>
      <div style={{padding:"40px 16px",maxWidth:420,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",padding:"28px 26px"}}>
          <p style={{fontSize:12,color:GOLD,fontWeight:500,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Espace Candidat</p>
          <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:"0 0 20px"}}>{titre}</h2>

          {mode!=="reset"&&<>
          <button onClick={onGoogle} style={{width:"100%",padding:"11px",borderRadius:8,fontSize:14,cursor:"pointer",background:"#fff",color:NAVY,border:"1.5px solid #CBD5E0",fontWeight:500,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
            <span style={{fontSize:16,fontWeight:700,color:"#4285F4"}}>G</span> Continuer avec Google
          </button>

          <div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0"}}>
            <div style={{flex:1,height:1,background:"#E2E8F0"}}/>
            <span style={{fontSize:12,color:"#A0AEC0"}}>ou par e-mail</span>
            <div style={{flex:1,height:1,background:"#E2E8F0"}}/>
          </div>
          </>}

          {mode==="reset"&&<p style={{fontSize:12.5,color:"#718096",margin:"-8px 0 16px",lineHeight:1.5}}>Saisissez votre e-mail : vous recevrez un lien pour définir un nouveau mot de passe.</p>}

          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div><Lbl t="E-mail" r/><input value={email} onChange={e=>setEmail(e.target.value)} placeholder="votre@email.com" style={iSt}/></div>
            {mode!=="reset"&&<div><Lbl t="Mot de passe" r/><input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••" style={iSt}/></div>}
            {mode==="login"&&<button onClick={()=>{setMode("reset");setMsg("");}} style={{background:"none",border:"none",color:"#718096",fontSize:12,cursor:"pointer",padding:0,textAlign:"right",textDecoration:"underline",marginTop:-6}}>Mot de passe oublié ?</button>}
            {msg&&<p style={{fontSize:12.5,color:msg.includes("✔")?"#2F855A":"#E53E3E",margin:0,lineHeight:1.5}}>{msg}</p>}
            <button onClick={submit} disabled={invalide} style={{padding:"11px",borderRadius:8,fontSize:14,cursor:busy?"default":"pointer",background:invalide?"#E2E8F0":NAVY,color:invalide?"#A0AEC0":"#fff",border:"none",fontWeight:500}}>{cta}</button>
          </div>
          <p style={{fontSize:12.5,color:"#718096",textAlign:"center",marginTop:18}}>
            {mode==="reset"
              ? <button onClick={()=>{setMode("login");setMsg("");}} style={{background:"none",border:"none",color:GOLD,fontWeight:500,cursor:"pointer",fontSize:12.5}}>← Retour à la connexion</button>
              : <>{mode==="login"?"Pas encore de compte ? ":"Vous avez déjà un compte ? "}
                  <button onClick={()=>{setMode(mode==="login"?"signup":"login");setMsg("");}} style={{background:"none",border:"none",color:GOLD,fontWeight:500,cursor:"pointer",fontSize:12.5}}>
                    {mode==="login"?"Créer un compte":"Se connecter"}
                  </button></>}
          </p>
          <div style={{borderTop:"1px solid #F0F4F8",marginTop:16,paddingTop:14,textAlign:"center"}}>
            <p style={{fontSize:12.5,color:"#718096",margin:0}}>Vous recrutez un juriste ?{" "}
              <button onClick={onSwitch} style={{background:"none",border:"none",color:NAVY,fontWeight:600,cursor:"pointer",fontSize:12.5,textDecoration:"underline"}}>Accéder à l'espace recruteur →</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ESPACE CANDIDAT
═══════════════════════════════════════ */
function EspaceCandidat({session,onLogout}){
  const meta=session?.user?.user_metadata||{};
  const authEmail=session?.user?.email||"";
  const fullName=meta.full_name||meta.name||"";
  const initPrenom=meta.given_name||fullName.split(" ")[0]||"";
  const initNom=meta.family_name||fullName.split(" ").slice(1).join(" ")||"";

  const [step,setStep]=useState(0);
  const [done,setDone]=useState(false);
  const [checking,setChecking]=useState(true);
  const [existing,setExisting]=useState(null);
  const [formMode,setFormMode]=useState(null); // null = création | 'edit' = modification
  const [deleted,setDeleted]=useState(false);
  const [savedMsg,setSavedMsg]=useState("");
  const [saving,setSaving]=useState(false);
  const [f,setF]=useState({prenom:initPrenom,nom:initNom,email:authEmail,tel:"",ville:"",titre:"",pays:"Maroc",niveau:"",diplome:"",formations:[],experiences:[],specs:[],langues:[{id:1,langue:"Français",niveau:"Courant"}],contrats:[],modalites:[],dispo:"",salaire:"",salaireNote:"",salaireActuel:""});

  // Vérifie si un profil existe déjà pour cet e-mail Google
  useEffect(()=>{
    let active=true;
    (async()=>{
      try{
        const {data,error}=await supabase.from('candidats').select('*').eq('email',authEmail).limit(1);
        if(active){
          if(!error && data && data.length>0) setExisting(data[0]);
          setChecking(false);
        }
      }catch(e){ if(active) setChecking(false); }
    })();
    return ()=>{active=false;};
  },[authEmail]);

  const sauvegarderProfil = async () => {
  const { error } = await supabase
    .from('candidats')
    .insert([{
      prenom: f.prenom, nom: f.nom, email: f.email,
      tel: f.tel, ville: f.ville, titre: f.titre,
      pays: f.pays, niveau: f.niveau, diplome: f.diplome,
      formations: f.formations, experiences: f.experiences,
      specs: f.specs, langues: f.langues,
      contrats: f.contrats, modalites: f.modalites, disponibilite: f.dispo,
      salaire: f.salaire, salaire_note: f.salaireNote,
salaire_actuel: f.salaireActuel,
      statut: 'en_attente'
    }])
  if(error){ alert('Erreur : ' + error.message) }
  else { setDone(true) }
}

  // Charge le profil existant dans le formulaire pour modification
  const startEdit=()=>{
    const e=existing||{};
    setF({
      prenom:e.prenom||"", nom:e.nom||"", email:e.email||authEmail,
      tel:e.tel||"", ville:e.ville||"", titre:e.titre||"",
      pays:e.pays||"Maroc", niveau:e.niveau||"", diplome:e.diplome||"",
      formations:(e.formations||[]).map((x,i)=>({id:x.id||i+1,type:x.type||"Diplôme",diplome:x.diplome||"",etab:x.etab||"",annee:x.annee||"",spec:x.spec||"",editing:false})),
      experiences:(e.experiences||[]).map((x,i)=>({id:x.id||i+1,poste:x.poste||"",org:x.org||"",debut:x.debut||"",fin:x.fin||"",encours:!!x.encours,missions:x.missions||"",editing:false})),
      specs:e.specs||[],
      langues:(e.langues&&e.langues.length>0?e.langues:[{langue:"Français",niveau:"Courant"}]).map((x,i)=>({id:x.id||i+1,langue:x.langue||"",niveau:x.niveau||"Courant"})),
      contrats:e.contrats||[],
      modalites:e.modalites||[],
      dispo:e.disponibilite||"", salaire:e.salaire||"", salaireNote:e.salaire_note||"", salaireActuel:e.salaire_actuel||""
    });
    setStep(0); setSavedMsg(""); setFormMode('edit');
  };

  // Enregistre les modifications (UPDATE)
  const enregistrerModifs=async()=>{
    setSaving(true);
    const payload={
      prenom:f.prenom, nom:f.nom, tel:f.tel, ville:f.ville, titre:f.titre,
      pays:f.pays, niveau:f.niveau, diplome:f.diplome,
      formations:f.formations.map(({editing,...r})=>r),
      experiences:f.experiences.map(({editing,...r})=>r),
      specs:f.specs, langues:f.langues, contrats:f.contrats, modalites:f.modalites,
      disponibilite:f.dispo, salaire:f.salaire, salaire_note:f.salaireNote, salaire_actuel:f.salaireActuel
    };
    const { error } = await supabase.from('candidats').update(payload).eq('email',authEmail);
    setSaving(false);
    if(error){ alert('Erreur : '+error.message); return; }
    setExisting(prev=>({...prev,...payload}));
    setFormMode(null); setStep(0);
    setSavedMsg("Vos modifications ont bien été enregistrées ✔");
  };

  // Supprime définitivement le profil (DELETE)
  const supprimerProfil=async()=>{
    if(!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement votre profil de la CVthèque JURIJOB ? Cette action est irréversible.")) return;
    const { error } = await supabase.from('candidats').delete().eq('email',authEmail);
    if(error){ alert('Erreur : '+error.message); return; }
    setExisting(null); setFormMode(null); setDeleted(true);
  };
  const upd=(k,v)=>setF(x=>({...x,[k]:v}));
  const togSpec=s=>upd("specs",f.specs.includes(s)?f.specs.filter(x=>x!==s):[...f.specs,s]);
  const togCtx=c=>upd("contrats",f.contrats.includes(c)?f.contrats.filter(x=>x!==c):[...f.contrats,c]);
  const togMod=m=>upd("modalites",f.modalites.includes(m)?f.modalites.filter(x=>x!==m):[...f.modalites,m]);
  const addFo=()=>upd("formations",[...f.formations,{id:nid(),type:"Diplôme",diplome:"",etab:"",annee:"",spec:"",editing:true}]);
  const updFo=(id,k,v)=>upd("formations",f.formations.map(x=>x.id===id?{...x,[k]:v}:x));
  const delFo=id=>upd("formations",f.formations.filter(x=>x.id!==id));
  const addEx=()=>upd("experiences",[...f.experiences,{id:nid(),poste:"",org:"",debut:"",fin:"",encours:false,missions:"",editing:true}]);
  const updEx=(id,k,v)=>upd("experiences",f.experiences.map(x=>x.id===id?{...x,[k]:v}:x));
  const delEx=id=>upd("experiences",f.experiences.filter(x=>x.id!==id));
  const addLg=()=>upd("langues",[...f.langues,{id:nid(),langue:"",niveau:"Courant"}]);
  const updLg=(id,k,v)=>upd("langues",f.langues.map(x=>x.id===id?{...x,[k]:v}:x));
  const delLg=id=>upd("langues",f.langues.filter(x=>x.id!==id));
  const ok=()=>{
    if(formMode==='edit') return step===0 ? (f.prenom.trim()&&f.nom.trim()&&f.ville.trim()&&f.pays.trim()) : true;
    if(step===0)return f.prenom.trim()&&f.nom.trim()&&f.email.trim()&&f.ville.trim()&&f.pays.trim();
    if(step===1)return f.formations.length>0&&f.formations.some(x=>x.diplome.trim());
    if(step===2)return true;
    if(step===3)return f.specs.length>0;
    if(step===4)return f.langues.length>0&&f.langues.every(l=>l.langue);
    if(step===5)return f.salaire&&f.contrats.length>0&&f.modalites.length>0&&f.dispo;
    return true;
  };
  const renderStep=()=>{
    if(step===0)return(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><Lbl t="Prénom" r/><Inp val={f.prenom} onChange={v=>upd("prenom",v)} ph="Votre prénom"/></div>
          <div><Lbl t="Nom" r/><Inp val={f.nom} onChange={v=>upd("nom",v)} ph="Votre nom"/></div>
        </div>
        <div><Lbl t="Titre professionnel"/>
          <datalist id="titres-list">{TITRES.map(t=><option key={t} value={t}/>)}</datalist>
          <input value={f.titre} onChange={e=>upd("titre",e.target.value)} placeholder="Ex. : Juriste d'affaires, Juriste & Gestionnaire de sinistres…" list="titres-list" style={iSt}/>
          <p style={{fontSize:11,color:"#A0AEC0",margin:"5px 0 0"}}>Saisie libre — des suggestions apparaissent pendant la saisie.</p>
        </div>
        <div><Lbl t="E-mail (compte Google)" r/><input value={f.email} readOnly style={{...iSt,background:"#F0F4F8",color:"#718096",cursor:"not-allowed"}}/></div>
        <div><Lbl t="Téléphone"/><Inp val={f.tel} onChange={v=>upd("tel",v)} ph="+212 6XX XXX XXX" filter={v=>v.replace(/[^0-9+\s()-]/g,'')}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div><Lbl t="Pays" r/>
            <select value={f.pays} onChange={e=>setF(x=>({...x,pays:e.target.value,ville:""}))} style={{...iSt,cursor:"pointer"}}>
              {PAYS.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div><Lbl t="Ville" r/>
            {VILLES[f.pays]
              ? <SelectOuAutre key={f.pays} value={f.ville} options={VILLES[f.pays]} onChange={v=>upd("ville",v)} ph="Votre ville"/>
              : <Inp val={f.ville} onChange={v=>upd("ville",v)} ph="Votre ville"/>}
          </div>
        </div>
      </div>
    );
    if(step===1)return(
      <div>
        <datalist id="ecoles-list">{ECOLES.map(e=><option key={e} value={e}/>)}</datalist>
        <div style={{marginBottom:16}}><Lbl t="Diplôme le plus élevé"/>
          <select value={f.diplome} onChange={e=>upd("diplome",e.target.value)} style={{...iSt,cursor:"pointer"}}>
            <option value="">— Sélectionner —</option>
            {DIPLOMES_CAND.map(d=><option key={d.val} value={d.val}>{d.label}</option>)}
          </select>
          <p style={{fontSize:11,color:"#A0AEC0",margin:"5px 0 0"}}>Sert au classement de votre profil dans les recherches. Détaillez vos diplômes ci-dessous.</p>
        </div>
        {f.formations.length===0&&<p style={{textAlign:"center",padding:"16px 0",color:"#A0AEC0",fontSize:13}}>Aucune formation ajoutée. Cliquez ci-dessous pour commencer.</p>}
        {f.formations.map((fo,i)=>(
          <div key={fo.id} style={{background:CREAM,borderRadius:10,padding:14,marginBottom:10,border:`1.5px solid ${fo.editing?GOLD:"#E2E8F0"}`}}>
            {!fo.editing?(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><p style={{margin:0,fontWeight:500,fontSize:13,color:NAVY}}>{fo.diplome||"Sans titre"}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>{fo.etab}{fo.annee?` · ${fo.annee}`:""}</p></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>updFo(fo.id,"editing",true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>✏️</button>
                  <button onClick={()=>delFo(fo.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#E53E3E"}}>✕</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontSize:12,fontWeight:500,color:GOLD}}>Formation / Certification {i+1}</span>
                  <button onClick={()=>delFo(fo.id)} style={{background:"none",border:"none",color:"#E53E3E",cursor:"pointer",fontSize:12}}>Supprimer</button>
                </div>
                <div><Lbl t="Type"/><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{["Diplôme","Certificat","Formation continue","Autre"].map(t=><Pill key={t} active={fo.type===t} onClick={()=>updFo(fo.id,"type",t)}>{t}</Pill>)}</div></div>
                <div><Lbl t="Intitulé" r/><Inp val={fo.diplome} onChange={v=>updFo(fo.id,"diplome",v)} ph="Ex. : Master II Droit des affaires, Certificat CIMA…"/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><Lbl t="Établissement"/><input value={fo.etab} onChange={e=>updFo(fo.id,"etab",e.target.value)} placeholder="Université, faculté, école…" list="ecoles-list" style={iSt}/></div>
                  <div><Lbl t="Année"/><Inp val={fo.annee} onChange={v=>updFo(fo.id,"annee",v)} ph="2022" filter={v=>v.replace(/[^0-9]/g,'').slice(0,4)}/></div>
                </div>
                <div><Lbl t="Spécialité / mention"/><Inp val={fo.spec} onChange={v=>updFo(fo.id,"spec",v)} ph="Ex. : Droit fiscal international"/></div>
                <button onClick={()=>updFo(fo.id,"editing",false)} style={{alignSelf:"flex-end",padding:"6px 16px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12,cursor:"pointer",fontWeight:500}}>Enregistrer</button>
              </div>
            )}
          </div>
        ))}
        <button onClick={addFo} style={{width:"100%",padding:10,borderRadius:8,background:"transparent",border:`1.5px dashed ${GOLD}`,color:NAVY,fontSize:13,cursor:"pointer",fontWeight:500}}>+ Ajouter une formation / certification</button>
      </div>
    );
    if(step===2)return(
      <div>
        <div style={{marginBottom:16}}><Lbl t="Niveau d'expérience"/>
          <select value={f.niveau} onChange={e=>upd("niveau",e.target.value)} style={{...iSt,cursor:"pointer"}}>
            <option value="">— Sélectionner —</option>
            {NIVEAUX_RH.map(n=><option key={n.val} value={n.val}>{n.label} · {n.sub}</option>)}
          </select>
        </div>
        <p style={{fontSize:12,color:"#A0AEC0",margin:"0 0 12px"}}>Cette étape est facultative pour les candidats sans expérience professionnelle.</p>
        {f.experiences.map((e,i)=>(
          <div key={e.id} style={{background:CREAM,borderRadius:10,padding:14,marginBottom:10,border:`1.5px solid ${e.editing?GOLD:"#E2E8F0"}`}}>
            {!e.editing?(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><p style={{margin:0,fontWeight:500,fontSize:13,color:NAVY}}>{e.poste||"Sans titre"}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>{e.org}{e.debut?` · ${e.debut}`:""}{e.encours?" – En cours":e.fin?` – ${e.fin}`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p></div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>updEx(e.id,"editing",true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>✏️</button>
                  <button onClick={()=>delEx(e.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#E53E3E"}}>✕</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,fontWeight:500,color:GOLD}}>Expérience {i+1}</span><button onClick={()=>delEx(e.id)} style={{background:"none",border:"none",color:"#E53E3E",cursor:"pointer",fontSize:12}}>Supprimer</button></div>
                <div><Lbl t="Intitulé du poste" r/><Inp val={e.poste} onChange={v=>updEx(e.id,"poste",v)} ph="Ex. : Juriste, Avocat collaborateur, Notaire stagiaire…"/></div>
                <div><Lbl t="Entreprise / Cabinet / Étude notariale"/><Inp val={e.org} onChange={v=>updEx(e.id,"org",v)} ph="Nom de l'employeur"/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><Lbl t="Début"/><Inp val={e.debut} onChange={v=>updEx(e.id,"debut",v)} ph="MM/AAAA" filter={v=>v.replace(/[^0-9/]/g,'').slice(0,7)}/></div>
                  <div><Lbl t="Fin"/>{e.encours?<p style={{margin:0,padding:"8px 0",fontSize:13,fontWeight:500,color:NAVY}}>En cours</p>:<Inp val={e.fin} onChange={v=>updEx(e.id,"fin",v)} ph="MM/AAAA" filter={v=>v.replace(/[^0-9/]/g,'').slice(0,7)}/>}</div>
                </div>
                <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:NAVY,cursor:"pointer"}}><input type="checkbox" checked={e.encours} onChange={ev=>updEx(e.id,"encours",ev.target.checked)}/>Poste actuel (en cours)</label>
                <div><Lbl t="Missions & réalisations"/><textarea value={e.missions} onChange={ev=>updEx(e.id,"missions",ev.target.value)} placeholder="Décrivez vos missions, dossiers traités, réalisations…" style={{...iSt,minHeight:75,resize:"vertical"}}/></div>
                <button onClick={()=>updEx(e.id,"editing",false)} style={{alignSelf:"flex-end",padding:"6px 16px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12,cursor:"pointer",fontWeight:500}}>Enregistrer</button>
              </div>
            )}
          </div>
        ))}
        <button onClick={addEx} style={{width:"100%",padding:10,borderRadius:8,background:"transparent",border:`1.5px dashed ${GOLD}`,color:NAVY,fontSize:13,cursor:"pointer",fontWeight:500}}>+ Ajouter une expérience</button>
      </div>
    );
    if(step===3)return(
      <div>
        <Lbl t="Vos domaines de spécialisation" r/>
        <p style={{fontSize:12,color:"#A0AEC0",margin:"0 0 16px"}}>Sélectionnez tous les domaines qui correspondent à votre expertise.</p>
        {SPECS.map(({cat,items})=>(
          <div key={cat} style={{marginBottom:16}}>
            <p style={{fontSize:11,fontWeight:500,color:GOLD,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 8px"}}>{cat}</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{items.map(s=><Pill key={s} active={f.specs.includes(s)} onClick={()=>togSpec(s)}>{s}</Pill>)}</div>
          </div>
        ))}
      </div>
    );
    if(step===4)return(
      <div>
        <Lbl t="Vos langues" r/>
        <p style={{fontSize:12,color:"#A0AEC0",margin:"0 0 14px"}}>Indiquez votre niveau pour chaque langue maîtrisée.</p>
        {f.langues.map(l=>(
          <div key={l.id} style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
            <select value={l.langue} onChange={e=>updLg(l.id,"langue",e.target.value)} style={{flex:1,padding:"8px 10px",borderRadius:7,fontSize:13,border:"1.5px solid #CBD5E0",color:NAVY,background:"#fff"}}>
              <option value="">Choisir une langue</option>
              {LGLIST.map(lg=><option key={lg}>{lg}</option>)}
            </select>
            <select value={l.niveau} onChange={e=>updLg(l.id,"niveau",e.target.value)} style={{flex:1,padding:"8px 10px",borderRadius:7,fontSize:13,border:"1.5px solid #CBD5E0",color:NAVY,background:"#fff"}}>
              {NIVLG.map(n=><option key={n}>{n}</option>)}
            </select>
            {f.langues.length>1&&<button onClick={()=>delLg(l.id)} style={{background:"none",border:"none",color:"#E53E3E",cursor:"pointer",fontSize:16,padding:"0 4px"}}>✕</button>}
          </div>
        ))}
        <button onClick={addLg} style={{padding:"8px 16px",borderRadius:7,background:"transparent",border:`1.5px dashed ${GOLD}`,color:NAVY,fontSize:12.5,cursor:"pointer",fontWeight:500}}>+ Ajouter une langue</button>
      </div>
    );
    if(step===5)return(
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div><Lbl t="Type(s) de contrat recherché(s)" r/><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{CONTRATS.map(c=><Pill key={c} active={f.contrats.includes(c)} onClick={()=>togCtx(c)}>{c}</Pill>)}</div></div>
        <div><Lbl t="Modalité(s) de travail acceptée(s)" r/><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{MODALITES.map(m=><Pill key={m} active={f.modalites.includes(m)} onClick={()=>togMod(m)}>{m}</Pill>)}</div></div>
        <div><Lbl t="Disponibilité" r/><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{DISPOS.map(d=><Pill key={d} active={f.dispo===d} onClick={()=>upd("dispo",d)}>{d}</Pill>)}</div></div>
        <div>
          <Lbl t="Salaire actuel (optionnel)"/><div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>{FOURCH.map(fo=>(<button key={fo} onClick={()=>upd("salaireActuel",fo)} style={{padding:"8px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:f.salaireActuel===fo?NAVY:"transparent",color:f.salaireActuel===fo?"#fff":NAVY,border:`1.5px solid ${f.salaireActuel===fo?NAVY:"#CBD5E0"}`,fontWeight:f.salaireActuel===fo?500:400}}>{fo}</button>))}</div><Lbl t="Prétentions salariales — Net mensuel" r/>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {FOURCH.map(fo=><button key={fo} onClick={()=>upd("salaire",fo)} style={{padding:"9px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:f.salaire===fo?NAVY:"transparent",color:f.salaire===fo?"#fff":NAVY,border:`1.5px solid ${f.salaire===fo?NAVY:"#CBD5E0"}`,fontWeight:f.salaire===fo?500:400}}>{fo}</button>)}
          </div>
          <div style={{marginTop:8}}><Lbl t="Précision complémentaire (optionnel)"/><Inp val={f.salaireNote} onChange={v=>upd("salaireNote",v)} ph="Ex. : Négociable selon avantages, hors primes…"/></div>
        </div>
      </div>
    );
    if(step===6)return(
      <div>
        <p style={{fontSize:12,color:"#718096",marginBottom:14,textAlign:"center"}}>Aperçu de votre profil dans la CVthèque JURIJOB. Vous pouvez revenir modifier n'importe quelle section à tout moment.</p>
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:NAVY,padding:"20px 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:50,height:50,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:600,color:NAVY,flexShrink:0}}>{(f.prenom[0]||"?")}{(f.nom[0]||"")}</div>
              <div>
                <p style={{margin:0,fontSize:17,fontWeight:500,color:"#fff"}}>{f.prenom} {f.nom}</p>
                {f.titre&&<p style={{margin:"3px 0 0",fontSize:13,color:GOLD}}>{f.titre}</p>}
                <p style={{margin:"3px 0 0",fontSize:12,color:"rgba(255,255,255,0.6)"}}>{[[f.ville,f.pays].filter(Boolean).join(", "),f.email,f.tel].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          </div>
          <div style={{padding:"18px 22px",display:"flex",flexDirection:"column",gap:16}}>
            {f.formations.length>0&&<div><SecTitle t="Formation & certifications"/>{triFo(f.formations).map(fo=><div key={fo.id} style={{marginBottom:8}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>{fo.diplome}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>{fo.etab}{fo.annee?` · ${fo.annee}`:""}{fo.spec?` · ${fo.spec}`:""}</p></div>)}</div>}
            {f.experiences.length>0&&<div><SecTitle t="Expériences professionnelles"/>{triExp(f.experiences).map(e=><div key={e.id} style={{marginBottom:10}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>{e.poste}{e.org?` — ${e.org}`:""}</p><p style={{margin:"2px 0 3px",fontSize:12,color:"#718096"}}>{e.debut}{e.encours?" – En cours":e.fin?` – ${e.fin}`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p>{e.missions&&<p style={{margin:0,fontSize:12,color:"#4A5568",lineHeight:1.5}}>{e.missions}</p>}</div>)}</div>}
            {f.specs.length>0&&<div><SecTitle t="Spécialisations"/><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{f.specs.map(s=><span key={s} style={{background:CREAM,color:NAVY,fontSize:12,padding:"4px 10px",borderRadius:20,border:"1px solid #E2E8F0"}}>{s}</span>)}</div></div>}
            {f.langues.filter(l=>l.langue).length>0&&<div><SecTitle t="Langues"/><div style={{display:"flex",flexWrap:"wrap",gap:12}}>{f.langues.filter(l=>l.langue).map(l=><span key={l.id} style={{fontSize:13,color:NAVY}}><strong>{l.langue}</strong> <span style={{color:"#718096",fontSize:12}}>— {l.niveau}</span></span>)}</div></div>}
            <div><SecTitle t="Préférences"/><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:9}}>{[["Contrat(s)",f.contrats.join(", ")],["Modalité(s)",f.modalites.join(", ")],["Disponibilité",f.dispo],["Salaire actuel",f.salaireActuel||"—"],["Prétentions",f.salaire]].map(([k,v])=>v?<div key={k} style={{background:CREAM,borderRadius:8,padding:"10px 12px"}}><p style={{margin:"0 0 3px",fontSize:11,color:"#A0AEC0"}}>{k}</p><p style={{margin:0,fontSize:12,fontWeight:500,color:NAVY}}>{v}</p></div>:null)}</div></div>
            <div style={{background:GOLD_LIGHT,borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:20}}>⏳</span>
              <div><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>Profil en attente de validation</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>L'équipe JURIJOB vérifiera et activera votre profil sous 24h.</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Écran de vérification du profil existant
  if(checking)return <Chargement/>;

  // Profil supprimé
  if(deleted)return(
    <div style={{background:CREAM,minHeight:"100vh"}}>
      <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
      <div style={{padding:"40px 16px",maxWidth:460,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:16,padding:36,border:"1px solid #E2E8F0",textAlign:"center"}}>
          <div style={{width:58,height:58,borderRadius:"50%",background:GOLD_LIGHT,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>🗑️</div>
          <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:"0 0 8px"}}>Profil supprimé</h2>
          <p style={{color:"#718096",fontSize:14,margin:"0 0 22px",lineHeight:1.6}}>Votre profil a été définitivement supprimé de la CVthèque JURIJOB. Vous pouvez en créer un nouveau quand vous le souhaitez.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>{setDeleted(false);setF({prenom:initPrenom,nom:initNom,email:authEmail,tel:"",ville:"",titre:"",pays:"Maroc",niveau:"",diplome:"",formations:[],experiences:[],specs:[],langues:[{id:1,langue:"Français",niveau:"Courant"}],contrats:[],modalites:[],dispo:"",salaire:"",salaireNote:"",salaireActuel:""});setStep(0);setFormMode(null);}} style={{padding:"11px",borderRadius:8,fontSize:14,cursor:"pointer",background:NAVY,color:"#fff",border:"none",fontWeight:500}}>Créer un nouveau profil</button>
            <button onClick={onLogout} style={{padding:"10px",borderRadius:8,fontSize:13,cursor:"pointer",background:"transparent",color:NAVY,border:"1.5px solid #CBD5E0"}}>Se déconnecter</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Tableau de bord du profil : consulter / modifier / supprimer
  if(existing && formMode!=='edit' && !done)return(
    <div style={{background:CREAM,minHeight:"100vh",paddingBottom:32}}>
      <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
      <div style={{padding:"32px 16px",maxWidth:600,margin:"0 auto"}}>
        <p style={{fontSize:14,color:"#718096",margin:"0 0 18px"}}>Bonjour <strong style={{color:NAVY}}>{existing.prenom}</strong> 👋 Voici votre profil JURIJOB. Vous pouvez le modifier, le compléter ou le supprimer à tout moment.</p>
        {savedMsg&&<div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",color:"#166534",borderRadius:10,padding:"12px 16px",fontSize:13,marginBottom:16,textAlign:"center"}}>{savedMsg}</div>}
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:16,overflow:"hidden"}}>
          <div style={{background:NAVY,padding:"22px 24px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:54,height:54,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:600,color:NAVY,flexShrink:0}}>{(existing.prenom?.[0]||"?")}{(existing.nom?.[0]||"")}</div>
            <div style={{flex:1}}>
              <p style={{margin:0,fontSize:18,fontWeight:500,color:"#fff"}}>{existing.prenom} {existing.nom}</p>
              {existing.titre&&<p style={{margin:"3px 0 0",fontSize:13,color:GOLD}}>{existing.titre}</p>}
              <p style={{margin:"3px 0 0",fontSize:12,color:"rgba(255,255,255,0.6)"}}>{[[existing.ville,existing.pays].filter(Boolean).join(", "),existing.email,existing.tel].filter(Boolean).join(" · ")}</p>
            </div>
          </div>
          <div style={{padding:"12px 24px",borderBottom:"1px solid #F0F4F8",display:"flex",flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:12.5,color:NAVY,fontWeight:500,background:GOLD_LIGHT,padding:"4px 12px",borderRadius:20}}>Statut : {existing.statut==='valide'?'Validé ✔':existing.statut==='refuse'?'Non retenu':'En attente de validation ⏳'}</span>
            {existing.niveau&&<span style={{fontSize:12.5,color:"#4A5568",background:CREAM,padding:"4px 12px",borderRadius:20,border:"1px solid #E2E8F0"}}>{NIVEAUX_RH.find(n=>n.val===existing.niveau)?.label||existing.niveau}</span>}
            {existing.diplome&&<span style={{fontSize:12.5,color:"#4A5568",background:CREAM,padding:"4px 12px",borderRadius:20,border:"1px solid #E2E8F0"}}>{DIPLOMES_CAND.find(d=>d.val===existing.diplome)?.label||existing.diplome}</span>}
            {(existing.modalites||[]).length>0&&<span style={{fontSize:12.5,color:"#4A5568",background:CREAM,padding:"4px 12px",borderRadius:20,border:"1px solid #E2E8F0"}}>🏢 {(existing.modalites||[]).join(" / ")}</span>}
          </div>
          <div style={{padding:"18px 24px",display:"flex",flexDirection:"column",gap:16}}>
            {(existing.formations||[]).length>0&&<div><SecTitle t="Formation & certifications"/>{triFo(existing.formations).map((fo,i)=><div key={i} style={{marginBottom:8}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>{fo.diplome}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>{fo.etab}{fo.annee?` · ${fo.annee}`:""}{fo.spec?` · ${fo.spec}`:""}</p></div>)}</div>}
            {(existing.experiences||[]).length>0&&<div><SecTitle t="Expériences professionnelles"/>{triExp(existing.experiences).map((e,i)=><div key={i} style={{marginBottom:10}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>{e.poste}{e.org?` — ${e.org}`:""}</p><p style={{margin:"2px 0 3px",fontSize:12,color:"#718096"}}>{e.debut}{e.encours?" – En cours":e.fin?` – ${e.fin}`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p>{e.missions&&<p style={{margin:0,fontSize:12,color:"#4A5568",lineHeight:1.5}}>{e.missions}</p>}</div>)}</div>}
            {(existing.specs||[]).length>0&&<div><SecTitle t="Spécialisations"/><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(existing.specs||[]).map(s=><span key={s} style={{background:CREAM,color:NAVY,fontSize:12,padding:"4px 10px",borderRadius:20,border:"1px solid #E2E8F0"}}>{s}</span>)}</div></div>}
            {(existing.langues||[]).filter(l=>l&&l.langue).length>0&&<div><SecTitle t="Langues"/><div style={{display:"flex",flexWrap:"wrap",gap:12}}>{(existing.langues||[]).filter(l=>l&&l.langue).map((l,i)=><span key={i} style={{fontSize:13,color:NAVY}}><strong>{l.langue}</strong> <span style={{color:"#718096",fontSize:12}}>— {l.niveau}</span></span>)}</div></div>}
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
          <button onClick={startEdit} style={{flex:1,minWidth:200,padding:"12px",borderRadius:8,fontSize:14,cursor:"pointer",background:NAVY,color:"#fff",border:"none",fontWeight:500}}>✏️ Modifier / compléter mon profil</button>
          <button onClick={supprimerProfil} style={{flex:1,minWidth:200,padding:"12px",borderRadius:8,fontSize:14,cursor:"pointer",background:"transparent",color:"#E53E3E",border:"1.5px solid #FEB2B2",fontWeight:500}}>🗑️ Supprimer mon profil</button>
        </div>
      </div>
    </div>
  );

  if(done)return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:16,padding:36,maxWidth:420,width:"100%",textAlign:"center",border:"1px solid #E2E8F0"}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:GOLD_LIGHT,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:26,color:NAVY}}>✓</div>
        <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:"0 0 10px"}}>Merci, {f.prenom} !</h2>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 8px"}}>Votre profil a bien été soumis à l'équipe JURIJOB.</p>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 24px"}}>Une confirmation vous sera envoyée par e-mail sous <strong>24h ouvrées</strong>.</p>
        <button onClick={onLogout} style={{background:"transparent",color:NAVY,border:`1.5px solid #CBD5E0`,borderRadius:8,padding:"9px 22px",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
    </div>
  );

  return(
    <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 32px"}}>
      <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        {formMode==='edit'
          ? <button onClick={()=>{setFormMode(null);setStep(0);setSavedMsg("");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mon profil</button>
          : <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>}
      </div>
      <div style={{padding:"22px 16px",maxWidth:580,margin:"0 auto"}}>
        <div style={{marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>{STEPS_C.map((s,i)=><span key={i} style={{fontSize:10.5,fontWeight:i===step?500:400,color:i<=step?NAVY:"#A0AEC0",flex:1,textAlign:"center"}}>{s}</span>)}</div>
          <div style={{height:4,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(step/(STEPS_C.length-1))*100}%`,background:GOLD,borderRadius:4,transition:"width .3s"}}/></div>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",padding:"24px 24px 20px"}}>
          <p style={{fontSize:12,color:GOLD,fontWeight:500,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>{formMode==='edit'?'Espace Candidat · Modification':'Espace Candidat'} · Étape {step+1} / {STEPS_C.length}</p>
          <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 20px"}}>{STEPS_C[step]}</h2>
          {renderStep()}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid #F0F4F8"}}>
            <button onClick={()=>setStep(s=>s-1)} disabled={step===0} style={{padding:"8px 18px",borderRadius:8,fontSize:13,cursor:step===0?"default":"pointer",background:"transparent",color:step===0?"#CBD5E0":NAVY,border:`1.5px solid ${step===0?"#E2E8F0":"#CBD5E0"}`}}>← Précédent</button>
            <div style={{display:"flex",gap:10}}>
              {formMode==='edit'&&<button onClick={enregistrerModifs} disabled={saving} style={{padding:"9px 22px",borderRadius:8,fontSize:13,cursor:saving?"default":"pointer",background:"#166534",color:"#fff",border:"none",fontWeight:600}}>{saving?"…":"💾 Enregistrer"}</button>}
              {step<6
                ? <button onClick={()=>setStep(s=>s+1)} disabled={!ok()} style={{padding:"8px 22px",borderRadius:8,fontSize:13,cursor:ok()?"pointer":"default",background:ok()?NAVY:"#E2E8F0",color:ok()?"#fff":"#A0AEC0",border:"none",fontWeight:500}}>Suivant →</button>
                : (formMode==='edit' ? null : <button onClick={sauvegarderProfil} style={{padding:"9px 24px",borderRadius:8,fontSize:13,cursor:"pointer",background:GOLD,color:NAVY,border:"none",fontWeight:600}}>Valider mon profil</button>)}
            </div>
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16}}>{STEPS_C.map((_,i)=><div key={i} style={{width:i===step?20:7,height:7,borderRadius:4,background:i===step?NAVY:i<step?GOLD:"#CBD5E0",transition:"all .2s"}}/>)}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   ESPACE RECRUTEUR
═══════════════════════════════════════ */
const STAT_R={en_cours:{bg:"#EFF6FF",color:"#1D4ED8",label:"En cours d'analyse"},terminee:{bg:"#F0FDF4",color:"#166534",label:"Short-list envoyée"},annulee:{bg:"#F1F5F9",color:"#64748B",label:"Annulée"}};

function EspaceRecruteur({session,onLogout}){
  const rmeta=session?.user?.user_metadata||{};
  const initialF={entreprise:rmeta.entreprise||"",contact:rmeta.contact||"",poste:"",genre:"",langues:[],niveau:"",diplome:"",specs:[],nbCv:3,urgence:"normal",modalite:"Indifférent",notes:"",budget:"",budgetConfidentiel:false};
  const [vue,setVue]=useState("dashboard"); // "dashboard" | "form" | "shortlist"
  const [mesDemandes,setMesDemandes]=useState([]);
  const [mesShortlists,setMesShortlists]=useState([]);
  const [mesPaiements,setMesPaiements]=useState([]);
  const [profils,setProfils]=useState([]);
  const [selectedDem,setSelectedDem]=useState(null);
  const [chargement,setChargement]=useState(true);
  const [step,setStep]=useState(0);
  const [submitted,setSubmitted]=useState(false);
  const [f,setF]=useState(initialF);
  const [virementSignale,setVirementSignale]=useState(false);
  const [signalantVirement,setSignalantVirement]=useState(false);

  const chargerMesDemandes = async () => {
    setChargement(true);
    const { data:d } = await supabase.from('demandes').select('*').eq('recruteur_email',session?.user?.email).order('created_at',{ascending:false});
    const { data:s } = await supabase.from('shortlists').select('*');
    const { data:p } = await supabase.from('paiements').select('*').eq('recruteur_email',session?.user?.email);
    if(d) setMesDemandes(d);
    if(s) setMesShortlists(s);
    if(p) setMesPaiements(p);
    setChargement(false);
  };
  useEffect(()=>{ chargerMesDemandes(); },[]);

  const nouvelleDemande = () => { setF(initialF); setStep(0); setVue("form"); };
  const retourDashboard = () => { setSubmitted(false); setF(initialF); setStep(0); setVue("dashboard"); setSelectedDem(null); setProfils([]); setVirementSignale(false); chargerMesDemandes(); };

  // Ouvrir la short-list d'une demande
  const voirShortlist = async (dem) => {
    setSelectedDem(dem);
    const sl = mesShortlists.find(s=>s.demande_id===dem.id);
    if(sl && sl.candidat_ids && sl.candidat_ids.length>0){
      const paiement = mesPaiements.find(p=>p.demande_id===dem.id && p.statut==="confirme");
      if(paiement){
        // Paiement confirmé → charger les profils
        const { data:cands } = await supabase.from('candidats').select('*').in('id',sl.candidat_ids);
        if(cands) setProfils(cands);
      }
    }
    setVue("shortlist");
  };

 const PRIX_UNITAIRE = 1490;
  const genRef = (id) => "JJ-" + new Date().getFullYear() + "-" + (id||"").substring(0,6).toUpperCase();

  // Signale un virement (crée une ligne paiements en_attente)
  const signalerVirement = async (dem, sl, nbProfils, total, ref) => {
    if(!sl || !dem || signalantVirement) return;
    setSignalantVirement(true);
    // Anti-doublon : vérifier qu'aucun paiement n'existe déjà pour cette short-list
    const { data:exist } = await supabase
      .from('paiements')
      .select('id,statut')
      .eq('shortlist_id', sl.id)
      .limit(1);
    if(exist && exist.length>0){
      setSignalantVirement(false);
      setVirementSignale(true);
      chargerMesDemandes();
      return;
    }
    // Création de la ligne paiements en_attente
    const { error } = await supabase.from('paiements').insert([{
      shortlist_id: sl.id,
      demande_id: dem.id,
      recruteur_email: session?.user?.email,
      nb_cv: nbProfils,
      montant_unitaire: PRIX_UNITAIRE,
      montant_total: total,
      mode_paiement: 'virement',
      statut: 'en_attente',
      reference_virement: ref
    }]);
    setSignalantVirement(false);
    if(error){
      alert("Erreur lors du signalement du virement : " + error.message);
      return;
    }
    setVirementSignale(true);
    chargerMesDemandes();
  };

  const sauvegarderDemande = async () => {
  const { error } = await supabase
    .from('demandes')
    .insert([{
      entreprise: f.entreprise,
      contact: f.contact,
      poste: f.poste,
      niveau: f.niveau,
      diplome: f.diplome,
      specs: f.specs,
      langues: f.langues,
      nb_cv: f.nbCv,
      urgence: f.urgence,
      modalite: f.modalite,
      notes: f.notes,
budget: f.budgetConfidentiel ? "Confidentiel" : f.budget,
      recruteur_email: session?.user?.email,
      statut: 'en_cours'
    }])
  if(error){ alert('Erreur : ' + error.message) }
  else { setSubmitted(true) }
}
  const set=(k,v)=>setF(x=>({...x,[k]:v}));
  const toggle=(k,v)=>setF(x=>({...x,[k]:x[k].includes(v)?x[k].filter(i=>i!==v):[...x[k],v]}));
  const ok=()=>{
    if(step===0)return f.entreprise.trim()&&f.poste.trim();
    if(step===1)return f.genre&&f.langues.length>0;
    if(step===2)return f.niveau&&f.diplome;
    if(step===3)return f.specs.length>0;
    return true;
  };
  const renderStep=()=>{
    if(step===0)return(
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div><Lbl t="Entreprise / Cabinet" r/><Inp val={f.entreprise} onChange={v=>set("entreprise",v)} ph="Ex. : Société Générale Maroc, Cabinet Mikou…"/></div>
        <div><Lbl t="Nom du contact RH"/><Inp val={f.contact} onChange={v=>set("contact",v)} ph="Prénom Nom"/></div>
        <div><Lbl t="Intitulé du poste recherché" r/><Inp val={f.poste} onChange={v=>set("poste",v)} ph="Ex. : Juriste d'entreprise, Avocat collaborateur…"/></div>
        <div>
          <Lbl t="Nombre de CV souhaités"/>
          <div style={{display:"flex",gap:8}}>{[1,2,3,5,10].map(n=><button key={n} onClick={()=>set("nbCv",n)} style={{flex:1,padding:"10px 6px",borderRadius:8,fontSize:14,cursor:"pointer",background:f.nbCv===n?NAVY:"transparent",color:f.nbCv===n?"#fff":NAVY,border:`1.5px solid ${f.nbCv===n?NAVY:"#CBD5E0"}`,fontWeight:f.nbCv===n?500:400}}>{n}</button>)}</div>
        </div>
        <div>
          <Lbl t="Degré d'urgence"/>
          <div style={{display:"flex",gap:10}}>{[["normal","Normal (2–4 sem.)"],["urgent","Urgent (< 1 sem.)"],["immediat","Immédiat"]].map(([v,l])=><button key={v} onClick={()=>set("urgence",v)} style={{flex:1,padding:"8px 6px",borderRadius:8,fontSize:12,cursor:"pointer",background:f.urgence===v?NAVY:"transparent",color:f.urgence===v?"#fff":NAVY,border:`1.5px solid ${f.urgence===v?NAVY:"#CBD5E0"}`,fontWeight:f.urgence===v?500:400}}>{l}</button>)}</div>
        </div>
        <div>
          <Lbl t="Modalité de travail proposée"/>
          <div style={{display:"flex",gap:10}}>{[...MODALITES,"Indifférent"].map(m=><button key={m} onClick={()=>set("modalite",m)} style={{flex:1,padding:"8px 6px",borderRadius:8,fontSize:12,cursor:"pointer",background:f.modalite===m?NAVY:"transparent",color:f.modalite===m?"#fff":NAVY,border:`1.5px solid ${f.modalite===m?NAVY:"#CBD5E0"}`,fontWeight:f.modalite===m?500:400}}>{m}</button>)}</div>
        </div>
      </div>
    );
    if(step===1)return(
      <div style={{display:"flex",flexDirection:"column",gap:22}}>
        <div>
          <Lbl t="Genre recherché" r/>
          <div style={{display:"flex",gap:10}}>{[["H","Homme"],["F","Femme"],["indiff","Indifférent"]].map(([v,l])=><button key={v} onClick={()=>set("genre",v)} style={{flex:1,padding:"10px 6px",borderRadius:8,fontSize:13,cursor:"pointer",background:f.genre===v?NAVY:"transparent",color:f.genre===v?"#fff":NAVY,border:`1.5px solid ${f.genre===v?NAVY:"#CBD5E0"}`,fontWeight:f.genre===v?500:400}}>{l}</button>)}</div>
        </div>
        <div>
          <Lbl t="Langues requises" r/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{LANGUES_RH.map(l=><Pill key={l} active={f.langues.includes(l)} onClick={()=>toggle("langues",l)}>{l}</Pill>)}</div>
        </div>
      </div>
    );
    if(step===2)return(
      <div style={{display:"flex",flexDirection:"column",gap:22}}>
        <div>
          <Lbl t="Niveau d'expérience" r/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{NIVEAUX_RH.map(n=><button key={n.val} onClick={()=>set("niveau",n.val)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:8,fontSize:13,cursor:"pointer",background:f.niveau===n.val?NAVY:"transparent",color:f.niveau===n.val?"#fff":NAVY,border:`1.5px solid ${f.niveau===n.val?NAVY:"#CBD5E0"}`,textAlign:"left"}}><span style={{fontWeight:f.niveau===n.val?500:400}}>{n.label}</span><span style={{fontSize:12,opacity:.7}}>{n.sub}</span></button>)}</div>
        </div>
        <div>
          <Lbl t="Diplôme minimum requis" r/>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{DIPLOMES_RH.map(d=><Pill key={d.val} active={f.diplome===d.val} onClick={()=>set("diplome",d.val)}>{d.label}</Pill>)}</div>
        </div>
      </div>
    );
    if(step===3)return(
      <div>
        <Lbl t="Domaine(s) de spécialisation" r/>
        {f.specs.length>0&&<span style={{marginLeft:8,background:GOLD_LIGHT,color:NAVY,fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:10}}>{f.specs.length} sélectionné{f.specs.length>1?"s":""}</span>}
        <div style={{display:"flex",flexDirection:"column",gap:14,marginTop:12}}>
          {SPECS.map(({cat,items})=>(
            <div key={cat}>
              <p style={{fontSize:11,fontWeight:500,color:GOLD,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 8px"}}>{cat}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{items.map(s=><Pill key={s} active={f.specs.includes(s)} onClick={()=>toggle("specs",s)}>{s}</Pill>)}</div>
            </div>
          ))}
        </div>
        <div style={{marginTop:16}}><Lbl t="Budget alloué au poste (optionnel)"/><div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>{FOURCH.map(fo=>(<button key={fo} onClick={()=>set("budget",fo)} style={{padding:"8px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:f.budget===fo?NAVY:"transparent",color:f.budget===fo?"#fff":NAVY,border:`1.5px solid ${f.budget===fo?NAVY:"#CBD5E0"}`,fontWeight:f.budget===fo?500:400}}>{fo}</button>))}</div><label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:NAVY,cursor:"pointer",marginBottom:12}}><input type="checkbox" checked={f.budgetConfidentiel} onChange={e=>set("budgetConfidentiel",e.target.checked)}/>Budget confidentiel / À négocier</label><Lbl t="Notes complémentaires"/><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} placeholder="Précisions sur le poste, contexte, exigences spécifiques…" style={{...iSt,resize:"vertical",minHeight:72}}/></div>
      </div>
    );
    if(step===4)return(
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[["Entreprise",f.entreprise],["Contact RH",f.contact||"—"],["Poste",f.poste],["CV demandés",f.nbCv],["Urgence",f.urgence==="normal"?"Normal":f.urgence==="urgent"?"Urgent":"Immédiat"],["Modalité",f.modalite],["Genre",f.genre==="H"?"Homme":f.genre==="F"?"Femme":"Indifférent"],["Langues",f.langues.join(", ")],["Niveau",NIVEAUX_RH.find(n=>n.val===f.niveau)?.label],["Diplôme",DIPLOMES_RH.find(d=>d.val===f.diplome)?.label],["Spécialisations",f.specs.join(" · ")],["Budget",f.budgetConfidentiel?"Confidentiel":f.budget||"—"],["Notes",f.notes||"—"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",padding:"9px 13px",background:CREAM,borderRadius:8,gap:12}}>
            <span style={{fontSize:13,color:"#718096",flexShrink:0}}>{k}</span>
            <span style={{fontSize:13,color:NAVY,fontWeight:500,textAlign:"right"}}>{v}</span>
          </div>
        ))}
        <p style={{fontSize:12,color:"#A0AEC0",marginTop:8,textAlign:"center"}}>En validant, votre demande sera transmise à l'équipe JURIJOB qui vous enverra une short-list sous 48h.</p>
      </div>
    );
  };

  if(submitted)return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:16,padding:"40px 36px",maxWidth:480,width:"100%",textAlign:"center",border:"1px solid #E2E8F0"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:GOLD_LIGHT,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28,color:NAVY}}>✓</div>
        <h2 style={{color:NAVY,fontSize:22,fontWeight:500,margin:"0 0 10px"}}>Merci, {f.contact||f.entreprise} !</h2>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 6px"}}>Votre demande a été transmise à l'équipe JURIJOB.</p>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 28px"}}>Votre short-list de <strong>{f.nbCv} CV</strong> vous sera communiquée sous <strong>48h ouvrées</strong>. Vous pouvez suivre son statut depuis votre tableau de bord.</p>
        <button onClick={retourDashboard} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"10px 24px",fontSize:13,cursor:"pointer",fontWeight:500}}>Voir mes demandes →</button>
      </div>
    </div>
  );

  // TABLEAU DE BORD RECRUTEUR (vue par défaut)
    if(vue==="dashboard")return(
    <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 40px"}}>
      <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
      <div style={{padding:"24px 16px",maxWidth:640,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12,marginBottom:20}}>
          <div>
            <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Espace Recruteur</p>
            <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:0}}>Mes demandes</h2>
            {(rmeta.entreprise||rmeta.contact)&&<p style={{fontSize:13,color:"#718096",margin:"4px 0 0"}}>{rmeta.entreprise}{rmeta.contact?` · ${rmeta.contact}`:""}</p>}
          </div>
          <button onClick={nouvelleDemande} style={{background:GOLD,color:NAVY,border:"none",borderRadius:9,padding:"10px 18px",fontSize:13.5,fontWeight:600,cursor:"pointer"}}>+ Nouvelle demande</button>
        </div>
        {chargement&&<p style={{color:"#718096",fontSize:13}}>Chargement de vos demandes…</p>}
        {!chargement&&mesDemandes.length===0&&(
          <div style={{background:"#fff",border:"1px dashed #CBD5E0",borderRadius:12,padding:"32px 24px",textAlign:"center"}}>
            <p style={{fontSize:14,color:NAVY,fontWeight:500,margin:"0 0 6px"}}>Aucune demande pour le moment</p>
            <p style={{fontSize:13,color:"#718096",margin:"0 0 16px"}}>Déposez votre première demande pour recevoir une short-list sous 48h.</p>
            <button onClick={nouvelleDemande} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"9px 20px",fontSize:13,fontWeight:500,cursor:"pointer"}}>Déposer une demande</button>
          </div>
        )}
        {!chargement&&mesDemandes.map(d=>{
          const st=STAT_R[d.statut]||STAT_R.en_cours;
          const hasShortlist=mesShortlists.some(s=>s.demande_id===d.id);
          const isPaid=mesPaiements.some(p=>p.demande_id===d.id && p.statut==="confirme");
          return(
            <div key={d.id} onClick={hasShortlist?()=>voirShortlist(d):undefined}
              style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:11,padding:"14px 16px",marginBottom:10,cursor:hasShortlist?"pointer":"default",transition:"box-shadow .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:NAVY}}>{d.poste}</p>
                  <p style={{margin:0,fontSize:12,color:"#718096"}}>{d.entreprise}{d.created_at?` · ${new Date(d.created_at).toLocaleDateString("fr-FR")}`:""}</p>
                  <p style={{margin:"4px 0 0",fontSize:12,color:"#718096"}}>📁 {d.nb_cv} CV demandé{d.nb_cv>1?"s":""}{(d.langues&&d.langues.length)?` · 🌍 ${d.langues.join(", ")}`:""}{d.modalite&&d.modalite!=="Indifférent"?` · 🏢 ${d.modalite}`:""}</p>
                </div>
                <div style={{textAlign:"right",flexShrink:0}}>
                  <span style={{background:st.bg,color:st.color,fontSize:11,fontWeight:500,padding:"4px 10px",borderRadius:20,whiteSpace:"nowrap",display:"inline-block"}}>{st.label}</span>
                  {hasShortlist&&<p style={{margin:"4px 0 0",fontSize:11,color:isPaid?"#166534":GOLD}}>{isPaid?"✔ Payée":"Voir la short-list →"}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // VUE SHORT-LIST (paywall ou profils)
  if(vue==="shortlist"&&selectedDem){
    const sl=mesShortlists.find(s=>s.demande_id===selectedDem.id);
    const nbProfils=sl?sl.candidat_ids.length:0;
    const paiement=mesPaiements.find(p=>p.demande_id===selectedDem.id && p.statut==="confirme");
    const paiementEnAttente=mesPaiements.find(p=>p.demande_id===selectedDem.id && p.statut==="en_attente");
    const total=nbProfils*PRIX_UNITAIRE;
    const ref=paiementEnAttente?.reference_virement || genRef(selectedDem.id);
    const dejaSignale=virementSignale||!!paiementEnAttente;

    // PAYÉ → afficher les profils
    if(paiement && profils.length>0) return(
      <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 40px"}}>
        <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo variant="light"/>
          <button onClick={retourDashboard} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mes demandes</button>
        </div>
        <div style={{padding:"24px 16px",maxWidth:640,margin:"0 auto"}}>
          <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Short-list · {selectedDem.poste}</p>
          <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 4px"}}>{nbProfils} profil{nbProfils>1?"s":""} sélectionné{nbProfils>1?"s":""}</h2>
          <p style={{fontSize:12,color:"#718096",margin:"0 0 20px"}}>{selectedDem.entreprise} · Payée le {new Date(paiement.date_confirmation||paiement.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</p>
          {profils.map(c=>(
            <div key={c.id} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"18px 16px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:600,color:NAVY,flexShrink:0}}>{(c.prenom?.[0]||"")}{(c.nom?.[0]||"")}</div>
                <div style={{flex:1}}>
                  <p style={{margin:0,fontSize:15,fontWeight:500,color:NAVY}}>{c.prenom} {c.nom}</p>
                  <p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>{c.titre}{c.ville?` · ${c.ville}`:""}</p>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                <span style={{fontSize:12,color:NAVY}}>📧 {c.email}</span>
                {c.tel&&<span style={{fontSize:12,color:"#718096"}}>📞 {c.tel}</span>}
              </div>
              {(c.formations||[]).length>0&&<div style={{marginBottom:8}}><p style={{margin:"0 0 4px",fontSize:11,fontWeight:500,color:"#4A5568"}}>🎓 Formation</p>{triFo(c.formations).map((fo,i)=><p key={i} style={{margin:"0 0 2px",fontSize:12,color:"#718096"}}>{fo.diplome}{fo.etab?` — ${fo.etab}`:""}{fo.annee?` (${fo.annee})`:""}</p>)}</div>}
              {(c.experiences||[]).length>0&&<div style={{marginBottom:8}}><p style={{margin:"0 0 4px",fontSize:11,fontWeight:500,color:"#4A5568"}}>💼 Expérience</p>{triExp(c.experiences).map((e,i)=><p key={i} style={{margin:"0 0 2px",fontSize:12,color:"#718096"}}>{e.poste}{e.org?` — ${e.org}`:""}{e.debut?` (${e.debut}${e.encours?" – en cours":e.fin?` – ${e.fin}`:""})`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p>)}</div>}
              {(c.specs||[]).length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:6}}>{(c.specs||[]).map(s=><span key={s} style={{background:CREAM,color:NAVY,fontSize:11,padding:"2px 8px",borderRadius:20}}>{s}</span>)}</div>}
              {(c.langues||[]).filter(l=>l&&l.langue).length>0&&<p style={{margin:0,fontSize:12,color:"#718096"}}>🌍 {(c.langues||[]).map(l=>typeof l==="string"?l:`${l.langue} (${l.niveau})`).join(", ")}</p>}
              {(c.modalites||[]).length>0&&<p style={{margin:"4px 0 0",fontSize:12,color:"#718096"}}>🏢 {(c.modalites||[]).join(" / ")}</p>}
            </div>
          ))}
        </div>
      </div>
    );

    // NON PAYÉ → PAYWALL
    return(
      <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 40px"}}>
        <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo variant="light"/>
          <button onClick={retourDashboard} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mes demandes</button>
        </div>
        <div style={{padding:"32px 16px",maxWidth:500,margin:"0 auto"}}>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",overflow:"hidden"}}>
            <div style={{background:NAVY,padding:"24px 24px 20px",textAlign:"center"}}>
              <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:1,margin:"0 0 6px"}}>Short-list prête</p>
              <p style={{fontSize:22,fontWeight:500,color:"#fff",margin:"0 0 4px"}}>{selectedDem.poste}</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:0}}>{selectedDem.entreprise}</p>
            </div>
            <div style={{padding:"24px",textAlign:"center"}}>
              <p style={{fontSize:14,color:NAVY,margin:"0 0 4px"}}><strong>{nbProfils} profil{nbProfils>1?"s":""}</strong> sélectionné{nbProfils>1?"s":""} pour vous</p>
              <div style={{background:GOLD_LIGHT,borderRadius:10,padding:"16px",margin:"16px 0"}}>
                <p style={{margin:"0 0 2px",fontSize:12,color:"#718096"}}>{nbProfils} × {PRIX_UNITAIRE.toLocaleString("fr-FR")} MAD</p>
                <p style={{margin:0,fontSize:28,fontWeight:600,color:NAVY}}>{total.toLocaleString("fr-FR")} MAD</p>
                <p style={{margin:"4px 0 0",fontSize:11,color:"#A0AEC0"}}>HT · Paiement par virement bancaire</p>
              </div>
              <div style={{background:"#F8FAFC",borderRadius:10,padding:"16px",textAlign:"left",margin:"16px 0"}}>
                <p style={{margin:"0 0 10px",fontSize:12,fontWeight:600,color:NAVY}}>Coordonnées bancaires</p>
                <div style={{display:"flex",flexDirection:"column",gap:6}}>
                  {[["Bénéficiaire","SENTISSI LEGAL ADVISORY"],["Banque","Attijariwafa Bank"],["Agence","Casa Tontonville"],["RIB","007 780 0003642000000445 15"],["SWIFT","BCMAMAMC"],["Référence à indiquer",ref]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",gap:8}}>
                      <span style={{fontSize:11.5,color:"#718096"}}>{k}</span>
                      <span style={{fontSize:11.5,color:NAVY,fontWeight:k==="Référence à indiquer"?600:500,textAlign:"right"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {!dejaSignale ? (
                <div>
                  <p style={{fontSize:12,color:"#718096",lineHeight:1.6,margin:"0 0 16px"}}>Effectuez le virement avec la référence ci-dessus, puis cliquez pour nous prévenir. Vos profils seront débloqués sous 24h ouvrées après confirmation.</p>
                  <button onClick={()=>signalerVirement(selectedDem, sl, nbProfils, total, ref)} disabled={signalantVirement} style={{width:"100%",padding:"12px",borderRadius:8,fontSize:14,cursor:signalantVirement?"default":"pointer",background:signalantVirement?"#E2E8F0":GOLD,color:signalantVirement?"#A0AEC0":NAVY,border:"none",fontWeight:600}}>{signalantVirement?"Enregistrement…":"J'ai effectué le virement"}</button>
                </div>
              ) : (
                <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:10,padding:"16px",textAlign:"center"}}>
                  <p style={{fontSize:14,fontWeight:500,color:"#166534",margin:"0 0 6px"}}>✔ Virement signalé</p>
                  <p style={{fontSize:12,color:"#166534",margin:0,lineHeight:1.6}}>Merci ! L'équipe JURIJOB va vérifier la réception de votre virement. Vos profils seront débloqués sous 24h ouvrées. Vous recevrez un e-mail de confirmation.</p>
                </div>
              )}
              <p style={{fontSize:11,color:"#A0AEC0",margin:"16px 0 0"}}>Une question ? <span style={{color:GOLD}}>recrutement@sentissilegal.com</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORMULAIRE « Entrez vos critères »
  return(
    <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 32px"}}>
      <div style={{background:NAVY,padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={()=>setVue("dashboard")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mes demandes</button>
      </div>
      <div style={{padding:"22px 16px",maxWidth:580,margin:"0 auto"}}>
        <div style={{marginBottom:22}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>{STEPS_R.map((s,i)=><span key={i} style={{fontSize:11,fontWeight:i===step?500:400,color:i<=step?NAVY:"#A0AEC0",flex:1,textAlign:"center"}}>{s}</span>)}</div>
          <div style={{height:4,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(step/(STEPS_R.length-1))*100}%`,background:GOLD,borderRadius:4,transition:"width .3s"}}/></div>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",padding:"24px 24px 20px"}}>
          <p style={{fontSize:12,color:GOLD,fontWeight:500,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Espace Recruteur · Étape {step+1} / {STEPS_R.length}</p>
          <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 20px"}}>{STEPS_R[step]}</h2>
          {renderStep()}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:24,paddingTop:16,borderTop:"1px solid #F0F4F8"}}>
            <button onClick={()=>setStep(s=>s-1)} disabled={step===0} style={{padding:"8px 18px",borderRadius:8,fontSize:13,cursor:step===0?"default":"pointer",background:"transparent",color:step===0?"#CBD5E0":NAVY,border:`1.5px solid ${step===0?"#E2E8F0":"#CBD5E0"}`}}>← Précédent</button>
            {step<4?<button onClick={()=>setStep(s=>s+1)} disabled={!ok()} style={{padding:"8px 22px",borderRadius:8,fontSize:13,cursor:ok()?"pointer":"default",background:ok()?NAVY:"#E2E8F0",color:ok()?"#fff":"#A0AEC0",border:"none",fontWeight:500}}>Suivant →</button>
            :<button onClick={sauvegarderDemande} style={{padding:"9px 26px",borderRadius:8,fontSize:13,cursor:"pointer",background:GOLD,color:NAVY,border:"none",fontWeight:600}}>Soumettre la demande</button>}
          </div>
        </div>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:16}}>{STEPS_R.map((_,i)=><div key={i} style={{width:i===step?20:7,height:7,borderRadius:4,background:i===step?NAVY:i<step?GOLD:"#CBD5E0",transition:"all .2s"}}/>)}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   APP ROOT
═══════════════════════════════════════ */
/* ═══════════════════════════════════════
   DÉFINIR UN NOUVEAU MOT DE PASSE (retour depuis le lien de réinitialisation)
═══════════════════════════════════════ */
function ResetPassword({onDone}){
  const [pwd,setPwd]=useState("");
  const [pwd2,setPwd2]=useState("");
  const [msg,setMsg]=useState("");
  const [busy,setBusy]=useState(false);
  const [ok,setOk]=useState(false);

  const submit=async()=>{
    if(pwd.length<6){ setMsg("Le mot de passe doit contenir au moins 6 caractères."); return; }
    if(pwd!==pwd2){ setMsg("Les deux mots de passe ne correspondent pas."); return; }
    setBusy(true); setMsg("");
    const {error}=await supabase.auth.updateUser({password:pwd});
    setBusy(false);
    if(error){ setMsg(frMsg(error.message)); } else { setOk(true); }
  };

  return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:"#fff",borderRadius:16,padding:"32px 30px",maxWidth:400,width:"100%",border:"1px solid #E2E8F0"}}>
        <div style={{textAlign:"center",marginBottom:18}}><Logo/></div>
        {ok ? (
          <div style={{textAlign:"center"}}>
            <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 10px"}}>Mot de passe mis à jour ✓</h2>
            <p style={{color:"#718096",fontSize:13.5,lineHeight:1.6,margin:"0 0 20px"}}>Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <button onClick={onDone} style={{width:"100%",padding:"11px",borderRadius:8,fontSize:14,cursor:"pointer",background:NAVY,color:"#fff",border:"none",fontWeight:500}}>Aller à la connexion</button>
          </div>
        ) : (
          <>
            <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 6px",textAlign:"center"}}>Nouveau mot de passe</h2>
            <p style={{color:"#718096",fontSize:12.5,textAlign:"center",margin:"0 0 20px"}}>Choisissez un nouveau mot de passe pour votre compte.</p>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              <div><Lbl t="Nouveau mot de passe" r/><input type="password" value={pwd} onChange={e=>setPwd(e.target.value)} placeholder="••••••••" style={iSt}/></div>
              <div><Lbl t="Confirmer le mot de passe" r/><input type="password" value={pwd2} onChange={e=>setPwd2(e.target.value)} placeholder="••••••••" style={iSt}/></div>
              {msg&&<p style={{fontSize:12.5,color:"#E53E3E",margin:0,lineHeight:1.5}}>{msg}</p>}
              <button onClick={submit} disabled={busy||!pwd||!pwd2} style={{padding:"11px",borderRadius:8,fontSize:14,cursor:busy?"default":"pointer",background:(busy||!pwd||!pwd2)?"#E2E8F0":NAVY,color:(busy||!pwd||!pwd2)?"#A0AEC0":"#fff",border:"none",fontWeight:500}}>{busy?"…":"Valider"}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MENTIONS LÉGALES — Style clair institutionnel
═══════════════════════════════════════ */
function PageMentionsLegales({onBack,onNavigate}){
  useEffect(()=>{
    if(!document.getElementById('gfont-jurijob-landing')){
      const l=document.createElement('link'); l.id='gfont-jurijob-landing'; l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
      document.head.appendChild(l);
    }
  },[]);
  const ff="'Inter',system-ui,sans-serif";
  const fs="'Cormorant Garamond',Georgia,serif";

  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c"}}>
      {/* NAV */}
      <nav style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center",height:64,position:"sticky",top:0,zIndex:10}}>
        <Logo size="header"/>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:13,cursor:"pointer",fontFamily:ff}}>← Retour à l'accueil</button>
      </nav>

      {/* HERO */}
      <section style={{background:NAVY,padding:"64px 32px",textAlign:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 14px",fontWeight:500,fontFamily:ff}}>Informations juridiques</p>
          <h1 style={{fontFamily:fs,fontSize:42,lineHeight:1.15,color:"#fff",fontWeight:500,margin:"0 auto 12px",letterSpacing:-0.6}}>
            Mentions <em style={{color:GOLD,fontStyle:"italic",fontWeight:500}}>légales</em>
          </h1>
          <p style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.75)",maxWidth:520,margin:"0 auto",fontWeight:300,fontFamily:ff}}>
            Informations relatives à l'éditeur, à l'hébergement et au traitement des données personnelles.
          </p>
        </div>
      </section>

      {/* SECTION — Traitement des données personnelles (CNDP) */}
      <section style={{padding:"56px 32px",maxWidth:820,margin:"0 auto"}}>
        <div style={{marginBottom:36}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Protection des données personnelles</p>
          <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:"0 0 20px",letterSpacing:-0.3}}>Traitement des données personnelles</h2>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 14px"}}>
            Par le biais de ce formulaire, Mohammed Sentissi collecte vos données personnelles en vue de leur inscription dans la CVthèque JURIJOB, plateforme de sélection de profils juridiques destinée à mettre les candidats en relation avec des recruteurs identifiés au Maroc et en Afrique francophone.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 14px"}}>
            Ce traitement a fait l'objet d'une déclaration auprès de la CNDP sous le numéro <strong style={{color:NAVY}}>en cours de traitement par la CNDP</strong>. Les données personnelles collectées peuvent être transmises à tous les recruteurs potentiels au Maroc conformément à la demande de transfert déposée auprès de la CNDP.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:0}}>
            Vous pouvez vous adresser à <a href="mailto:recrutement@sentissilegal.com" style={{color:GOLD,textDecoration:"none",fontWeight:500}}>recrutement@sentissilegal.com</a> pour exercer vos droits d'accès, de rectification et d'opposition conformément aux dispositions de la loi 09-08.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#fff",padding:"24px 32px",borderTop:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Logo size="compact"/>
            <span style={{fontSize:11,color:"#A0AEC0",fontFamily:ff}}>© 2026 — Smart Recrutement Juridique</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Accueil</button>
            <button onClick={()=>onNavigate&&onNavigate("services")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Services</button>
            <span style={{fontSize:12,color:"#4A5568",fontFamily:ff}}>recrutement@sentissilegal.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   SERVICES — Style clair institutionnel
═══════════════════════════════════════ */
function PageServices({onBack,onNavigate}){
  useEffect(()=>{
    if(!document.getElementById('gfont-jurijob-landing')){
      const l=document.createElement('link'); l.id='gfont-jurijob-landing'; l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
      document.head.appendChild(l);
    }
  },[]);
  const ff="'Inter',system-ui,sans-serif";
  const fs="'Cormorant Garamond',Georgia,serif";
  const [hov,setHov]=useState(null);
  const isMobile=useIsMobile();

  const services=[
    {
      icon:"§",
      titre:"Rédaction de contrats de travail sur mesure",
      desc:"Nous rédigeons des contrats de travail personnalisés, adaptés à chaque poste et à votre contexte, dans le respect de la législation sociale en vigueur au Maroc."
    },
    {
      icon:"◆",
      titre:"Prise en charge du recrutement de profils étrangers",
      desc:"Vous souhaitez recruter un talent non-marocain ? Nous prenons en charge l'intégralité des démarches liées à l'embauche de profils étrangers au Maroc : vous nous confiez le dossier, nous nous en occupons de bout en bout, jusqu'à sa finalisation."
    },
    {
      icon:"○",
      titre:"Participation et évaluation des entretiens",
      desc:"Nos experts peuvent assister à vos entretiens d'embauche et évaluer chaque candidat selon une grille d'appréciation rigoureuse, pour sécuriser et objectiver votre décision finale."
    },
    {
      icon:"⊙",
      titre:"Préparation de la fiche de poste",
      desc:"En amont du recrutement, nous vous aidons à définir précisément votre besoin et à construire une fiche de poste claire et structurée — la base d'une recherche efficace."
    },
  ];

  const cardStyle=(key)=>({
    background:"#fff",
    border:`1px solid ${hov===key?"#C8A046":"#E2E8F0"}`,
    borderRadius:10,
    padding:"24px 22px",
    transition:"all .2s",
    transform:hov===key?"translateY(-2px)":"none",
    boxShadow:hov===key?"0 8px 20px rgba(11,37,69,0.06)":"none",
    textAlign:"left"
  });

  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c"}}>
      {/* NAV */}
      <nav style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center",height:64,position:"sticky",top:0,zIndex:10}}>
        <Logo size="header"/>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:13,cursor:"pointer",fontFamily:ff}}>← Retour à l'accueil</button>
      </nav>

      {/* HERO */}
      <section style={{background:NAVY,padding:isMobile?"48px 20px":"64px 32px",textAlign:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 14px",fontWeight:500,fontFamily:ff}}>Nos prestations</p>
          <h1 style={{fontFamily:fs,fontSize:isMobile?32:42,lineHeight:1.15,color:"#fff",fontWeight:500,margin:"0 auto 12px",letterSpacing:-0.6,maxWidth:640}}>
            Nos <em style={{color:GOLD,fontStyle:"italic",fontWeight:500}}>services</em>
          </h1>
          <p style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.75)",maxWidth:540,margin:"0 auto",fontWeight:300,fontFamily:ff}}>
            Au-delà de la mise en relation, JURIJOB et Sentissi Legal Advisory vous accompagnent à chaque étape de votre recrutement juridique.
          </p>
        </div>
      </section>

      {/* OFFRE PRINCIPALE — short-list */}
      <section style={{padding:isMobile?"40px 20px 24px":"56px 32px 32px",maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Notre offre principale</p>
          <h2 style={{fontFamily:fs,fontSize:28,color:NAVY,fontWeight:500,margin:0,letterSpacing:-0.3}}>La short-list de profils juridiques</h2>
        </div>
        <div style={{background:"#F8F5ED",border:`1px solid ${GOLD_LIGHT}`,borderRadius:12,padding:isMobile?"22px 20px":"28px 32px"}}>
          <p style={{fontSize:15,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 16px"}}>
            Le cœur de JURIJOB : vous sélectionnez les critères du profil recherché — spécialisation, expérience, diplôme, langues — et le nombre de profils souhaité, et nous vous livrons une <strong style={{color:NAVY,fontWeight:600}}>short-list de juristes présélectionnés et scorés</strong>, sous 48 heures ouvrées.
          </p>
          <p style={{fontSize:15,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:0}}>
            Chaque short-list est validée manuellement par un ex-Directeur juridique. Vous gardez la main sur l'entretien et la décision finale.
          </p>
        </div>
      </section>

      {/* SERVICES COMPLÉMENTAIRES */}
      <section style={{padding:isMobile?"16px 20px 40px":"24px 32px 56px",maxWidth:900,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Pour aller plus loin</p>
          <h2 style={{fontFamily:fs,fontSize:28,color:NAVY,fontWeight:500,margin:0,letterSpacing:-0.3}}>Services complémentaires</h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(2,1fr)",gap:16}}>
          {services.map((s,i)=>(
            <div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)} style={cardStyle(i)}>
              <div style={{width:34,height:34,background:GOLD_LIGHT,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:14,color:GOLD,fontSize:17,fontWeight:600,fontFamily:fs}}>{s.icon}</div>
              <h3 style={{fontFamily:fs,fontSize:19,color:NAVY,fontWeight:600,margin:"0 0 8px",lineHeight:1.3}}>{s.titre}</h3>
              <p style={{fontSize:13.5,color:"#4A5568",lineHeight:1.65,margin:0,fontFamily:ff,fontWeight:300}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA CONTACT */}
      <section style={{padding:"48px 32px",background:"#F8F5ED",borderTop:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:640,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontFamily:fs,fontSize:24,color:NAVY,fontWeight:500,margin:"0 0 10px",letterSpacing:-0.3}}>Un besoin spécifique ?</h2>
          <p style={{fontSize:14,color:"#4A5568",margin:"0 0 20px",lineHeight:1.6,fontFamily:ff,fontWeight:300}}>Chaque prestation est adaptée à votre contexte et fait l'objet d'un devis personnalisé. Écrivez-nous pour en discuter.</p>
          <a href="mailto:recrutement@sentissilegal.com" style={{display:"inline-block",background:NAVY,color:"#fff",fontWeight:500,fontSize:13.5,padding:"12px 26px",borderRadius:7,textDecoration:"none",fontFamily:ff}}>recrutement@sentissilegal.com</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#fff",padding:"24px 32px",borderTop:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Logo size="compact"/>
            <span style={{fontSize:11,color:"#A0AEC0",fontFamily:ff}}>© 2026 — Smart Recrutement Juridique</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Accueil</button>
            <button onClick={()=>onNavigate&&onNavigate("faq")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>FAQ</button>
            <button onClick={()=>onNavigate&&onNavigate("legal")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Mentions légales</button>
            <span style={{fontSize:12,color:"#4A5568",fontFamily:ff}}>recrutement@sentissilegal.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   FAQ — Accordéon, style clair institutionnel
═══════════════════════════════════════ */
function PageFAQ({onBack,onNavigate}){
  useEffect(()=>{
    if(!document.getElementById('gfont-jurijob-landing')){
      const l=document.createElement('link'); l.id='gfont-jurijob-landing'; l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
      document.head.appendChild(l);
    }
  },[]);
  const ff="'Inter',system-ui,sans-serif";
  const fs="'Cormorant Garamond',Georgia,serif";
  const [open,setOpen]=useState(null);
  const toggle=i=>setOpen(o=>o===i?null:i);
  const isMobile=useIsMobile();

  const sections = [
    {
      titre: "Comprendre JURIJOB",
      faqs: [
        {
          q: "Qu'est-ce que JURIJOB, exactement ?",
          a: "JURIJOB est une plateforme de sélection de profils juridiques au Maroc et en Afrique francophone. Notre rôle est de vous livrer une short-list qualifiée qui correspond à vos critères — spécialisation, langues, expérience, diplôme. L'entretien, l'appréciation et la décision finale restent entre vos mains : nous vous faisons gagner un temps considérable en identifiant les profils pertinents."
        },
        {
          q: "En quoi JURIJOB diffère d'un cabinet de recrutement classique ?",
          a: "Un cabinet de recrutement facture au succès de l'embauche, souvent 15 à 25 % du salaire annuel du candidat recruté. JURIJOB facture un tarif fixe et transparent par profil livré, communiqué directement au recruteur lors de sa demande. Nous ne sommes pas rémunérés au succès de votre embauche, mais à la qualité de la sélection — cela nous permet de rester objectifs et de proposer un service à coût maîtrisé, même pour des besoins récurrents."
        },
        {
          q: "Qui est derrière JURIJOB ?",
          a: "JURIJOB est portée par Sentissi Legal Advisory (SLA), cabinet fondé par Mohammed Sentissi — expert juridique, ex-Directeur juridique de holdings au Maroc et en Afrique, et Président élu de l'Association marocaine des juristes d'entreprise — AMJE (en cours de constitution). Le service s'appuie sur 24 ans d'expérience en direction juridique et sur un réseau de plusieurs dizaines de milliers de contacts professionnels."
        }
      ]
    },
    {
      titre: "Pour les recruteurs",
      faqs: [
        {
          q: "Comment JURIJOB sélectionne-t-il ses candidats ?",
          a: "Nous appliquons une méthodologie rigoureuse fondée sur une expertise juridique de terrain. Notre algorithme de scoring évalue chaque profil sur quatre dimensions clés : spécialisations juridiques, langues, expérience et diplôme. Chaque short-list est ensuite validée manuellement par un ex-Directeur juridique, avant envoi au recruteur."
        },
        {
          q: "Quel est le délai pour recevoir ma short-list ?",
          a: "Sous 48 heures ouvrées après validation de votre demande. Ce délai couvre l'ensemble du travail : analyse de vos critères, recherche dans la CVthèque et le réseau professionnel, évaluation manuelle des profils, puis composition d'une short-list courte et qualifiée."
        },
        {
          q: "Que se passe-t-il si aucun profil de la short-list ne me convient ?",
          a: "Écrivez-nous à recrutement@sentissilegal.com. Selon la nature du besoin, nous pouvons vous orienter vers un service complémentaire de chasse de tête, avec une tarification adaptée. Nous restons à votre écoute pour affiner la recherche."
        },
        {
          q: "Proposez-vous des tarifs pour des besoins récurrents ?",
          a: "Oui. Pour les entreprises et cabinets ayant plusieurs recrutements juridiques par an, nous appliquons une tarification dégressive. Contactez-nous à recrutement@sentissilegal.com pour un devis personnalisé."
        }
      ]
    },
    {
      titre: "Candidats & services complémentaires",
      faqs: [
        {
          q: "Comment garantissez-vous la confidentialité ?",
          a: "La discrétion est au cœur de notre déontologie. Chaque profil candidat est hébergé de manière sécurisée et n'est accessible qu'aux recruteurs dont le paiement est confirmé — aucune diffusion publique. Notre plateforme est conforme à la loi marocaine 09-08 relative à la protection des données personnelles."
        },
        {
          q: "JURIJOB propose-t-il d'autres services que la short-list ?",
          a: "Oui. En complément, SLA peut prendre en charge des entretiens de pré-qualification (service payant) permettant d'évaluer les candidats avant vos propres entretiens. D'autres prestations sont disponibles à la demande : chasse de tête, rédaction de contrats de travail, audit RH juridique. Écrivez à recrutement@sentissilegal.com pour toute demande spécifique."
        }
      ]
    }
  ];

  // Aplatissement pour l'index global (pour éviter les doublons d'open)
  let globalIdx = 0;

  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c"}}>
      {/* NAV */}
      <nav style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center",height:64,position:"sticky",top:0,zIndex:10}}>
        <Logo size="header"/>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:13,cursor:"pointer",fontFamily:ff}}>← Retour à l'accueil</button>
      </nav>

      {/* HERO avec photo poignée de main en arrière-plan */}
      <section style={{position:"relative",overflow:"hidden",minHeight:"min(340px,45vh)",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:`url(${handshakeImage})`,backgroundSize:"cover",backgroundPosition:"center"}} aria-hidden="true"/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg, rgba(11,37,69,0.92) 0%, rgba(11,37,69,0.78) 50%, rgba(26,58,107,0.72) 100%)"}} aria-hidden="true"/>
        <div style={{position:"relative",zIndex:2,padding:isMobile?"48px 20px":"60px 32px",maxWidth:900,margin:"0 auto",textAlign:"center"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 14px",fontWeight:500,fontFamily:ff}}>Foire aux questions</p>
          <h1 style={{fontFamily:fs,fontSize:isMobile?32:42,lineHeight:1.15,color:"#fff",fontWeight:500,margin:"0 auto 12px",letterSpacing:-0.6,maxWidth:640,textShadow:"0 2px 12px rgba(0,0,0,0.25)"}}>
            Questions <em style={{color:GOLD,fontStyle:"italic",fontWeight:500}}>Fréquentes</em>
          </h1>
          <p style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.75)",maxWidth:520,margin:"0 auto",fontWeight:300,fontFamily:ff}}>
            Tout ce que vous devez savoir sur JURIJOB : notre approche, nos tarifs, nos délais et nos garanties.
          </p>
        </div>
      </section>

      {/* SECTIONS FAQ */}
      <section style={{padding:isMobile?"40px 20px":"56px 32px",maxWidth:820,margin:"0 auto"}}>
        {sections.map((sec, si) => (
          <div key={si} style={{marginBottom:si<sections.length-1?44:0}}>
            <div style={{textAlign:"center",marginBottom:24}}>
              <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 6px",fontWeight:500,fontFamily:ff}}>Section {si+1}</p>
              <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:0,letterSpacing:-0.3}}>{sec.titre}</h2>
            </div>
            {sec.faqs.map((item) => {
              const currentIdx = globalIdx++;
              const isOpen = open === currentIdx;
              return (
                <div key={currentIdx} style={{borderBottom:"1px solid #E2E8F0"}}>
                  <button onClick={() => toggle(currentIdx)} style={{width:"100%",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",padding:"22px 0",fontFamily:ff}}>
                    <span style={{fontSize:16,fontWeight:500,color:NAVY,fontFamily:fs,paddingRight:16,lineHeight:1.4}}>{item.q}</span>
                    <span style={{fontSize:24,color:GOLD,fontWeight:300,lineHeight:1,transition:"transform .2s",transform:isOpen?"rotate(45deg)":"none",flexShrink:0}}>+</span>
                  </button>
                  {isOpen && (
                    <div style={{paddingBottom:22,paddingRight:isMobile?0:32}}>
                      <p style={{margin:0,fontSize:14,color:"#4A5568",lineHeight:1.7,fontWeight:300,fontFamily:ff}}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </section>

      {/* CTA CONTACT */}
      <section style={{padding:isMobile?"40px 20px":"48px 32px",background:"#F8F5ED",borderTop:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:640,margin:"0 auto",textAlign:"center"}}>
          <h2 style={{fontFamily:fs,fontSize:24,color:NAVY,fontWeight:500,margin:"0 0 10px",letterSpacing:-0.3}}>Une autre question ?</h2>
          <p style={{fontSize:14,color:"#4A5568",margin:"0 0 20px",lineHeight:1.6,fontFamily:ff,fontWeight:300}}>Notre équipe reste à votre disposition pour toute demande spécifique.</p>
          <a href="mailto:recrutement@sentissilegal.com" style={{display:"inline-block",background:NAVY,color:"#fff",fontWeight:500,fontSize:isMobile?12.5:13.5,padding:isMobile?"12px 18px":"12px 26px",borderRadius:7,textDecoration:"none",fontFamily:ff,wordBreak:"break-word"}}>recrutement@sentissilegal.com</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{background:"#fff",padding:"24px 32px",borderTop:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Logo size="compact"/>
            <span style={{fontSize:11,color:"#A0AEC0",fontFamily:ff}}>© 2026 — Smart Recrutement Juridique</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:18}}>
            <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Accueil</button>
            <button onClick={()=>onNavigate&&onNavigate("services")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Services</button>
            <button onClick={()=>onNavigate&&onNavigate("legal")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Mentions légales</button>
            <span style={{fontSize:12,color:"#4A5568",fontFamily:ff}}>recrutement@sentissilegal.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App(){
  const ADMIN_EMAIL="admin@jurijob.ma";
  const [view,setView]=useState("landing");
  const [session,setSession]=useState(null);
  const [ready,setReady]=useState(false);
  const [intendedRole,setIntendedRole]=useState(null); // "candidat" | "recruteur" | null
  const [recovery,setRecovery]=useState(false); // true après clic sur un lien de réinitialisation

  useEffect(()=>{
    if(window.location.hash.includes("type=recovery")) setRecovery(true);
    supabase.auth.getSession().then(({data})=>{ setSession(data.session); setReady(true); });
    const { data:sub } = supabase.auth.onAuthStateChange((event,s)=>{
      if(event==="PASSWORD_RECOVERY") setRecovery(true);
      setSession(s);
    });
    return ()=>{ sub.subscription.unsubscribe(); };
  },[]);

  const loginGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider:'google',
      options:{ redirectTo: window.location.origin }
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setIntendedRole(null);
    setView("landing");
  };

  if(!ready) return <Chargement/>;

  // Retour depuis un lien de réinitialisation : on affiche l'écran « nouveau mot de passe »
  if(recovery) return <ResetPassword onDone={async()=>{ await supabase.auth.signOut(); setRecovery(false); setIntendedRole(null); setView("landing"); }}/>;

  const provider = session?.user?.app_metadata?.provider;
  const role = session?.user?.user_metadata?.role;
  const isAdmin = session?.user?.email === ADMIN_EMAIL;
  const actualRole = provider==="google" ? "candidat" : (role || "recruteur");
  const roleLabel = r => r==="candidat" ? "Candidat" : "Recruteur";

  // Admin : via le bouton « Accès Admin » ou si une session admin est déjà active
  if(view==="admin" || isAdmin) return <AdminDashboard onBack={()=>setView("landing")}/>;

  if(session){
    // Connexion par une « porte » qui ne correspond pas au rôle réel du compte
    if(intendedRole && actualRole!==intendedRole)
      return <RoleMismatch email={session.user.email} actualLabel={roleLabel(actualRole)} intendedLabel={roleLabel(intendedRole)} onContinue={()=>setIntendedRole(actualRole)} onLogout={logout}/>;
    if(actualRole==="candidat") return <EspaceCandidat session={session} onLogout={logout}/>;
    return <EspaceRecruteur session={session} onLogout={logout}/>;
  }

  // Pas de session : écrans de connexion selon le choix
  if(view==="services") return <PageServices onBack={()=>setView("landing")} onNavigate={(v)=>setView(v)}/>;
  if(view==="faq") return <PageFAQ onBack={()=>setView("landing")} onNavigate={(v)=>setView(v)}/>;
  if(view==="legal") return <PageMentionsLegales onBack={()=>setView("landing")} onNavigate={(v)=>setView(v)}/>;
  if(view==="candidat-auth") return <AuthCandidat onBack={()=>setView("landing")} onGoogle={loginGoogle} onSwitch={()=>{setIntendedRole("recruteur");setView("recruteur-auth");}}/>;
  if(view==="recruteur-auth") return <AuthRecruteur onBack={()=>setView("landing")} onSwitch={()=>{setIntendedRole("candidat");setView("candidat-auth");}}/>;

  // Sinon, page d'accueil
  return <Landing onChoose={(v)=>{
    if(v==="candidat"){ setIntendedRole("candidat"); setView("candidat-auth"); }
    else if(v==="recruteur"){ setIntendedRole("recruteur"); setView("recruteur-auth"); }
    else setView(v);
  }}/>;
}