using FintechApp.Api.DTOs;

namespace FintechApp.Api.Services;

public interface ICardTagService
{
    Task<List<CardTagDto>> GetAllAsync();
    Task<CardTagDto?> GetByIdAsync(int id);
    Task<CardTagDto> CreateAsync(CreateCardTagRequest req);
    Task<CardTagDto?> UpdateAsync(int id, UpdateCardTagRequest req);
    Task<bool?> DeleteAsync(int id);
}
