const donnees_exemple = [
    {   
        character: "Ralph Wiggum",
        characterDirection: "Left", 
        image: "https://cdn.glitch.com/3c3ffadc-3406-4440-bb95-d40ec8fcde72%2FRalphWiggum.png?1497567511523",
        origin: "The Simpsons",
        quote: "They taste like...burning.", 
        score : {},
        __v : 0,
        __id : "608d0a8122d19f0d39234d7e"
    },
    {   
        character: "Rainier Wolfcastle",
        characterDirection: "Left", 
        image: "https://cdn.glitch.com/3c3ffadc-3406-4440-bb95-d40ec8fcde72%2FRainierWolfcastle.png?1497567511035",
        origin: "The Simpsons",
        quote: "My eyes! The goggles do nothing!", 
        score : {},
        __v : 0,
        __id : "608d0a8122d19f0d39234d7f"
    },

];



// Test de regression
document.addEventListener('DOMContentLoaded', function(){

    mocha.setup('tdd');
  
    suite("Test de RandomForbiden(max, forbidenNb) :", 
        function(){
            test("On vérifie que nb <= max",
                function(){
                    chai.assert.isAtLeast(10, RandomForbiden(10, -1));
                }
            );
            test("On vérifie nombre interdit", 
                function(){
                    chai.assert.notDeepEqual(RandomForbiden(2, 1), 1);
                }
            );
        }
    );

    suite("Test de RandomQuote(data) :",
        function(){
            test("2 citations différentes",
                function(){
                    const quotes = RandomQuotes(donnees_exemple);
                    chai.assert.notDeepEqual(quotes[0].__id, quotes[1].__id);
                }
            );
        }
    );

    suite("Test de getDirection(dir) :",
        function(){
            test("Right retourne Droite", 
                function(){
                    chai.assert.deepEqual(getDirection("Right"), "Droite");
                }
            );

            test("Left retourne Gauche", 
                function(){
                    chai.assert.deepEqual(getDirection("Left"), "Gauche");
                }
            );

            test("Autre retourne Inconnue", 
                function(){
                    chai.assert.deepEqual(getDirection("right"), "Inconnue");
                    chai.assert.deepEqual(getDirection("dkff"), "Inconnue");
                    chai.assert.deepEqual(getDirection("left"), "Inconnue");
                    chai.assert.deepEqual(getDirection(1), "Inconnue");
                }
            );
        }
    );


    suite("Test de TadaToTab(data) :",
        function(){
            test("Tableau correctement créé",
                function(){
                    const tableau = dataToTab(donnees_exemple);
                    /*
                    chai.assert.deepEqual(tableau,
                        `<tr id="${donnees_exemple[0].__id}"><th>${1}</th><td>${donnees_exemple[0].character}</td>
                        <td>${donnees_exemple[0].quote}</td><td><button class="fas fa-info-circle" onclick=
                        "ouvrirModale('modale${donnees_exemple[0]._id}')"></button></td></tr>
                        <div id="modale${donnees_exemple[0]._id}" class="modal"><div class="modal-background"
                        onclick="fermerModale('modale${donnees_exemple[0]._id}');"></div>
                        <div class="modal-content box">
                        <button class="modal-close is-large" aria-label="close" 
                        onclick="fermerModale('modale${donnees_exemple[0]._id}');"></button>
                        <div><p class="my-2"><b>Citation : 
                        </b> 
                        ${donnees_exemple[0].quote}</p><p class="my-2"><b>Personnage : </b>${donnees_exemple[0].character}</p>
                        <p class="my-2"><b>Source : </b> ${donnees_exemple[0].origin}</p></div>
                        <div> <p class="my-2"><b>Image : </b></p>
                        <img class="mx-2" src="${donnees_exemple[0].image}" width="150px"></div>
                        <p class="my-2"><b>Direction : </b> ${getDirection(donnees_exemple[0].characterDirection)}</p>
                        <p class="my-2"><b>Ajouté par : </b> ${donnees_exemple[0].addedBy}</p>
                        </div></div><tr id="${donnees_exemple[1].__id}"><th>${2}</th><td>${donnees_exemple[1].character}</td>
                        <td>${donnees_exemple[1].quote}</td><td><button class="fas fa-info-circle" onclick=
                        "ouvrirModale('modale${donnees_exemple[1]._id}')"></button></td></tr>
                        <div id="modale${donnees_exemple[1]._id}" class="modal"><div class="modal-background"
                        onclick="fermerModale('modale${donnees_exemple[1]._id}');"></div>
                        <div class="modal-content box">
                        <button class="modal-close is-large" aria-label="close" 
                        onclick="fermerModale('modale${donnees_exemple[1]._id}');"></button>
                        <div><p class="my-2"><b>Citation : 
                        </b> 
                        ${donnees_exemple[1].quote}</p><p class="my-2"><b>Personnage : </b>${donnees_exemple[1].character}</p>
                        <p class="my-2"><b>Source : </b> ${donnees_exemple[1].origin}</p></div>
                        <div> <p class="my-2"><b>Image : </b></p>
                        <img class="mx-2" src="${donnees_exemple[1].image}" width="150px"></div>
                        <p class="my-2"><b>Direction : </b> ${getDirection(donnees_exemple[1].characterDirection)}</p>
                        <p class="my-2"><b>Ajouté par : </b> ${donnees_exemple[1].addedBy}</p>
                        </div></div>`
                        
                    );
                    */
                }
            );
        }
    );
  
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
}, false);
  