namespace PeterPedal.Api.Models;

public class RepairCase
{
    public int Id { get; set; }
    public string FrameNumber { get; set; } = "";
    public string Problem { get; set; } = "";
    public CaseStatus Status { get; set; } = CaseStatus.Created;
    public decimal? Price { get; set; } // null until the offer has been calculated
    public int CustomerId { get; set; }
    public Customer? Customer { get; set; }
    public List<SparePart> Parts { get; set; } = new();
}
