using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdriassengerApi.Migrations
{
    public partial class notificationAndFriendupdate5 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropIndex(
                name: "IX_Notifications_FriendId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "FriendId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "Discriminator",
                table: "Notifications",
                newName: "RejectUrl");

            migrationBuilder.AddColumn<string>(
                name: "AcceptUrl",
                table: "Notifications",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "ActionId",
                table: "Notifications",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AcceptUrl",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ActionId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "RejectUrl",
                table: "Notifications",
                newName: "Discriminator");

            migrationBuilder.AddColumn<int>(
                name: "FriendId",
                table: "Notifications",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_FriendId",
                table: "Notifications",
                column: "FriendId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_friends_FriendId",
                table: "Notifications",
                column: "FriendId",
                principalTable: "friends",
                principalColumn: "FriendId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
