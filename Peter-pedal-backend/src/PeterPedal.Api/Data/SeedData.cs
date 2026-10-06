using PeterPedal.Api.Models;

namespace PeterPedal.Api.Data;

public static class SeedData
{
    public static void Seed(PeterPedalDbContext db)
    {
        // Any existing row means "not a fresh database" (e.g. Egon was deleted in a demo): do not re-seed.
        if (db.Customers.Any() || db.SpareParts.Any() || db.RepairCases.Any())
        {
            return;
        }

        var egon = new Customer { FirstName = "Egon", LastName = "Cykelmyggen", Phone = "20123456" };

        db.SpareParts.AddRange(
            new SparePart { Name = "Gear cable", Price = 150m },
            new SparePart { Name = "Sprocket", Price = 300m },
            new SparePart { Name = "Brake pads", Price = 120m });

        db.RepairCases.Add(new RepairCase
        {
            FrameNumber = "STL-4471",
            Problem = "The gears are not shifting properly and the bike is almost impossible to ride.",
            Customer = egon
        });

        db.SaveChanges();
    }
}
