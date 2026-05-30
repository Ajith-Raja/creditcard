using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FintechApp.Api.Migrations
{
    public partial class AddStructuredRewardsAndBankFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Banks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactNumber",
                table: "Banks",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StructuredFeesandChargesJson",
                table: "CreditCards",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Email",
                table: "Banks");

            migrationBuilder.DropColumn(
                name: "ContactNumber",
                table: "Banks");

            migrationBuilder.DropColumn(
                name: "StructuredFeesandChargesJson",
                table: "CreditCards");
        }
    }
}
