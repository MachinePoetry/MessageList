using System;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using MessageList.Models;
using MessageList.Models.QueryModels;
using MessageList.Models.Interfaces;
using MessageList.Tests.Infrastructure.Classes;

namespace MessageList.Controllers
{
    public class UserControllerTests
    {
        private static IRepository _repository = new RepositoryWithData();
        private UserController _controller = new UserController(_repository);

        [Fact]
        public async void ItShould_return_fail_if_password_key_is_not_valid()
        {
            QueryValidateKey keyInfo = new QueryValidateKey();
            IActionResult res = await _controller.ValidateChangePasswordKeyAsync(keyInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("InvalidKey", actual.Status);
        }

        [Fact]
        public async void ItShould_return_fail_if_user_was_not_found_while_key_validating()
        {
            IRepository repository = new RepositoryEmpty();
            UserController controller = new UserController(repository);
            QueryValidateKey keyInfo = new QueryValidateKey();
            IActionResult res = await controller.ValidateChangePasswordKeyAsync(keyInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("UserNotFound", actual.Status);
        }

        [Fact]
        public async void ItShould_return_user_info_if_password_key_is_valid()
        {
            QueryValidateKey keyInfo = new QueryValidateKey();
            keyInfo.Key = "some key";
            IActionResult res = await _controller.ValidateChangePasswordKeyAsync(keyInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            User actual = (User)result.Value;
            Assert.Equal("email@email.com", actual.Email);
        }

        [Fact]
        public async void ItShould_return_success_if_password_was_changed()
        {
            QueryChangePassword changePasswordInfo = new QueryChangePassword();
            changePasswordInfo.Mode = "restore";
            changePasswordInfo.NewPassword = "password";
            IActionResult res = await _controller.ChangePasswordAsync(changePasswordInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("PasswordChanged", actual.Status);
        }

        [Fact]
        public async void ItShould_return_fail_if_user_was_not_found_while_password_changing()
        {
            IRepository repository = new RepositoryEmpty();
            UserController controller = new UserController(repository);
            QueryChangePassword changePasswordInfo = new QueryChangePassword();
            IActionResult res = await controller.ChangePasswordAsync(changePasswordInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("Пользователь для смены пароля не найден", actual.Info);
        }
        
        [Fact]
        public async void ItShould_return_fail_if_ne_user_password_is_invalid()
        {
            QueryChangePassword changePasswordInfo = new QueryChangePassword();
            changePasswordInfo.Mode = "restore";
            changePasswordInfo.NewPassword = "123";
            IActionResult res = await _controller.ChangePasswordAsync(changePasswordInfo);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("Неверный формат пароля", actual.Info);
        }

        [Fact]
        public async void ItShould_return_success_if_user_was_greeted()
        {
            Identificator idContainer = new Identificator();
            idContainer.Id = 10;
            IActionResult res = await _controller.GreetUserAsync(idContainer);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("UserGreeted", actual.Status);
        }

        [Fact]
        public async void ItShould_return_fail_if_user_was_not_found_while_greeting()
        {
            IRepository repository = new RepositoryEmpty();
            UserController controller = new UserController(repository);
            Identificator idContainer = new Identificator();
            idContainer.Id = 10;
            IActionResult res = await controller.GreetUserAsync(idContainer);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("GreetingFailed", actual.Status);
        }
    }
}
