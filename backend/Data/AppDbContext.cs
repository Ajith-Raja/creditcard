using FintechApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FintechApp.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Bank> Banks => Set<Bank>();
    public DbSet<CreditCard> CreditCards => Set<CreditCard>();
    public DbSet<CardType> CardTypes => Set<CardType>();
    public DbSet<CardTag> CardTags => Set<CardTag>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Many-to-many: CreditCard <-> CardTag
        modelBuilder.Entity<CreditCard>()
            .HasMany(c => c.Tags)
            .WithMany(t => t.CreditCards)
            .UsingEntity("CreditCardTags");

        // ── Seed Data ──────────────────────────────────────────────

        // Ensure new rich-text/string columns have defaults and are non-nullable at the model level.
        modelBuilder.Entity<CreditCard>(eb =>
        {
            eb.Property(c => c.StructuredFeesandChargesJson).HasDefaultValue(string.Empty).IsRequired();
            eb.Property(c => c.EligibilityHtml).HasDefaultValue(string.Empty).IsRequired();
            eb.Property(c => c.DocumentsRequiredHtml).HasDefaultValue(string.Empty).IsRequired();
            eb.Property(c => c.FaqHtml).HasDefaultValue(string.Empty).IsRequired();
            eb.Property(c => c.FaqJson).HasDefaultValue(string.Empty).IsRequired();
        });

        // Card Types
        modelBuilder.Entity<CardType>().HasData(
            new CardType { Id = 1, Name = "RuPay" },
            new CardType { Id = 2, Name = "Visa" },
            new CardType { Id = 3, Name = "Mastercard" },
            new CardType { Id = 4, Name = "Amex" },
            new CardType { Id = 5, Name = "Other" }
        );

        // Card Tags
        modelBuilder.Entity<CardTag>().HasData(
            new CardTag { Id = 1, Name = "Fuel" },
            new CardTag { Id = 2, Name = "Dining" },
            new CardTag { Id = 3, Name = "Travel" },
            new CardTag { Id = 4, Name = "Cashback" },
            new CardTag { Id = 5, Name = "Shopping" },
            new CardTag { Id = 6, Name = "Entertainment" }
        );

        // Banks (matching frontend banks.ts)
            modelBuilder.Entity<Bank>().HasData(
            new Bank { Id = 1, Name = "Punjab National Bank", Slug = "punjab-national-bank", Website = "https://www.pnbindia.in", Email = "", ContactNumber = "", LogoUrl = "/bank-logos/pnb.png", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Bank { Id = 2, Name = "HDFC Bank", Slug = "hdfc-bank", Website = "https://www.hdfcbank.com", Email = "", ContactNumber = "", LogoUrl = "/bank-logos/hdfc.png", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Bank { Id = 3, Name = "ICICI Bank", Slug = "icici-bank", Website = "https://www.icicibank.com", Email = "", ContactNumber = "", LogoUrl = "/bank-logos/icici.png", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Bank { Id = 4, Name = "Axis Bank", Slug = "axis-bank", Website = "https://www.axisbank.com", Email = "", ContactNumber = "", LogoUrl = "/bank-logos/axis.png", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) },
            new Bank { Id = 5, Name = "State Bank of India", Slug = "sbi", Website = "https://www.sbi.co.in", Email = "", ContactNumber = "", LogoUrl = "/bank-logos/sbi.png", CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc) }
        );

        // Credit Cards (seeded from frontend cards.ts)
        modelBuilder.Entity<CreditCard>().HasData(
            new CreditCard
            {
                Id = 1, Name = "Cashback Card", BankId = 1, CardTypeId = 1,
                JoiningFee = 0, AnnualFee = 0,
                Rewards = "5% cashback on groceries, 2% on all other purchases",
                StructuredFeesandChargesJson = "",
                ImageUrl = "/placeholder-card.png", IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new CreditCard
            {
                Id = 2, Name = "Travel Rewards Card", BankId = 2, CardTypeId = 2,
                JoiningFee = 0, AnnualFee = 95,
                Rewards = "2x points on travel, 1x points on all other purchases",
                StructuredFeesandChargesJson = "",
                ImageUrl = "/placeholder-card.png", IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new CreditCard
            {
                Id = 3, Name = "Low Interest Card", BankId = 3, CardTypeId = 3,
                JoiningFee = 0, AnnualFee = 0,
                Rewards = "1% cashback on all purchases",
                StructuredFeesandChargesJson = "",
                ImageUrl = "/placeholder-card.png", IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new CreditCard
            {
                Id = 4, Name = "Premium Rewards Card", BankId = 2, CardTypeId = 2,
                JoiningFee = 0, AnnualFee = 150,
                Rewards = "3x points on dining, 1.5x points on all other purchases",
                StructuredFeesandChargesJson = "",
                ImageUrl = "/placeholder-card.png", IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            },
            new CreditCard
            {
                Id = 5, Name = "Student Card", BankId = 1, CardTypeId = 1,
                JoiningFee = 0, AnnualFee = 0,
                Rewards = "1% cashback on all purchases",
                StructuredFeesandChargesJson = "",
                ImageUrl = "/placeholder-card.png", IsActive = true,
                CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc)
            }
        );
    }
}
