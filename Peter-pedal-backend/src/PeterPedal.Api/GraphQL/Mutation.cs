using HotChocolate;
using Microsoft.EntityFrameworkCore;
using PeterPedal.Api.Data;
using PeterPedal.Api.Models;

namespace PeterPedal.Api.GraphQL;

// Every public method becomes a field on the GraphQL Mutation type.
// If the case or part does not exist, the method returns null (or false for DeleteCase).
public class Mutation
{
    public async Task<RepairCase> CreateCase(int customerId, string frameNumber, string problem,
        [Service] PeterPedalDbContext db)
    {
        var repairCase = new RepairCase { CustomerId = customerId, FrameNumber = frameNumber, Problem = problem };
        db.RepairCases.Add(repairCase);
        await db.SaveChangesAsync();
        await db.Entry(repairCase).Reference(c => c.Customer).LoadAsync();
        return repairCase;
    }

    public async Task<RepairCase?> AddPart(int caseId, int partId, [Service] PeterPedalDbContext db)
    {
        // TODO: Load the case (use Load) and the part, add the part to repairCase.Parts if it is not there already, save and return the case. Return null if either is missing.
        throw new NotImplementedException();
    }

    public async Task<RepairCase?> CalculateOffer(int caseId, [Service] PeterPedalDbContext db)
    {
        // TODO: Set repairCase.Price with PriceCalculator.CalculateOffer, save and return the case (null if missing).
        throw new NotImplementedException();
    }

    public async Task<RepairCase?> SetStatus(int caseId, CaseStatus status, [Service] PeterPedalDbContext db)
    {
        var repairCase = await Load(db, caseId);
        if (repairCase is null)
        {
            return null;
        }
        repairCase.Status = status;
        await db.SaveChangesAsync();
        return repairCase;
    }

    public async Task<bool> DeleteCase(int caseId, [Service] PeterPedalDbContext db)
    {
        // TODO: Delete the case and return true, or false if it does not exist.
        throw new NotImplementedException();
    }

    private static Task<RepairCase?> Load(PeterPedalDbContext db, int caseId) =>
        db.RepairCases.Include(c => c.Customer).Include(c => c.Parts)
            .FirstOrDefaultAsync(c => c.Id == caseId);
}
