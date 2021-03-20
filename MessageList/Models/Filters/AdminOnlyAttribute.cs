using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using MessageList.Data;

namespace MessageList.Models.Filters
{
    public class AdminOnlyAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            string connectionString = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build().GetSection("Data:MessageListDbConnection:ConnectionString").Value;
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            optionsBuilder.UseNpgsql(connectionString);
            ApplicationDbContext db = new ApplicationDbContext(optionsBuilder.Options);
            User authenticatedUser = db.Users.FirstOrDefault(u => u.Email.Equals(context.HttpContext.User.Identity.Name));

            if (authenticatedUser != null)
            {
                List<int> authenticatedUserRolesIds = db.RolesToUsers.Where(r => r.UserId == authenticatedUser.Id).Select(role => role.RoleId).ToList();
                int adminRoleId = db.Roles.FirstOrDefault(r => r.Name.Equals("Administrator")).Id;
                if (!authenticatedUserRolesIds.Contains(adminRoleId))
                {
                    context.Result = new StatusCodeResult(403);
                }
            }
        }
    }
}
