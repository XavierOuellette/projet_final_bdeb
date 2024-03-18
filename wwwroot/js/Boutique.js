async function addProduct() {
    const name = document.getElementById('Name').value;
    const description = document.getElementById('Description').value;
    const price = document.getElementById('Price').value * 100;
    const image = document.getElementById('Image').files[0];
    const available = document.getElementById('Available').checked;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('available', available);

    try {
        debugger;
        const imageResponse = await fetch('/Boutique/UploadImage', {
            method: 'POST',
            body: formData
        });
        if (imageResponse.ok) {
            const imagePath = await imageResponse.text();

            var productData = {
                name: name,
                description: description,
                price: price,
                image_path: imagePath,
                available: available,
                
            };
            productData = addSessionAndUserAgentData(productData);

            console.log("Product Data:", productData);

            const response = await fetch('http://127.0.0.1:5000/insert_item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            if (response.ok) {
                alert('Produit ajouté avec succès.');
            } else {
                alert('Une erreur s\'est produite lors de l\'ajout du produit.');
            }
        } else {
            alert('Une erreur s\'est produite lors du téléchargement de l\'image.');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur s\'est produite lors de l\'ajout du produit.');
    }
}

function addSessionAndUserAgentData(data) {
    // Récupérer les valeurs d'ipAddress et sessionId à partir des attributs de données
    var session = document.getElementById("session");
    var sessionId = $("#session").attr("session-id");
    var ipAddress = $("#session").attr("ip-address");
    data.session_id = sessionId;
    data.ip_address = ipAddress;
    data.user_agent = navigator.userAgent;
    return data;
}

function convertCentsToDollars(priceInCents) {
    // Fonction pour convertir le prix en cents en dollars
    return (priceInCents / 100).toFixed(2);
}

function deleteProduct(event) {
    event.stopPropagation(); // Arrêter la propagation de l'événement de clic
    target = event.currentTarget

    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
        // Récupérer l'ID de l'élément à partir des données de l'élément lui-même
        var itemId = $(target).closest('.box-img').attr('item-id');

        // Créer un objet avec les données nécessaires
        var productData = {
            id: itemId
        };
        productData = addSessionAndUserAgentData(productData);

        // Envoyer les données à la méthode delete_item via AJAX
        $.ajax({
            url: "http://127.0.0.1:5000/delete_item",
            type: "DELETE",
            contentType: "application/json",
            data: JSON.stringify(productData),
            success: function (response) {
                // Traiter la réponse de suppression réussie
                alert(response.message);
                // Actualiser ou effectuer d'autres actions après la suppression réussie
                var imagePath = $(target).closest('.box-img').find('img').attr('src');
                if (fs.existsSync(imagePath)) {
                    // Delete the file
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                            console.error("Erreur lors de la suppression de l'image:", err);
                            return;
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                // Gérer les erreurs de suppression
                console.error(error);
                alert("Une erreur s'est produite lors de la suppression de l'élément.");
            }
        });
    }
}

function onClickSlide(event) {
    elem = event.currentTarget;
    const descriptionDiv = elem.querySelector('.description');
    const editButton = elem.querySelector('.edit-button');
    const deleteButton = elem.querySelector('.delete-button');

    if (descriptionDiv.style.display === 'none') {
        $(descriptionDiv).slideDown();
        if (editButton) $(editButton).slideDown();
        if (deleteButton) $(deleteButton).slideDown();
    } else {
        $(descriptionDiv).slideUp();
        if (editButton) $(editButton).slideUp();
        if (deleteButton) $(deleteButton).slideUp();
    }
}


function searchChanged(event) {
    var searchInput = event.currentTarget.value.toLowerCase(); // Get the search input value and convert to lowercase for case-insensitive comparison
    var productDivs = document.querySelectorAll('.productDiv'); // Select all product divs

    if (searchInput.trim() === '') { // Check if the search input is empty
        productDivs.forEach(function (productDiv) {
            productDiv.style.display = 'block'; // Show all products if search input is empty
        });
    } else {
        productDivs.forEach(function (productDiv) {
            var productName = productDiv.querySelector('h4').textContent.toLowerCase(); // Get the product name and convert to lowercase
            if (productName.includes(searchInput)) { // Check if the product name contains the search input
                productDiv.style.display = 'block'; // Show the product if it matches
            } else {
                productDiv.style.display = 'none'; // Hide the product if it doesn't match
            }
        });
    }
}