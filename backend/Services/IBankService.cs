using FintechApp.Api.DTOs;

namespace FintechApp.Api.Services;

public interface IBankService
{
    Task<List<BankDto>> GetAllAsync();
    Task<BankDto?> GetByIdAsync(int id);
    Task<BankDto> CreateAsync(CreateBankRequest req);
    Task<BankDto?> UpdateAsync(int id, UpdateBankRequest req);
    /// <summary>Returns null if not found, throws InvalidOperationException if cards are linked.</summary>
    Task<bool?> DeleteAsync(int id);
}
