using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using MessageList.Data;

namespace MessageList.Models
{
    public class DbCreator
    {
        public static void CreateDatabase(IApplicationBuilder app)
        {
            var db = app.ApplicationServices.GetRequiredService<ApplicationDbContext>();
            db.Database.EnsureCreated();
        }
    }
}
