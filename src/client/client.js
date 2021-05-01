/* ******************************************************************
 * Constantes de configuration
 */
//const apiKey = "0e2c739a-0c73-4d13-bf99-1997b8dc94b7";
const serverUrl = "https://lifap5.univ-lyon1.fr";

/* ******************************************************************
 * Gestion des tabs "Voter" et "Toutes les citations"  
 ******************************************************************** */

/**
 * Affiche/masque les divs "div-duel" et "div-tout"
 * selon le tab indiqué dans l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majTab(etatCourant) {
  console.log("CALL majTab");
  const dDuel = document.getElementById("div-duel");
  const dTout = document.getElementById("div-tout");
  const tDuel = document.getElementById("tab-duel");
  const tTout = document.getElementById("tab-tout");
  if (etatCourant.tab === "duel") {
    dDuel.style.display = "flex";
    tDuel.classList.add("is-active");
    dTout.style.display = "none";
    tTout.classList.remove("is-active");
  } else {
    dTout.style.display = "flex";
    tTout.classList.add("is-active");
    dDuel.style.display = "none";
    tDuel.classList.remove("is-active");
  }
}


/* ******************************************************************
 * Récupérer les données des citations sur le serveur
 ******************************************************************** */


/**
 * Effectue les actions à réaliser après avoir récupérer les citations
 * 
 *  * @param {Etat} etatCourant l'état courant
 */
function updateQuotes(etatCourant) {
  fetchCitations().then(data => {
    document.getElementById("tab-body-classement").innerHTML = dataToTab(data);
  });
  fetchCitations().then(data => RandomQuotes(data))
  .then(citation => DisplayQuote(citation, etatCourant));
}




/**
 * Fait une requête GET authentifiée sur /citations
 * Entre les données récupérées dans data dans etatCourant
 * @returns les données des citations en Json
 */
function fetchCitations() {
  return fetch(serverUrl + "/citations")
    .then(res => {return res.text()})
    .then((textData) => {
      return JSON.parse(textData);
    })
    .catch((erreur) => ({ err: erreur }));
}

/* ******************************************************************
 * Gestion du tab "Toutes les citations"  
 ******************************************************************** */

/**
 * Met en forme les citations sous forme de tableau
 * 
 * @param {Array} data les citations
 * @returns les citations sous forme de cellules de tableau
 */
function dataToTab(data) {
  return data.map((data, index) => {
    return `<tr id="${data._id}"><th>${index+1}</th><td>${data.character}</td>
  <td>${data.quote}</td><td><button class="fas fa-info-circle" onclick=
  "ouvrirModale('modale${data._id}')"></button></td></tr>
  <div id="modale${data._id}" class="modal"><div class="modal-background"
   onclick="fermerModale('modale${data._id}');"></div>
          <div class="modal-content box">
          <button class="modal-close is-large" aria-label="close" 
          onclick="fermerModale('modale${data._id}');"></button>
          <div><p class="my-2"><b>Citation : 
          </b> 
          ${data.quote}</p><p class="my-2"><b>Personnage : </b>${data.character}</p>
          <p class="my-2"><b>Source : </b> ${data.origin}</p></div>
          <div> <p class="my-2"><b>Image : </b></p>
          <img class="mx-2" src="${data.image}" width="150px"></div>
          <p class="my-2"><b>Direction : </b> ${getDirection(data.characterDirection)}</p>
          <p class="my-2"><b>Ajouté par : </b> ${data.addedBy}</p>
          </div></div>
          `;
  }).join("");
}




/**
 * Rend la direction du joueur en français
 * 
 *  @param {Direction} dir la direction du joueur en anglais
 *  @returns la direction du joueur en français
 */
function getDirection(dir) {
  switch (dir) {
    case "Right":
      return "Droite";
    case "Left":
      return "Gauche";
    default:
      return "Inconnue";
  }
}

/**
 * Affiche la modale de détails de la citation
 * 
 *  * @param {Id} element la modale à ouvrir
 */
function ouvrirModale(element)
{
    document.getElementById(element).classList.add('is-active');
}

/**
 * Ferme la modale de détails de la citation
 *
 * @param {Id} element la modale à ferme
 */
function fermerModale(element)
{
    document.getElementById(element).classList.remove('is-active');
}


/**
 * Mets au besoin à jour l'état courant lors d'un click sur un tab.
 * En cas de mise à jour, déclenche une mise à jour de la page.
 *
 * @param {String} tab le nom du tab qui a été cliqué
 * @param {Etat} etatCourant l'état courant
 */
function clickTab(tab, etatCourant) {
  console.log(`CALL clickTab(${tab},...)`);
  if (etatCourant.tab !== tab) {
    etatCourant.tab = tab;
    majPage(etatCourant);
  }
}

/**
 * Enregistre les fonctions à utiliser lorsque l'on clique
 * sur un des tabs.
 *
 * @param {Etat} etatCourant l'état courant
 */
function registerTabClick(etatCourant) {
  console.log("CALL registerTabClick");
  document.getElementById("tab-duel").onclick = () =>
    clickTab("duel", etatCourant);
  document.getElementById("tab-tout").onclick = () =>
    clickTab("tout", etatCourant);
}

/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'ajout de citation
 * ****************************************************************** */

/**
 * Déclenche l'ouverture de la modale d'ajout de citation
 *
 * @param {Etat} etatCourant l'état courant
 */
function openAddQuote(etatCourant) {
  etatCourant.addQuoteModal = true;
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la modale d'ajout de citation 
 * et vide ses champs de formulaire
 *
 * @param {Etat} etatCourant l'état courant
 */
function closeAddQuote(etatCourant) {
  etatCourant.addQuoteModal = false;
  addQuoteFormClear();
  majPage(etatCourant);
}

/**
 * Met à jour l'état de la modale, l'ouvre/la ferme.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majAddQuoteModal(etatCourant) {
  const modalClasses = document.getElementById("addQuoteModal").classList;
  if (etatCourant.addQuoteModal) {
    modalClasses.add("is-active");
  } else {
    modalClasses.remove("is-active");
  }
}

/**
 * Gère le formulaire d'ajout de citation. 
 * Si les informations saisies sont correctes -> AddQuote(...)
 * Si les informations saisies ne sont pas correctes -> erreur
 *
 * @param {Etat} etatCourant l'état courant
 */
function addQuoteForm(etatCourant) {
  const quote = document.getElementById("add-quote-text").value;
  const character = document.getElementById("add-character-text").value;
  const source = document.getElementById("add-source-text").value;
  const image = document.getElementById("add-image-link").value;
  let direction = ""
  if (document.getElementById("add-left-radio").checked === true) {
    direction = "Left";
  }else if (document.getElementById("add-right-radio").checked === true) {
    direction = "Right";
  }
  if (quote != "" && character != "" && source != "") {
    AddQuote(etatCourant, quote, character, source, image, direction);
  }else {
    addQuoteFormError(quote, character, source, image, direction);
    document.getElementById("add-quote-success-message").classList
        .add("is-hidden");
  }
}

/**
 * Ajoute la citation des champs du formulaire sur le serveur.
 * Affiche un message de succès et met à jour les citations.
 *
 * @param {Etat} etatCourant l'état courant
 * @param {String} quote la valeur du champ citation
 * @param {String} character la valeur du champ personnage
 * @param {String} source la valeur du champ source
 * @param {String} image la valeur du champ image
 * @param {String} direction la valeur de la direction
 */
function AddQuote(etatCourant, quote, character, source, image, direction) {
  fetch(serverUrl + "/citations", { method: 'POST', headers: { 
      "x-api-key":etatCourant.key, "Content-Type": "application/json" },
      body: JSON.stringify({"quote": quote, "character": character, "image":
      image, "characterDirection": direction, "origin": source})})
        .then(updateQuotes(etatCourant));
        addQuoteFormClear(); 

      document.getElementById("add-quote-success-message").classList
        .remove("is-hidden");
      document.getElementById("add-quote-error-message").classList
        .add("is-hidden");    
}

/**
 * Gere les erreurs du formulaire. 
 * Si tous les champs ne sont saisies correctement -> erreur et mise en valeur
 * des champs manquant
 *
 * @param {String} quote la valeur du champ citation
 * @param {String} character la valeur du champ personnage
 * @param {String} source la valeur du champ source
 */
function addQuoteFormError(quote, character, source) {
  if ( quote == "" ) document.getElementById('add-quote-text').classList
    .add('is-danger');
  else document.getElementById('add-quote-text').classList.remove('is-danger');
  if ( character == "") document.getElementById('add-character-text').classList
    .add('is-danger');
  else document.getElementById('add-character-text').classList
    .remove('is-danger');
  if ( source == "" ) document.getElementById('add-source-text').classList
    .add('is-danger');
  else document.getElementById('add-source-text').classList
    .remove('is-danger');
  document.getElementById("add-quote-error-message").classList
    .remove("is-hidden");
}


/**
 * Remet les champs du formulaire vides. Enlève les messages d'erreurs
 *
 */
function addQuoteFormClear() {
  document.getElementById("add-quote-text").value = "";
  document.getElementById("add-character-text").value = "";
  document.getElementById("add-source-text").value = "";
  document.getElementById("add-image-link").value = "";
  document.getElementById("add-left-radio").checked = false;
  document.getElementById("add-right-radio").checked = false;
  document.getElementById("add-quote-success-message").classList.add("is-hidden");
  document.getElementById("add-quote-error-message").classList.add("is-hidden");
}

/**
* Enregistre les actions à effectuer lors d'un click sur les boutons
* impliqués sur l'ajout d'une citation
* 
* @param {Etat} etatCourant
*/
function AddQuoteModalClick(etatCourant) {
  document.getElementById("btn-add-quote").onclick = () =>
    openAddQuote(etatCourant);
  document.getElementById("btn-close-add-quote1").onclick = () =>
    closeAddQuote(etatCourant);
  document.getElementById("btn-close-add-quote2").onclick = () =>
    closeAddQuote(etatCourant);
  document.getElementById("add-btn").onclick = () =>
    addQuoteForm(etatCourant);  
}


/* ******************************************************************
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur ainsi que de la connexion/deconnexion
 * ****************************************************************** */

/**
* Fait une requête GET authentifiée sur /whoami
* 
* @param {Clé} key La clé API entrée par l'utilisateur
* @returns une promesse du login utilisateur ou du message d'erreur
*/
function fetchWhoami(key) {
  return fetch(serverUrl + "/whoami", { headers: { "x-api-key": key } })
    .then((response) => response.json())
    .then((jsonData) => {
      if (jsonData.status && Number(jsonData.status) != 200) {
        return { err: jsonData.message };
      }
      return jsonData;
    })
    .catch((erreur) => ({ err: erreur }));
}

/**
 * Fait une requête sur le serveur et insère le login dans
 * la modale d'affichage de l'utilisateur.
 * 
 * @param {Etat} etatCourant l'état courant
 * @param {Clé} key La clé API entrée par l'utilisateur
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin(etatCourant, key) {
  if (!etatCourant.isConnected) {
    return fetchWhoami(key).then((data) => {
      const ok = data.err === undefined;
      if (!ok) {
        etatCourant.isConnected = false;
        etatCourant.errorAPI = true;
        etatCourant.login = "";
        etatCourant.key = 0;
      } else {
        etatCourant.isConnected = true;
        document.getElementById("vote-error-message").classList.add("is-hidden");
        etatCourant.errorAPI = false;
        etatCourant.login = data.login;
        etatCourant.key = key;
        clickFermeModalLogin(etatCourant);
      }
      majAPIErrorMessage(etatCourant);
      majEnterAPI(etatCourant);
      return ok;
    });
  }
}

/**
 * Affiche ou masque la fenêtre modale de login en fonction de l'état courant.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majModalLogin(etatCourant) {
  const modalClasses = document.getElementById("mdl-login").classList;
  if (etatCourant.loginModal) {
    modalClasses.add("is-active");
  } else {
    modalClasses.remove("is-active");
  }
}

/**
 * Affiche ou masque la fenêtre le message d'erreur de connexion avec
 * la clé d'API dans la fenêtre modale de login
 *
 * @param {Etat} etatCourant l'état courant
 */
function majAPIErrorMessage(etatCourant) {
  const errorMessage = document.getElementById("api-error-message").classList;
  if (etatCourant.isConnected || !etatCourant.errorAPI) {
    errorMessage.add("is-hidden");
  } else if (etatCourant.errorAPI) {
    errorMessage.remove("is-hidden");
  }
}

/**
 * Effectue les actions nécessaire sur l'affichage lorsque de la 
 * connexion/deconnexion
 * @param {Etat} etatCourant 
 */
function majEnterAPI(etatCourant) {
  const enterAPI = document.getElementById("enter-api").classList;
  const connectBtn = document.getElementById("btn-open-login-modal").classList;
  const disconnectBtn = document.getElementById("btn-disconnect").classList;
  const connectedAs = document.getElementById("connected-as");
  const AddQuoteBtn = document.getElementById("btn-add-quote").classList;
  if (etatCourant.isConnected) {
    enterAPI.add("is-hidden");
    connectBtn.add("is-hidden")
    disconnectBtn.remove("is-hidden");
    connectedAs.classList.remove("is-hidden");
    connectedAs.innerHTML = `Connecté en tant que ${etatCourant.login}. `;
    AddQuoteBtn.remove("is-hidden");
  } else {
    enterAPI.remove("is-hidden");
    connectBtn.remove("is-hidden");
    disconnectBtn.add("is-hidden");
    connectedAs.classList.add("is-hidden");
    connectedAs.innerHTML = "";
    AddQuoteBtn.add("is-hidden");
  }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickFermeModalLogin(etatCourant) {
  etatCourant.loginModal = false;
  document.getElementById("api_key").value = "";
  etatCourant.errorAPI = false;
  majPage(etatCourant);
}

/**
 * Effectue les actions nécessaire lors de la déconnexion
 * @param {Etat} etatCourant 
 */
function clickDisconnect(etatCourant) {

  etatCourant.isConnected = false;
  document.getElementById("btn-disconnect").classList.add("is-hidden");
  document.getElementById("api_key").value = "";
  document.getElementById("elt-affichage-login").innerHTML = "";
  etatCourant.key = 0;
  etatCourant.login = "";
  majPage(etatCourant);
}

/**
 * Déclenche la fermeture de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickOuvreModalLogin(etatCourant) {
  etatCourant.loginModal = true;
  majPage(etatCourant);
}

/**
 * Enregistre les actions à effectuer lors d'un click sur les boutons
 * impliqués sur la connexion/deconnexion.
 * @param {Etat} etatCourant
 */
function registerLoginModalClick(etatCourant) {
  document.getElementById("btn-close-login-modal1").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-close-login-modal2").onclick = () =>
    clickFermeModalLogin(etatCourant);
  document.getElementById("btn-open-login-modal").onclick = () =>
    clickOuvreModalLogin(etatCourant);
  document.getElementById("btn-connect-API").onclick = () =>
    lanceWhoamiEtInsereLogin(etatCourant,
      document.getElementById("api_key").value);
  document.getElementById("btn-disconnect").onclick = () =>
  clickDisconnect(etatCourant);
}

/* ******************************************************************
 * Affichage d'un duel aléatoire
 * 
 * ****************************************************************** */

/**
 * Renvoie un entier aléatoire entre 0 et max
 * et avec l'entier forbidenNb interdit
 *
 * @param {Entier} max le nombre max
 * @param {Entier} forbidenNb le nombre interdit
 * @returns le nombre aléatoire 
 */
function RandomForbiden(max, forbidenNb){
  const nb = Math.floor(Math.random()*max);
  if(nb==forbidenNb) return RandomForbiden(max, forbidenNb);

  return nb;
}

/**
 * Renvoie un tableau de 2 citations parmis 
 * toutes les citations
 *
 * @param {Array} data tableau d'objet contenant les sitations
 * @returns un tableau contenant les deux citations aléatoires
 */
function RandomQuotes(data){
  const random = RandomForbiden(data.length, -1);
  return [data[random], 
          data[RandomForbiden(data.length, random)]];
}

/**
 * Affiche le duel de 2 sitation
 * en gérant l'orientation des images
 *
 * @param {Array} citations tableau de 2 objets citations
 */
function DisplayQuote(citations, etatCourant){
    document.getElementById("left-vote-btn").onclick = () =>
  vote(citations[0]._id, citations[1]._id, etatCourant);
  document.getElementById("right-vote-btn").onclick = () =>
  vote(citations[1]._id, citations[0]._id, etatCourant);

  citations.map((citation, index) => {
  document.getElementById("quote"+(index+1)).innerHTML = citation.quote;
  document.getElementById("subtitle"+(index+1)).innerHTML = 
    citation.character + " dans "+citation.origin;

  document.getElementById("img"+(index+1)).src = citation.image;
  if(index==0 && citation.characterDirection=="Right"){
    document.getElementById("img1").style = "transform: scaleX(-1);";
  }
  if(index==1 && citation.characterDirection=="Left"){
    document.getElementById("img2").style = "transform: scaleX(-1);";
  }
    
  });
}


/**
 * Vote pour une des deux citations affichées 
 *
 * @param {CitationId} winner id de la citation ayant gagné
 * @param {CitationId} looser id de la citation ayant perdu
 * @param {Etat} etatCourant l'état courant
 */
function vote(winner, looser, etatCourant) {
  console.log("CALL voter");

  if (etatCourant.isConnected) {
    fetch(serverUrl + "/citations/duels", {
      method: 'POST',
      headers: { "x-api-key": etatCourant.key, "Content-Type": "application/json" },
      body: JSON.stringify({"winner": winner, "looser": looser})
    });
    updateQuotes(etatCourant);
  }else{
    document.getElementById("vote-error-message").classList.remove("is-hidden");
  }

}

/* ******************************************************************
 * Initialisation de la page et fonction de mise à jour
 * globale de la page.
 * ****************************************************************** */

/**
 * Mets à jour la page (contenu et événements) en fonction d'un nouvel état.
 *
 * @param {Etat} etatCourant l'état courant
 */
function majPage(etatCourant) {
  console.log("CALL majPage");
  majTab(etatCourant);
  majModalLogin(etatCourant);
  majAPIErrorMessage(etatCourant);
  registerTabClick(etatCourant);
  registerLoginModalClick(etatCourant);
  AddQuoteModalClick(etatCourant);
  majEnterAPI(etatCourant);
  majAddQuoteModal(etatCourant);
}

/**
 * Appelé après le chargement de la page.
 * Met en place la mécanique de gestion des événements
 * en lançant la mise à jour de la page à partir d'un état initial.
 */
function initClientCitations() {
  console.log("CALL initClientCitations");
  const etatInitial = {
    tab: "duel",
    loginModal: false,
    addQuoteModal: false,
    isConnected: false,
    errorAPI: false,
    key: 0,
    login: "",
  };
  updateQuotes(etatInitial);
  majPage(etatInitial);
}


// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});

