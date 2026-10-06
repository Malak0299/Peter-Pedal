using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PeterPedal.Api.Data;
using PeterPedal.Api.Models;

namespace PeterPedal.Api.Controllers;

[ApiController]
[Route("api/customers")]
public class CustomersController : ControllerBase
{
    private readonly PeterPedalDbContext _db;

    public CustomersController(PeterPedalDbContext db) => _db = db;

    [HttpGet]
    public async Task<List<Customer>> GetAll() =>
        await _db.Customers.OrderBy(c => c.Id).ToListAsync();

    [HttpGet("{id}")]
    public async Task<ActionResult<Customer>> GetById(int id)
    {
        var customer = await _db.Customers.FindAsync(id);
        if (customer is null)
        {
            return NotFound();
        }
        return customer;
    }

    [HttpPost]
    public async Task<ActionResult<Customer>> Create(Customer customer)
    {
        customer.Id = 0; // the database assigns the id
        _db.Customers.Add(customer);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = customer.Id }, customer);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Customer>> Update(int id, Customer input)
    {
        var customer = await _db.Customers.FindAsync(id);
        if (customer is null)
        {
            return NotFound();
        }
        customer.FirstName = input.FirstName;
        customer.LastName = input.LastName;
        customer.Phone = input.Phone;
        await _db.SaveChangesAsync();
        return customer;
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var customer = await _db.Customers.FindAsync(id);
        if (customer is null)
        {
            return NotFound();
        }
        _db.Customers.Remove(customer);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
