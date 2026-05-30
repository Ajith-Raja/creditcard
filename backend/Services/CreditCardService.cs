using FintechApp.Api.Data;
using FintechApp.Api.DTOs;
using FintechApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FintechApp.Api.Services;

public class CreditCardService : ICreditCardService
{
    private readonly AppDbContext _db;

    public CreditCardService(AppDbContext db) => _db = db;

    public async Task<List<CreditCardDto>> GetAllAsync(int? bankId, int? cardTypeId, bool? isActive)
    {
        var query = _db.CreditCards
            .Include(c => c.Bank)
            .Include(c => c.CardType)
            .Include(c => c.Tags)
            .AsQueryable();

        if (bankId.HasValue)     query = query.Where(c => c.BankId == bankId.Value);
        if (cardTypeId.HasValue) query = query.Where(c => c.CardTypeId == cardTypeId.Value);
        if (isActive.HasValue)   query = query.Where(c => c.IsActive == isActive.Value);

        return await query.OrderBy(c => c.Name).Select(c => ToDto(c)).ToListAsync();
    }

    public async Task<CreditCardDto?> GetByIdAsync(int id)
    {
        var card = await _db.CreditCards
            .Include(c => c.Bank)
            .Include(c => c.CardType)
            .Include(c => c.Tags)
            .FirstOrDefaultAsync(c => c.Id == id);

        return card is null ? null : ToDto(card);
    }

    public async Task<(CreditCardDto? dto, string? error)> CreateAsync(CreateCreditCardRequest req)
    {
        var bank = await _db.Banks.FindAsync(req.BankId);
        if (bank is null) return (null, $"Bank {req.BankId} not found.");

        var cardType = await _db.CardTypes.FindAsync(req.CardTypeId);
        if (cardType is null) return (null, $"Card type {req.CardTypeId} not found.");

        var tags = await _db.CardTags.Where(t => req.TagIds.Contains(t.Id)).ToListAsync();

        var card = new CreditCard
        {
            Name = req.Name.Trim(),
            BankId = req.BankId,
            Bank = bank,
            CardTypeId = req.CardTypeId,
            CardType = cardType,
            JoiningFee = req.JoiningFee,
            AnnualFee = req.AnnualFee,
                Rewards = req.Rewards?.Trim() ?? string.Empty,
                StructuredFeesandChargesJson = req.StructuredFeesandChargesJson?.Trim() ?? string.Empty,
                EligibilityHtml = req.EligibilityHtml?.Trim() ?? string.Empty,
                DocumentsRequiredHtml = req.DocumentsRequiredHtml?.Trim() ?? string.Empty,
                FaqHtml = req.FaqHtml?.Trim() ?? string.Empty,
                FaqJson = req.FaqJson?.Trim() ?? string.Empty,
                ApplyLink = req.ApplyLink?.Trim() ?? string.Empty,
            ImageUrl = req.ImageUrl?.Trim() ?? string.Empty,
            IsActive = req.IsActive,
            CreatedAt = DateTime.UtcNow,
            Tags = tags
        };

        _db.CreditCards.Add(card);
        await _db.SaveChangesAsync();
        return (ToDto(card), null);
    }

    public async Task<(CreditCardDto? dto, string? error)> UpdateAsync(int id, UpdateCreditCardRequest req)
    {
        var card = await _db.CreditCards
            .Include(c => c.Bank)
            .Include(c => c.CardType)
            .Include(c => c.Tags)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (card is null) return (null, null); // null error = not found

        var bank = await _db.Banks.FindAsync(req.BankId);
        if (bank is null) return (null, $"Bank {req.BankId} not found.");

        var cardType = await _db.CardTypes.FindAsync(req.CardTypeId);
        if (cardType is null) return (null, $"Card type {req.CardTypeId} not found.");

        var tags = await _db.CardTags.Where(t => req.TagIds.Contains(t.Id)).ToListAsync();

        card.Name = req.Name.Trim();
        card.BankId = req.BankId;
        card.Bank = bank;
        card.CardTypeId = req.CardTypeId;
        card.CardType = cardType;
        card.JoiningFee = req.JoiningFee;
        card.AnnualFee = req.AnnualFee;
        card.Rewards = req.Rewards?.Trim() ?? string.Empty;
        card.StructuredFeesandChargesJson = req.StructuredFeesandChargesJson?.Trim() ?? string.Empty;
        card.EligibilityHtml = req.EligibilityHtml?.Trim() ?? string.Empty;
        card.DocumentsRequiredHtml = req.DocumentsRequiredHtml?.Trim() ?? string.Empty;
        card.FaqHtml = req.FaqHtml?.Trim() ?? string.Empty;
        card.FaqJson = req.FaqJson?.Trim() ?? string.Empty;
        card.ApplyLink = req.ApplyLink?.Trim() ?? string.Empty;
        card.ImageUrl = req.ImageUrl?.Trim() ?? string.Empty;
        card.IsActive = req.IsActive;
        card.Tags = tags;

        await _db.SaveChangesAsync();
        return (ToDto(card), null);
    }

    public async Task<bool?> DeleteAsync(int id)
    {
        var card = await _db.CreditCards.FindAsync(id);
        if (card is null) return null;

        _db.CreditCards.Remove(card);
        await _db.SaveChangesAsync();
        return true;
    }

    private static CreditCardDto ToDto(CreditCard c) => new(
        c.Id, c.Name,
        c.BankId, c.Bank?.Name ?? string.Empty,
        c.CardTypeId, c.CardType?.Name ?? string.Empty,
        c.JoiningFee, c.AnnualFee,
        c.Rewards, c.StructuredFeesandChargesJson, c.EligibilityHtml, c.DocumentsRequiredHtml, c.FaqHtml, c.FaqJson, c.ApplyLink, c.ImageUrl, c.IsActive, c.CreatedAt,
        (c.Tags ?? Enumerable.Empty<CardTag>()).Select(t => new CardTagDto(t.Id, t.Name)).ToList()
    );
}
