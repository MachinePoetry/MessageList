using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models.Roles;

namespace MessageList.Models.Helpers
{
    public static class RoleHelper
    {
        public static IEnumerable<string> GetUserRolesNames(User user, IEnumerable<Role> roles)
        {
            IEnumerable<string> result = new List<string>();
            if (user.RolesToUsers.Count() > 0)
            {
                IEnumerable<int> userRolesIds = user.RolesToUsers.Select(r => r.RoleId);
                result = roles.Where(r => userRolesIds.Contains(r.Id)).Select(role => role.Name);
            }
            return result;
        }

        public static void CheckThatRoleUserIsIn(IEnumerable<int> rolesIds, DbSet<Role> dbSet)
        {
            if (rolesIds.ToList().Count > 0)
            {
                int userRoleId = dbSet.FirstOrDefault(r => r.Name.Equals("User")).Id;
                if (!rolesIds.Contains(userRoleId))
                {
                    rolesIds.ToList().Add(userRoleId);
                }
            }
            else
            {
                throw new ArgumentException("Не указаны роли для пользователя");
            }
        }

        public static async Task<int> AddRolesToUser(IEnumerable<int> rolesIds, int newUserId, ApplicationDbContext db)
        {
            IEnumerable<int> uniqueRolesIds = rolesIds.Distinct();
            foreach (var id in uniqueRolesIds)
            {
                RolesToUsers newUserRole = new RolesToUsers(userId: newUserId, roleId: id);
                db.RolesToUsers.Add(newUserRole);
            }
            int res = await db.SaveChangesAsync();
            return res;
        }

        public static void ChangeUserRoles(IEnumerable<int> rolesIds, User user, DbSet<RolesToUsers> dbSet)
        {
            if (rolesIds.ToList().Count > 0)
            {
                IEnumerable<int> uniqueRolesIds = rolesIds.Distinct();
                IEnumerable<RolesToUsers> existingUserRoles = dbSet.Where(r => r.UserId == user.Id).ToList();
                if (uniqueRolesIds.Count() < existingUserRoles.Count())
                {
                    IEnumerable<RolesToUsers> rolesToRemove = existingUserRoles.Where(r => !uniqueRolesIds.Contains(r.RoleId));
                    foreach (var role in rolesToRemove)
                    {
                        dbSet.Remove(role);
                    }
                }
                else
                {
                    IEnumerable<int> existingUserRolesIds = existingUserRoles.Select(r => r.RoleId);
                    IEnumerable<int> rolesIdsToAdd = uniqueRolesIds.Except(existingUserRolesIds);
                    foreach (var id in rolesIdsToAdd)
                    {
                        RolesToUsers newUserRole = new RolesToUsers(userId: user.Id, roleId: id);
                        dbSet.Add(newUserRole);
                    }
                }
            }
            else
            {
                throw new ArgumentException("Не указаны роли для пользователя");
            }
        }
    }
}
