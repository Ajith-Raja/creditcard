using System.Text.Json.Serialization;

namespace FintechApp.Api.DTOs;

// ── Bank DTOs ──────────────────────────────────────────────────────────────

public record BankDto(int Id, string Name, string Slug, string Website, string? Email, string? ContactNumber, string LogoUrl, DateTime CreatedAt);

public record CreateBankRequest(
    string Name,
    string Slug,
    string Website,
    string? Email,
    string? ContactNumber,
    string LogoUrl
);

public record UpdateBankRequest(
    string Name,
    string Slug,
    string Website,
    string? Email,
    string? ContactNumber,
    string LogoUrl
);

// ── CardType DTOs ──────────────────────────────────────────────────────────

public record CardTypeDto(int Id, string Name);

public record CreateCardTypeRequest(string Name);

public record UpdateCardTypeRequest(string Name);

// ── CardTag DTOs ───────────────────────────────────────────────────────────

public record CardTagDto(int Id, string Name);

public record CreateCardTagRequest(string Name);

public record UpdateCardTagRequest(string Name);

// ── CreditCard DTOs ────────────────────────────────────────────────────────

public record CreditCardDto(
    int Id,
    string Name,
    int BankId,
    string BankName,
    int CardTypeId,
    string CardTypeName,
    decimal JoiningFee,
    decimal AnnualFee,
    string Rewards,
    [property: JsonPropertyName("structuredRewardsJson")] string StructuredFeesandChargesJson,
    string EligibilityHtml,
    string DocumentsRequiredHtml,
    string FaqHtml,
    string FaqJson,
    string ApplyLink,
    string ImageUrl,
    bool IsActive,
    DateTime CreatedAt,
    List<CardTagDto> Tags
);

public record CreateCreditCardRequest(
    string Name,
    int BankId,
    int CardTypeId,
    decimal JoiningFee,
    decimal AnnualFee,
    string Rewards,
    [property: JsonPropertyName("structuredRewardsJson")] string? StructuredFeesandChargesJson,
    string EligibilityHtml,
    string DocumentsRequiredHtml,
    string FaqHtml,
    string FaqJson,
    string ApplyLink,
    string ImageUrl,
    bool IsActive,
    List<int> TagIds
);

public record UpdateCreditCardRequest(
    string Name,
    int BankId,
    int CardTypeId,
    decimal JoiningFee,
    decimal AnnualFee,
    string Rewards,
    [property: JsonPropertyName("structuredRewardsJson")] string? StructuredFeesandChargesJson,
    string EligibilityHtml,
    string DocumentsRequiredHtml,
    string FaqHtml,
    string FaqJson,
    string ApplyLink,
    string ImageUrl,
    bool IsActive,
    List<int> TagIds
);
