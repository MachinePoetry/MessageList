using System;
using Xunit;
using MessageList.Models;
using MessageList.Models.QueryModels;
using MessageList.Models.Helpers;
using MessageList.Models.Interfaces;
using MessageList.Tests.Infrastructure.Classes;

namespace MessageList.Tests.UnitTests.ModelsTests.HelpersTests
{
    public class UserHelperTests
    {
        [Fact]
        public async void ItShould_return_true_if_user_is_authenticated_user()
        {
            IRepository repository = new RepositoryWithData();
            bool actual = await UserHelper.IsAuthenticatedUserAsync(10, "email@email.com", repository);
            Assert.True(actual);
        }

        [Fact]
        public async void ItShould_return_false_if_user_is_not_authenticated_user()
        {
            IRepository repository = new RepositoryEmpty();
            bool actual = await UserHelper.IsAuthenticatedUserAsync(10, "email@email.com", repository);
            Assert.False(actual);
        }

        [Fact]
        public async void ItShould_return_success_result_if_user_property_changed()
        {
            IRepository repository = new RepositoryWithData();
            ResultInfo successResult = new ResultInfo(status: "Success", info: "Success");
            ResultInfo failResult = new ResultInfo(status: "Fail", info: "Fail");
            ResultInfo actual = await UserHelper.ChangeUserPropertyAsync<string>(10, "Key", "123", repository, successResult, failResult);
            Assert.Equal("Success", actual.Status);
        }

        [Fact]
        public async void ItShould_return_fail_result_if_user_property_was_not_found()
        {
            IRepository repository = new RepositoryWithData();
            ResultInfo successResult = new ResultInfo(status: "Success", info: "Success");
            ResultInfo failResult = new ResultInfo(status: "Fail", info: "Fail");
            ResultInfo actual = await UserHelper.ChangeUserPropertyAsync<string>(10, "unknown", "123", repository, successResult, failResult);
            Assert.Equal("Fail", actual.Status);
        }

        [Fact]
        public async void ItShould_return_success_result_if_user_password_was_changed()
        {
            IRepository repository = new RepositoryWithData();
            User user = new User("email@email.com", "passwoed", 30);
            ResultInfo actual = await UserHelper.ChangePasswordAsync("password", user, repository);
            Assert.Equal("PasswordChanged", actual.Status);
        }

        [Fact]
        public async void ItShould_throw_exception_if_email_is_in_db_while_creating_user()
        {
            IRepository repository = new RepositoryWithData();
            QueryUserInfo userInfo = new QueryUserInfo("some@email.com", "password");
            await Assert.ThrowsAsync<Exception>(async() => await UserHelper.CreateUserAsync(userInfo, repository));
        }

        [Fact]
        public async void ItShould_return_user_id_after_creating_new_user()
        {
            IRepository repository = new RepositoryEmpty();
            QueryUserInfo userInfo = new QueryUserInfo("some@email.com", "password");
            int actual = await UserHelper.CreateUserAsync(userInfo, repository);
            Assert.Equal(0, actual);
        }

        [Fact]
        public async void ItShould_throw_exception_if_email_is_in_db_while_updating_user()
        {
            IRepository repository = new RepositoryWithData();
            QueryUserInfo userInfo = new QueryUserInfo("some@email.com", "password");
            User user = new User();
            await Assert.ThrowsAsync<Exception>(async () => await UserHelper.UpdateUserInfoAsync(userInfo, user, repository));
        }
    }
}
