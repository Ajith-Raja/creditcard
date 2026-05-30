using FintechApp.Api.DTOs;
using FintechApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace FintechApp.Api.Controllers;

[ApiController]
[Route("api/credit-cards")]
[Produces("application/json")]
public class CreditCardsController : ControllerBase
{
    private readonly ICreditCardService _service;
    private readonly IWebHostEnvironment _env;

    public CreditCardsController(ICreditCardService service, IWebHostEnvironment env)
    {
        _service = service;
        _env = env;
    }

    // GET /api/credit-cards?bankId=&cardTypeId=&isActive=
    [HttpGet]
    [ProducesResponseType(typeof(List<CreditCardDto>), 200)]
    public async Task<IActionResult> GetAll(
        [FromQuery] int? bankId,
        [FromQuery] int? cardTypeId,
        [FromQuery] bool? isActive) =>
        Ok(await _service.GetAllAsync(bankId, cardTypeId, isActive));

    // GET /api/credit-cards/{id}
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(CreditCardDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        return dto is null ? NotFound(new { message = $"Credit card {id} not found." }) : Ok(dto);
    }

    // POST /api/credit-cards/upload-logo
    [HttpPost("upload-logo")]
    [ProducesResponseType(typeof(object), 200)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> UploadLogo([FromForm] IFormFile file)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded." });

        try
        {
            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var dir = Path.Combine(webRoot, "credit-cards");
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

            var ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(ext)) ext = ".png";
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(dir, fileName);

            await using var stream = System.IO.File.Create(filePath);
            await file.CopyToAsync(stream);

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var url = $"{baseUrl}/credit-cards/{fileName}";
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // POST /api/credit-cards
    [HttpPost]
    [ProducesResponseType(typeof(CreditCardDto), 201)]
    [ProducesResponseType(400)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Create([FromBody] CreateCreditCardRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Card name is required." });

        var (dto, error) = await _service.CreateAsync(req);
        if (error is not null) return NotFound(new { message = error });

        return CreatedAtAction(nameof(GetById), new { id = dto!.Id }, dto);
    }

    // PUT /api/credit-cards/{id}
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(CreditCardDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCreditCardRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Card name is required." });

        var (dto, error) = await _service.UpdateAsync(id, req);

        if (dto is null && error is null)
            return NotFound(new { message = $"Credit card {id} not found." });

        if (error is not null)
            return NotFound(new { message = error });

        return Ok(dto);
    }

    // DELETE /api/credit-cards/{id}
    [HttpDelete("{id:int}")]
    [ProducesResponseType(204)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        return result is null
            ? NotFound(new { message = $"Credit card {id} not found." })
            : NoContent();
    }
}
