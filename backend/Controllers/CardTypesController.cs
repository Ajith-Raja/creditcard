using FintechApp.Api.DTOs;
using FintechApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FintechApp.Api.Controllers;

[ApiController]
[Route("api/card-types")]
[Produces("application/json")]
public class CardTypesController : ControllerBase
{
    private readonly ICardTypeService _service;

    public CardTypesController(ICardTypeService service) => _service = service;

    // GET /api/card-types
    [HttpGet]
    [ProducesResponseType(typeof(List<CardTypeDto>), 200)]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    // GET /api/card-types/{id}
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CardTypeDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        return dto is null ? NotFound(new { message = $"Card type {id} not found." }) : Ok(dto);
    }

    // POST /api/card-types
    [HttpPost]
    [ProducesResponseType(typeof(CardTypeDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CreateCardTypeRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Card type name is required." });

        try
        {
            var dto = await _service.CreateAsync(req);
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT /api/card-types/{id}
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(CardTypeDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCardTypeRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Card type name is required." });

        var dto = await _service.UpdateAsync(id, req);
        return dto is null ? NotFound(new { message = $"Card type {id} not found." }) : Ok(dto);
    }

    // DELETE /api/card-types/{id}
    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    [ProducesResponseType(409)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _service.DeleteAsync(id);
            return result is null
                ? NotFound(new { message = $"Card type {id} not found." })
                : NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
