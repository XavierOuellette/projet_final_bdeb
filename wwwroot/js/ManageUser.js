$(document).ready(function () {
        // Stockage des valeurs initiales des champs éditables et du dropdown
        var initialValues = {};
        var initialRoleValue = {};

        $(".edit-button").click(function () {
            // Recupere la ligne tr plus proche
            var $row = $(this).closest("tr");
            var userId = $row.find(".id").text();

            // Vérifier si les valeurs initiales pour cet utilisateur existent déjà
            if (!initialValues[userId]) {
                initialValues[userId] = {};
            }

            // Stocker les valeurs initiales avant l'édition
            $row.find(".save").each(function () {
                var fieldName = $(this).data("field-name");
                initialValues[userId][fieldName] = $(this).text();
            });

            // Stocker la valeur initiale du dropdown
            initialRoleValue[userId] = $row.find(".role-dropdown").val();

            // Activer l'édition des champs et du dropdown
            $row.find(".editable").attr("contenteditable", "true");
            $row.find(".role-dropdown").prop("disabled", false);

            // Cacher le bouton d'édition
            $(this).hide();

            // Afficher les boutons de confirmation et d'annulation
            $row.find(".confirm-button").show();
            $row.find(".cancel-button").show();

            // Cacher le bouton de suppression
            $row.find(".delete-button").hide();
        });

        $(".cancel-button").click(function () {

            //Recupere la ligne tr plus proche
            var $row = $(this).closest("tr");
            var userId = $row.find(".id").text();

            // Remet les valeur d'origine
            $row.find(".save").each(function () {
                var fieldName = $(this).data("field-name");
                $(this).text(initialValues[userId][fieldName]);
            });

            // Remet le drop down menu a sa valeur d'origine
            $row.find(".role-dropdown").val(initialRoleValue[userId]);

            // Désactive l'édition
            $row.find(".editable").removeAttr("contenteditable");
            $row.find(".role-dropdown").prop("disabled", true);
            $(this).hide();
            $row.find(".confirm-button").hide();
            $row.find(".edit-button").show();
            $row.find(".delete-button").show();
        });

        // Récupérer les valeurs d'ipAddress et sessionId à partir des attributs de données
        var session = document.getElementById("session");
        var sessionId = session.getAttribute("session-id");
        var ipAddress = session.getAttribute("ip-address");

        $(".confirm-button").click(function () {

            var $row = $(this).closest("tr");  //Recupere la ligne tr plus proche

            // Désactiver l'édition des champs et le dropdown
            $row.find(".editable").removeAttr("contenteditable"); 
            $row.find(".role-dropdown").prop("disabled", true);

            // Cacher les boutons confirm et cancel
            $(this).hide();
            $row.find(".cancel-button").hide();

            // Afficher les boutons Edit et delete
            $row.find(".edit-button").show();
            $row.find(".delete-button").show();
            
            // Créer un objet avec les données de l'utilisateur à mettre à jour
            var userData = {
                user_id: $row.find(".id").text(),
                username: $row.find("[data-field-name='Username']").text(),
                email: $row.find("[data-field-name='Email']").text(),
                role_name: $row.find(".role-dropdown").val(),
                session_id: sessionId,
                user_agent: navigator.userAgent,
                ip_address: ipAddress
            };

            // Envoyer les données à la méthode update_user via AJAX
            $.ajax({
                url: "http://127.0.0.1:5000/update_user",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(userData),
                error: function (xhr, status, error) {

                    // Gérer les erreurs
                    console.error(error);
                    alert("Une erreur s'est produite lors de la mise à jour de l'utilisateur. Les changements seront annulés.");

                    // Rollback des changements en revenant aux valeurs initiales
                    var userId = $row.find(".id").text();
                    $row.find("[data-field-name='Username']").text(initialValues[userId]["Username"]);
                    $row.find("[data-field-name='Email']").text(initialValues[userId]["Email"]);
                    $row.find(".role-dropdown").val(initialRoleValue[userId]);
                }
            });
        });
        $(".delete-button").click(function () {
            var $row = $(this).closest("tr");

            var userData = {
                user_id: $row.find(".id").text(),
                session_id: "@sessionId",
                user_agent: navigator.userAgent,
                ip_address: "@ipAddress"
            }
            // Confirmation de suppression de l'utilisateur
            if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {

                // Envoyer une requête DELETE au service REST pour supprimer l'utilisateur
                $.ajax({
                    url: "http://127.0.0.1:5000/delete_user",
                    type: "DELETE",
                    contentType: "application/json",
                    data: JSON.stringify(userData),
                    success: function (response) {
                        // Actualiser la page ou effectuer d'autres actions après la suppression réussie
                        alert("Utilisateur supprimé avec succès.");
                        window.location.reload(); // Recharger la page pour refléter les changements
                    },
                    error: function (xhr, status, error) {
                        // Gérer les erreurs de suppression
                        console.error(error);
                        alert("Une erreur s'est produite lors de la suppression de l'utilisateur.");
                    }
                });
            }
        });
    });