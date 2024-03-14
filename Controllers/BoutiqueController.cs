using Microsoft.AspNetCore.Mvc;
using Projet_Finale.Models;
using System;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Projet_Finale.Controllers
{
    public class BoutiqueController : Controller
    {
        public IActionResult Boutique()
        {
            return View();
        }
        public IActionResult AddProduct()
        {
            return View();
        }

        private readonly IWebHostEnvironment _webHostEnvironment;

        public BoutiqueController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        // Méthode pour télécharger l'image
        [HttpPost]
        public async Task<IActionResult> UploadImage()
        {
            try
            {
                var file = Request.Form.Files[0]; // Récupérer le fichier depuis la requête

                if (file == null || file.Length == 0)
                {
                    return BadRequest("Aucun fichier sélectionné.");
                }

                var uploadsFolder = Path.Combine(_webHostEnvironment.WebRootPath, "images/Boutique");

                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(file.FileName);
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                // Déplacer le fichier vers le dossier de destination
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(fileStream);
                }

                var imagePath = "/images/Boutique/" + uniqueFileName;
                return Ok(imagePath); // Retourner le chemin de l'image
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Une erreur s'est produite lors du téléchargement de l'image : {ex.Message}");
            }
        }

    }
}
