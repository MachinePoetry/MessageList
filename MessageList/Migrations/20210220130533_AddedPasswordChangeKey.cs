using Microsoft.EntityFrameworkCore.Migrations;

namespace MessageList.Migrations
{
    public partial class AddedPasswordChangeKey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "is_email_confirmed",
                table: "users");

            migrationBuilder.AddColumn<string>(
                name: "change_password_key",
                table: "users",
                type: "character varying(64)",
                maxLength: 64,
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "change_password_key",
                table: "users");

            migrationBuilder.AddColumn<bool>(
                name: "is_email_confirmed",
                table: "users",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
