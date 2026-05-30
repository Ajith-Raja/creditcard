namespace FintechApp.Api.Models;

public class CreditCard
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Foreign Keys
    public int BankId { get; set; }
    public Bank Bank { get; set; } = null!;

    public int CardTypeId { get; set; }
    public CardType CardType { get; set; } = null!;

    // Fees
    public decimal JoiningFee { get; set; }
    public decimal AnnualFee { get; set; }

    // Details
    public string Rewards { get; set; } = string.Empty;
    // Structured JSON representation of fees & charges (serialized from admin structured table)
    public string StructuredFeesandChargesJson { get; set; } = string.Empty;
    // Rich text fields for admin-managed content
    public string EligibilityHtml { get; set; } = string.Empty;
    public string DocumentsRequiredHtml { get; set; } = string.Empty;
    public string FaqHtml { get; set; } = string.Empty;
    // Structured FAQ as JSON array: [{ "question": "...", "answer": "..." }]
    public string FaqJson { get; set; } = string.Empty;
    public string ApplyLink { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation — many-to-many with CardTag
    public ICollection<CardTag> Tags { get; set; } = new List<CardTag>();
}
