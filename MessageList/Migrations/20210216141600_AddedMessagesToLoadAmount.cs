using Microsoft.EntityFrameworkCore.Migrations;

namespace MessageList.Migrations
{
    public partial class AddedMessagesToLoadAmount : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "messages_to_load_amount",
                table: "users",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "messages_to_load_amount",
                table: "users");
        }
    }
}
