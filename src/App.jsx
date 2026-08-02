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
const TYPES_EXP=["Stage","Alternance / Professionnalisation","CDI","CDD","Freelance / Consulting","Clinique juridique","Bénévolat juridique","Autre"];
const NIVEAUX_RH=[{val:"stagiaire",label:"Stagiaire",sub:"0 an"},{val:"junior",label:"Junior",sub:"1 – 3 ans"},{val:"confirme",label:"Confirmé",sub:"3 – 7 ans"},{val:"senior",label:"Senior",sub:"7 – 12 ans"},{val:"directeur",label:"Directeur juridique",sub:"12 ans +"}];
const DIPLOMES_RH=[{val:"licence",label:"Licence en droit"},{val:"licence_bac4",label:"Licence (ancien système, Bac+4)"},{val:"master1",label:"Master I"},{val:"master2",label:"Master II / DESA"},{val:"doctorat",label:"Doctorat"},{val:"barreau",label:"Diplôme du Barreau"},{val:"notariat",label:"Notariat"},{val:"indifferent",label:"Indifférent"}];
const LANGUES_RH=["Arabe","Français","Anglais","Espagnol","Allemand","Italien","Mandarin"];
const STEPS_C=["Identité","Formation","Parcours","Spécialisations","Langues","Préférences","Aperçu"];
const STEPS_R=["Votre profil","Langues","Expérience & Diplôme","Spécialisation","Confirmation"];

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
const Inp=({val,onChange,ph,style,filter,onBlur})=><input value={val} onChange={e=>onChange(filter?filter(e.target.value):e.target.value)} onBlur={onBlur} placeholder={ph} style={{...iSt,...style}}/>;
const Lbl=({t,r})=><label style={{fontSize:12,fontWeight:500,color:"#4A5568",display:"block",marginBottom:5}}>{t}{r&&<span style={{color:GOLD,marginLeft:3}}>*</span>}</label>;
const Pill=({active,onClick,children})=><button onClick={onClick} style={{padding:"6px 13px",borderRadius:20,fontSize:12.5,cursor:"pointer",background:active?NAVY:"transparent",color:active?"#fff":NAVY,border:`1.5px solid ${active?NAVY:"#CBD5E0"}`,fontWeight:active?500:400}}>{children}</button>;
const SecTitle=({t})=><p style={{fontSize:11,fontWeight:500,color:GOLD,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 10px",borderBottom:`1px solid ${CREAM}`,paddingBottom:6}}>{t}</p>;

/* Normalise la casse d'un nom propre : « el amrani » ou « EL AMRANI » → « El Amrani ».
   Découpe sur les espaces, tirets et apostrophes (droites ou typographiques),
   et réduit les espaces multiples. */
const capNom = s => (s||"").trim().replace(/\s+/g," ").toLowerCase()
  .replace(/(^|[\s\-'’])([a-zà-ÿ])/g,(m,p1,p2)=>p1+p2.toUpperCase());

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
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c",overflowX:"hidden",width:"100%",boxSizing:"border-box"}}>
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
            ["48h","Livraison de la short-list"],
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
      <section style={{padding:isMobile?"40px 20px":"56px 32px",maxWidth:1100,margin:"0 auto"}}>
        <div style={{background:"#fff",border:`1px solid ${GOLD_LIGHT}`,borderRadius:12,padding:isMobile?"24px 22px":"32px 36px",display:"flex",gap:24,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{width:80,height:80,borderRadius:"50%",background:NAVY,color:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:fs,fontSize:28,fontWeight:600,flexShrink:0}}>MS</div>
          <div style={{flex:1,minWidth:isMobile?0:280}}>
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
            <button onClick={()=>onChoose("cgu")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>CGU</button>
            <button onClick={()=>onChoose("cgv")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>CGV</button>
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

  /* Responsive : une seule colonne sous 768 px, marges et bandeaux resserrés */
  const isMobile=useIsMobile();
  const g2=isMobile?"1fr":"1fr 1fr";                                  // grilles à 2 colonnes
  const padBarre=isMobile?"12px 16px":"14px 24px";                    // bandeau navy
  const padCarte=isMobile?"18px 16px 16px":"24px 24px 20px";          // carte du formulaire

  const [step,setStep]=useState(0);
  const [done,setDone]=useState(false);
  const [checking,setChecking]=useState(true);
  const [existing,setExisting]=useState(null);
  const [formMode,setFormMode]=useState(null); // null = création | 'edit' = modification
  const [deleted,setDeleted]=useState(false);
  const [savedMsg,setSavedMsg]=useState("");
  const [saving,setSaving]=useState(false);
  const [sansExp,setSansExp]=useState(null); // null = pas encore répondu | true = aucune expérience | false = a une expérience
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
      prenom: capNom(f.prenom), nom: capNom(f.nom), email: f.email,
      tel: f.tel, ville: capNom(f.ville), titre: f.titre,
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
      experiences:(e.experiences||[]).map((x,i)=>({id:x.id||i+1,type:x.type||"",poste:x.poste||"",org:x.org||"",debut:x.debut||"",fin:x.fin||"",encours:!!x.encours,missions:x.missions||"",editing:false})),
      specs:e.specs||[],
      langues:(e.langues&&e.langues.length>0?e.langues:[{langue:"Français",niveau:"Courant"}]).map((x,i)=>({id:x.id||i+1,langue:x.langue||"",niveau:x.niveau||"Courant"})),
      contrats:e.contrats||[],
      modalites:e.modalites||[],
      dispo:e.disponibilite||"", salaire:e.salaire||"", salaireNote:e.salaire_note||"", salaireActuel:e.salaire_actuel||""
    });
    setSansExp((e.experiences||[]).length>0 ? false : null);
    setStep(0); setSavedMsg(""); setFormMode('edit');
  };

  // Enregistre les modifications (UPDATE)
  const enregistrerModifs=async()=>{
    setSaving(true);
    const payload={
      prenom:capNom(f.prenom), nom:capNom(f.nom), tel:f.tel, ville:capNom(f.ville), titre:f.titre,
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
  const addEx=()=>upd("experiences",[...f.experiences,{id:nid(),type:"",poste:"",org:"",debut:"",fin:"",encours:false,missions:"",editing:true}]);
  const updEx=(id,k,v)=>upd("experiences",f.experiences.map(x=>x.id===id?{...x,[k]:v}:x));
  const delEx=id=>upd("experiences",f.experiences.filter(x=>x.id!==id));
  const addLg=()=>upd("langues",[...f.langues,{id:nid(),langue:"",niveau:"Courant"}]);
  const updLg=(id,k,v)=>upd("langues",f.langues.map(x=>x.id===id?{...x,[k]:v}:x));
  const delLg=id=>upd("langues",f.langues.filter(x=>x.id!==id));
  // Le candidat déclare n'avoir aucune expérience : on vide la liste et on positionne le niveau
  const choisirSansExperience=()=>{
    if(f.experiences.length>0 && !window.confirm("Vous avez déjà saisi une ou plusieurs expériences. En déclarant n'avoir aucune expérience, elles seront supprimées. Continuer ?")) return;
    upd("experiences",[]);
    if(!f.niveau) upd("niveau","stagiaire");
    setSansExp(true);
  };
  // Champs obligatoires non renseignés — sert à l'avertissement affiché en mode modification
  const champsManquants=()=>{
    const m=[];
    if(!f.titre.trim()) m.push("le titre professionnel");
    if(!f.tel.trim()) m.push("le téléphone");
    if(!f.diplome) m.push("le diplôme le plus élevé");
    if(!f.niveau) m.push("le niveau d'expérience");
    if(f.experiences.length===0&&sansExp!==true) m.push("le parcours professionnel (stages inclus)");
    return m;
  };
  const ok=()=>{
    if(formMode==='edit') return step===0 ? (f.prenom.trim()&&f.nom.trim()&&f.ville.trim()&&f.pays.trim()) : true;
    if(step===0)return f.prenom.trim()&&f.nom.trim()&&f.email.trim()&&f.tel.trim()&&f.titre.trim()&&f.ville.trim()&&f.pays.trim();
    if(step===1)return !!f.diplome&&f.formations.length>0&&f.formations.some(x=>x.diplome.trim());
    if(step===2)return !!f.niveau&&(sansExp===true||(f.experiences.length>0&&f.experiences.every(x=>x.poste.trim())));
    if(step===3)return f.specs.length>0;
    if(step===4)return f.langues.length>0&&f.langues.every(l=>l.langue);
    if(step===5)return f.salaire&&f.contrats.length>0&&f.modalites.length>0&&f.dispo;
    return true;
  };
  const renderStep=()=>{
    if(step===0)return(
      <div style={{display:"flex",flexDirection:"column",gap:14}}>
        <div style={{display:"grid",gridTemplateColumns:g2,gap:12}}>
          <div><Lbl t="Prénom" r/><Inp val={f.prenom} onChange={v=>upd("prenom",v)} onBlur={()=>upd("prenom",capNom(f.prenom))} ph="Votre prénom"/></div>
          <div><Lbl t="Nom" r/><Inp val={f.nom} onChange={v=>upd("nom",v)} onBlur={()=>upd("nom",capNom(f.nom))} ph="Votre nom"/></div>
        </div>
        <div><Lbl t="Titre professionnel" r/>
          <datalist id="titres-list">{TITRES.map(t=><option key={t} value={t}/>)}</datalist>
          <input value={f.titre} onChange={e=>upd("titre",e.target.value)} placeholder={isMobile?"Ex. : Juriste d'affaires…":"Ex. : Juriste d'affaires, Juriste & Gestionnaire de sinistres…"} list="titres-list" style={iSt}/>
          <p style={{fontSize:11,color:"#A0AEC0",margin:"5px 0 0"}}>Saisie libre — des suggestions apparaissent pendant la saisie.</p>
        </div>
        <div><Lbl t="E-mail" r/><input value={f.email} readOnly style={{...iSt,background:"#F0F4F8",color:"#718096",cursor:"not-allowed"}}/></div>
        <div><Lbl t="Téléphone" r/><Inp val={f.tel} onChange={v=>upd("tel",v)} ph="+212 6XX XXX XXX" filter={v=>v.replace(/[^0-9+\s()-]/g,'')}/></div>
        <div style={{display:"grid",gridTemplateColumns:g2,gap:12}}>
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
        <div style={{marginBottom:16}}><Lbl t="Diplôme le plus élevé" r/>
          <select value={f.diplome} onChange={e=>upd("diplome",e.target.value)} style={{...iSt,cursor:"pointer"}}>
            <option value="">— Sélectionner —</option>
            {DIPLOMES_CAND.map(d=><option key={d.val} value={d.val}>{d.label}</option>)}
          </select>
          <p style={{fontSize:11,color:"#A0AEC0",margin:"5px 0 0"}}>Sert au classement de votre profil dans les recherches. Détaillez vos diplômes ci-dessous.</p>
        </div>
        {f.formations.length===0&&<p style={{textAlign:"center",padding:"16px 0",color:"#A0AEC0",fontSize:13}}>Aucune formation ajoutée. Cliquez ci-dessous pour commencer.</p>}
        {f.formations.map((fo,i)=>(
          <div key={fo.id} style={{background:CREAM,borderRadius:10,padding:isMobile?12:14,marginBottom:10,border:`1.5px solid ${fo.editing?GOLD:"#E2E8F0"}`}}>
            {!fo.editing?(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{minWidth:0}}><p style={{margin:0,fontWeight:500,fontSize:13,color:NAVY,wordBreak:"break-word"}}>{fo.diplome||"Sans titre"}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{fo.etab}{fo.annee?` · ${fo.annee}`:""}</p></div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>updFo(fo.id,"editing",true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>✏️</button>
                  <button onClick={()=>delFo(fo.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#E53E3E"}}>✕</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:500,color:GOLD}}>Formation / Certification {i+1}</span>
                  <button onClick={()=>delFo(fo.id)} style={{background:"none",border:"none",color:"#E53E3E",cursor:"pointer",fontSize:12,flexShrink:0}}>Supprimer</button>
                </div>
                <div><Lbl t="Type"/><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{["Diplôme","Certificat","Formation continue","Autre"].map(t=><Pill key={t} active={fo.type===t} onClick={()=>updFo(fo.id,"type",t)}>{t}</Pill>)}</div></div>
                <div><Lbl t="Intitulé" r/><Inp val={fo.diplome} onChange={v=>updFo(fo.id,"diplome",v)} ph={isMobile?"Ex. : Master II Droit des affaires":"Ex. : Master II Droit des affaires, Certificat CIMA…"}/></div>
                <div style={{display:"grid",gridTemplateColumns:g2,gap:10}}>
                  <div><Lbl t="Établissement"/><input value={fo.etab} onChange={e=>updFo(fo.id,"etab",e.target.value)} placeholder="Université, faculté, école…" list="ecoles-list" style={iSt}/></div>
                  <div><Lbl t="Année"/><Inp val={fo.annee} onChange={v=>updFo(fo.id,"annee",v)} ph="2022" filter={v=>v.replace(/[^0-9]/g,'').slice(0,4)}/></div>
                </div>
                <div><Lbl t="Spécialité / mention"/><Inp val={fo.spec} onChange={v=>updFo(fo.id,"spec",v)} ph="Ex. : Droit fiscal international"/></div>
                <button onClick={()=>updFo(fo.id,"editing",false)} style={{alignSelf:isMobile?"stretch":"flex-end",padding:"9px 16px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12.5,cursor:"pointer",fontWeight:500}}>Enregistrer</button>
              </div>
            )}
          </div>
        ))}
        <button onClick={addFo} style={{width:"100%",padding:11,borderRadius:8,background:"transparent",border:`1.5px dashed ${GOLD}`,color:NAVY,fontSize:13,cursor:"pointer",fontWeight:500}}>+ Ajouter une formation / certification</button>
      </div>
    );
    if(step===2)return(
      <div>
        <div style={{background:GOLD_LIGHT,borderRadius:10,padding:isMobile?"12px 14px":"13px 16px",marginBottom:18}}>
          <p style={{margin:0,fontSize:12.5,color:NAVY,lineHeight:1.65}}><strong>Un stage est une expérience.</strong> Stage, alternance, clinique juridique ou bénévolat juridique comptent pleinement et renforcent votre positionnement auprès des recruteurs. Ne laissez pas cette étape vide si vous avez déjà exercé, même brièvement.</p>
        </div>
        <Lbl t="Avez-vous déjà une expérience, même un stage ?" r/>
        <div style={{display:"flex",flexDirection:"column",gap:8,margin:"0 0 18px"}}>
          <button onClick={()=>{setSansExp(false); if(f.experiences.length===0) addEx();}} style={{padding:"11px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:sansExp===false?NAVY:"transparent",color:sansExp===false?"#fff":NAVY,border:`1.5px solid ${sansExp===false?NAVY:"#CBD5E0"}`,fontWeight:sansExp===false?500:400,lineHeight:1.4}}>Oui — j'ai déjà travaillé ou effectué un stage</button>
          <button onClick={choisirSansExperience} style={{padding:"11px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:sansExp===true?NAVY:"transparent",color:sansExp===true?"#fff":NAVY,border:`1.5px solid ${sansExp===true?NAVY:"#CBD5E0"}`,fontWeight:sansExp===true?500:400,lineHeight:1.4}}>Non — aucune expérience, pas même un stage</button>
        </div>
        {sansExp===true&&(
          <div style={{background:"#EFF6FF",borderRadius:10,padding:isMobile?"12px 14px":"13px 16px",marginBottom:18}}>
            <p style={{margin:0,fontSize:12.5,color:"#1D4ED8",lineHeight:1.65}}>C'est noté — débuter sans expérience est parfaitement normal. Votre formation et vos spécialisations suffiront à vous positionner. Pensez à revenir compléter cette étape dès votre premier stage.</p>
          </div>
        )}
        <div style={{marginBottom:16}}><Lbl t="Niveau d'expérience" r/>
          <select value={f.niveau} onChange={e=>upd("niveau",e.target.value)} style={{...iSt,cursor:"pointer"}}>
            <option value="">— Sélectionner —</option>
            {NIVEAUX_RH.map(n=><option key={n.val} value={n.val}>{n.label} · {n.sub}</option>)}
          </select>
        </div>
        {sansExp!==true&&<>
        {f.experiences.map((e,i)=>(
          <div key={e.id} style={{background:CREAM,borderRadius:10,padding:isMobile?12:14,marginBottom:10,border:`1.5px solid ${e.editing?GOLD:"#E2E8F0"}`}}>
            {!e.editing?(
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
                <div style={{minWidth:0}}><p style={{margin:0,fontWeight:500,fontSize:13,color:NAVY,wordBreak:"break-word"}}>{e.poste||"Sans titre"}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{e.type?`${e.type} · `:""}{e.org}{e.debut?` · ${e.debut}`:""}{e.encours?" – En cours":e.fin?` – ${e.fin}`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p></div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <button onClick={()=>updEx(e.id,"editing",true)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14}}>✏️</button>
                  <button onClick={()=>delEx(e.id)} style={{background:"none",border:"none",cursor:"pointer",fontSize:14,color:"#E53E3E"}}>✕</button>
                </div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:8}}><span style={{fontSize:12,fontWeight:500,color:GOLD}}>Expérience {i+1}</span><button onClick={()=>delEx(e.id)} style={{background:"none",border:"none",color:"#E53E3E",cursor:"pointer",fontSize:12,flexShrink:0}}>Supprimer</button></div>
                <div><Lbl t="Type d'expérience"/><div style={{display:"flex",gap:7,flexWrap:"wrap"}}>{TYPES_EXP.map(tp=><Pill key={tp} active={e.type===tp} onClick={()=>updEx(e.id,"type",tp)}>{tp}</Pill>)}</div></div>
                <div><Lbl t="Intitulé du poste" r/><Inp val={e.poste} onChange={v=>updEx(e.id,"poste",v)} ph={isMobile?"Ex. : Juriste, Notaire stagiaire…":"Ex. : Juriste, Avocat collaborateur, Notaire stagiaire…"}/></div>
                <div><Lbl t="Entreprise / Cabinet / Étude notariale"/><Inp val={e.org} onChange={v=>updEx(e.id,"org",v)} ph="Nom de l'employeur"/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><Lbl t="Début"/><Inp val={e.debut} onChange={v=>updEx(e.id,"debut",v)} ph="MM/AAAA" filter={v=>v.replace(/[^0-9/]/g,'').slice(0,7)}/></div>
                  <div><Lbl t="Fin"/>{e.encours?<p style={{margin:0,padding:"8px 0",fontSize:13,fontWeight:500,color:NAVY}}>En cours</p>:<Inp val={e.fin} onChange={v=>updEx(e.id,"fin",v)} ph="MM/AAAA" filter={v=>v.replace(/[^0-9/]/g,'').slice(0,7)}/>}</div>
                </div>
                <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:NAVY,cursor:"pointer"}}><input type="checkbox" checked={e.encours} onChange={ev=>updEx(e.id,"encours",ev.target.checked)}/>Poste actuel (en cours)</label>
                <div><Lbl t="Missions & réalisations"/><textarea value={e.missions} onChange={ev=>updEx(e.id,"missions",ev.target.value)} placeholder="Décrivez vos missions, dossiers traités, réalisations…" style={{...iSt,minHeight:75,resize:"vertical"}}/></div>
                <button onClick={()=>updEx(e.id,"editing",false)} style={{alignSelf:isMobile?"stretch":"flex-end",padding:"9px 16px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12.5,cursor:"pointer",fontWeight:500}}>Enregistrer</button>
              </div>
            )}
          </div>
        ))}
        <button onClick={addEx} style={{width:"100%",padding:11,borderRadius:8,background:"transparent",border:`1.5px dashed ${GOLD}`,color:NAVY,fontSize:13,cursor:"pointer",fontWeight:500}}>+ Ajouter une expérience</button>
        </>}
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
          <div key={l.id} style={{display:"flex",gap:isMobile?7:10,alignItems:"center",marginBottom:10}}>
            <select value={l.langue} onChange={e=>updLg(l.id,"langue",e.target.value)} style={{flex:1,minWidth:0,padding:"8px 10px",borderRadius:7,fontSize:13,border:"1.5px solid #CBD5E0",color:NAVY,background:"#fff"}}>
              <option value="">Choisir une langue</option>
              {LGLIST.map(lg=><option key={lg}>{lg}</option>)}
            </select>
            <select value={l.niveau} onChange={e=>updLg(l.id,"niveau",e.target.value)} style={{flex:1,minWidth:0,padding:"8px 10px",borderRadius:7,fontSize:13,border:"1.5px solid #CBD5E0",color:NAVY,background:"#fff"}}>
              {NIVLG.map(n=><option key={n}>{n}</option>)}
            </select>
            {f.langues.length>1&&<button onClick={()=>delLg(l.id)} style={{background:"none",border:"none",color:"#E53E3E",cursor:"pointer",fontSize:16,padding:"0 4px",flexShrink:0}}>✕</button>}
          </div>
        ))}
        <button onClick={addLg} style={{padding:"9px 16px",borderRadius:7,background:"transparent",border:`1.5px dashed ${GOLD}`,color:NAVY,fontSize:12.5,cursor:"pointer",fontWeight:500,width:isMobile?"100%":"auto"}}>+ Ajouter une langue</button>
      </div>
    );
    if(step===5)return(
      <div style={{display:"flex",flexDirection:"column",gap:20}}>
        <div><Lbl t="Type(s) de contrat recherché(s)" r/><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{CONTRATS.map(c=><Pill key={c} active={f.contrats.includes(c)} onClick={()=>togCtx(c)}>{c}</Pill>)}</div></div>
        <div><Lbl t="Modalité(s) de travail acceptée(s)" r/><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{MODALITES.map(m=><Pill key={m} active={f.modalites.includes(m)} onClick={()=>togMod(m)}>{m}</Pill>)}</div></div>
        <div><Lbl t="Disponibilité" r/><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{DISPOS.map(d=><Pill key={d} active={f.dispo===d} onClick={()=>upd("dispo",d)}>{d}</Pill>)}</div></div>
        <div>
          <Lbl t="Salaire actuel (optionnel)"/><div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:16}}>{FOURCH.map(fo=>(<button key={fo} onClick={()=>upd("salaireActuel",fo)} style={{padding:"10px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:f.salaireActuel===fo?NAVY:"transparent",color:f.salaireActuel===fo?"#fff":NAVY,border:`1.5px solid ${f.salaireActuel===fo?NAVY:"#CBD5E0"}`,fontWeight:f.salaireActuel===fo?500:400}}>{fo}</button>))}</div><Lbl t="Prétentions salariales — Net mensuel" r/>
          <div style={{display:"flex",flexDirection:"column",gap:7}}>
            {FOURCH.map(fo=><button key={fo} onClick={()=>upd("salaire",fo)} style={{padding:"10px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:f.salaire===fo?NAVY:"transparent",color:f.salaire===fo?"#fff":NAVY,border:`1.5px solid ${f.salaire===fo?NAVY:"#CBD5E0"}`,fontWeight:f.salaire===fo?500:400}}>{fo}</button>)}
          </div>
          <div style={{marginTop:8}}><Lbl t="Précision complémentaire (optionnel)"/><Inp val={f.salaireNote} onChange={v=>upd("salaireNote",v)} ph="Ex. : Négociable selon avantages, hors primes…"/></div>
        </div>
      </div>
    );
    if(step===6)return(
      <div>
        <p style={{fontSize:12,color:"#718096",marginBottom:14,textAlign:"center"}}>Aperçu de votre profil dans la CVthèque JURIJOB. Vous pouvez revenir modifier n'importe quelle section à tout moment.</p>
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,overflow:"hidden"}}>
          <div style={{background:NAVY,padding:isMobile?"16px 16px":"20px 22px"}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:50,height:50,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:600,color:NAVY,flexShrink:0}}>{(f.prenom[0]||"?")}{(f.nom[0]||"")}</div>
              <div style={{minWidth:0}}>
                <p style={{margin:0,fontSize:17,fontWeight:500,color:"#fff",wordBreak:"break-word"}}>{f.prenom} {f.nom}</p>
                {f.titre&&<p style={{margin:"3px 0 0",fontSize:13,color:GOLD,wordBreak:"break-word"}}>{f.titre}</p>}
                <p style={{margin:"3px 0 0",fontSize:12,color:"rgba(255,255,255,0.6)",wordBreak:"break-word"}}>{[[f.ville,f.pays].filter(Boolean).join(", "),f.email,f.tel].filter(Boolean).join(" · ")}</p>
              </div>
            </div>
          </div>
          <div style={{padding:isMobile?"16px 16px":"18px 22px",display:"flex",flexDirection:"column",gap:16}}>
            {f.formations.length>0&&<div><SecTitle t="Formation & certifications"/>{triFo(f.formations).map(fo=><div key={fo.id} style={{marginBottom:8}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{fo.diplome}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{fo.etab}{fo.annee?` · ${fo.annee}`:""}{fo.spec?` · ${fo.spec}`:""}</p></div>)}</div>}
            {f.experiences.length>0&&<div><SecTitle t="Expériences professionnelles"/>{triExp(f.experiences).map(e=><div key={e.id} style={{marginBottom:10}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{e.poste}{e.org?` — ${e.org}`:""}</p><p style={{margin:"2px 0 3px",fontSize:12,color:"#718096"}}>{e.type?`${e.type} · `:""}{e.debut}{e.encours?" – En cours":e.fin?` – ${e.fin}`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p>{e.missions&&<p style={{margin:0,fontSize:12,color:"#4A5568",lineHeight:1.5}}>{e.missions}</p>}</div>)}</div>}
            {f.specs.length>0&&<div><SecTitle t="Spécialisations"/><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{f.specs.map(s=><span key={s} style={{background:CREAM,color:NAVY,fontSize:12,padding:"4px 10px",borderRadius:20,border:"1px solid #E2E8F0"}}>{s}</span>)}</div></div>}
            {f.langues.filter(l=>l.langue).length>0&&<div><SecTitle t="Langues"/><div style={{display:"flex",flexWrap:"wrap",gap:12}}>{f.langues.filter(l=>l.langue).map(l=><span key={l.id} style={{fontSize:13,color:NAVY}}><strong>{l.langue}</strong> <span style={{color:"#718096",fontSize:12}}>— {l.niveau}</span></span>)}</div></div>}
            <div><SecTitle t="Préférences"/><div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr 1fr",gap:9}}>{[["Contrat(s)",f.contrats.join(", ")],["Modalité(s)",f.modalites.join(", ")],["Disponibilité",f.dispo],["Salaire actuel",f.salaireActuel||"—"],["Prétentions",f.salaire]].map(([k,v])=>v?<div key={k} style={{background:CREAM,borderRadius:8,padding:"10px 12px"}}><p style={{margin:"0 0 3px",fontSize:11,color:"#A0AEC0"}}>{k}</p><p style={{margin:0,fontSize:12,fontWeight:500,color:NAVY}}>{v}</p></div>:null)}</div></div>
            <div style={{background:GOLD_LIGHT,borderRadius:8,padding:isMobile?"12px 14px":"12px 16px",display:"flex",alignItems:"center",gap:10}}>
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
      <div style={{background:NAVY,padding:padBarre,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
      <div style={{padding:"40px 16px",maxWidth:460,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:16,padding:isMobile?"28px 20px":36,border:"1px solid #E2E8F0",textAlign:"center"}}>
          <div style={{width:58,height:58,borderRadius:"50%",background:GOLD_LIGHT,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:24}}>🗑️</div>
          <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:"0 0 8px"}}>Profil supprimé</h2>
          <p style={{color:"#718096",fontSize:14,margin:"0 0 22px",lineHeight:1.6}}>Votre profil a été définitivement supprimé de la CVthèque JURIJOB. Vous pouvez en créer un nouveau quand vous le souhaitez.</p>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <button onClick={()=>{setDeleted(false);setF({prenom:initPrenom,nom:initNom,email:authEmail,tel:"",ville:"",titre:"",pays:"Maroc",niveau:"",diplome:"",formations:[],experiences:[],specs:[],langues:[{id:1,langue:"Français",niveau:"Courant"}],contrats:[],modalites:[],dispo:"",salaire:"",salaireNote:"",salaireActuel:""});setStep(0);setFormMode(null);setSansExp(null);}} style={{padding:"12px",borderRadius:8,fontSize:14,cursor:"pointer",background:NAVY,color:"#fff",border:"none",fontWeight:500}}>Créer un nouveau profil</button>
            <button onClick={onLogout} style={{padding:"11px",borderRadius:8,fontSize:13,cursor:"pointer",background:"transparent",color:NAVY,border:"1.5px solid #CBD5E0"}}>Se déconnecter</button>
          </div>
        </div>
      </div>
    </div>
  );

  // Tableau de bord du profil : consulter / modifier / supprimer
  if(existing && formMode!=='edit' && !done)return(
    <div style={{background:CREAM,minHeight:"100vh",paddingBottom:32}}>
      <div style={{background:NAVY,padding:padBarre,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
      <div style={{padding:isMobile?"24px 14px":"32px 16px",maxWidth:600,margin:"0 auto"}}>
        <p style={{fontSize:14,color:"#718096",margin:"0 0 18px"}}>Bonjour <strong style={{color:NAVY}}>{existing.prenom}</strong> 👋 Voici votre profil JURIJOB. Vous pouvez le modifier, le compléter ou le supprimer à tout moment.</p>
        {savedMsg&&<div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",color:"#166534",borderRadius:10,padding:"12px 16px",fontSize:13,marginBottom:16,textAlign:"center"}}>{savedMsg}</div>}
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:16,overflow:"hidden"}}>
          <div style={{background:NAVY,padding:isMobile?"18px 16px":"22px 24px",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:54,height:54,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,fontWeight:600,color:NAVY,flexShrink:0}}>{(existing.prenom?.[0]||"?")}{(existing.nom?.[0]||"")}</div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{margin:0,fontSize:18,fontWeight:500,color:"#fff",wordBreak:"break-word"}}>{existing.prenom} {existing.nom}</p>
              {existing.titre&&<p style={{margin:"3px 0 0",fontSize:13,color:GOLD,wordBreak:"break-word"}}>{existing.titre}</p>}
              <p style={{margin:"3px 0 0",fontSize:12,color:"rgba(255,255,255,0.6)",wordBreak:"break-word"}}>{[[existing.ville,existing.pays].filter(Boolean).join(", "),existing.email,existing.tel].filter(Boolean).join(" · ")}</p>
            </div>
          </div>
          <div style={{padding:isMobile?"12px 16px":"12px 24px",borderBottom:"1px solid #F0F4F8",display:"flex",flexWrap:"wrap",gap:8}}>
            <span style={{fontSize:12.5,color:NAVY,fontWeight:500,background:GOLD_LIGHT,padding:"4px 12px",borderRadius:20}}>Statut : {existing.statut==='valide'?'Validé ✔':existing.statut==='refuse'?'Non retenu':'En attente de validation ⏳'}</span>
            {existing.niveau&&<span style={{fontSize:12.5,color:"#4A5568",background:CREAM,padding:"4px 12px",borderRadius:20,border:"1px solid #E2E8F0"}}>{NIVEAUX_RH.find(n=>n.val===existing.niveau)?.label||existing.niveau}</span>}
            {existing.diplome&&<span style={{fontSize:12.5,color:"#4A5568",background:CREAM,padding:"4px 12px",borderRadius:20,border:"1px solid #E2E8F0"}}>{DIPLOMES_CAND.find(d=>d.val===existing.diplome)?.label||existing.diplome}</span>}
            {(existing.modalites||[]).length>0&&<span style={{fontSize:12.5,color:"#4A5568",background:CREAM,padding:"4px 12px",borderRadius:20,border:"1px solid #E2E8F0"}}>🏢 {(existing.modalites||[]).join(" / ")}</span>}
          </div>
          <div style={{padding:isMobile?"16px 16px":"18px 24px",display:"flex",flexDirection:"column",gap:16}}>
            {(existing.formations||[]).length>0&&<div><SecTitle t="Formation & certifications"/>{triFo(existing.formations).map((fo,i)=><div key={i} style={{marginBottom:8}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{fo.diplome}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{fo.etab}{fo.annee?` · ${fo.annee}`:""}{fo.spec?` · ${fo.spec}`:""}</p></div>)}</div>}
            {(existing.experiences||[]).length>0&&<div><SecTitle t="Expériences professionnelles"/>{triExp(existing.experiences).map((e,i)=><div key={i} style={{marginBottom:10}}><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{e.poste}{e.org?` — ${e.org}`:""}</p><p style={{margin:"2px 0 3px",fontSize:12,color:"#718096"}}>{e.type?`${e.type} · `:""}{e.debut}{e.encours?" – En cours":e.fin?` – ${e.fin}`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p>{e.missions&&<p style={{margin:0,fontSize:12,color:"#4A5568",lineHeight:1.5}}>{e.missions}</p>}</div>)}</div>}
            {(existing.specs||[]).length>0&&<div><SecTitle t="Spécialisations"/><div style={{display:"flex",flexWrap:"wrap",gap:6}}>{(existing.specs||[]).map(s=><span key={s} style={{background:CREAM,color:NAVY,fontSize:12,padding:"4px 10px",borderRadius:20,border:"1px solid #E2E8F0"}}>{s}</span>)}</div></div>}
            {(existing.langues||[]).filter(l=>l&&l.langue).length>0&&<div><SecTitle t="Langues"/><div style={{display:"flex",flexWrap:"wrap",gap:12}}>{(existing.langues||[]).filter(l=>l&&l.langue).map((l,i)=><span key={i} style={{fontSize:13,color:NAVY}}><strong>{l.langue}</strong> <span style={{color:"#718096",fontSize:12}}>— {l.niveau}</span></span>)}</div></div>}
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:18,flexWrap:"wrap"}}>
          <button onClick={startEdit} style={{flex:1,minWidth:isMobile?"100%":200,padding:"13px 12px",borderRadius:8,fontSize:14,cursor:"pointer",background:NAVY,color:"#fff",border:"none",fontWeight:500}}>✏️ Modifier / compléter mon profil</button>
          <button onClick={supprimerProfil} style={{flex:1,minWidth:isMobile?"100%":200,padding:"13px 12px",borderRadius:8,fontSize:14,cursor:"pointer",background:"transparent",color:"#E53E3E",border:"1.5px solid #FEB2B2",fontWeight:500}}>🗑️ Supprimer mon profil</button>
        </div>
      </div>
    </div>
  );

  if(done)return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?16:24}}>
      <div style={{background:"#fff",borderRadius:16,padding:isMobile?"28px 22px":36,maxWidth:420,width:"100%",textAlign:"center",border:"1px solid #E2E8F0",boxSizing:"border-box"}}>
        <div style={{width:58,height:58,borderRadius:"50%",background:GOLD_LIGHT,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",fontSize:26,color:NAVY}}>✓</div>
        <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:"0 0 10px"}}>Merci, {f.prenom} !</h2>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 8px"}}>Votre profil a bien été soumis à l'équipe JURIJOB.</p>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 24px"}}>Une confirmation vous sera envoyée par e-mail sous <strong>24h ouvrées</strong>.</p>
        <button onClick={onLogout} style={{background:"transparent",color:NAVY,border:`1.5px solid #CBD5E0`,borderRadius:8,padding:"10px 22px",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
    </div>
  );

  return(
    <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 32px"}}>
      <div style={{background:NAVY,padding:padBarre,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        {formMode==='edit'
          ? <button onClick={()=>{setFormMode(null);setStep(0);setSavedMsg("");}} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mon profil</button>
          : <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>}
      </div>
      <div style={{padding:isMobile?"18px 14px":"22px 16px",maxWidth:580,margin:"0 auto"}}>
        <div style={{marginBottom:22}}>
          {/* Sur mobile, les 7 intitulés d'étapes ne tiennent pas : on n'affiche que l'étape courante */}
          {isMobile
            ? <p style={{margin:"0 0 7px",fontSize:12.5,fontWeight:500,color:NAVY,textAlign:"center"}}>Étape {step+1} / {STEPS_C.length} · {STEPS_C[step]}</p>
            : <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>{STEPS_C.map((s,i)=><span key={i} style={{fontSize:10.5,fontWeight:i===step?500:400,color:i<=step?NAVY:"#A0AEC0",flex:1,textAlign:"center"}}>{s}</span>)}</div>}
          <div style={{height:4,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(step/(STEPS_C.length-1))*100}%`,background:GOLD,borderRadius:4,transition:"width .3s"}}/></div>
        </div>
        {formMode==='edit'&&champsManquants().length>0&&(
          <div style={{background:GOLD_LIGHT,border:`1px solid ${GOLD}`,borderRadius:12,padding:isMobile?"12px 14px":"13px 16px",marginBottom:14}}>
            <p style={{margin:"0 0 4px",fontSize:12.5,fontWeight:600,color:NAVY}}>⚠️ Votre profil est incomplet</p>
            <p style={{margin:0,fontSize:12,color:"#92400E",lineHeight:1.6}}>Il manque encore {champsManquants().join(", ")}. Ces informations sont utilisées par notre algorithme pour vous proposer aux recruteurs : sans elles, vous passez à côté d'opportunités. Vous pouvez enregistrer sans les renseigner, mais nous vous invitons vivement à les compléter.</p>
          </div>
        )}
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",padding:padCarte}}>
          <p style={{fontSize:12,color:GOLD,fontWeight:500,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>{formMode==='edit'?'Espace Candidat · Modification':'Espace Candidat'} · Étape {step+1} / {STEPS_C.length}</p>
          <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 20px"}}>{STEPS_C[step]}</h2>
          {renderStep()}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginTop:24,paddingTop:16,borderTop:"1px solid #F0F4F8"}}>
            <button onClick={()=>setStep(s=>s-1)} disabled={step===0} style={{padding:"10px 18px",borderRadius:8,fontSize:13,cursor:step===0?"default":"pointer",background:"transparent",color:step===0?"#CBD5E0":NAVY,border:`1.5px solid ${step===0?"#E2E8F0":"#CBD5E0"}`,flex:isMobile?"1 1 100px":"none"}}>← Précédent</button>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",flex:isMobile?"1 1 160px":"none",justifyContent:"flex-end"}}>
              {formMode==='edit'&&<button onClick={enregistrerModifs} disabled={saving} style={{padding:"10px 18px",borderRadius:8,fontSize:13,cursor:saving?"default":"pointer",background:"#166534",color:"#fff",border:"none",fontWeight:600,flex:isMobile?"1 1 auto":"none"}}>{saving?"…":"💾 Enregistrer"}</button>}
              {step<6
                ? <button onClick={()=>setStep(s=>s+1)} disabled={!ok()} style={{padding:"10px 22px",borderRadius:8,fontSize:13,cursor:ok()?"pointer":"default",background:ok()?NAVY:"#E2E8F0",color:ok()?"#fff":"#A0AEC0",border:"none",fontWeight:500,flex:isMobile?"1 1 auto":"none"}}>Suivant →</button>
                : (formMode==='edit' ? null : <button onClick={sauvegarderProfil} style={{padding:"11px 24px",borderRadius:8,fontSize:13,cursor:"pointer",background:GOLD,color:NAVY,border:"none",fontWeight:600,flex:isMobile?"1 1 auto":"none"}}>Valider mon profil</button>)}
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
  const initialF={entreprise:rmeta.entreprise||"",contact:rmeta.contact||"",poste:"",pays:"Maroc",ville:"",langues:[],niveau:"",diplome:"",specs:[],nbCv:3,urgence:"normal",modalite:"Indifférent",notes:"",budget:"",budgetConfidentiel:false};

  /* Responsive : mêmes règles que l'espace candidat */
  const isMobile=useIsMobile();
  const padBarre=isMobile?"12px 16px":"14px 24px";
  const padCarte=isMobile?"18px 16px 16px":"24px 24px 20px";

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
      pays: f.pays,
      ville: f.ville,
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
    if(step===0)return f.entreprise.trim()&&f.poste.trim()&&f.contact.trim()&&f.pays.trim()&&f.ville.trim();
    if(step===1)return f.langues.length>0;
    if(step===2)return f.niveau&&f.diplome;
    if(step===3)return f.specs.length>0;
    return true;
  };
  const renderStep=()=>{
    if(step===0)return(
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div><Lbl t="Entreprise / Cabinet" r/><Inp val={f.entreprise} onChange={v=>set("entreprise",v)} ph={isMobile?"Ex. : Société Générale Maroc":"Ex. : Société Générale Maroc, Cabinet Mikou…"}/></div>
        <div><Lbl t="Nom du contact RH" r/><Inp val={f.contact} onChange={v=>set("contact",v)} ph="Prénom Nom"/></div>
        <div><Lbl t="Intitulé du poste recherché" r/><Inp val={f.poste} onChange={v=>set("poste",v)} ph={isMobile?"Ex. : Juriste d'entreprise":"Ex. : Juriste d'entreprise, Avocat collaborateur…"}/></div>
        <div>
          <Lbl t="Lieu du poste" r/>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"1fr 1fr",gap:12}}>
            <select value={f.pays} onChange={e=>setF(x=>({...x,pays:e.target.value,ville:""}))} style={{...iSt,cursor:"pointer"}}>
              {PAYS.map(p=><option key={p} value={p}>{p}</option>)}
            </select>
            {VILLES[f.pays]
              ? <SelectOuAutre key={f.pays} value={f.ville} options={VILLES[f.pays]} onChange={v=>set("ville",v)} ph="Ville du poste"/>
              : <Inp val={f.ville} onChange={v=>set("ville",v)} ph="Ville du poste"/>}
          </div>
          <p style={{fontSize:11,color:"#A0AEC0",margin:"5px 0 0",lineHeight:1.5}}>Lieu d'exercice, pas nécessairement le siège social. Les agglomérations proches sont traitées comme un même bassin d'emploi. Si vous retenez le télétravail plus bas, le lieu n'entre pas dans la sélection.</p>
        </div>
        <div>
          <Lbl t="Nombre de CV souhaités"/>
          <div style={{display:"flex",gap:8}}>{[1,2,3,5,10].map(n=><button key={n} onClick={()=>set("nbCv",n)} style={{flex:1,minWidth:0,padding:"11px 4px",borderRadius:8,fontSize:14,cursor:"pointer",background:f.nbCv===n?NAVY:"transparent",color:f.nbCv===n?"#fff":NAVY,border:`1.5px solid ${f.nbCv===n?NAVY:"#CBD5E0"}`,fontWeight:f.nbCv===n?500:400}}>{n}</button>)}</div>
        </div>
        <div>
          <Lbl t="Degré d'urgence"/>
          {/* Mobile : une colonne — les libellés « Normal (2–4 sem.) » ne tiennent pas sur 3 colonnes */}
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:isMobile?8:10}}>{[["normal","Normal (2–4 sem.)"],["urgent","Urgent (< 1 sem.)"],["immediat","Immédiat"]].map(([v,l])=><button key={v} onClick={()=>set("urgence",v)} style={{padding:"10px 8px",borderRadius:8,fontSize:12.5,cursor:"pointer",background:f.urgence===v?NAVY:"transparent",color:f.urgence===v?"#fff":NAVY,border:`1.5px solid ${f.urgence===v?NAVY:"#CBD5E0"}`,fontWeight:f.urgence===v?500:400}}>{l}</button>)}</div>
        </div>
        <div>
          <Lbl t="Modalité de travail proposée"/>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:isMobile?8:10}}>{[...MODALITES,"Indifférent"].map(m=><button key={m} onClick={()=>set("modalite",m)} style={{padding:"10px 6px",borderRadius:8,fontSize:12.5,cursor:"pointer",background:f.modalite===m?NAVY:"transparent",color:f.modalite===m?"#fff":NAVY,border:`1.5px solid ${f.modalite===m?NAVY:"#CBD5E0"}`,fontWeight:f.modalite===m?500:400}}>{m}</button>)}</div>
        </div>
      </div>
    );
    if(step===1)return(
      <div style={{display:"flex",flexDirection:"column",gap:22}}>
        <div>
          <Lbl t="Langues requises" r/>
          <p style={{fontSize:12,color:"#A0AEC0",margin:"0 0 10px"}}>Sélectionnez toutes les langues que le poste exige.</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{LANGUES_RH.map(l=><Pill key={l} active={f.langues.includes(l)} onClick={()=>toggle("langues",l)}>{l}</Pill>)}</div>
        </div>
      </div>
    );
    if(step===2)return(
      <div style={{display:"flex",flexDirection:"column",gap:22}}>
        <div>
          <Lbl t="Niveau d'expérience" r/>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>{NIVEAUX_RH.map(n=><button key={n.val} onClick={()=>set("niveau",n.val)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8,padding:"11px 14px",borderRadius:8,fontSize:13,cursor:"pointer",background:f.niveau===n.val?NAVY:"transparent",color:f.niveau===n.val?"#fff":NAVY,border:`1.5px solid ${f.niveau===n.val?NAVY:"#CBD5E0"}`,textAlign:"left"}}><span style={{fontWeight:f.niveau===n.val?500:400}}>{n.label}</span><span style={{fontSize:12,opacity:.7,flexShrink:0}}>{n.sub}</span></button>)}</div>
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
        <div style={{marginTop:16}}><Lbl t="Budget alloué au poste (optionnel)"/><div style={{display:"flex",flexDirection:"column",gap:7,marginBottom:12}}>{FOURCH.map(fo=>(<button key={fo} onClick={()=>set("budget",fo)} style={{padding:"10px 14px",borderRadius:8,fontSize:13,cursor:"pointer",textAlign:"left",background:f.budget===fo?NAVY:"transparent",color:f.budget===fo?"#fff":NAVY,border:`1.5px solid ${f.budget===fo?NAVY:"#CBD5E0"}`,fontWeight:f.budget===fo?500:400}}>{fo}</button>))}</div><label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,color:NAVY,cursor:"pointer",marginBottom:12}}><input type="checkbox" checked={f.budgetConfidentiel} onChange={e=>set("budgetConfidentiel",e.target.checked)}/>Budget confidentiel / À négocier</label><Lbl t="Notes complémentaires"/><textarea value={f.notes} onChange={e=>set("notes",e.target.value)} placeholder="Précisions sur le poste, contexte, exigences spécifiques…" style={{...iSt,resize:"vertical",minHeight:72}}/></div>
      </div>
    );
    if(step===4)return(
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {[["Entreprise",f.entreprise],["Contact RH",f.contact],["Poste",f.poste],["Lieu du poste",[f.ville,f.pays].filter(Boolean).join(", ")],["CV demandés",f.nbCv],["Urgence",f.urgence==="normal"?"Normal":f.urgence==="urgent"?"Urgent":"Immédiat"],["Modalité",f.modalite],["Langues",f.langues.join(", ")],["Niveau",NIVEAUX_RH.find(n=>n.val===f.niveau)?.label],["Diplôme",DIPLOMES_RH.find(d=>d.val===f.diplome)?.label],["Spécialisations",f.specs.join(" · ")],["Budget",f.budgetConfidentiel?"Confidentiel":f.budget||"—"],["Notes",f.notes||"—"]].map(([k,v])=>(
          <div key={k} style={{display:"flex",flexDirection:isMobile?"column":"row",justifyContent:"space-between",alignItems:"flex-start",padding:"9px 13px",background:CREAM,borderRadius:8,gap:isMobile?3:12}}>
            <span style={{fontSize:isMobile?11.5:13,color:"#718096",flexShrink:0}}>{k}</span>
            <span style={{fontSize:13,color:NAVY,fontWeight:500,textAlign:isMobile?"left":"right",wordBreak:"break-word"}}>{v}</span>
          </div>
        ))}
        <p style={{fontSize:12,color:"#A0AEC0",marginTop:8,textAlign:"center"}}>En validant, votre demande sera transmise à l'équipe JURIJOB qui vous enverra une short-list sous 48h.</p>
      </div>
    );
  };

  if(submitted)return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:isMobile?16:24}}>
      <div style={{background:"#fff",borderRadius:16,padding:isMobile?"32px 22px":"40px 36px",maxWidth:480,width:"100%",textAlign:"center",border:"1px solid #E2E8F0",boxSizing:"border-box"}}>
        <div style={{width:64,height:64,borderRadius:"50%",background:GOLD_LIGHT,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",fontSize:28,color:NAVY}}>✓</div>
        <h2 style={{color:NAVY,fontSize:isMobile?20:22,fontWeight:500,margin:"0 0 10px"}}>Merci, {f.contact||f.entreprise} !</h2>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 6px"}}>Votre demande a été transmise à l'équipe JURIJOB.</p>
        <p style={{color:"#718096",fontSize:14,margin:"0 0 28px"}}>Votre short-list de <strong>{f.nbCv} CV</strong> vous sera communiquée sous <strong>48h ouvrées</strong>. Vous pouvez suivre son statut depuis votre tableau de bord.</p>
        <button onClick={retourDashboard} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"11px 24px",fontSize:13,cursor:"pointer",fontWeight:500}}>Voir mes demandes →</button>
      </div>
    </div>
  );

  // TABLEAU DE BORD RECRUTEUR (vue par défaut)
    if(vue==="dashboard")return(
    <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 40px"}}>
      <div style={{background:NAVY,padding:padBarre,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={onLogout} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>Se déconnecter</button>
      </div>
      <div style={{padding:isMobile?"20px 14px":"24px 16px",maxWidth:640,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:isMobile?"stretch":"center",flexDirection:isMobile?"column":"row",flexWrap:"wrap",gap:12,marginBottom:20}}>
          <div>
            <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Espace Recruteur</p>
            <h2 style={{color:NAVY,fontSize:20,fontWeight:500,margin:0}}>Mes demandes</h2>
            {(rmeta.entreprise||rmeta.contact)&&<p style={{fontSize:13,color:"#718096",margin:"4px 0 0"}}>{rmeta.entreprise}{rmeta.contact?` · ${rmeta.contact}`:""}</p>}
          </div>
          <button onClick={nouvelleDemande} style={{background:GOLD,color:NAVY,border:"none",borderRadius:9,padding:"12px 18px",fontSize:13.5,fontWeight:600,cursor:"pointer",width:isMobile?"100%":"auto"}}>+ Nouvelle demande</button>
        </div>
        {chargement&&<p style={{color:"#718096",fontSize:13}}>Chargement de vos demandes…</p>}
        {!chargement&&mesDemandes.length===0&&(
          <div style={{background:"#fff",border:"1px dashed #CBD5E0",borderRadius:12,padding:isMobile?"26px 18px":"32px 24px",textAlign:"center"}}>
            <p style={{fontSize:14,color:NAVY,fontWeight:500,margin:"0 0 6px"}}>Aucune demande pour le moment</p>
            <p style={{fontSize:13,color:"#718096",margin:"0 0 16px"}}>Déposez votre première demande pour recevoir une short-list sous 48h.</p>
            <button onClick={nouvelleDemande} style={{background:NAVY,color:"#fff",border:"none",borderRadius:8,padding:"11px 20px",fontSize:13,fontWeight:500,cursor:"pointer"}}>Déposer une demande</button>
          </div>
        )}
        {!chargement&&mesDemandes.map(d=>{
          const st=STAT_R[d.statut]||STAT_R.en_cours;
          const hasShortlist=mesShortlists.some(s=>s.demande_id===d.id);
          const isPaid=mesPaiements.some(p=>p.demande_id===d.id && p.statut==="confirme");
          return(
            <div key={d.id} onClick={hasShortlist?()=>voirShortlist(d):undefined}
              style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:11,padding:"14px 16px",marginBottom:10,cursor:hasShortlist?"pointer":"default",transition:"box-shadow .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10,flexWrap:isMobile?"wrap":"nowrap"}}>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{d.poste}</p>
                  <p style={{margin:0,fontSize:12,color:"#718096",wordBreak:"break-word"}}>{d.entreprise}{d.created_at?` · ${new Date(d.created_at).toLocaleDateString("fr-FR")}`:""}</p>
                  <p style={{margin:"4px 0 0",fontSize:12,color:"#718096"}}>📁 {d.nb_cv} CV demandé{d.nb_cv>1?"s":""}{d.ville?` · 📍 ${d.ville}`:""}{(d.langues&&d.langues.length)?` · 🌍 ${d.langues.join(", ")}`:""}{d.modalite&&d.modalite!=="Indifférent"?` · 🏢 ${d.modalite}`:""}</p>
                </div>
                <div style={{textAlign:isMobile?"left":"right",flexShrink:0}}>
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
        <div style={{background:NAVY,padding:padBarre,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo variant="light"/>
          <button onClick={retourDashboard} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mes demandes</button>
        </div>
        <div style={{padding:isMobile?"20px 14px":"24px 16px",maxWidth:640,margin:"0 auto"}}>
          <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Short-list · {selectedDem.poste}</p>
          <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 4px"}}>{nbProfils} profil{nbProfils>1?"s":""} sélectionné{nbProfils>1?"s":""}</h2>
          <p style={{fontSize:12,color:"#718096",margin:"0 0 20px"}}>{selectedDem.entreprise} · Payée le {new Date(paiement.date_confirmation||paiement.created_at).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</p>
          {profils.map(c=>(
            <div key={c.id} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:isMobile?"16px 14px":"18px 16px",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
                <div style={{width:44,height:44,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:600,color:NAVY,flexShrink:0}}>{(c.prenom?.[0]||"")}{(c.nom?.[0]||"")}</div>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{margin:0,fontSize:15,fontWeight:500,color:NAVY,wordBreak:"break-word"}}>{c.prenom} {c.nom}</p>
                  <p style={{margin:"2px 0 0",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{c.titre}{c.ville?` · ${c.ville}`:""}</p>
                </div>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                <span style={{fontSize:12,color:NAVY,wordBreak:"break-all"}}>📧 {c.email}</span>
                {c.tel&&<span style={{fontSize:12,color:"#718096"}}>📞 {c.tel}</span>}
              </div>
              {(c.formations||[]).length>0&&<div style={{marginBottom:8}}><p style={{margin:"0 0 4px",fontSize:11,fontWeight:500,color:"#4A5568"}}>🎓 Formation</p>{triFo(c.formations).map((fo,i)=><p key={i} style={{margin:"0 0 2px",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{fo.diplome}{fo.etab?` — ${fo.etab}`:""}{fo.annee?` (${fo.annee})`:""}</p>)}</div>}
              {(c.experiences||[]).length>0&&<div style={{marginBottom:8}}><p style={{margin:"0 0 4px",fontSize:11,fontWeight:500,color:"#4A5568"}}>💼 Expérience</p>{triExp(c.experiences).map((e,i)=><p key={i} style={{margin:"0 0 2px",fontSize:12,color:"#718096",wordBreak:"break-word"}}>{e.type?`${e.type} · `:""}{e.poste}{e.org?` — ${e.org}`:""}{e.debut?` (${e.debut}${e.encours?" – en cours":e.fin?` – ${e.fin}`:""})`:""}{(()=>{const dur=calcDuree(e.debut,e.fin,e.encours);return dur?` · ${dur}`:""})()}</p>)}</div>}
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
        <div style={{background:NAVY,padding:padBarre,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <Logo variant="light"/>
          <button onClick={retourDashboard} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mes demandes</button>
        </div>
        <div style={{padding:isMobile?"24px 14px":"32px 16px",maxWidth:500,margin:"0 auto"}}>
          <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",overflow:"hidden"}}>
            <div style={{background:NAVY,padding:isMobile?"20px 16px 18px":"24px 24px 20px",textAlign:"center"}}>
              <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:1,margin:"0 0 6px"}}>Short-list prête</p>
              <p style={{fontSize:isMobile?19:22,fontWeight:500,color:"#fff",margin:"0 0 4px",wordBreak:"break-word"}}>{selectedDem.poste}</p>
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",margin:0,wordBreak:"break-word"}}>{selectedDem.entreprise}</p>
            </div>
            <div style={{padding:isMobile?"20px 16px":"24px",textAlign:"center"}}>
              <p style={{fontSize:14,color:NAVY,margin:"0 0 4px"}}><strong>{nbProfils} profil{nbProfils>1?"s":""}</strong> sélectionné{nbProfils>1?"s":""} pour vous</p>
              <div style={{background:GOLD_LIGHT,borderRadius:10,padding:"16px",margin:"16px 0"}}>
                <p style={{margin:"0 0 2px",fontSize:12,color:"#718096"}}>{nbProfils} × {PRIX_UNITAIRE.toLocaleString("fr-FR")} MAD</p>
                <p style={{margin:0,fontSize:isMobile?24:28,fontWeight:600,color:NAVY}}>{total.toLocaleString("fr-FR")} MAD</p>
                <p style={{margin:"4px 0 0",fontSize:11,color:"#A0AEC0"}}>HT · Paiement par virement bancaire</p>
              </div>
              <div style={{background:"#F8FAFC",borderRadius:10,padding:isMobile?"14px":"16px",textAlign:"left",margin:"16px 0"}}>
                <p style={{margin:"0 0 10px",fontSize:12,fontWeight:600,color:NAVY}}>Coordonnées bancaires</p>
                <div style={{display:"flex",flexDirection:"column",gap:isMobile?9:6}}>
                  {[["Bénéficiaire","SENTISSI LEGAL ADVISORY"],["Banque","Attijariwafa Bank"],["Agence","Casa Tontonville"],["RIB","007 780 0003642000000445 15"],["SWIFT","BCMAMAMC"],["Référence à indiquer",ref]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",flexDirection:isMobile?"column":"row",justifyContent:"space-between",gap:isMobile?2:8}}>
                      <span style={{fontSize:11.5,color:"#718096"}}>{k}</span>
                      <span style={{fontSize:isMobile?13:11.5,color:NAVY,fontWeight:k==="Référence à indiquer"?600:500,textAlign:isMobile?"left":"right",wordBreak:"break-word"}}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {!dejaSignale ? (
                <div>
                  <p style={{fontSize:12,color:"#718096",lineHeight:1.6,margin:"0 0 16px"}}>Effectuez le virement avec la référence ci-dessus, puis cliquez pour nous prévenir. Vos profils seront débloqués sous 24h ouvrées après confirmation.</p>
                  <button onClick={()=>signalerVirement(selectedDem, sl, nbProfils, total, ref)} disabled={signalantVirement} style={{width:"100%",padding:"13px",borderRadius:8,fontSize:14,cursor:signalantVirement?"default":"pointer",background:signalantVirement?"#E2E8F0":GOLD,color:signalantVirement?"#A0AEC0":NAVY,border:"none",fontWeight:600}}>{signalantVirement?"Enregistrement…":"J'ai effectué le virement"}</button>
                </div>
              ) : (
                <div style={{background:"#F0FDF4",border:"1px solid #BBF7D0",borderRadius:10,padding:"16px",textAlign:"center"}}>
                  <p style={{fontSize:14,fontWeight:500,color:"#166534",margin:"0 0 6px"}}>✔ Virement signalé</p>
                  <p style={{fontSize:12,color:"#166534",margin:0,lineHeight:1.6}}>Merci ! L'équipe JURIJOB va vérifier la réception de votre virement. Vos profils seront débloqués sous 24h ouvrées. Vous recevrez un e-mail de confirmation.</p>
                </div>
              )}
              <p style={{fontSize:11,color:"#A0AEC0",margin:"16px 0 0",wordBreak:"break-word"}}>Une question ? <span style={{color:GOLD}}>recrutement@sentissilegal.com</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // FORMULAIRE « Entrez vos critères »
  return(
    <div style={{background:CREAM,minHeight:"100vh",padding:"0 0 32px"}}>
      <div style={{background:NAVY,padding:padBarre,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <Logo variant="light"/>
        <button onClick={()=>setVue("dashboard")} style={{background:"transparent",border:"none",color:"rgba(255,255,255,0.6)",fontSize:13,cursor:"pointer"}}>← Mes demandes</button>
      </div>
      <div style={{padding:isMobile?"18px 14px":"22px 16px",maxWidth:580,margin:"0 auto"}}>
        <div style={{marginBottom:22}}>
          {/* Sur mobile, on n'affiche que l'étape courante — « Expérience & Diplôme » ne tient pas en colonne */}
          {isMobile
            ? <p style={{margin:"0 0 7px",fontSize:12.5,fontWeight:500,color:NAVY,textAlign:"center"}}>Étape {step+1} / {STEPS_R.length} · {STEPS_R[step]}</p>
            : <div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}>{STEPS_R.map((s,i)=><span key={i} style={{fontSize:11,fontWeight:i===step?500:400,color:i<=step?NAVY:"#A0AEC0",flex:1,textAlign:"center"}}>{s}</span>)}</div>}
          <div style={{height:4,background:"#E2E8F0",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${(step/(STEPS_R.length-1))*100}%`,background:GOLD,borderRadius:4,transition:"width .3s"}}/></div>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #E2E8F0",padding:padCarte}}>
          <p style={{fontSize:12,color:GOLD,fontWeight:500,margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Espace Recruteur · Étape {step+1} / {STEPS_R.length}</p>
          <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 20px"}}>{STEPS_R[step]}</h2>
          {renderStep()}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10,marginTop:24,paddingTop:16,borderTop:"1px solid #F0F4F8"}}>
            <button onClick={()=>setStep(s=>s-1)} disabled={step===0} style={{padding:"10px 18px",borderRadius:8,fontSize:13,cursor:step===0?"default":"pointer",background:"transparent",color:step===0?"#CBD5E0":NAVY,border:`1.5px solid ${step===0?"#E2E8F0":"#CBD5E0"}`,flex:isMobile?"1 1 100px":"none"}}>← Précédent</button>
            {step<4?<button onClick={()=>setStep(s=>s+1)} disabled={!ok()} style={{padding:"10px 22px",borderRadius:8,fontSize:13,cursor:ok()?"pointer":"default",background:ok()?NAVY:"#E2E8F0",color:ok()?"#fff":"#A0AEC0",border:"none",fontWeight:500,flex:isMobile?"1 1 120px":"none"}}>Suivant →</button>
            :<button onClick={sauvegarderDemande} style={{padding:"11px 26px",borderRadius:8,fontSize:13,cursor:"pointer",background:GOLD,color:NAVY,border:"none",fontWeight:600,flex:isMobile?"1 1 120px":"none"}}>Soumettre la demande</button>}
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
  const isMobile=useIsMobile();

  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c",overflowX:"hidden",width:"100%",boxSizing:"border-box"}}>
      {/* NAV */}
      <nav style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:isMobile?"0 16px":"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center",height:64,position:"sticky",top:0,zIndex:10}}>
        <Logo size="header"/>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:13,cursor:"pointer",fontFamily:ff}}>← Retour à l'accueil</button>
      </nav>

      {/* HERO */}
      <section style={{background:NAVY,padding:isMobile?"48px 20px":"64px 32px",textAlign:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 14px",fontWeight:500,fontFamily:ff}}>Informations juridiques</p>
          <h1 style={{fontFamily:fs,fontSize:isMobile?32:42,lineHeight:1.15,color:"#fff",fontWeight:500,margin:"0 auto 12px",letterSpacing:-0.6}}>
            Mentions <em style={{color:GOLD,fontStyle:"italic",fontWeight:500}}>légales</em>
          </h1>
          <p style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.75)",maxWidth:520,margin:"0 auto",fontWeight:300,fontFamily:ff}}>
            Informations relatives à l'éditeur, à l'hébergement et au traitement des données personnelles.
          </p>
        </div>
      </section>

      {/* SECTIONS — Éditeur, hébergeur, PI, données personnelles */}
      <section style={{padding:isMobile?"40px 20px":"56px 32px",maxWidth:820,margin:"0 auto"}}>

        {/* 1 — Éditeur du site */}
        <div style={{marginBottom:40}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Article 1</p>
          <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:"0 0 16px",letterSpacing:-0.3}}>Éditeur du site</h2>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 18px"}}>
            Le site <strong style={{color:NAVY}}>www.jurijob.ma</strong> et la plateforme JURIJOB sont édités par :
          </p>
          <div style={{background:"#F8F5ED",border:`1px solid ${GOLD_LIGHT}`,borderRadius:10,padding:isMobile?"18px 16px":"22px 24px"}}>
            {[
              ["Dénomination sociale","SENTISSI LEGAL ADVISORY (SLA)"],
              ["Forme juridique","Société à responsabilité limitée à associé unique (SARL AU)"],
              ["Capital social","10 000 MAD"],
              ["Siège social","12, rue Saria Ben Zounaim, étage 3, appartement 3 — Palmier, Casablanca, Maroc"],
              ["Registre du commerce","RC n° 641427 — Tribunal de commerce de Casablanca"],
              ["Identifiant commun de l'entreprise","ICE 003569200000033"],
              ["Identifiant fiscal","IF 66067629"],
              ["Responsable de la publication","Mohammed Sentissi, gérant"],
              ["Contact","recrutement@sentissilegal.com"],
            ].map(([k,v])=>(
              <div key={k} style={{display:"flex",flexDirection:isMobile?"column":"row",justifyContent:"space-between",gap:isMobile?2:16,padding:"7px 0",borderBottom:"1px solid rgba(200,160,70,0.15)"}}>
                <span style={{fontSize:12.5,color:"#718096",fontFamily:ff,flexShrink:0}}>{k}</span>
                <span style={{fontSize:13,color:NAVY,fontFamily:ff,fontWeight:500,textAlign:isMobile?"left":"right"}}>{v}</span>
              </div>
            ))}
          </div>
          <p style={{fontSize:13,color:"#718096",lineHeight:1.7,fontFamily:ff,fontWeight:300,margin:"16px 0 0"}}>
            JURIJOB est une marque déposée auprès de l'OMPIC sous la dénomination « JURIJOB — Smart Recrutement Juridique ». La plateforme est exploitée par Sentissi Legal Advisory, également éditrice du site www.sentissilegal.com.
          </p>
        </div>

        {/* 2 — Hébergement */}
        <div style={{marginBottom:40}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Article 2</p>
          <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:"0 0 16px",letterSpacing:-0.3}}>Hébergement</h2>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 12px"}}>
            Le site est hébergé par <strong style={{color:NAVY}}>Vercel Inc.</strong>, société de droit américain dont le siège est situé 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:0}}>
            Les données de la plateforme sont hébergées sur l'infrastructure de <strong style={{color:NAVY}}>Supabase Inc.</strong> Les e-mails transactionnels sont acheminés par <strong style={{color:NAVY}}>Resend</strong>, dont les serveurs d'envoi sont situés en Irlande (Union européenne).
          </p>
        </div>

        {/* 3 — Propriété intellectuelle */}
        <div style={{marginBottom:40}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Article 3</p>
          <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:"0 0 16px",letterSpacing:-0.3}}>Propriété intellectuelle</h2>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 12px"}}>
            L'ensemble des éléments composant le site — structure, textes, graphismes, logo, charte visuelle, base de données et méthodologie de sélection — est protégé par la loi 2-00 relative aux droits d'auteur et droits voisins, ainsi que par la loi 17-97 relative à la protection de la propriété industrielle.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:0}}>
            Toute reproduction, représentation, extraction ou réutilisation, totale ou partielle, sans autorisation écrite préalable de Sentissi Legal Advisory, est interdite. Les contenus déposés par les candidats demeurent leur propriété ; ceux-ci concèdent à la plateforme une licence d'utilisation limitée aux seules finalités du service.
          </p>
        </div>

        {/* 4 — Données personnelles (CNDP) */}
        <div style={{marginBottom:40}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Article 4</p>
          <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:"0 0 16px",letterSpacing:-0.3}}>Traitement des données personnelles</h2>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 14px"}}>
            Par le biais de ce formulaire, Mohammed Sentissi collecte vos données personnelles en vue de leur inscription dans la CVthèque JURIJOB, plateforme de sélection de profils juridiques destinée à mettre les candidats en relation avec des recruteurs identifiés au Maroc et en Afrique francophone.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 14px"}}>
            Ce traitement a fait l'objet d'une déclaration auprès de la CNDP sous le numéro <strong style={{color:NAVY}}>en cours de traitement par la CNDP</strong>. Les données personnelles collectées peuvent être transmises à tous les recruteurs potentiels au Maroc conformément à la demande de transfert déposée auprès de la CNDP.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 14px"}}>
            L'accès aux profils est strictement réservé aux recruteurs dont le paiement a été confirmé. Aucune diffusion publique n'est effectuée. Les données sont conservées tant que le candidat maintient son profil actif ; celui-ci peut le supprimer définitivement à tout moment depuis son espace personnel.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:0}}>
            Vous pouvez vous adresser à <a href="mailto:recrutement@sentissilegal.com" style={{color:GOLD,textDecoration:"none",fontWeight:500}}>recrutement@sentissilegal.com</a> pour exercer vos droits d'accès, de rectification et d'opposition conformément aux dispositions de la loi 09-08.
          </p>
        </div>

        {/* 5 — Responsabilité */}
        <div style={{marginBottom:40}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Article 5</p>
          <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:"0 0 16px",letterSpacing:-0.3}}>Responsabilité</h2>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 12px"}}>
            JURIJOB intervient en qualité d'outil de sourcing et de mise en relation. La plateforme n'est pas partie aux relations contractuelles qui se nouent entre candidats et recruteurs, et ne saurait être tenue responsable du déroulement des entretiens, des décisions d'embauche ou des engagements pris entre les parties.
          </p>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:0}}>
            Les informations figurant dans les profils sont déclarées par les candidats sous leur seule responsabilité. Sentissi Legal Advisory s'efforce d'assurer la disponibilité et l'exactitude du service, sans garantir une accessibilité ininterrompue.
          </p>
        </div>

        {/* 6 — Droit applicable */}
        <div style={{marginBottom:8}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Article 6</p>
          <h2 style={{fontFamily:fs,fontSize:26,color:NAVY,fontWeight:500,margin:"0 0 16px",letterSpacing:-0.3}}>Droit applicable</h2>
          <p style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:"0 0 12px"}}>
            Les présentes mentions légales sont régies par le droit marocain. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux de Casablanca, à défaut de résolution amiable.
          </p>
          <p style={{fontSize:12.5,color:"#A0AEC0",lineHeight:1.7,fontFamily:ff,fontWeight:300,margin:0,fontStyle:"italic"}}>
            Dernière mise à jour : août 2026.
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
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c",overflowX:"hidden",width:"100%",boxSizing:"border-box"}}>
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

        {/* Bloc tarif */}
        <div style={{background:"#fff",border:`1.5px solid ${GOLD}`,borderRadius:12,padding:isMobile?"24px 20px":"30px 32px",marginTop:18,textAlign:"center"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 12px",fontWeight:500,fontFamily:ff}}>Tarification</p>
          <p style={{fontFamily:fs,fontSize:isMobile?36:44,color:NAVY,fontWeight:500,margin:"0 0 2px",lineHeight:1,letterSpacing:-1}}>1 490 <span style={{fontSize:isMobile?20:24}}>MAD HT</span></p>
          <p style={{fontSize:13,color:"#718096",margin:"0 0 20px",fontFamily:ff}}>par profil livré · soit 1 788 MAD TTC</p>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:12,margin:"0 0 20px",textAlign:"left"}}>
            {[
              ["Sans abonnement","Vous ne payez que les profils que vous recevez."],
              ["Sans commission","Aucun pourcentage prélevé sur le salaire du candidat recruté."],
              ["Sans engagement","Une demande ponctuelle ou récurrente, à votre rythme."]
            ].map(([t,d])=>(
              <div key={t} style={{background:"#F8F5ED",borderRadius:9,padding:"14px 15px"}}>
                <p style={{margin:"0 0 5px",fontSize:13,fontWeight:600,color:NAVY,fontFamily:ff}}>{t}</p>
                <p style={{margin:0,fontSize:12.5,color:"#4A5568",lineHeight:1.55,fontFamily:ff,fontWeight:300}}>{d}</p>
              </div>
            ))}
          </div>
          <p style={{fontSize:13,color:"#4A5568",lineHeight:1.7,margin:"0 0 6px",fontFamily:ff,fontWeight:300}}>
            Le montant total vous est communiqué <strong style={{color:NAVY,fontWeight:600}}>avant tout paiement</strong>. Si aucun profil de la CVthèque ne correspond à vos critères, aucune short-list n'est livrée et rien ne vous est facturé.
          </p>
          <p style={{fontSize:12.5,color:"#718096",lineHeight:1.65,margin:0,fontFamily:ff,fontWeight:300}}>
            Une tarification préférentielle s'applique à partir de cinq profils. <a href="mailto:recrutement@sentissilegal.com" style={{color:GOLD,textDecoration:"none",fontWeight:500}}>Écrivez-nous</a> pour un devis adapté à vos volumes.
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
   GABARIT COMMUN — Pages juridiques (CGU / CGV)
═══════════════════════════════════════ */
function PageJuridique({titre,titreEm,sousTitre,articles,maj,onBack,onNavigate}){
  useEffect(()=>{
    if(!document.getElementById('gfont-jurijob-landing')){
      const l=document.createElement('link'); l.id='gfont-jurijob-landing'; l.rel='stylesheet';
      l.href='https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap';
      document.head.appendChild(l);
    }
  },[]);
  const ff="'Inter',system-ui,sans-serif";
  const fs="'Cormorant Garamond',Georgia,serif";
  const isMobile=useIsMobile();

  return(
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c",overflowX:"hidden",width:"100%",boxSizing:"border-box"}}>
      <nav style={{background:"#fff",borderBottom:"1px solid #E2E8F0",padding:isMobile?"0 16px":"0 32px",display:"flex",justifyContent:"space-between",alignItems:"center",height:64,position:"sticky",top:0,zIndex:10}}>
        <Logo size="header"/>
        <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:13,cursor:"pointer",fontFamily:ff}}>← Retour à l'accueil</button>
      </nav>

      <section style={{background:NAVY,padding:isMobile?"48px 20px":"64px 32px",textAlign:"center"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 14px",fontWeight:500,fontFamily:ff}}>Informations juridiques</p>
          <h1 style={{fontFamily:fs,fontSize:isMobile?30:42,lineHeight:1.15,color:"#fff",fontWeight:500,margin:"0 auto 12px",letterSpacing:-0.6}}>
            {titre} <em style={{color:GOLD,fontStyle:"italic",fontWeight:500}}>{titreEm}</em>
          </h1>
          <p style={{fontSize:14,lineHeight:1.6,color:"rgba(255,255,255,0.75)",maxWidth:560,margin:"0 auto",fontWeight:300,fontFamily:ff}}>{sousTitre}</p>
        </div>
      </section>

      <section style={{padding:isMobile?"40px 20px":"56px 32px",maxWidth:820,margin:"0 auto"}}>
        {articles.map((a,i)=>(
          <div key={i} style={{marginBottom:i<articles.length-1?38:8}}>
            <p style={{color:GOLD,fontSize:10.5,letterSpacing:2.5,textTransform:"uppercase",margin:"0 0 8px",fontWeight:500,fontFamily:ff}}>Article {i+1}</p>
            <h2 style={{fontFamily:fs,fontSize:isMobile?22:26,color:NAVY,fontWeight:500,margin:"0 0 16px",letterSpacing:-0.3}}>{a.titre}</h2>
            {a.paras.map((t,j)=>(
              <p key={j} style={{fontSize:14,color:"#4A5568",lineHeight:1.75,fontFamily:ff,fontWeight:300,margin:j<a.paras.length-1?"0 0 13px":0}} dangerouslySetInnerHTML={{__html:t}}/>
            ))}
            {a.encadre&&(
              <div style={{background:"#F8F5ED",border:`1px solid ${GOLD_LIGHT}`,borderRadius:10,padding:isMobile?"16px 15px":"18px 22px",marginTop:14}}>
                <p style={{margin:0,fontSize:13.5,color:NAVY,lineHeight:1.7,fontFamily:ff}} dangerouslySetInnerHTML={{__html:a.encadre}}/>
              </div>
            )}
          </div>
        ))}
        <p style={{fontSize:12.5,color:"#A0AEC0",lineHeight:1.7,fontFamily:ff,fontWeight:300,margin:"32px 0 0",fontStyle:"italic"}}>{maj}</p>
      </section>

      <footer style={{background:"#fff",padding:"24px 32px",borderTop:"1px solid #E2E8F0"}}>
        <div style={{maxWidth:1100,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:16}}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <Logo size="compact"/>
            <span style={{fontSize:11,color:"#A0AEC0",fontFamily:ff}}>© 2026 — Smart Recrutement Juridique</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
            <button onClick={onBack} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Accueil</button>
            <button onClick={()=>onNavigate&&onNavigate("cgu")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>CGU</button>
            <button onClick={()=>onNavigate&&onNavigate("cgv")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>CGV</button>
            <button onClick={()=>onNavigate&&onNavigate("legal")} style={{background:"none",border:"none",color:"#4A5568",fontSize:12,cursor:"pointer",fontFamily:ff}}>Mentions légales</button>
            <span style={{fontSize:12,color:"#4A5568",fontFamily:ff}}>recrutement@sentissilegal.com</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ═══════════════════════════════════════
   CGU — Conditions Générales d'Utilisation
═══════════════════════════════════════ */
const ART_CGU=[
  {titre:"Objet et champ d'application",paras:[
    "Les présentes Conditions Générales d'Utilisation (ci-après les « CGU ») définissent les modalités d'accès et d'utilisation de la plateforme <strong>JURIJOB</strong>, accessible à l'adresse www.jurijob.ma, éditée par la société SENTISSI LEGAL ADVISORY SARL AU (ci-après « SLA » ou « la Plateforme »).",
    "JURIJOB est un outil de sourcing spécialisé dans les métiers du droit. La Plateforme met en relation des professionnels du droit — juristes d'entreprise, avocats, notaires, fiscalistes, compliance officers — avec des recruteurs identifiés au Maroc et en Afrique francophone.",
    "Toute utilisation de la Plateforme emporte acceptation pleine et entière des présentes CGU. L'utilisateur qui n'accepte pas ces conditions doit renoncer à utiliser le service."
  ]},
  {titre:"Définitions",paras:[
    "<strong>Candidat</strong> : toute personne physique créant un profil dans la CVthèque JURIJOB en vue d'être proposée à des recruteurs.",
    "<strong>Recruteur</strong> : toute personne morale ou physique agissant dans le cadre de son activité professionnelle, déposant une demande de sourcing sur la Plateforme.",
    "<strong>Short-list</strong> : sélection de profils de candidats, évalués puis validés manuellement, transmise à un recruteur en réponse à sa demande.",
    "<strong>CVthèque</strong> : base de données des profils candidats constituée et exploitée par SLA."
  ]},
  {titre:"Accès au service",paras:[
    "La consultation des pages publiques de la Plateforme est libre et gratuite. La création d'un compte est nécessaire pour déposer un profil candidat ou une demande de sourcing.",
    "L'utilisateur est responsable de son équipement informatique et de sa connexion Internet. Les frais d'accès au réseau demeurent à sa charge.",
    "SLA se réserve le droit de suspendre temporairement l'accès à la Plateforme pour des raisons de maintenance, de mise à jour ou de sécurité, sans que cette interruption puisse ouvrir droit à indemnisation."
  ]},
  {titre:"Inscription et compte utilisateur",paras:[
    "L'inscription requiert la communication d'informations exactes, complètes et à jour. L'utilisateur s'engage à maintenir l'exactitude de ces informations pendant toute la durée d'utilisation du service.",
    "Une adresse e-mail valide est exigée ; son activation peut être soumise à vérification. Chaque utilisateur est seul responsable de la confidentialité de ses identifiants et de toute activité effectuée depuis son compte.",
    "Une même adresse e-mail ne peut être associée qu'à un seul rôle — candidat ou recruteur. Pour disposer des deux espaces, l'utilisateur doit créer deux comptes distincts avec des adresses différentes.",
    "SLA se réserve le droit de suspendre ou de supprimer tout compte en cas de manquement aux présentes CGU, notamment en cas d'informations manifestement fausses ou d'usurpation d'identité."
  ]},
  {titre:"Obligations du candidat",paras:[
    "Le candidat garantit l'exactitude et la sincérité des informations qu'il déclare : identité, coordonnées, formations, expériences professionnelles, spécialisations et compétences linguistiques.",
    "Il s'engage à ne renseigner que des données le concernant personnellement et dont il est en droit de disposer.",
    "Le candidat conserve la maîtrise de son profil : il peut le consulter, le modifier, le compléter ou le supprimer définitivement à tout moment depuis son espace personnel.",
    "Toute déclaration inexacte de nature à induire un recruteur en erreur engage la responsabilité exclusive du candidat et peut entraîner la suppression de son profil."
  ]},
  {titre:"Obligations du recruteur",paras:[
    "Le recruteur agit exclusivement dans le cadre de son activité professionnelle et garantit disposer des pouvoirs nécessaires pour engager la structure qu'il représente.",
    "Il s'engage à formuler des critères de recherche conformes au droit du travail applicable, notamment aux dispositions prohibant toute discrimination à l'embauche.",
    "Les profils communiqués sont destinés au seul processus de recrutement au titre duquel ils ont été demandés. Toute extraction, conservation en base interne, revente, cession ou transmission à un tiers est strictement interdite.",
    "Le recruteur demeure seul responsable de la conduite des entretiens, de l'appréciation des candidats et de sa décision finale d'embauche."
  ]},
  {titre:"Rôle et limites de la Plateforme",paras:[
    "JURIJOB agit en qualité d'<strong>outil de sourcing</strong> et d'intermédiaire technique. La Plateforme n'exerce pas l'activité d'agence de recrutement privée et n'intervient pas dans la relation contractuelle qui peut se nouer entre un candidat et un recruteur.",
    "SLA ne garantit ni l'embauche d'un candidat, ni sa disponibilité effective, ni l'exactitude des informations qu'il a déclarées sous sa propre responsabilité.",
    "La Plateforme ne saurait être tenue responsable du déroulement des processus de recrutement, des engagements pris entre les parties, ni des conséquences d'une embauche."
  ],
  encadre:"<strong>Point essentiel.</strong> JURIJOB identifie et présente des profils pertinents. Le recruteur conserve l'intégralité de la maîtrise des entretiens et de la décision d'embauche."},
  {titre:"Propriété intellectuelle",paras:[
    "La Plateforme, sa structure, son design, ses textes, son logo, sa charte graphique, sa base de données et sa méthodologie de sélection sont protégés par les lois marocaines 2-00 relative aux droits d'auteur et droits voisins et 17-97 relative à la protection de la propriété industrielle.",
    "La marque « JURIJOB — Smart Recrutement Juridique » est déposée auprès de l'OMPIC. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable, est interdite.",
    "Les contenus déposés par les utilisateurs demeurent leur propriété. Ceux-ci concèdent à SLA une licence d'utilisation non exclusive, limitée aux seules finalités de fonctionnement du service."
  ]},
  {titre:"Données personnelles",paras:[
    "Le traitement des données personnelles est effectué conformément à la loi 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel, et a fait l'objet d'une déclaration auprès de la CNDP.",
    "Les profils candidats ne font l'objet d'aucune diffusion publique. Leur accès est strictement réservé aux recruteurs dont le paiement a été confirmé, et limité aux profils composant la short-list qui leur a été adressée.",
    "Chaque utilisateur dispose d'un droit d'accès, de rectification et d'opposition, qu'il peut exercer en écrivant à recrutement@sentissilegal.com. Les modalités détaillées figurent dans les mentions légales."
  ]},
  {titre:"Modification des CGU",paras:[
    "SLA se réserve le droit de modifier les présentes CGU à tout moment afin de les adapter à l'évolution du service ou de la réglementation.",
    "Les utilisateurs sont informés de toute modification substantielle. La poursuite de l'utilisation de la Plateforme après modification vaut acceptation des nouvelles conditions."
  ]},
  {titre:"Droit applicable et litiges",paras:[
    "Les présentes CGU sont régies par le droit marocain.",
    "Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux de Casablanca, à défaut de résolution amiable préalable."
  ]},
];

function PageCGU({onBack,onNavigate}){
  return <PageJuridique
    titre="Conditions Générales" titreEm="d'Utilisation"
    sousTitre="Les règles d'accès et d'utilisation de la plateforme JURIJOB, applicables aux candidats comme aux recruteurs."
    articles={ART_CGU}
    maj="Dernière mise à jour : août 2026."
    onBack={onBack} onNavigate={onNavigate}/>;
}

/* ═══════════════════════════════════════
   CGV — Conditions Générales de Vente
═══════════════════════════════════════ */
const ART_CGV=[
  {titre:"Objet",paras:[
    "Les présentes Conditions Générales de Vente (ci-après les « CGV ») régissent les prestations payantes proposées par SENTISSI LEGAL ADVISORY SARL AU (ci-après « SLA ») aux recruteurs professionnels via la plateforme JURIJOB.",
    "Elles complètent les Conditions Générales d'Utilisation, auxquelles elles ne dérogent pas. En cas de contradiction, les présentes CGV prévalent pour tout ce qui concerne les prestations payantes.",
    "Toute commande emporte acceptation pleine et entière des présentes CGV."
  ]},
  {titre:"Prestation : la short-list de profils juridiques",paras:[
    "La prestation principale consiste en la livraison d'une <strong>short-list de profils juridiques présélectionnés</strong>, établie en réponse aux critères définis par le recruteur : spécialisations, niveau d'expérience, diplôme, langues et modalité de travail.",
    "Chaque profil est évalué au moyen d'un algorithme de scoring propriétaire portant sur quatre dimensions, puis la sélection est validée manuellement avant transmission.",
    "La prestation comprend, pour chaque profil livré : l'identité et les coordonnées du candidat, son parcours de formation, ses expériences professionnelles, ses spécialisations juridiques et ses compétences linguistiques.",
    "La prestation ne comprend ni la conduite des entretiens, ni l'évaluation approfondie des candidats, ni aucune garantie d'embauche. Ces prestations peuvent faire l'objet de services complémentaires distincts, sur devis."
  ]},
  {titre:"Prix",paras:[
    "Le prix unitaire est fixé à <strong>1 490 MAD hors taxes par profil livré</strong>, soit 1 788 MAD toutes taxes comprises, au taux de TVA en vigueur de 20 %.",
    "Le montant total dû correspond au prix unitaire multiplié par le nombre de profils effectivement composant la short-list livrée. Ce montant est affiché au recruteur avant tout engagement de paiement.",
    "Des conditions tarifaires spécifiques peuvent être consenties pour les besoins récurrents ou les volumes importants. Elles sont communiquées directement au recruteur et font l'objet d'un accord distinct.",
    "Les prix sont susceptibles d'évoluer ; le tarif applicable est celui en vigueur au jour de la livraison de la short-list."
  ]},
  {titre:"Commande et livraison",paras:[
    "Le recruteur dépose sa demande depuis son espace personnel en précisant ses critères et le nombre de profils souhaité.",
    "SLA s'engage à livrer la short-list dans un <strong>délai indicatif de 48 heures ouvrées</strong> à compter de la validation de la demande, sous réserve que la CVthèque comporte des profils correspondant aux critères exprimés.",
    "Lorsque aucun profil ne correspond aux critères, aucune short-list n'est livrée et <strong>aucune somme n'est due</strong>. SLA en informe le recruteur et peut lui proposer une prestation complémentaire de recherche directe, sur devis séparé.",
    "Le nombre de profils livrés peut être inférieur au nombre demandé si la CVthèque ne permet pas de constituer une sélection pertinente. Le montant facturé est alors ajusté au nombre de profils effectivement livrés."
  ]},
  {titre:"Modalités de paiement",paras:[
    "Le paiement s'effectue par <strong>virement bancaire</strong> sur le compte de SENTISSI LEGAL ADVISORY, dont les coordonnées et la référence de virement sont communiquées au recruteur au moment de la commande.",
    "Le recruteur signale son virement depuis son espace personnel. L'accès aux profils est débloqué après vérification et confirmation de la réception des fonds par SLA, généralement sous 24 heures ouvrées.",
    "Tant que le paiement n'a pas été confirmé, les profils composant la short-list demeurent inaccessibles au recruteur. Le défaut de paiement n'entraîne aucune pénalité : la short-list reste simplement verrouillée et devient caduque.",
    "La référence de virement indiquée doit impérativement être reportée lors du transfert, à défaut de quoi le rapprochement du paiement ne peut être garanti."
  ]},
  {titre:"Annulation et rétractation",paras:[
    "Le recruteur peut retirer sa demande à tout moment, <strong>tant qu'aucun paiement n'a été effectué</strong>, sans frais ni justification, en informant SLA à l'adresse recrutement@sentissilegal.com.",
    "Une fois le paiement confirmé et l'accès aux profils débloqué, la prestation est réputée exécutée. Les services étant fournis à des professionnels agissant dans le cadre de leur activité, et l'accès aux contenus débutant dès la confirmation du paiement, le droit de rétractation ne trouve pas à s'appliquer.",
    "Aucun remboursement ne peut être demandé au motif qu'aucun candidat de la short-list n'aurait été retenu à l'issue des entretiens. Le recruteur reconnaît que la prestation porte sur l'identification et la livraison de profils qualifiés, et non sur le résultat du recrutement."
  ],
  encadre:"<strong>À retenir.</strong> Le recruteur connaît le nombre de profils et le montant total <em>avant</em> de payer. Le paiement n'intervient donc jamais à l'aveugle."},
  {titre:"Absence de garantie de résultat",paras:[
    "SLA est tenue à une <strong>obligation de moyens</strong> et non de résultat. La prestation consiste à identifier et livrer des profils correspondant aux critères exprimés.",
    "SLA ne garantit ni l'embauche d'un candidat, ni son acceptation d'une proposition, ni sa disponibilité effective à la date souhaitée, ni le maintien de sa candidature.",
    "Les informations composant les profils sont déclarées par les candidats sous leur seule responsabilité. Il appartient au recruteur de procéder aux vérifications qu'il juge nécessaires, notamment quant aux diplômes et aux expériences déclarés."
  ]},
  {titre:"Utilisation des profils livrés",paras:[
    "Les profils livrés sont destinés au seul processus de recrutement au titre duquel la short-list a été commandée.",
    "Sont strictement interdites : l'extraction massive de données, la conservation des profils dans une base interne au-delà du processus concerné, la revente, la cession ou la communication à un tiers, ainsi que la réutilisation pour un poste distinct sans nouvelle commande.",
    "Tout manquement engage la responsabilité du recruteur et peut donner lieu à la suspension immédiate de son accès, sans préjudice de toute action ultérieure."
  ]},
  {titre:"Responsabilité",paras:[
    "La responsabilité de SLA, si elle venait à être engagée, ne saurait excéder le montant effectivement réglé par le recruteur au titre de la prestation concernée.",
    "SLA ne saurait être tenue responsable des dommages indirects, notamment de la perte d'exploitation, de la perte de chance ou du préjudice commercial résultant d'un recrutement non abouti.",
    "SLA s'efforce d'assurer la disponibilité de la Plateforme sans garantir une accessibilité ininterrompue."
  ]},
  {titre:"Facturation et données personnelles",paras:[
    "Une facture est établie pour chaque prestation et adressée au recruteur à l'adresse électronique associée à son compte.",
    "Le traitement des données personnelles est effectué conformément à la loi 09-08 et aux mentions légales de la Plateforme. Le recruteur, en sa qualité de destinataire de données personnelles de candidats, s'engage à en assurer la confidentialité et à n'en faire usage que pour la finalité de recrutement prévue."
  ]},
  {titre:"Droit applicable et litiges",paras:[
    "Les présentes CGV sont régies par le droit marocain.",
    "Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence exclusive des tribunaux de Casablanca, à défaut de résolution amiable préalable."
  ]},
];

function PageCGV({onBack,onNavigate}){
  return <PageJuridique
    titre="Conditions Générales" titreEm="de Vente"
    sousTitre="Les conditions applicables aux prestations payantes de JURIJOB, destinées aux recruteurs professionnels."
    articles={ART_CGV}
    maj="Dernière mise à jour : août 2026."
    onBack={onBack} onNavigate={onNavigate}/>;
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
          a: "Un cabinet de recrutement facture au succès de l'embauche, souvent 15 à 25 % du salaire annuel du candidat recruté — soit plusieurs dizaines de milliers de dirhams pour un juriste confirmé. JURIJOB facture 1 490 MAD HT par profil livré, sans abonnement et sans commission sur l'embauche. Nous ne sommes pas rémunérés au succès de votre recrutement, mais à la qualité de la sélection — cela nous permet de rester objectifs et de proposer un service à coût maîtrisé, même pour des besoins récurrents."
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
          q: "Combien coûte une short-list ?",
          a: "1 490 MAD HT par profil livré, soit 1 788 MAD TTC. Vous choisissez le nombre de profils souhaité lors de votre demande, et le montant total vous est communiqué avant tout paiement — vous savez donc exactement ce que vous engagez. Aucun abonnement, aucune commission sur le salaire du candidat recruté. Si aucun profil de notre CVthèque ne correspond à vos critères, aucune short-list n'est livrée et rien ne vous est facturé. Une tarification préférentielle s'applique à partir de cinq profils : écrivez-nous à recrutement@sentissilegal.com pour un devis adapté."
        },
        {
          q: "Quand et comment s'effectue le paiement ?",
          a: "Vous ne payez qu'après avoir reçu votre short-list. Le règlement s'effectue par virement bancaire : les coordonnées et une référence unique vous sont communiquées dans votre espace recruteur. Une fois le virement signalé et sa réception confirmée par nos soins — généralement sous 24 heures ouvrées — les profils complets se débloquent : identité, coordonnées, parcours et expériences. Tant que le paiement n'est pas confirmé, les profils restent verrouillés."
        },
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
    <div style={{background:"#fff",minHeight:"100vh",fontFamily:ff,color:"#1a202c",overflowX:"hidden",width:"100%",boxSizing:"border-box"}}>
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
            Tout ce que vous devez savoir sur JURIJOB : notre approche, nos tarifs, nos délais et notre méthode.
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
  if(view==="cgu") return <PageCGU onBack={()=>setView("landing")} onNavigate={(v)=>setView(v)}/>;
  if(view==="cgv") return <PageCGV onBack={()=>setView("landing")} onNavigate={(v)=>setView(v)}/>;
  if(view==="candidat-auth") return <AuthCandidat onBack={()=>setView("landing")} onGoogle={loginGoogle} onSwitch={()=>{setIntendedRole("recruteur");setView("recruteur-auth");}}/>;
  if(view==="recruteur-auth") return <AuthRecruteur onBack={()=>setView("landing")} onSwitch={()=>{setIntendedRole("candidat");setView("candidat-auth");}}/>;

  // Sinon, page d'accueil
  return <Landing onChoose={(v)=>{
    if(v==="candidat"){ setIntendedRole("candidat"); setView("candidat-auth"); }
    else if(v==="recruteur"){ setIntendedRole("recruteur"); setView("recruteur-auth"); }
    else setView(v);
  }}/>;
}