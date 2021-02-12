﻿// <auto-generated />
using System;
using MessageList.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace MessageList.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20210211131341_AddedUrlPreviews")]
    partial class AddedUrlPreviews
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .UseIdentityByDefaultColumns()
                .HasAnnotation("Relational:MaxIdentifierLength", 63)
                .HasAnnotation("ProductVersion", "5.0.0");

            modelBuilder.Entity("MessageList.Models.AudioFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("ContentType")
                        .HasColumnType("text")
                        .HasColumnName("content_type");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasMaxLength(20500000)
                        .HasColumnType("bytea")
                        .HasColumnName("data");

                    b.Property<int>("FileCollectionId")
                        .HasColumnType("integer")
                        .HasColumnName("related_file_collection_id");

                    b.Property<string>("FileName")
                        .HasColumnType("text")
                        .HasColumnName("file_name");

                    b.Property<long>("Length")
                        .HasColumnType("bigint")
                        .HasColumnName("length");

                    b.HasKey("Id");

                    b.HasIndex("FileCollectionId");

                    b.ToTable("audio");
                });

            modelBuilder.Entity("MessageList.Models.BugReport", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("ReportContacts")
                        .HasMaxLength(400)
                        .HasColumnType("character varying(400)")
                        .HasColumnName("report_contacts");

                    b.Property<string>("ReportText")
                        .IsRequired()
                        .HasMaxLength(4000)
                        .HasColumnType("character varying(4000)")
                        .HasColumnName("report_text");

                    b.HasKey("Id");

                    b.ToTable("bug_reports");
                });

            modelBuilder.Entity("MessageList.Models.FileCollection", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<int>("MessageId")
                        .HasColumnType("integer")
                        .HasColumnName("related_message_id");

                    b.HasKey("Id");

                    b.HasIndex("MessageId")
                        .IsUnique();

                    b.ToTable("file_collections");
                });

            modelBuilder.Entity("MessageList.Models.ImageFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("ContentType")
                        .HasColumnType("text")
                        .HasColumnName("content_type");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasMaxLength(1050000)
                        .HasColumnType("bytea")
                        .HasColumnName("data");

                    b.Property<int>("FileCollectionId")
                        .HasColumnType("integer")
                        .HasColumnName("related_file_collection_id");

                    b.Property<string>("FileName")
                        .HasColumnType("text")
                        .HasColumnName("file_name");

                    b.Property<long>("Length")
                        .HasColumnType("bigint")
                        .HasColumnName("length");

                    b.HasKey("Id");

                    b.HasIndex("FileCollectionId");

                    b.ToTable("images");
                });

            modelBuilder.Entity("MessageList.Models.Message", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<int>("MessageGroupId")
                        .HasColumnType("integer")
                        .HasColumnName("related_message_group");

                    b.Property<string>("Text")
                        .HasMaxLength(5000)
                        .HasColumnType("character varying(5000)")
                        .HasColumnName("text");

                    b.HasKey("Id");

                    b.HasIndex("MessageGroupId");

                    b.ToTable("messages");
                });

            modelBuilder.Entity("MessageList.Models.MessageGroup", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("character varying(50)")
                        .HasColumnName("name");

                    b.Property<int>("UserId")
                        .HasColumnType("integer")
                        .HasColumnName("related_user_id");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("message_groups");
                });

            modelBuilder.Entity("MessageList.Models.OtherFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("ContentType")
                        .HasColumnType("text")
                        .HasColumnName("content_type");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasMaxLength(10500000)
                        .HasColumnType("bytea")
                        .HasColumnName("data");

                    b.Property<int>("FileCollectionId")
                        .HasColumnType("integer")
                        .HasColumnName("related_file_collection_id");

                    b.Property<string>("FileName")
                        .HasColumnType("text")
                        .HasColumnName("file_name");

                    b.Property<long>("Length")
                        .HasColumnType("bigint")
                        .HasColumnName("length");

                    b.HasKey("Id");

                    b.HasIndex("FileCollectionId");

                    b.ToTable("files");
                });

            modelBuilder.Entity("MessageList.Models.UrlPreview", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("Description")
                        .HasColumnType("text")
                        .HasColumnName("description");

                    b.Property<string>("Image")
                        .HasColumnType("text")
                        .HasColumnName("image");

                    b.Property<int>("MessageId")
                        .HasColumnType("integer")
                        .HasColumnName("related_message_id");

                    b.Property<string>("Title")
                        .HasColumnType("text")
                        .HasColumnName("title");

                    b.Property<string>("Url")
                        .HasColumnType("text")
                        .HasColumnName("url");

                    b.HasKey("Id");

                    b.HasIndex("MessageId");

                    b.ToTable("url_previews");
                });

            modelBuilder.Entity("MessageList.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp without time zone")
                        .HasColumnName("created_at");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(300)
                        .HasColumnType("character varying(300)")
                        .HasColumnName("email");

                    b.Property<bool>("IsAdmin")
                        .HasColumnType("boolean")
                        .HasColumnName("is_admin");

                    b.Property<bool>("IsEmailConfirmed")
                        .HasColumnType("boolean")
                        .HasColumnName("is_email_confirmed");

                    b.Property<bool>("IsGreeted")
                        .HasColumnType("boolean")
                        .HasColumnName("is_greeted");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasMaxLength(64)
                        .HasColumnType("character varying(64)")
                        .HasColumnName("password");

                    b.HasKey("Id");

                    b.ToTable("users");
                });

            modelBuilder.Entity("MessageList.Models.VideoFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer")
                        .HasColumnName("id")
                        .UseIdentityByDefaultColumn();

                    b.Property<string>("ContentType")
                        .HasColumnType("text")
                        .HasColumnName("content_type");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasMaxLength(105000000)
                        .HasColumnType("bytea")
                        .HasColumnName("data");

                    b.Property<int>("FileCollectionId")
                        .HasColumnType("integer")
                        .HasColumnName("related_file_collection_id");

                    b.Property<string>("FileName")
                        .HasColumnType("text")
                        .HasColumnName("file_name");

                    b.Property<long>("Length")
                        .HasColumnType("bigint")
                        .HasColumnName("length");

                    b.HasKey("Id");

                    b.HasIndex("FileCollectionId");

                    b.ToTable("video");
                });

            modelBuilder.Entity("MessageList.Models.AudioFile", b =>
                {
                    b.HasOne("MessageList.Models.FileCollection", "FileCollection")
                        .WithMany("Audio")
                        .HasForeignKey("FileCollectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileCollection");
                });

            modelBuilder.Entity("MessageList.Models.FileCollection", b =>
                {
                    b.HasOne("MessageList.Models.Message", "Message")
                        .WithOne("FileCollection")
                        .HasForeignKey("MessageList.Models.FileCollection", "MessageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Message");
                });

            modelBuilder.Entity("MessageList.Models.ImageFile", b =>
                {
                    b.HasOne("MessageList.Models.FileCollection", "FileCollection")
                        .WithMany("Images")
                        .HasForeignKey("FileCollectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileCollection");
                });

            modelBuilder.Entity("MessageList.Models.Message", b =>
                {
                    b.HasOne("MessageList.Models.MessageGroup", "MessageGroup")
                        .WithMany("Messages")
                        .HasForeignKey("MessageGroupId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("MessageGroup");
                });

            modelBuilder.Entity("MessageList.Models.MessageGroup", b =>
                {
                    b.HasOne("MessageList.Models.User", "User")
                        .WithMany("MessageGroups")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("MessageList.Models.OtherFile", b =>
                {
                    b.HasOne("MessageList.Models.FileCollection", "FileCollection")
                        .WithMany("Files")
                        .HasForeignKey("FileCollectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileCollection");
                });

            modelBuilder.Entity("MessageList.Models.UrlPreview", b =>
                {
                    b.HasOne("MessageList.Models.Message", "Message")
                        .WithMany("UrlPreviews")
                        .HasForeignKey("MessageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Message");
                });

            modelBuilder.Entity("MessageList.Models.VideoFile", b =>
                {
                    b.HasOne("MessageList.Models.FileCollection", "FileCollection")
                        .WithMany("Video")
                        .HasForeignKey("FileCollectionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("FileCollection");
                });

            modelBuilder.Entity("MessageList.Models.FileCollection", b =>
                {
                    b.Navigation("Audio");

                    b.Navigation("Files");

                    b.Navigation("Images");

                    b.Navigation("Video");
                });

            modelBuilder.Entity("MessageList.Models.Message", b =>
                {
                    b.Navigation("FileCollection");

                    b.Navigation("UrlPreviews");
                });

            modelBuilder.Entity("MessageList.Models.MessageGroup", b =>
                {
                    b.Navigation("Messages");
                });

            modelBuilder.Entity("MessageList.Models.User", b =>
                {
                    b.Navigation("MessageGroups");
                });
#pragma warning restore 612, 618
        }
    }
}
