using FintechApp.Api.DTOs;
using FintechApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FintechApp.Api.Controllers;

[ApiController]
[Route("api/card-tags")]
[Produces("application/json")]
public class CardTagsController : ControllerBase
{
    private readonly ICardTagService _service;

    public CardTagsController(ICardTagService service) => _service = service;

    // GET /api/card-tags
    [HttpGet]
    [ProducesResponseType(typeof(List<CardTagDto>), 200)]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    // GET /api/card-tags/{id}
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CardTagDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        return dto is null ? NotFound(new { message = $"Tag {id} not found." }) : Ok(dto);
    }

    // POST /api/card-tags
    [HttpPost]
    [ProducesResponseType(typeof(CardTagDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CreateCardTagRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Tag name is required." });

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

    // PUT /api/card-tags/{id}
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(CardTagDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCardTagRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Tag name is required." });

        var dto = await _service.UpdateAsync(id, req);
        return dto is null ? NotFound(new { message = $"Tag {id} not found." }) : Ok(dto);
    }

    // DELETE /api/card-tags/{id}
    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        return result is null ? NotFound(new { message = $"Tag {id} not found." }) : NoContent();
    }
}
