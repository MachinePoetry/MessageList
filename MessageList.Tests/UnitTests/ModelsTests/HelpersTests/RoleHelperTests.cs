using System;
using Xunit;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MessageList.Models;
using MessageList.Models.Roles;
using MessageList.Models.Helpers;
using MessageList.Models.Interfaces;
using MessageList.Tests.Infrastructure.Classes;

namespace MessageList.Tests.UnitTests.ModelsTests.HelpersTests
{
    public class RoleHelperTests
    {
        [Fact]
        public void ItShould_return_string_collection_of_user_roles_names()
        {
            User user = new User();
            user.RolesToUsers = new List<RolesToUsers> { new RolesToUsers { UserId = 1, RoleId = 1 } };
            IEnumerable<Role> roles = new List<Role> { new Role { Id = 1, Name = "User" }, new Role { Id = 2, Name = "Administrator" } }; 
            IEnumerable<string> actual = RoleHelper.GetUserRolesNames(user, roles);
            Assert.True(actual.Count() == 1);
            Assert.True(actual.First().Equals("User"));
        }

        [Fact]
        public async Task ItShould_throw_exception_if_empty_role_collection_is_given()
        {
            IList<int> rolesIds = new List<int>();
            IRepository repository = new RepositoryWithData();
            await Assert.ThrowsAsync<ArgumentException>(() => RoleHelper.CheckThatRoleUserIsInAsync(rolesIds, repository));
        }

        [Fact]
        public async Task ItShould_insert_user_role_id_if_it_is_not_in_roles_ids_collection()
        {
            IList<int> rolesIds = new List<int> { 2 };
            IRepository repository = new RepositoryWithData();
            await RoleHelper.CheckThatRoleUserIsInAsync(rolesIds, repository);
            Assert.True(rolesIds.Count() == 2);
        }

        [Fact]
        public async Task ItShould_not_change_roles_collection_if_user_role_id_is_in()
        {
            IList<int> rolesIds = new List<int> { 1, 2 };
            IRepository repository = new RepositoryWithData();
            await RoleHelper.CheckThatRoleUserIsInAsync(rolesIds, repository);
            Assert.True(rolesIds.Count() == 2);
        }

        [Fact]
        public async Task ItShould_create_roles_from_ids_collection()
        {
            IRepository repository = new RepositoryWithData();
            int res = await RoleHelper.AddRolesToUserAsync(new List<int> { 1, 2 }, 1, repository);
            Assert.Equal(1, res);
        }

        [Fact]
        public async Task ItShould_throw_exception_if_empty_roles_ids_collection_is_given()
        {
            IList<int> rolesIds = new List<int>();
            IRepository repository = new RepositoryWithData();
            await Assert.ThrowsAsync<ArgumentException>(() => RoleHelper.ChangeUserRolesAsync(rolesIds, new User(), repository));
        }
    }
}
