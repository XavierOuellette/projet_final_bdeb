using Microsoft.AspNetCore.Mvc;
using Projet_Finale.Models;
using System.Diagnostics;
using Newtonsoft.Json;

namespace Projet_Finale.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public async Task<IActionResult> Index()
        {
            try
            {
                using (var client = new HttpClient())
                {
                    // Remplacez l'URL ci-dessous par l'URL de votre API Flask
                    string url = "http://localhost:5000/connexion";
                    HttpResponseMessage response = await client.GetAsync(url);
                    response.EnsureSuccessStatusCode(); // Lève une exception si la requête n'a pas réussi

                    // Traitement de la réponse JSON
                    string jsonResponse = await response.Content.ReadAsStringAsync();
                    dynamic data = JsonConvert.DeserializeObject(jsonResponse);
                    string message = data.message;

                    ViewBag.Message = message;
                }
            }
            catch (HttpRequestException e)
            {
                // Gestion des erreurs de requête HTTP
                ViewBag.Error = "Une erreur s'est produite lors de la communication avec l'API : " + e.Message;
            }

            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}