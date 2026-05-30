using FintechApp.Api.DTOs;

namespace FintechApp.Api.Services;

public interface ICardTypeService
{
    Task<List<CardTypeDto>> GetAllAsync();
    Task<CardTypeDto?> GetByIdAsync(int id);
    Task<CardTypeDto> CreateAsync(CreateCardTypeRequest req);
    Task<CardTypeDto?> UpdateAsync(int id, UpdateCardTypeRequest req);
    Task<bool?> DeleteAsync(int id);
}
