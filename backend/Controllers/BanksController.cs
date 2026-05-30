using FintechApp.Api.DTOs;
using FintechApp.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.IO;

namespace FintechApp.Api.Controllers;

[ApiController]
[Route("api/banks")]
[Produces("application/json")]
public class BanksController : ControllerBase
{
    private readonly IBankService _service;
    private readonly IWebHostEnvironment _env;

    public BanksController(IBankService service, IWebHostEnvironment env)
    {
        _service = service;
        _env = env;
    }

    // POST /api/banks/upload-logo
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
            var dir = Path.Combine(webRoot, "bank-logos");
            if (!Directory.Exists(dir)) Directory.CreateDirectory(dir);

            var ext = Path.GetExtension(file.FileName);
            if (string.IsNullOrEmpty(ext)) ext = ".png";
            var fileName = $"{Guid.NewGuid()}{ext}";
            var filePath = Path.Combine(dir, fileName);

            await using var stream = System.IO.File.Create(filePath);
            await file.CopyToAsync(stream);

            var baseUrl = $"{Request.Scheme}://{Request.Host}";
            var url = $"{baseUrl}/bank-logos/{fileName}";
            return Ok(new { url });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET /api/banks
    [HttpGet]
    [ProducesResponseType(typeof(List<BankDto>), 200)]
    public async Task<IActionResult> GetAll() =>
        Ok(await _service.GetAllAsync());

    // GET /api/banks/{id}
    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(BankDto), 200)]
    [ProducesResponseType(404)]
    public async Task<IActionResult> GetById(int id)
    {
        var dto = await _service.GetByIdAsync(id);
        return dto is null ? NotFound(new { message = $"Bank {id} not found." }) : Ok(dto);
    }

    // POST /api/banks
    [HttpPost]
    [ProducesResponseType(typeof(BankDto), 201)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Create([FromBody] CreateBankRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Bank name is required." });

        var dto = await _service.CreateAsync(req);
        return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
    }

    // PUT /api/banks/{id}
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(BankDto), 200)]
    [ProducesResponseType(404)]
    [ProducesResponseType(400)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBankRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            return BadRequest(new { message = "Bank name is required." });

        var dto = await _service.UpdateAsync(id, req);
        return dto is null ? NotFound(new { message = $"Bank {id} not found." }) : Ok(dto);
    }

    // DELETE /api/banks/{id}
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
                ? NotFound(new { message = $"Bank {id} not found." })
                : NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
    }
}
