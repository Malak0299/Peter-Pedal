namespace PeterPedal.Api.Models;

public static class PriceCalculator
{
    private const decimal PartMarkup = 1.10m;
    private const decimal HourlyRate = 450m;
    private const decimal Hours = 2m;
    private const decimal Vat = 1.25m;

    // (sum of part prices x markup + labour) x VAT
    public static decimal CalculateOffer(IEnumerable<SparePart> parts) =>
        (parts.Sum(part => part.Price) * PartMarkup + HourlyRate * Hours) * Vat;
}
