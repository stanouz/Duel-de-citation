/* ******************************************************************
 * Constantes de configuration
 */
const apiKey = "0e2c739a-0c73-4d13-bf99-1997b8dc94b7";
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
 * Gestion de la boîte de dialogue (a.k.a. modal) d'affichage de
 * l'utilisateur.
 * ****************************************************************** */

/**
 * Fait une requête GET authentifiée sur /whoami
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
 * @param {Clé} key La clé API entrée par l'utilisateur
 * @returns Une promesse de mise à jour
 */
function lanceWhoamiEtInsereLogin(etatCourant, key) {
  if (!etatCourant.isConnected) {
    return fetchWhoami(key).then((data) => {
      const elt = document.getElementById("elt-affichage-login");
      const ok = data.err === undefined;
      if (!ok) {
        etatCourant.isConnected = false;
        etatCourant.errorAPI = true;
      } else {
        etatCourant.isConnected = true;
        etatCourant.errorAPI = false;
        elt.innerHTML = `Bonjour ${data.login}.`;
      }
      majAPIErrorMessage(etatCourant);
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
  if (etatCourant.isConnected) {
    errorMessage.add("is-hidden");
  } else if(etatCourant.errorAPI) {
    errorMessage.remove("is-hidden");
  }
}

/**
 * Déclenche l'affichage de la boîte de dialogue du nom de l'utilisateur.
 * @param {Etat} etatCourant
 */
function clickFermeModalLogin(etatCourant) {
  etatCourant.loginModal = false;
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
 * d'ouverture/fermeture de la boîte de dialogue affichant l'utilisateur.
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
    lanceWhoamiEtInsereLogin(etatCourant, document.getElementById("api_key").value);

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
    isConnected: false,
    errorAPI: false,
  };
  majPage(etatInitial);
}

// Appel de la fonction init_client_duels au après chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  console.log("Exécution du code après chargement de la page");
  initClientCitations();
});
