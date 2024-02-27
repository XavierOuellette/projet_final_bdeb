using System.ComponentModel.DataAnnotations;

namespace Projet_Finale.Models
{
    public class Credentials
    {

        //on ajoute des parametres html pour gerer la validation directement dans nos attributs de notre classe credentials
        [Required(ErrorMessage = "Le nom d'utilisateur est requis.")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Le mot de passe est requis.")]
        [RegularExpression("^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!#$%^&*()-_+=])[A-Za-z\\d!#$%^&*()-_+=]{8,25}$", ErrorMessage = "Le format est invalide.")]
        public string Password { get; set; }

        [Required(ErrorMessage = "La confirmation est requise.")]
        [Compare("Password", ErrorMessage = "Les mots de passe ne correspondent pas.")]
        public string PasswordValidate { get; set; }
    }
}
