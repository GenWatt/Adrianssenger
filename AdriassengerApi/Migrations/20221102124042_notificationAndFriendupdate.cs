using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdriassengerApi.Migrations
{
    public partial class notificationAndFriendupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActionType",
                table: "Notifications",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "RequestAccepted",
                table: "friends",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActionType",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "RequestAccepted",
                table: "friends");
        }
    }
}
