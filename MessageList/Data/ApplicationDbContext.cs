using System;
using Microsoft.EntityFrameworkCore;
using MessageList.Models;
using MessageList.Models.Roles;

namespace MessageList.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; } 
        public DbSet<MessageGroup> MessageGroups { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<RolesToUsers> RolesToUsers { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FileCollection> FileCollections { get; set; }
        public DbSet<UrlPreview> UrlPreviews { get; set; }
        public DbSet<ImageFile> Images { get; set; }
        public DbSet<VideoFile> Video { get; set; }
        public DbSet<AudioFile> Audio { get; set; }
        public DbSet<OtherFile> Files { get; set; }
        public DbSet<UserRequestInfo> UserRequestsHistory { get; set; }

        public ApplicationDbContext (DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasData(new User { Id = 1, Email = "admin@admin.com", Password = "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918", 
                                                           Key = "", CreatedAt = DateTime.Now, IsGreeted = false, MessagesToLoadAmount = 30 });
            modelBuilder.Entity<Role>().HasData(
                new Role[]
                {
                    new Role { Id = 1, Name = "User"},
                    new Role { Id = 2, Name = "Administrator"}
                });
            modelBuilder.Entity<RolesToUsers>().HasData(
                new RolesToUsers[]
                {
                    new RolesToUsers { Id = 1, UserId = 1, RoleId = 1},
                    new RolesToUsers { Id = 2, UserId = 1, RoleId = 2}
                });
        }
    }
}
