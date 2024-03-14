document.getElementById('myForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre normalement
    console.log("test submit")

    // Récupère les valeurs des champs du formulaire
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var email = document.getElementById('email').value;

    // Crée un objet JSON avec les données du formulaire
    var userData = {
        "username": username,
        "password": password,
        "email": email
    };

    // Envoie les données du formulaire au service REST à la route /insert_user
    fetch('http://127.0.0.1:5000/insert_user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de la création du compte');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Affiche la réponse du serveur dans la console
            // Ajoutez ici le code pour gérer la réponse du serveur (par exemple, afficher un message de succès)
        })
        .catch(error => {
            console.error('Erreur:', error);
            // Ajoutez ici le code pour gérer les erreurs (par exemple, afficher un message d'erreur)
        });
});