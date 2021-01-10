using Microsoft.EntityFrameworkCore.Migrations;

namespace MessageList.Migrations
{
    public partial class UserGreeting : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_greeted",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_greeted",
                table: "users");
        }
    }
}
