using Microsoft.EntityFrameworkCore.Migrations;

namespace MessageList.Migrations
{
    public partial class NewTableNames : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageGroups_Users_RelatedUserId",
                table: "MessageGroups");

            migrationBuilder.DropForeignKey(
                name: "FK_Messages_MessageGroups_RelatedMessageGroup",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Messages",
                table: "Messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageGroups",
                table: "MessageGroups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_BugReports",
                table: "BugReports");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "users");

            migrationBuilder.RenameTable(
                name: "Messages",
                newName: "messages");

            migrationBuilder.RenameTable(
                name: "MessageGroups",
                newName: "message_groups");

            migrationBuilder.RenameTable(
                name: "BugReports",
                newName: "bug_reports");

            migrationBuilder.RenameColumn(
                name: "Password",
                table: "users",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "Email",
                table: "users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "users",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "IsEmailConfirmed",
                table: "users",
                newName: "is_email_confirmed");

            migrationBuilder.RenameColumn(
                name: "IsAdmin",
                table: "users",
                newName: "is_admin");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "users",
                newName: "created_at");

            migrationBuilder.RenameColumn(
                name: "Text",
                table: "messages",
                newName: "text");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "messages",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "RelatedMessageGroup",
                table: "messages",
                newName: "related_message_group");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "messages",
                newName: "created_at");

            migrationBuilder.RenameIndex(
                name: "IX_Messages_RelatedMessageGroup",
                table: "messages",
                newName: "IX_messages_related_message_group");

            migrationBuilder.RenameColumn(
                name: "Name",
                table: "message_groups",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "message_groups",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "RelatedUserId",
                table: "message_groups",
                newName: "related_user_id");

            migrationBuilder.RenameIndex(
                name: "IX_MessageGroups_RelatedUserId",
                table: "message_groups",
                newName: "IX_message_groups_related_user_id");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "bug_reports",
                newName: "id");

            migrationBuilder.RenameColumn(
                name: "ReportText",
                table: "bug_reports",
                newName: "report_text");

            migrationBuilder.RenameColumn(
                name: "ReportContacts",
                table: "bug_reports",
                newName: "report_contacts");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "bug_reports",
                newName: "created_at");

            migrationBuilder.AddPrimaryKey(
                name: "PK_users",
                table: "users",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_messages",
                table: "messages",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_message_groups",
                table: "message_groups",
                column: "id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_bug_reports",
                table: "bug_reports",
                column: "id");

            migrationBuilder.AddForeignKey(
                name: "FK_message_groups_users_related_user_id",
                table: "message_groups",
                column: "related_user_id",
                principalTable: "users",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_messages_message_groups_related_message_group",
                table: "messages",
                column: "related_message_group",
                principalTable: "message_groups",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_message_groups_users_related_user_id",
                table: "message_groups");

            migrationBuilder.DropForeignKey(
                name: "FK_messages_message_groups_related_message_group",
                table: "messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_users",
                table: "users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_messages",
                table: "messages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_message_groups",
                table: "message_groups");

            migrationBuilder.DropPrimaryKey(
                name: "PK_bug_reports",
                table: "bug_reports");

            migrationBuilder.RenameTable(
                name: "users",
                newName: "Users");

            migrationBuilder.RenameTable(
                name: "messages",
                newName: "Messages");

            migrationBuilder.RenameTable(
                name: "message_groups",
                newName: "MessageGroups");

            migrationBuilder.RenameTable(
                name: "bug_reports",
                newName: "BugReports");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Users",
                newName: "Password");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Email");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Users",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "is_email_confirmed",
                table: "Users",
                newName: "IsEmailConfirmed");

            migrationBuilder.RenameColumn(
                name: "is_admin",
                table: "Users",
                newName: "IsAdmin");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Users",
                newName: "CreatedAt");

            migrationBuilder.RenameColumn(
                name: "text",
                table: "Messages",
                newName: "Text");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "Messages",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "related_message_group",
                table: "Messages",
                newName: "RelatedMessageGroup");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "Messages",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_messages_related_message_group",
                table: "Messages",
                newName: "IX_Messages_RelatedMessageGroup");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "MessageGroups",
                newName: "Name");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "MessageGroups",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "related_user_id",
                table: "MessageGroups",
                newName: "RelatedUserId");

            migrationBuilder.RenameIndex(
                name: "IX_message_groups_related_user_id",
                table: "MessageGroups",
                newName: "IX_MessageGroups_RelatedUserId");

            migrationBuilder.RenameColumn(
                name: "id",
                table: "BugReports",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "report_text",
                table: "BugReports",
                newName: "ReportText");

            migrationBuilder.RenameColumn(
                name: "report_contacts",
                table: "BugReports",
                newName: "ReportContacts");

            migrationBuilder.RenameColumn(
                name: "created_at",
                table: "BugReports",
                newName: "CreatedAt");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Messages",
                table: "Messages",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageGroups",
                table: "MessageGroups",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_BugReports",
                table: "BugReports",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageGroups_Users_RelatedUserId",
                table: "MessageGroups",
                column: "RelatedUserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Messages_MessageGroups_RelatedMessageGroup",
                table: "Messages",
                column: "RelatedMessageGroup",
                principalTable: "MessageGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
