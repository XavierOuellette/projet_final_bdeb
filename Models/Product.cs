using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Projet_Finale.Models
{
    public class ProductList
    {
        public List<Product> Products { get; set; }
    }

    public class Product
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        [DataType(DataType.Currency)]
        public int Price { get; set; }

        [JsonProperty("image_path")]
        public string Image_Path { get; set; }

        [JsonConverter(typeof(BooleanConverter))]
        public bool Available { get; set; }
    }

    public class BooleanConverter : JsonConverter<bool>
    {
        public override bool ReadJson(JsonReader reader, Type objectType, bool existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            string value = reader.Value.ToString();
            return value == "1";
        }

        public override void WriteJson(JsonWriter writer, bool value, JsonSerializer serializer)
        {
            writer.WriteValue(value ? "1" : "0");
        }
    }
}
