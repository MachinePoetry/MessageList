using System;
using Xunit;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MessageList.Tests.Infrastructure.Classes;
using MessageList.Controllers;
using MessageList.Models;
using MessageList.Models.QueryModels;
using MessageList.Models.Roles;
using MessageList.Models.Interfaces;

namespace MessageList.Tests.UnitTests.ModelsTests.ControllersTests
{
    public class AdminControllerTests
    {
        private static IRepository _repository = new RepositoryWithData();
        private AdminController _controller = new AdminController(_repository);

        [Fact]
        public async void ItShould_return_collection_of_users()
        {
            IActionResult res = await _controller.GetUsersAsync();
            JsonResult result = Assert.IsType<JsonResult>(res);
            List<User> actual = (List<User>)result.Value;
            Assert.Equal("email@email.com", actual.First().Email);
            Assert.Equal("password_hash", actual.First().Password);
        }

        [Fact]
        public async void ItShould_return_collection_of_roles()
        {
            IActionResult res = await _controller.GetRolesAsync();
            JsonResult result = Assert.IsType<JsonResult>(res);
            List<Role> actual = (List<Role>)result.Value;
            Assert.True(actual.Count() == 2);
            Assert.Equal("User", actual.First().Name);
        }

        [Fact]
        public async void ItShould_return_fail_result_if_user_email_is_in_db_on_creating()
        {
            QueryUserInfo userInfo = new QueryUserInfo("some@email.com", "password");
            IActionResult res = await _controller.CreateUserAsync(userInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("UserCreationFailed", actual.Status);
        }

        [Fact]
        public async void ItShould_return_success_result_if_user_was_created()
        {
            IRepository repository = new RepositoryEmpty();
            AdminController controller = new AdminController(repository);
            QueryUserInfo userInfo = new QueryUserInfo("some@email.com", "password");
            userInfo.RolesIds = new List<int> { 1 };
            IActionResult res = await controller.CreateUserAsync(userInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("UserCreated", actual.Status);
        }

        [Fact]
        public async void ItShould_return_fail_result_if_user_email_is_in_db_on_updating()
        {
            QueryUserInfo userInfo = new QueryUserInfo("some@email.com", "password");
            IActionResult res = await _controller.UpdateUserAsync(userInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("UserUpdateFailed", actual.Status);
        }
    }
}
