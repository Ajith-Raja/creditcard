namespace FintechApp.Api.Models;

public class CardTag
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;   // e.g. Fuel, Dining, Travel, Cashback

    // Navigation (many-to-many via join table)
    public ICollection<CreditCard> CreditCards { get; set; } = new List<CreditCard>();
}
