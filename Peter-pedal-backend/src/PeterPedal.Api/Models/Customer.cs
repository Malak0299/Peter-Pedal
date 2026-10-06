using System.ComponentModel.DataAnnotations;

namespace PeterPedal.Api.Models;

public class Customer
{
    public int Id { get; set; }

    // [Required] makes [ApiController] answer 400 Bad Request when the field is missing or empty.
    [Required] public string FirstName { get; set; } = "";
    [Required] public string LastName { get; set; } = "";
    [Required] public string Phone { get; set; } = "";
}
