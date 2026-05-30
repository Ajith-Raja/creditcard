using FintechApp.Api.DTOs;

namespace FintechApp.Api.Services;

public interface ICreditCardService
{
    Task<List<CreditCardDto>> GetAllAsync(int? bankId, int? cardTypeId, bool? isActive);
    Task<CreditCardDto?> GetByIdAsync(int id);
    Task<(CreditCardDto? dto, string? error)> CreateAsync(CreateCreditCardRequest req);
    Task<(CreditCardDto? dto, string? error)> UpdateAsync(int id, UpdateCreditCardRequest req);
    Task<bool?> DeleteAsync(int id);
}
