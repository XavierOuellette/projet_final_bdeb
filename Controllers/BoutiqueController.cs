using Microsoft.AspNetCore.Mvc;
using Projet_Finale.Models;

namespace Projet_Finale.Controllers
{
    public class BoutiqueController : Controller
    {
        public IActionResult Boutique()
        {
            return View();
        }
        public IActionResult AjoutItem(Product model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Vérifier si un fichier est téléchargé
                    if (model.Image != null && model.Image.Length > 0)
                    {
                        // Enregistrer l'image dans le dossier wwwroot/images
                        var uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(model.Image.FileName);
                        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", uniqueFileName);
                        using (var fileStream = new FileStream(filePath, FileMode.Create))
                        {
                            model.Image.CopyTo(fileStream);
                        }

                        // Mettre à jour le chemin de l'image dans le modèle
                        model.ImagePath = "/images/" + uniqueFileName;
                    }

                }
            }
            return View();
        }
    }
}
