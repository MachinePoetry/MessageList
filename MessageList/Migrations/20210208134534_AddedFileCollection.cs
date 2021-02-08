using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace MessageList.Migrations
{
    public partial class AddedFileCollection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "related_message_id",
                table: "video",
                newName: "related_file_collection_id");

            migrationBuilder.RenameColumn(
                name: "related_message_id",
                table: "images",
                newName: "related_file_collection_id");

            migrationBuilder.RenameColumn(
                name: "related_message_id",
                table: "files",
                newName: "related_file_collection_id");

            migrationBuilder.RenameColumn(
                name: "related_message_id",
                table: "audio",
                newName: "related_file_collection_id");

            migrationBuilder.CreateTable(
                name: "file_collections",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    related_message_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_file_collections", x => x.id);
                    table.ForeignKey(
                        name: "FK_file_collections_messages_related_message_id",
                        column: x => x.related_message_id,
                        principalTable: "messages",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_video_related_file_collection_id",
                table: "video",
                column: "related_file_collection_id");

            migrationBuilder.CreateIndex(
                name: "IX_images_related_file_collection_id",
                table: "images",
                column: "related_file_collection_id");

            migrationBuilder.CreateIndex(
                name: "IX_files_related_file_collection_id",
                table: "files",
                column: "related_file_collection_id");

            migrationBuilder.CreateIndex(
                name: "IX_audio_related_file_collection_id",
                table: "audio",
                column: "related_file_collection_id");

            migrationBuilder.CreateIndex(
                name: "IX_file_collections_related_message_id",
                table: "file_collections",
                column: "related_message_id",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_audio_file_collections_related_file_collection_id",
                table: "audio",
                column: "related_file_collection_id",
                principalTable: "file_collections",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_files_file_collections_related_file_collection_id",
                table: "files",
                column: "related_file_collection_id",
                principalTable: "file_collections",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_images_file_collections_related_file_collection_id",
                table: "images",
                column: "related_file_collection_id",
                principalTable: "file_collections",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_video_file_collections_related_file_collection_id",
                table: "video",
                column: "related_file_collection_id",
                principalTable: "file_collections",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_audio_file_collections_related_file_collection_id",
                table: "audio");

            migrationBuilder.DropForeignKey(
                name: "FK_files_file_collections_related_file_collection_id",
                table: "files");

            migrationBuilder.DropForeignKey(
                name: "FK_images_file_collections_related_file_collection_id",
                table: "images");

            migrationBuilder.DropForeignKey(
                name: "FK_video_file_collections_related_file_collection_id",
                table: "video");

            migrationBuilder.DropTable(
                name: "file_collections");

            migrationBuilder.DropIndex(
                name: "IX_video_related_file_collection_id",
                table: "video");

            migrationBuilder.DropIndex(
                name: "IX_images_related_file_collection_id",
                table: "images");

            migrationBuilder.DropIndex(
                name: "IX_files_related_file_collection_id",
                table: "files");

            migrationBuilder.DropIndex(
                name: "IX_audio_related_file_collection_id",
                table: "audio");

            migrationBuilder.RenameColumn(
                name: "related_file_collection_id",
                table: "video",
                newName: "related_message_id");

            migrationBuilder.RenameColumn(
                name: "related_file_collection_id",
                table: "images",
                newName: "related_message_id");

            migrationBuilder.RenameColumn(
                name: "related_file_collection_id",
                table: "files",
                newName: "related_message_id");

            migrationBuilder.RenameColumn(
                name: "related_file_collection_id",
                table: "audio",
                newName: "related_message_id");
        }
    }
}
