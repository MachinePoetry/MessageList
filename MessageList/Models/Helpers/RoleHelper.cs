using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using MessageList.Models.Interfaces;
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

        public static async Task CheckThatRoleUserIsIn(IEnumerable<int> rolesIds, IRepository repository)
        {
            if (rolesIds.ToList().Count > 0)
            {
                Role userRole = await repository.GetRoleByNameAsync("User");
                int userRoleId = userRole.Id;
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

        public static async Task<int> AddRolesToUser(IEnumerable<int> rolesIds, int newUserId, IRepository repository)
        {
            IEnumerable<int> uniqueRolesIds = rolesIds.Distinct();
            IEnumerable<RolesToUsers> rolesToAdd = uniqueRolesIds.Select(r => new RolesToUsers(userId: newUserId, roleId: r));
            return await repository.SaveUserRolesToDatabaseAsync(rolesToAdd);
        }

        public static async Task<int> ChangeUserRoles(IEnumerable<int> rolesIds, User user, IRepository repository)
        {
            int res = 0;
            if (rolesIds.ToList().Count > 0)
            {
                IEnumerable<int> uniqueRolesIds = rolesIds.Distinct();
                IEnumerable<RolesToUsers> existingUserRoles = await repository.GetUserRolesAsync(user.Id);
                if (uniqueRolesIds.Count() < existingUserRoles.Count())
                {
                    IEnumerable<RolesToUsers> rolesToRemove = existingUserRoles.Where(r => !uniqueRolesIds.Contains(r.RoleId));
                    res = await repository.RemoveUserRolesAsync(rolesToRemove);
                }
                else
                {
                    IEnumerable<int> existingUserRolesIds = existingUserRoles.Select(r => r.RoleId);
                    IEnumerable<int> rolesIdsToAdd = uniqueRolesIds.Except(existingUserRolesIds);
                    res = await AddRolesToUser(rolesIdsToAdd, user.Id, repository);
                }
            }
            else
            {
                throw new ArgumentException("Не указаны роли для пользователя");
            }
            return res;
        }
    }
}
