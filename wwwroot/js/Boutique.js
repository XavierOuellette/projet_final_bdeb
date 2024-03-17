async function addProduct() {
    const name = document.getElementById('Name').value;
    const description = document.getElementById('Description').value;
    const price = document.getElementById('Price').value * 100;
    const image = document.getElementById('Image').files[0];
    const available = document.getElementById('Available').checked;

    // Récupérer les valeurs d'ipAddress et sessionId à partir des attributs de données
    var session = document.getElementById("session");
    var sessionId = $("#session").attr("session-id");
    var ipAddress = $("#session").attr("ip-address");

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
                session_id: sessionId,
                ip_address: ipAddress,
                user_agent: navigator.userAgent
            };

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

function addSessionAndUserAgentData(productData, sessionId, ipAddress) {
    productData.session_id = sessionId;
    productData.ip_address = ipAddress;
    productData.user_agent = navigator.userAgent;
    return productData;
}

function convertCentsToDollars(priceInCents) {
    // Fonction pour convertir le prix en cents en dollars
    return (priceInCents / 100).toFixed(2);
}


async function loadProducts() {
    // Fonction pour charger les produits depuis l'API et les afficher sur la page
    try {
        const response = await fetch('http://127.0.0.1:5000/all_items');
        const data = await response.json();

        const productsContainer = document.getElementById('productsContainer');

        data.items.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('col-lg-3', 'col-sm-6', 'col-md-3', 'productDiv');
            productDiv.innerHTML = `
                            <div class="box-img">
                                <h4>${item.name}</h4>
                                <img src="${item.image_path}" alt="${item.name}" style="width:108px; height:112px;" />
                                <div class="price-available">
                                    <br>
                                    <span class="price">${convertCentsToDollars(item.price)} $</span>
                                    <br>
                                    <span class="availability ${item.available == '1' ? 'available' : 'unavailable'}">${item.available == '1' ? 'Disponible' : 'Indisponible'}</span>
                                    <div class="description" style="display: none;">
                                        <br>
                                        ${item.description}
                                    </div>
                                    <br>
                                    <button class="edit-button" style="display: none;">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="delete-button" style="display: none;">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                    `;
            // Ajouter un gestionnaire d'événements pour agrandir le productDiv et afficher la description
            productDiv.onclick = function (event) {
                const descriptionDiv = this.querySelector('.description');
                const editButton = this.querySelector('.edit-button');
                const deleteButton = this.querySelector('.delete-button');

                if (descriptionDiv.style.display === 'none') {
                    $(descriptionDiv).slideDown();
                    $(editButton).slideDown();
                    $(deleteButton).slideDown();
                } else {
                    $(descriptionDiv).slideUp();
                    $(editButton).slideUp();
                    $(deleteButton).slideUp();
                }
            }

            // Ajouter un gestionnaire d'événements pour le bouton delete
            $(document).ready(function () {
                var sessionId = $("#productData").data("session-id");
                var ipAddress = $("#productData").data("ip-address");

                // Ajouter un gestionnaire d'événements pour le bouton delete
                console.log(1)
                $(".delete-button").on("click", function (event) {
                    event.stopPropagation(); // Arrêter la propagation de l'événement de clic
                    console.log(2)
                    if (confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
                        console.log(3)
                        // Récupérer l'ID de l'élément à partir des données de l'élément lui-même
                        var itemId = $(this).closest('.box-img').data('item-id');
                        console.log(itemId)
                        // Créer un objet avec les données nécessaires
                        var productData = {
                            id: itemId,
                        };
                        productData = addSessionAndUserAgentData(productData, sessionId, ipAddress);
                        console.log(itemData)
                        // Envoyer les données à la méthode delete_item via AJAX
                        $.ajax({
                            url: "http://127.0.0.1:5000/delete_item",
                            type: "DELETE",
                            contentType: "application/json",
                            data: JSON.stringify(itemData),
                            success: function (response) {
                                // Traiter la réponse de suppression réussie
                                alert(response.message);
                                // Actualiser ou effectuer d'autres actions après la suppression réussie
                            },
                            error: function (xhr, status, error) {
                                // Gérer les erreurs de suppression
                                console.error(error);
                                alert("Une erreur s'est produite lors de la suppression de l'élément.");
                            }
                        });
                    }
                });
            });
            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
    }
}
// Appeler la fonction pour charger les produits lorsque la page est chargée
window.addEventListener('DOMContentLoaded', loadProducts);
