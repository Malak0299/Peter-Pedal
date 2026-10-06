using System.ComponentModel.DataAnnotations;

namespace PeterPedal.Api.Models;

public class SparePart
{
    public int Id { get; set; }
    [Required] public string Name { get; set; } = "";
    public decimal Price { get; set; }
}
