function createAccount(event) {
    event.preventDefault(); // Empêche le formulaire de se soumettre normalement

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
    $.ajax({
        url: 'http://127.0.0.1:5000/insert_user',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(userData),
        success: function (response) {
            // Si la création du compte est réussie, afficher une alerte et rediriger vers la page de connexion
            alert('Utilisateur créé avec succès');
            window.location.href = '/Login/Login'; // Redirection vers la page de connexion
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.error('Erreur:', errorThrown);
            // Ajoutez ici le code pour gérer les erreurs (par exemple, afficher un message d'erreur)
        }
    });
}

// Attachez la fonction submitForm à l'événement de soumission du formulaire
document.getElementById('myForm').addEventListener('submit', createAccount);
