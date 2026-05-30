using FintechApp.Api.Data;
using FintechApp.Api.DTOs;
using FintechApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FintechApp.Api.Services;

public class CardTypeService : ICardTypeService
{
    private readonly AppDbContext _db;

    public CardTypeService(AppDbContext db) => _db = db;

    public async Task<List<CardTypeDto>> GetAllAsync() =>
        await _db.CardTypes
            .OrderBy(t => t.Name)
            .Select(t => new CardTypeDto(t.Id, t.Name))
            .ToListAsync();

    public async Task<CardTypeDto?> GetByIdAsync(int id)
    {
        var t = await _db.CardTypes.FindAsync(id);
        return t is null ? null : new CardTypeDto(t.Id, t.Name);
    }

    public async Task<CardTypeDto> CreateAsync(CreateCardTypeRequest req)
    {
        var exists = await _db.CardTypes.AnyAsync(t => t.Name.ToLower() == req.Name.ToLower().Trim());
        if (exists) throw new InvalidOperationException($"Card type '{req.Name}' already exists.");

        var cardType = new CardType { Name = req.Name.Trim() };
        _db.CardTypes.Add(cardType);
        await _db.SaveChangesAsync();
        return new CardTypeDto(cardType.Id, cardType.Name);
    }

    public async Task<CardTypeDto?> UpdateAsync(int id, UpdateCardTypeRequest req)
    {
        var cardType = await _db.CardTypes.FindAsync(id);
        if (cardType is null) return null;

        cardType.Name = req.Name.Trim();
        await _db.SaveChangesAsync();
        return new CardTypeDto(cardType.Id, cardType.Name);
    }

    public async Task<bool?> DeleteAsync(int id)
    {
        var cardType = await _db.CardTypes.Include(t => t.CreditCards).FirstOrDefaultAsync(t => t.Id == id);
        if (cardType is null) return null;

        if (cardType.CreditCards.Any())
            throw new InvalidOperationException(
                $"Cannot delete '{cardType.Name}' — {cardType.CreditCards.Count} card(s) use this type.");

        _db.CardTypes.Remove(cardType);
        await _db.SaveChangesAsync();
        return true;
    }
}
