using FintechApp.Api.Data;
using FintechApp.Api.DTOs;
using FintechApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FintechApp.Api.Services;

public class CardTagService : ICardTagService
{
    private readonly AppDbContext _db;

    public CardTagService(AppDbContext db) => _db = db;

    public async Task<List<CardTagDto>> GetAllAsync() =>
        await _db.CardTags
            .OrderBy(t => t.Name)
            .Select(t => new CardTagDto(t.Id, t.Name))
            .ToListAsync();

    public async Task<CardTagDto?> GetByIdAsync(int id)
    {
        var t = await _db.CardTags.FindAsync(id);
        return t is null ? null : new CardTagDto(t.Id, t.Name);
    }

    public async Task<CardTagDto> CreateAsync(CreateCardTagRequest req)
    {
        var exists = await _db.CardTags.AnyAsync(t => t.Name.ToLower() == req.Name.ToLower().Trim());
        if (exists) throw new InvalidOperationException($"Tag '{req.Name}' already exists.");

        var tag = new CardTag { Name = req.Name.Trim() };
        _db.CardTags.Add(tag);
        await _db.SaveChangesAsync();
        return new CardTagDto(tag.Id, tag.Name);
    }

    public async Task<CardTagDto?> UpdateAsync(int id, UpdateCardTagRequest req)
    {
        var tag = await _db.CardTags.FindAsync(id);
        if (tag is null) return null;

        tag.Name = req.Name.Trim();
        await _db.SaveChangesAsync();
        return new CardTagDto(tag.Id, tag.Name);
    }

    public async Task<bool?> DeleteAsync(int id)
    {
        var tag = await _db.CardTags.FindAsync(id);
        if (tag is null) return null;

        _db.CardTags.Remove(tag);
        await _db.SaveChangesAsync();
        return true;
    }
}
