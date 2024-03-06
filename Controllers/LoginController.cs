using Microsoft.AspNetCore.Mvc;
using Projet_Finale.Models;

namespace Projet_Finale.Controllers
{
	public class LoginController : Controller
	{
		public IActionResult Login()
		{
			return View();
		}

        public IActionResult CreateAcc()
        {
            return View();
        }

		[HttpPost]
		//retour des éléments dépendament de l'authentification 
		public IActionResult CreateAcc(Credentials credentials)
		{
			if (ModelState.IsValid)
			{
				bool isValid = ValidateCredentials(credentials.Username, credentials.Password, credentials.PasswordValidate);
				if (isValid)
				{
					//test
					return RedirectToAction("Index", "Home");
				}
			}

			return View(credentials);
		}

		[HttpPost]
		public IActionResult Login(Credentials credentials)
		{
			if (true) // <-- Logique à mettre pour aller rechercher dans la BD
            {
				return RedirectToAction("Index", "Home");
			}
			return View(credentials);
		}

		//logique d'authentification (TEST) 
		private bool ValidateCredentials (string username, string password, string passwordValidate)
		{
			if (password.Equals(passwordValidate)) // <-- Logique à mettre pour aller écrire dans la BD
            {
				return true;
			}
			return false;
		}
    }
}
