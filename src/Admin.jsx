import { useState } from "react";

const NAVY="#0B2545",GOLD="#C8A046",CREAM="#F8F5ED",GOLD_LIGHT="#F5EDD6";

/* ─── DONNÉES ─── */
const DEMANDES_INIT=[
  {id:"DEM-001",entreprise:"Attijariwafa Bank",contact:"Sara Benali",poste:"Juriste senior – Conformité",niveau:"senior",specs:["Compliance & conformité","Droit bancaire & financier"],langues:["Français","Anglais"],diplome:"master2",nbCv:3,urgence:"immediat",date:"02/06/2026",statut:"en_cours"},
  {id:"DEM-002",entreprise:"Cabinet Mikou & Associés",contact:"Ahmed Mikou",poste:"Avocat collaborateur",niveau:"confirme",specs:["Droit des sociétés","Droit commercial"],langues:["Arabe","Français"],diplome:"barreau",nbCv:2,urgence:"normal",date:"01/06/2026",statut:"en_cours"},
  {id:"DEM-003",entreprise:"OCP Group",contact:"Karim Fassi",poste:"Directeur Juridique Adjoint",niveau:"directeur",specs:["Droit des contrats","Droit international des affaires"],langues:["Français","Anglais","Espagnol"],diplome:"doctorat",nbCv:5,urgence:"urgent",date:"31/05/2026",statut:"en_cours"},
  {id:"DEM-004",entreprise:"Centrale Danone",contact:"Nadia Tahiri",poste:"Juriste social",niveau:"junior",specs:["Droit social / RH"],langues:["Arabe","Français"],diplome:"master2",nbCv:3,urgence:"normal",date:"28/05/2026",statut:"terminee"},
  {id:"DEM-005",entreprise:"Étude Notariale Benjelloun",contact:"Hassan Benjelloun",poste:"Notaire collaborateur",niveau:"confirme",specs:["Droit notarial","Droit immobilier"],langues:["Arabe","Français"],diplome:"notariat",nbCv:2,urgence:"normal",date:"25/05/2026",statut:"terminee"},
  {id:"DEM-006",entreprise:"Marsa Maroc",contact:"Salma Alaoui",poste:"Juriste contentieux",niveau:"junior",specs:["Droit administratif","Droit de l'exécution forcée"],langues:["Arabe","Français"],diplome:"master2",nbCv:3,urgence:"normal",date:"20/05/2026",statut:"annulee"},
];
const CANDIDATS_INIT=[
  {id:"C-001",prenom:"Youssef",nom:"El Alami",titre:"Juriste d'entreprise",ville:"Casablanca",specs:["Droit des sociétés","Compliance & conformité"],langues:["Arabe","Français","Anglais"],niveau:"confirme",diplome:"master2",salaire:"12 000 – 18 000 MAD/mois",dispo:"Sous 1 mois",statut:"valide",date:"03/06/2026"},
  {id:"C-002",prenom:"Fatima Zahra",nom:"Benali",titre:"Avocate au Barreau",ville:"Casablanca",specs:["Droit commercial","Arbitrage & MARD"],langues:["Arabe","Français"],niveau:"senior",diplome:"barreau",salaire:"18 000 – 25 000 MAD/mois",dispo:"Immédiatement",statut:"valide",date:"02/06/2026"},
  {id:"C-003",prenom:"Omar",nom:"Kabbaj",titre:"Juriste fiscal",ville:"Rabat",specs:["Droit fiscal","Droit des sociétés"],langues:["Arabe","Français","Anglais"],niveau:"confirme",diplome:"master2",salaire:"12 000 – 18 000 MAD/mois",dispo:"Sous 1 mois",statut:"en_attente",date:"04/06/2026"},
  {id:"C-004",prenom:"Aicha",nom:"Moukrim",titre:"Notaire stagiaire",ville:"Casablanca",specs:["Droit notarial","Droit de la famille"],langues:["Arabe","Français"],niveau:"junior",diplome:"notariat",salaire:"5 000 – 8 000 MAD/mois",dispo:"Immédiatement",statut:"en_attente",date:"04/06/2026"},
  {id:"C-005",prenom:"Karim",nom:"Serghini",titre:"Directeur Juridique",ville:"Casablanca",specs:["Droit des contrats","Droit international des affaires","Compliance & conformité"],langues:["Arabe","Français","Anglais","Espagnol"],niveau:"directeur",diplome:"doctorat",salaire:"Plus de 35 000 MAD/mois",dispo:"Sous 3 mois",statut:"valide",date:"01/06/2026"},
  {id:"C-006",prenom:"Leila",nom:"Tahiri",titre:"Juriste social RH",ville:"Casablanca",specs:["Droit social / RH","Droit des contrats"],langues:["Arabe","Français"],niveau:"junior",diplome:"master2",salaire:"8 000 – 12 000 MAD/mois",dispo:"Immédiatement",statut:"valide",date:"30/05/2026"},
  {id:"C-007",prenom:"Mehdi",nom:"Cherkaoui",titre:"Avocat pénaliste",ville:"Rabat",specs:["Droit pénal des affaires","Droit pénal général"],langues:["Arabe","Français"],niveau:"confirme",diplome:"barreau",salaire:"12 000 – 18 000 MAD/mois",dispo:"Sous 1 mois",statut:"en_attente",date:"05/06/2026"},
  {id:"C-008",prenom:"Salma",nom:"Idrissi",titre:"Juriste conformité",ville:"Casablanca",specs:["Compliance & conformité","Droit bancaire & financier"],langues:["Arabe","Français","Anglais"],niveau:"confirme",diplome:"master2",salaire:"12 000 – 18 000 MAD/mois",dispo:"Sous 1 mois",statut:"en_attente",date:"05/06/2026"},
];

/* ─── ALGORITHME DE MATCHING ─── */
const NIV_ORDER=["stagiaire","junior","confirme","senior","directeur"];
const DIPL_ORDER=["licence","master1","master2","barreau","notariat","doctorat"];

function scoreCandidat(c, d) {
  let score=0; const details={};

  // 1. SPÉCIALISATIONS — 40 pts
  const specMatch=d.specs.filter(s=>c.specs.includes(s));
  const specScore=d.specs.length>0?Math.round((specMatch.length/d.specs.length)*40):0;
  score+=specScore;
  details.specs={score:specScore,max:40,matched:specMatch,total:d.specs.length};

  // 2. LANGUES — 25 pts
  const langMatch=d.langues.filter(l=>c.langues.includes(l));
  const langScore=d.langues.length>0?Math.round((langMatch.length/d.langues.length)*25):25;
  score+=langScore;
  details.langues={score:langScore,max:25,matched:langMatch,total:d.langues.length};

  // 3. NIVEAU — 20 pts
  const ci=NIV_ORDER.indexOf(c.niveau), di=NIV_ORDER.indexOf(d.niveau);
  let niveauScore=0;
  if(ci===di) niveauScore=20;
  else if(ci>di) niveauScore=14; // surqualifié : acceptable
  else if(di-ci===1) niveauScore=10; // légèrement en dessous
  score+=niveauScore;
  details.niveau={score:niveauScore,max:20,candidat:c.niveau,demande:d.niveau};

  // 4. DIPLÔME — 15 pts
  let diplomeScore=0;
  if(d.diplome==="indifferent"){ diplomeScore=15; }
  else {
    const cdi=DIPL_ORDER.indexOf(c.diplome), ddi=DIPL_ORDER.indexOf(d.diplome);
    if(cdi>=ddi) diplomeScore=15;
    else if(ddi-cdi===1) diplomeScore=8;
  }
  score+=diplomeScore;
  details.diplome={score:diplomeScore,max:15};

  return {score, details};
}

function scoreColor(s){
  if(s>=80) return{bg:"#F0FDF4",color:"#166534",label:"Excellent"};
  if(s>=60) return{bg:"#EFF6FF",color:"#1D4ED8",label:"Bon"};
  if(s>=40) return{bg:GOLD_LIGHT,color:"#92400E",label:"Partiel"};
  return{bg:"#F1F5F9",color:"#64748B",label:"Faible"};
}

/* ─── UI HELPERS ─── */
const URGENCE_STYLE={immediat:{bg:"#FEE2E2",color:"#991B1B",label:"Immédiat"},urgent:{bg:"#FEF3C7",color:"#92400E",label:"Urgent"},normal:{bg:"#E1F5EE",color:"#0F6E56",label:"Normal"}};
const STATUT_D={en_cours:{bg:"#EFF6FF",color:"#1D4ED8",label:"En cours"},terminee:{bg:"#F0FDF4",color:"#166534",label:"Terminée"},annulee:{bg:"#F1F5F9",color:"#64748B",label:"Annulée"}};
const STATUT_C={valide:{bg:"#F0FDF4",color:"#166534",label:"Validé"},en_attente:{bg:GOLD_LIGHT,color:"#92400E",label:"En attente"},refuse:{bg:"#FEF2F2",color:"#991B1B",label:"Refusé"}};
const Badge=({bg,color,label})=><span style={{background:bg,color,fontSize:11,fontWeight:500,padding:"3px 9px",borderRadius:20,whiteSpace:"nowrap"}}>{label}</span>;
const Avatar=({prenom,nom,size=36})=>{
  const palettes=[GOLD_LIGHT,"#EFF6FF","#F0FDF4","#FDF4FF","#FFF7ED"];
  const h=(prenom+nom).split("").reduce((a,c)=>a+c.charCodeAt(0),0);
  return <div style={{width:size,height:size,borderRadius:"50%",background:palettes[h%palettes.length],display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*.32,fontWeight:600,color:NAVY,flexShrink:0}}>{prenom[0]}{nom[0]}</div>;
};

/* ─── SCORE RING ─── */
const ScoreRing=({score})=>{
  const {bg,color}=scoreColor(score);
  return(
    <div style={{width:48,height:48,borderRadius:"50%",background:bg,border:`2.5px solid ${color}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
      <span style={{fontSize:14,fontWeight:700,color,lineHeight:1}}>{score}</span>
      <span style={{fontSize:9,color,opacity:.8}}>/100</span>
    </div>
  );
};

/* ─── BARRE DE SCORE DÉTAILLÉE ─── */
const ScoreBar=({label,score,max,note})=>(
  <div style={{marginBottom:6}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
      <span style={{fontSize:11,color:"#718096"}}>{label}</span>
      <span style={{fontSize:11,fontWeight:500,color:NAVY}}>{score}/{max}{note&&<span style={{color:"#A0AEC0",marginLeft:4}}>{note}</span>}</span>
    </div>
    <div style={{height:4,background:"#E2E8F0",borderRadius:2,overflow:"hidden"}}>
      <div style={{height:"100%",width:`${(score/max)*100}%`,background:score===max?GOLD:score>max*.6?"#60A5FA":"#CBD5E0",borderRadius:2}}/>
    </div>
  </div>
);

export default function AdminDashboard(){
  const [tab,setTab]=useState("dashboard");
  const [demandes,setDemandes]=useState(DEMANDES_INIT);
  const [candidats,setCandidats]=useState(CANDIDATS_INIT);
  const [selectedDem,setSelectedDem]=useState(null);
  const [shortlistSel,setShortlistSel]=useState([]);
  const [shortlistSent,setShortlistSent]=useState([]);
  const [expandedScore,setExpandedScore]=useState(null);

  const statD={en_cours:demandes.filter(d=>d.statut==="en_cours").length,terminee:demandes.filter(d=>d.statut==="terminee").length,annulee:demandes.filter(d=>d.statut==="annulee").length};
  const statC={valide:candidats.filter(c=>c.statut==="valide").length,en_attente:candidats.filter(c=>c.statut==="en_attente").length,refuse:candidats.filter(c=>c.statut==="refuse").length};

  const validerCandidat=(id,s)=>setCandidats(cs=>cs.map(c=>c.id===id?{...c,statut:s}:c));
  const cloturerDemande=(id,s)=>setDemandes(ds=>ds.map(d=>d.id===id?{...d,statut:s}:d));

  /* ── Matching automatique ── */
  const getScoredCandidats=(dem)=>{
    return candidats
      .filter(c=>c.statut==="valide")
      .map(c=>({...c,...scoreCandidat(c,dem)}))
      .sort((a,b)=>b.score-a.score);
  };

  const ouvrirDemande=(d)=>{
    const scored=getScoredCandidats(d);
    const autoSel=scored.slice(0,d.nbCv).map(c=>c.id);
    setSelectedDem(d);
    setShortlistSel(autoSel);
    setExpandedScore(null);
  };

  const envoyerShortlist=()=>{
    const choisis=candidats.filter(c=>shortlistSel.includes(c.id));
    setShortlistSent(sl=>[...sl,{demId:selectedDem.id,entreprise:selectedDem.entreprise,poste:selectedDem.poste,contact:selectedDem.contact,candidats:choisis,date:new Date().toLocaleDateString("fr-FR")}]);
    cloturerDemande(selectedDem.id,"terminee");
    setSelectedDem(null);
    setShortlistSel([]);
    setTab("shortlists");
  };

  const navItems=[{id:"dashboard",icon:"⊞",label:"Vue d'ensemble"},{id:"demandes",icon:"📋",label:"Demandes"},{id:"cvtheque",icon:"👥",label:"CVthèque"},{id:"shortlists",icon:"📤",label:"Short-lists"}];

  const Header=()=>(
    <div style={{background:NAVY,padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{background:GOLD,color:NAVY,fontWeight:700,fontSize:16,padding:"4px 11px",borderRadius:7,letterSpacing:1}}>JURIJOB</div>
        <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>Admin</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:30,height:30,borderRadius:"50%",background:GOLD,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:600,color:NAVY}}>MS</div>
        <span style={{fontSize:13,color:"rgba(255,255,255,0.75)"}}>Me Sentissi</span>
      </div>
    </div>
  );

  const Nav=()=>(
    <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",display:"flex",padding:"0 20px",gap:4}}>
      {navItems.map(n=>(
        <button key={n.id} onClick={()=>{setTab(n.id);setSelectedDem(null);}} style={{padding:"11px 12px",fontSize:12.5,cursor:"pointer",background:"none",border:"none",borderBottom:`2.5px solid ${tab===n.id?GOLD:"transparent"}`,color:tab===n.id?NAVY:"#718096",fontWeight:tab===n.id?500:400,display:"flex",alignItems:"center",gap:5}}>
          <span style={{fontSize:14}}>{n.icon}</span>{n.label}
        </button>
      ))}
    </div>
  );

  /* ══ DASHBOARD ══ */
  const renderDashboard=()=>(
    <div style={{padding:"20px",display:"flex",flexDirection:"column",gap:18}}>
      <div>
        <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Tableau de bord</p>
        <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:0}}>Bonjour, Maître Sentissi 👋</h2>
        <p style={{fontSize:13,color:"#718096",margin:"4px 0 0"}}>{new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</p>
      </div>
      <div>
        <p style={{fontSize:12,fontWeight:500,color:"#4A5568",margin:"0 0 8px"}}>Demandes recruteurs</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[["En cours",statD.en_cours,"#1D4ED8","#EFF6FF"],["Terminées",statD.terminee,"#166534","#F0FDF4"],["Annulées",statD.annulee,"#64748B","#F1F5F9"]].map(([l,v,c,bg])=>(
            <div key={l} style={{background:bg,borderRadius:10,padding:"14px 16px"}}><p style={{margin:"0 0 4px",fontSize:11,color:c,opacity:.8}}>{l}</p><p style={{margin:0,fontSize:26,fontWeight:500,color:c}}>{v}</p></div>
          ))}
        </div>
      </div>
      <div>
        <p style={{fontSize:12,fontWeight:500,color:"#4A5568",margin:"0 0 8px"}}>CVthèque</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[["Validés",statC.valide,"#166534","#F0FDF4"],["En attente",statC.en_attente,"#92400E",GOLD_LIGHT],["Refusés",statC.refuse,"#991B1B","#FEF2F2"]].map(([l,v,c,bg])=>(
            <div key={l} style={{background:bg,borderRadius:10,padding:"14px 16px"}}><p style={{margin:"0 0 4px",fontSize:11,color:c,opacity:.8}}>{l}</p><p style={{margin:0,fontSize:26,fontWeight:500,color:c}}>{v}</p></div>
          ))}
        </div>
      </div>
      {demandes.filter(d=>d.statut==="en_cours"&&d.urgence!=="normal").length>0&&(
        <div style={{background:"#FFF7ED",border:"1px solid #FCD34D",borderRadius:12,padding:"14px 18px"}}>
          <p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:"#92400E"}}>⚡ Demandes urgentes à traiter</p>
          {demandes.filter(d=>d.statut==="en_cours"&&d.urgence!=="normal").map(d=>(
            <div key={d.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><p style={{margin:0,fontSize:13,color:NAVY,fontWeight:500}}>{d.poste}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>{d.entreprise} · {d.id}</p></div>
              <button onClick={()=>{ouvrirDemande(d);setTab("demandes");}} style={{padding:"5px 12px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12,cursor:"pointer",fontWeight:500}}>Traiter</button>
            </div>
          ))}
        </div>
      )}
      {shortlistSent.length>0&&(
        <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"16px 18px"}}>
          <p style={{margin:"0 0 10px",fontSize:13,fontWeight:500,color:NAVY}}>Short-lists récentes</p>
          {shortlistSent.slice(-3).reverse().map((sl,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<Math.min(shortlistSent.length,3)-1?"1px solid #F0F4F8":"none"}}>
              <div><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>{sl.poste}</p><p style={{margin:"2px 0 0",fontSize:12,color:"#718096"}}>{sl.entreprise} · {sl.candidats.length} profils · {sl.date}</p></div>
              <Badge bg="#F0FDF4" color="#166534" label="Envoyée"/>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ══ DEMANDES ══ */
  const renderDemandes=()=>{
    if(selectedDem){
      const scored=getScoredCandidats(selectedDem);
      const totalValides=scored.length;
      return(
        <div style={{padding:"20px"}}>
          <button onClick={()=>{setSelectedDem(null);setShortlistSel([]);}} style={{background:"none",border:"none",color:"#718096",fontSize:13,cursor:"pointer",marginBottom:14,padding:0}}>← Retour aux demandes</button>

          {/* Fiche demande */}
          <div style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div><p style={{margin:"0 0 3px",fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8}}>{selectedDem.id}</p><h3 style={{margin:"0 0 3px",fontSize:15,fontWeight:500,color:NAVY}}>{selectedDem.poste}</h3><p style={{margin:0,fontSize:12,color:"#718096"}}>{selectedDem.entreprise} · {selectedDem.contact}</p></div>
              <Badge {...URGENCE_STYLE[selectedDem.urgence]}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {[["Niveau",NIV_ORDER.includes(selectedDem.niveau)?{stagiaire:"Stagiaire",junior:"Junior",confirme:"Confirmé",senior:"Senior",directeur:"Dir. juridique"}[selectedDem.niveau]:selectedDem.niveau],["Diplôme",{licence:"Licence",master1:"Master I",master2:"Master II",doctorat:"Doctorat",barreau:"Barreau",notariat:"Notariat",indifferent:"Indifférent"}[selectedDem.diplome]||selectedDem.diplome],["Langues",selectedDem.langues.join(", ")],["CV demandés",`${selectedDem.nbCv} profils`]].map(([k,v])=>(
                <div key={k} style={{background:CREAM,borderRadius:8,padding:"8px 12px"}}><p style={{margin:"0 0 2px",fontSize:11,color:"#A0AEC0"}}>{k}</p><p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>{v}</p></div>
              ))}
            </div>
            <div style={{marginTop:10}}><p style={{fontSize:11,color:"#A0AEC0",margin:"0 0 6px"}}>Spécialisations requises</p><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{selectedDem.specs.map(s=><span key={s} style={{background:GOLD_LIGHT,color:NAVY,fontSize:11,padding:"3px 10px",borderRadius:20}}>{s}</span>)}</div></div>
          </div>

          {/* Légende matching */}
          <div style={{background:"#EFF6FF",borderRadius:10,padding:"12px 16px",marginBottom:14,display:"flex",alignItems:"flex-start",gap:10}}>
            <span style={{fontSize:16}}>🤖</span>
            <div>
              <p style={{margin:"0 0 3px",fontSize:13,fontWeight:500,color:NAVY}}>Matching automatique activé</p>
              <p style={{margin:0,fontSize:12,color:"#4A5568"}}>{totalValides} profil{totalValides>1?"s":""} validé{totalValides>1?"s":""} analysé{totalValides>1?"s":""}. Les <strong>{Math.min(selectedDem.nbCv,totalValides)} meilleurs scores</strong> ont été pré-sélectionnés. Vous pouvez ajuster librement.</p>
            </div>
          </div>

          {/* Candidats scorés */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <p style={{margin:0,fontSize:13,fontWeight:500,color:NAVY}}>Résultats classés par pertinence</p>
            {shortlistSel.length>0&&<span style={{background:GOLD_LIGHT,color:NAVY,fontSize:11,fontWeight:500,padding:"3px 10px",borderRadius:20}}>{shortlistSel.length} sélectionné{shortlistSel.length>1?"s":""}</span>}
          </div>

          {scored.length===0&&<p style={{fontSize:13,color:"#A0AEC0",padding:"20px 0",textAlign:"center"}}>Aucun candidat validé dans la CVthèque pour le moment.</p>}

          {scored.map((c,idx)=>{
            const sel=shortlistSel.includes(c.id);
            const sc=scoreColor(c.score);
            const expanded=expandedScore===c.id;
            return(
              <div key={c.id} style={{background:sel?"#EFF6FF":"#fff",border:`1.5px solid ${sel?NAVY:"#E2E8F0"}`,borderRadius:11,padding:"14px",marginBottom:10}}>
                <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                  {/* Checkbox */}
                  <div onClick={()=>setShortlistSel(sl=>sl.includes(c.id)?sl.filter(x=>x!==c.id):[...sl,c.id])}
                    style={{width:20,height:20,borderRadius:4,border:`2px solid ${sel?NAVY:"#CBD5E0"}`,background:sel?NAVY:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:14,cursor:"pointer"}}>
                    {sel&&<span style={{color:"#fff",fontSize:12,lineHeight:1}}>✓</span>}
                  </div>
                  {/* Rang */}
                  <div style={{width:22,height:22,borderRadius:"50%",background:idx<selectedDem.nbCv?NAVY:CREAM,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:idx<selectedDem.nbCv?"#fff":"#A0AEC0",flexShrink:0,marginTop:13}}>#{idx+1}</div>
                  <Avatar prenom={c.prenom} nom={c.nom} size={40}/>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                      <div>
                        <p style={{margin:"0 0 1px",fontSize:14,fontWeight:500,color:NAVY}}>{c.prenom} {c.nom}</p>
                        <p style={{margin:0,fontSize:12,color:"#718096"}}>{c.titre} · {c.ville}</p>
                      </div>
                      <ScoreRing score={c.score}/>
                    </div>
                    {/* Specs */}
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,margin:"8px 0 6px"}}>
                      {c.specs.filter(s=>selectedDem.specs.includes(s)).map(s=><span key={s} style={{background:GOLD_LIGHT,color:NAVY,fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:500}}>✓ {s}</span>)}
                      {c.specs.filter(s=>!selectedDem.specs.includes(s)).map(s=><span key={s} style={{background:CREAM,color:"#718096",fontSize:11,padding:"2px 8px",borderRadius:20}}>{s}</span>)}
                    </div>
                    <p style={{margin:"0 0 6px",fontSize:12,color:"#718096"}}>🌍 {c.langues.join(", ")} · 💰 {c.salaire} · 📅 {c.dispo}</p>
                    {/* Détail score */}
                    <button onClick={()=>setExpandedScore(expanded?null:c.id)} style={{background:"none",border:"none",fontSize:12,color:"#718096",cursor:"pointer",padding:0,textDecoration:"underline"}}>
                      {expanded?"Masquer le détail":"Voir le détail du score →"}
                    </button>
                    {expanded&&(
                      <div style={{background:CREAM,borderRadius:8,padding:"12px",marginTop:8}}>
                        <ScoreBar label="Spécialisations" score={c.details.specs.score} max={40} note={`${c.details.specs.matched.length}/${c.details.specs.total} domaines`}/>
                        <ScoreBar label="Langues" score={c.details.langues.score} max={25} note={`${c.details.langues.matched.length}/${c.details.langues.total} langues`}/>
                        <ScoreBar label="Niveau d'expérience" score={c.details.niveau.score} max={20}/>
                        <ScoreBar label="Diplôme" score={c.details.diplome.score} max={15}/>
                        <div style={{display:"flex",justifyContent:"space-between",paddingTop:8,borderTop:"1px solid #E2E8F0",marginTop:4}}>
                          <span style={{fontSize:12,fontWeight:500,color:NAVY}}>Score total</span>
                          <span style={{fontSize:13,fontWeight:600,color:scoreColor(c.score).color}}>{c.score}/100 — {scoreColor(c.score).label}</span>
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
              <button onClick={envoyerShortlist} style={{width:"100%",padding:"11px",borderRadius:9,background:GOLD,color:NAVY,border:"none",fontSize:14,cursor:"pointer",fontWeight:600}}>
                📤 Générer et envoyer la short-list ({shortlistSel.length} profil{shortlistSel.length>1?"s":""})
              </button>
            </div>
          )}
        </div>
      );
    }

    return(
      <div style={{padding:"20px"}}>
        <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Gestion</p>
        <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 18px"}}>Demandes recruteurs</h2>
        {["en_cours","terminee","annulee"].map(statut=>{
          const list=demandes.filter(d=>d.statut===statut);
          if(!list.length)return null;
          return(
            <div key={statut} style={{marginBottom:20}}>
              <p style={{fontSize:12,fontWeight:500,color:"#4A5568",margin:"0 0 8px",display:"flex",alignItems:"center",gap:8}}><Badge {...STATUT_D[statut]}/><span>{list.length} demande{list.length>1?"s":""}</span></p>
              {list.map(d=>(
                <div key={d.id} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:4}}><span style={{fontSize:11,color:"#A0AEC0"}}>{d.id}</span><Badge {...URGENCE_STYLE[d.urgence]}/></div>
                    <p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:NAVY}}>{d.poste}</p>
                    <p style={{margin:0,fontSize:12,color:"#718096"}}>{d.entreprise} · {d.contact} · {d.date}</p>
                    <p style={{margin:"3px 0 0",fontSize:12,color:"#718096"}}>📁 {d.nbCv} CV · {d.langues.join(", ")}</p>
                  </div>
                  {statut==="en_cours"&&(
                    <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                      <button onClick={()=>ouvrirDemande(d)} style={{padding:"7px 14px",borderRadius:7,background:NAVY,color:"#fff",border:"none",fontSize:12,cursor:"pointer",fontWeight:500,whiteSpace:"nowrap"}}>Traiter →</button>
                      <button onClick={()=>cloturerDemande(d.id,"annulee")} style={{padding:"7px 14px",borderRadius:7,background:"transparent",color:"#718096",border:"1px solid #E2E8F0",fontSize:12,cursor:"pointer"}}>Annuler</button>
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

  /* ══ CVTHÈQUE ══ */
  const renderCvtheque=()=>(
    <div style={{padding:"20px"}}>
      <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Modération</p>
      <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 18px"}}>CVthèque — {candidats.length} profils</h2>
      {["en_attente","valide","refuse"].map(statut=>{
        const list=candidats.filter(c=>c.statut===statut);
        if(!list.length)return null;
        return(
          <div key={statut} style={{marginBottom:20}}>
            <p style={{fontSize:12,fontWeight:500,color:"#4A5568",margin:"0 0 8px",display:"flex",alignItems:"center",gap:8}}><Badge {...STATUT_C[statut]}/><span>{list.length} profil{list.length>1?"s":""}</span></p>
            {list.map(c=>(
              <div key={c.id} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:10,padding:"14px",marginBottom:8}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <Avatar prenom={c.prenom} nom={c.nom}/>
                  <div style={{flex:1}}>
                    <p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:NAVY}}>{c.prenom} {c.nom}</p>
                    <p style={{margin:"0 0 6px",fontSize:12,color:"#718096"}}>{c.titre} · {c.ville} · {c.diplome}</p>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:5}}>{c.specs.map(s=><span key={s} style={{background:CREAM,color:NAVY,fontSize:11,padding:"2px 8px",borderRadius:20}}>{s}</span>)}</div>
                    <p style={{margin:0,fontSize:12,color:"#718096"}}>🌍 {c.langues.join(", ")} · 💰 {c.salaire} · 📅 {c.dispo}</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                    {statut==="en_attente"&&<><button onClick={()=>validerCandidat(c.id,"valide")} style={{padding:"6px 12px",borderRadius:7,background:"#F0FDF4",color:"#166534",border:"1px solid #BBF7D0",fontSize:12,cursor:"pointer",fontWeight:500}}>✓ Valider</button><button onClick={()=>validerCandidat(c.id,"refuse")} style={{padding:"6px 12px",borderRadius:7,background:"#FEF2F2",color:"#991B1B",border:"1px solid #FECACA",fontSize:12,cursor:"pointer"}}>✕ Refuser</button></>}
                    {statut==="refuse"&&<button onClick={()=>validerCandidat(c.id,"en_attente")} style={{padding:"6px 12px",borderRadius:7,background:CREAM,color:NAVY,border:"1px solid #E2E8F0",fontSize:12,cursor:"pointer"}}>↩ Remettre</button>}
                    {statut==="valide"&&<button onClick={()=>validerCandidat(c.id,"refuse")} style={{padding:"6px 12px",borderRadius:7,background:"transparent",color:"#718096",border:"1px solid #E2E8F0",fontSize:12,cursor:"pointer"}}>Archiver</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  /* ══ SHORT-LISTS ══ */
  const renderShortlists=()=>(
    <div style={{padding:"20px"}}>
      <p style={{fontSize:11,color:GOLD,fontWeight:500,textTransform:"uppercase",letterSpacing:.8,margin:"0 0 4px"}}>Historique</p>
      <h2 style={{color:NAVY,fontSize:19,fontWeight:500,margin:"0 0 18px"}}>Short-lists envoyées</h2>
      {!shortlistSent.length&&<p style={{fontSize:13,color:"#A0AEC0",textAlign:"center",padding:"32px 0"}}>Aucune short-list générée pour le moment.<br/>Traitez une demande pour en créer une.</p>}
      {shortlistSent.map((sl,i)=>(
        <div key={i} style={{background:"#fff",border:"1px solid #E2E8F0",borderRadius:12,overflow:"hidden",marginBottom:16}}>
          <div style={{background:NAVY,padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><p style={{margin:"0 0 2px",fontSize:14,fontWeight:500,color:"#fff"}}>{sl.poste}</p><p style={{margin:0,fontSize:12,color:"rgba(255,255,255,0.6)"}}>{sl.entreprise} · {sl.contact} · {sl.date}</p></div>
            <Badge bg={GOLD_LIGHT} color={NAVY} label={`${sl.candidats.length} profils`}/>
          </div>
          <div style={{padding:"14px 18px"}}>
            {sl.candidats.map((c,j)=>(
              <div key={c.id} style={{display:"flex",gap:12,alignItems:"center",padding:"10px 0",borderBottom:j<sl.candidats.length-1?"1px solid #F0F4F8":"none"}}>
                <Avatar prenom={c.prenom} nom={c.nom} size={36}/>
                <div style={{flex:1}}><p style={{margin:"0 0 2px",fontSize:13,fontWeight:500,color:NAVY}}>{j+1}. {c.prenom} {c.nom}</p><p style={{margin:0,fontSize:12,color:"#718096"}}>{c.titre} · {c.niveau} · {c.dispo}</p></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const content=tab==="dashboard"?renderDashboard():tab==="demandes"?renderDemandes():tab==="cvtheque"?renderCvtheque():renderShortlists();
  return(
    <div style={{background:CREAM,minHeight:"100vh",display:"flex",flexDirection:"column"}}>
      <Header/><Nav/>
      <div style={{flex:1}}>{content}</div>
    </div>
  );
}