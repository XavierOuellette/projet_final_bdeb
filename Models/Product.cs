using System.ComponentModel.DataAnnotations;

namespace Projet_Finale.Models
{
    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Price { get; set; }

        public string ImagePath { get; set; }

        public bool Available { get; set; }
    }
}
