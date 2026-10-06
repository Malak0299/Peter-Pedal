using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeterPedal.Api.Data;
using PeterPedal.Api.Models;

namespace PeterPedal.Api.Controllers;

[ApiController]
[Route("api/spareparts")]
public class SparePartsController : ControllerBase
{
    private readonly PeterPedalDbContext _db;

    public SparePartsController(PeterPedalDbContext db) => _db = db;
    
    [HttpGet]
    public async Task<List<SparePart>> GetAll() =>
        await _db.SpareParts.OrderBy(p => p.Id).ToListAsync();
    
    [HttpGet("{id}")]
    public async Task<ActionResult<SparePart>> GetById(int id)
    {
        // TODO: Return the spare part with the given id, or 404 Not Found.
        var spareParts = await _db.SpareParts.FindAsync(id);

        if (spareParts == null)
            return NotFound();
        
        return spareParts; 
    }

    [HttpPost]
    public async Task<ActionResult<SparePart>> Create(SparePart part)
    {
        // TODO: Save the new spare part and return 201 Created.
        _db.SpareParts.Add(part);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new {id = part.Id}, part);
        
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SparePart>> Update(int id, SparePart input)
    {
        // TODO: Update name and price and return the spare part, or 404 Not Found.
        throw new NotImplementedException();
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        // TODO: Delete the spare part and return 204 No Content, or 404 Not Found.
        throw new NotImplementedException();
    }
}
