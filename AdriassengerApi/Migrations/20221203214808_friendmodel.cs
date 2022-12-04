using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdriassengerApi.Migrations
{
    public partial class friendmodel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Deleted",
                table: "friends",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Deleted",
                table: "friends");
        }
    }
}
