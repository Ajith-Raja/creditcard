namespace FintechApp.Api.Models;

public class CardType
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;   // e.g. Visa, Mastercard, RuPay, Amex

    // Navigation
    public ICollection<CreditCard> CreditCards { get; set; } = new List<CreditCard>();
}
