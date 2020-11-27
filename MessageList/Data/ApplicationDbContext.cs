using System;
using Microsoft.EntityFrameworkCore;
using MessageList.Models;

namespace MessageList.Data
{
    public class ApplicationDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Message> Messages { get; set; } 
        public DbSet<MessageGroup> MessageGroups { get; set; }
        public DbSet<BugReport> BugReports { get; set; }
        public ApplicationDbContext (DbContextOptions<ApplicationDbContext> options) : base(options) { }
    }
}
