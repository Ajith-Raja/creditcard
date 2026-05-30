using FintechApp.Api.Data;
using FintechApp.Api.DTOs;
using FintechApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FintechApp.Api.Services;

public class BankService : IBankService
{
    private readonly AppDbContext _db;

    public BankService(AppDbContext db) => _db = db;

    public async Task<List<BankDto>> GetAllAsync() =>
        await _db.Banks
            .OrderBy(b => b.Name)
            .Select(b => ToDto(b))
            .ToListAsync();

    public async Task<BankDto?> GetByIdAsync(int id)
    {
        var bank = await _db.Banks.FindAsync(id);
        return bank is null ? null : ToDto(bank);
    }

    public async Task<BankDto> CreateAsync(CreateBankRequest req)
    {
        var bank = new Bank
        {
            Name = req.Name.Trim(),
            Slug = req.Slug.Trim(),
            Website = req.Website.Trim(),
            Email = string.IsNullOrWhiteSpace(req.Email) ? null : req.Email!.Trim(),
            ContactNumber = string.IsNullOrWhiteSpace(req.ContactNumber) ? null : req.ContactNumber!.Trim(),
            LogoUrl = req.LogoUrl.Trim(),
            CreatedAt = DateTime.UtcNow
        };
        _db.Banks.Add(bank);
        await _db.SaveChangesAsync();
        return ToDto(bank);
    }

    public async Task<BankDto?> UpdateAsync(int id, UpdateBankRequest req)
    {
        var bank = await _db.Banks.FindAsync(id);
        if (bank is null) return null;

        bank.Name = req.Name.Trim();
        bank.Slug = req.Slug.Trim();
        bank.Website = req.Website.Trim();
        bank.Email = string.IsNullOrWhiteSpace(req.Email) ? null : req.Email!.Trim();
        bank.ContactNumber = string.IsNullOrWhiteSpace(req.ContactNumber) ? null : req.ContactNumber!.Trim();
        bank.LogoUrl = req.LogoUrl.Trim();
        await _db.SaveChangesAsync();
        return ToDto(bank);
    }

    public async Task<bool?> DeleteAsync(int id)
    {
        var bank = await _db.Banks.Include(b => b.CreditCards).FirstOrDefaultAsync(b => b.Id == id);
        if (bank is null) return null;

        if (bank.CreditCards.Any())
            throw new InvalidOperationException(
                $"Cannot delete '{bank.Name}' — it has {bank.CreditCards.Count} associated credit card(s). Remove the cards first.");

        _db.Banks.Remove(bank);
        await _db.SaveChangesAsync();
        return true;
    }

    private static BankDto ToDto(Bank b) =>
        new(b.Id, b.Name, b.Slug, b.Website, b.Email, b.ContactNumber, b.LogoUrl, b.CreatedAt);
}
