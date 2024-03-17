async function addProduct() {
    const name = document.getElementById('Name').value;
    const description = document.getElementById('Description').value;
    const price = document.getElementById('Price').value * 100;
    const image = document.getElementById('Image').files[0];
    const available = document.getElementById('Available').checked;

    // Récupérer les valeurs d'ipAddress et sessionId à partir des attributs de données
    var sessionId = $("#session").data("session-id");
    var ipAddress = $("#session").data("ip-address");

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', image);
    formData.append('available', available);

    try {
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
                available: available
            };

            productData.session_id = sessionId;
            productData.ip_address = ipAddress;
            productData.user_agent = navigator.userAgent;

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

// Fonction pour convertir le prix en cents en dollars
function convertCentsToDollars(priceInCents) {
    return (priceInCents / 100).toFixed(2);
}

// Fonction pour charger les produits depuis l'API et les afficher sur la page
async function loadProducts() {
    try {
        const response = await fetch('http://127.0.0.1:5000/all_items');
        const data = await response.json();

        const productsContainer = document.getElementById('productsContainer');

        data.items.forEach(item => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('col-lg-3', 'col-sm-6', 'col-md-3');
            productDiv.innerHTML = `
                        <a href="productpage.html">
                            <div class="box-img">
                                <h4>${item.name}</h4>
                                <img src="${item.image_path}" alt="${item.name}" style="width:108px; height:112px;" />
                                <div class="price-available">
                                    <br>
                                    <span class="price">${convertCentsToDollars(item.price)} $</span>
                                    <br>
                                    <span class="availability ${item.available == '1' ? 'available' : 'unavailable'}">${item.available == '1' ? 'Disponible' : 'Indisponible'}</span>
                                </div>
                            </div>
                        </a>
                    `;
            productsContainer.appendChild(productDiv);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
    }
}

// Appeler la fonction pour charger les produits lorsque la page est chargée
window.addEventListener('DOMContentLoaded', loadProducts);