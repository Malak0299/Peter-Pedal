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
        //Returns the spare part with the given id, or 404 Not Found.
        var spareParts = await _db.SpareParts.FindAsync(id);

        if (spareParts == null)
            return NotFound();
        
        return spareParts; 
    }

    [HttpPost]
    public async Task<ActionResult<SparePart>> Create(SparePart part)
    {
        //Saves the new spare part and returns 201 Created.
        _db.SpareParts.Add(part);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new {id = part.Id}, part);
        
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SparePart>> Update(int id, SparePart part)
    {
        //Updates name and price and returns the spare part, or 404 Not Found.
        var existing = await _db.SpareParts.FindAsync(id);
        
        if (existing == null)
            return NotFound();

        existing.Name = part.Name;
        existing.Price = part.Price;
        await _db.SaveChangesAsync();

        return existing;
    }
    
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        //Deletes the spare part and returns 204 No Content, or 404 Not Found.
        var part = await _db.SpareParts.FindAsync(id);

        if (part == null)
            return NotFound();
        
        _db.SpareParts.Remove(part);
        await _db.SaveChangesAsync();

        return NoContent();
        
    }
}
