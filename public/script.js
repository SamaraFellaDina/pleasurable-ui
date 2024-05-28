const btn = document.querySelector('.share-button');

function fire (ratio, opt) {
    confetti(Object.assign({}, opt, {
        origin: {y: .6},
        particleCount: Math.floor(200 * ratio)
    }));
}

btn.addEventListener('click', () => {
    fire(.25, {
        spread: 30,
        startVelocity: 60
      });
    fire(.2, {spread: 60});
    fire(.35, {
        spread: 100,
        decay: .9,
        scalar: 1
      });
      fire(.1, {
        spread: 130,
        startVelocity: 30,
        decay: .92,
        scalar: 1.2
      });
      fire (.2, {
        spread: 120,
        startVelocity: 45
      });
    });



// Selecteer share formulier
let form = document.querySelector('form');

// Luister naar het submit event
form.addEventListener('submit', function(event) {
    // Voorkom dat het formulier de pagina herlaadt
    event.preventDefault();

    // Selecteer de .shares div
    let shares = document.querySelector('.shares');

    // Lees de data van het formulier in
    let data = new FormData(this);

    // Voeg een extra eigenschap aan de formulierdata toe
    data.append('enhanced', true);

    // Gebruik een client-side fetch om een POST te doen naar de server
    fetch(this.action, {
        method: this.method,
        body: data // Gebruik FormData object als body
    }).then(function(response) {
        // Als de server een antwoord geeft, krijgen we een stream terug
        // We willen hiervan de text gebruiken, wat in dit geval HTML teruggeeft
        return response.text();
    }).then(function(responseHTML) {
        // Creëer een tijdelijke div om de HTML te parseren
        let tempDiv = document.createElement('div');
        tempDiv.innerHTML = responseHTML;

        // Selecteer alleen de inhoud van .shares uit de ontvangen HTML
        let newSharesContent = tempDiv.querySelector('.shares').innerHTML;

        // Hier wordt alleen de .shares div geüpdate met de nieuwe inhoud
        shares.innerHTML = newSharesContent;
    });
});
