using HotChocolate;
using Microsoft.EntityFrameworkCore;
using PeterPedal.Api.Data;
using PeterPedal.Api.Models;

namespace PeterPedal.Api.GraphQL;

// Every public method becomes a field on the GraphQL Query type.
public class Query
{
    public async Task<List<RepairCase>> RepairCases([Service] PeterPedalDbContext db) =>
        await db.RepairCases.Include(c => c.Customer).Include(c => c.Parts)
            .OrderBy(c => c.Id).ToListAsync();

    public async Task<RepairCase?> RepairCase(int id, [Service] PeterPedalDbContext db) =>
        await db.RepairCases.Include(c => c.Customer).Include(c => c.Parts)
            .FirstOrDefaultAsync(c => c.Id == id);
}
