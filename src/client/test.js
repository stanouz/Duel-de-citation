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


    
    mocha.checkLeaks();
    mocha.globals(['jQuery']);
    mocha.run();
}, false);
  