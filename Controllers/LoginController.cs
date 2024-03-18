using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Projet_Finale.Auth;
using Projet_Finale.Models;
using System.Text;

namespace Projet_Finale.Controllers
{
	public class LoginController : Controller
	{
        private readonly HttpClient _httpClient = new HttpClient();

        public LoginController()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("http://127.0.0.1:5000");
        }

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
					return RedirectToAction("Index", "Home");
				}
			}

			return View(credentials);
		}

		[HttpPost]
		public async Task<IActionResult> Login(Credentials credentials)
		{
            string? sessionId = Request.Cookies["session_id"];
            string? userAgent = Request.Headers["User-Agent"];
            string? ipAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();

			// Si il nous manque des infos OU une session existe déja, retourne sur index
            if (userAgent == null || ipAddress == null || sessionId != null)
            {
                return RedirectToAction("Index", "Home");
            }

			// Requête sur l'API pour approuver le login
            var requestData = new Dictionary<string, string>
            {
				{"username", credentials.Username},
				{"password", credentials.Password},
                {"user_agent", userAgent},
                {"ip_address", ipAddress}
            };
            var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
            HttpResponseMessage response = await _httpClient.PostAsync("/validate_login", content);

            // Si la requête est approuvée
            if (response.IsSuccessStatusCode)
            {
                string jsonResponse = await response.Content.ReadAsStringAsync();
                dynamic? responseObject = JsonConvert.DeserializeObject(jsonResponse);

                string? newSessionId = responseObject?.session_id;
				if(newSessionId == null)
				{
                    // Si on arrive ici, problème avec les données recu du serveur
                    return RedirectToAction("Index", "Home");
				}
                
				Response.Cookies.Append("session_id", newSessionId);
			}
            return RedirectToAction("Index", "Home");
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

        [HttpGet]
        public async Task<IActionResult> Disconnect()
        {
            SessionData session = new SessionData(Response.HttpContext);

            if (session.IsValid)
            {
                // Requête sur l'API pour approuver le login
                var requestData = new Dictionary<string, string>
            {
                {"session_id", session.SessionID},
                {"user_agent", session.UserAgent},
                {"ip_address", session.IpAddress}
            };
                var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
                HttpResponseMessage response = await _httpClient.PostAsync("/disconnect", content);

                if (response.IsSuccessStatusCode)
                {
                    Response.Cookies.Delete("session_id");
                }
                return RedirectToAction("Index", "Home");
            }
            else
            {
                // Ne devrais jamais aller ici
                return RedirectToAction("Index", "Home");
            }
        }
    }
}
