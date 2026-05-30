using FintechApp.Api.Data;
using FintechApp.Api.Services;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// ── Services ───────────────────────────────────────────────────────────────

// EF Core — PostgreSQL
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Service layer — controllers depend on interfaces, not DbContext directly
builder.Services.AddScoped<IBankService, BankService>();
builder.Services.AddScoped<ICardTypeService, CardTypeService>();
builder.Services.AddScoped<ICardTagService, CardTagService>();
builder.Services.AddScoped<ICreditCardService, CreditCardService>();

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(opts =>
    {
        // Keep camelCase JSON (default), pretty-print in dev
        opts.JsonSerializerOptions.WriteIndented = builder.Environment.IsDevelopment();
        // Avoid self-referencing loop errors for EF navigation properties
        opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    });

// Swagger / OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new()
    {
        Title = "FintechApp Admin API",
        Version = "v1",
        Description = "CRUD API for managing Banks, Credit Cards, Card Types and Tags"
    });
});

// CORS — allow Next.js dev server and production frontend origin
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        // Always allow localhost dev origins
        var origins = new[] { "http://localhost:3000", "http://localhost:3001" };
        // Add production origin if configured / required
        var prodOrigin = "https://techtoolsweb.com";
        policy.WithOrigins(origins.Concat(new[] { prodOrigin }).ToArray())
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ── Seed the in-memory DB ──────────────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();   // runs OnModelCreating seed data
    // Schema migrations should be applied via EF Core migrations.
}

// ── Middleware ─────────────────────────────────────────────────────────────

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "FintechApp Admin API v1");
        c.RoutePrefix = "swagger";   // http://localhost:5000/swagger
    });
}

app.UseCors("Frontend");
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();

// Redirect root to Swagger for convenience
app.MapGet("/", () => Results.Redirect("/swagger")).ExcludeFromDescription();

app.Run();
