using System;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Reflection;
using MessageList.Models.Extensions;
using MessageList.Models.Interfaces;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;

namespace MessageList.Models.Helpers
{
    public static class UserHelper
    {
        public static async Task<bool> IsAuthenticatedUserAsync(int userFromRequestId, string authUserEmail, IRepository repository)
        {
            bool result = false;
            try
            {
                User userFromRequest = await repository.GetUserByIdAsync(userFromRequestId);
                User authenticatedUser = await repository.GetUserByEmailAsync(authUserEmail);
                result = userFromRequest.Id == authenticatedUser.Id;
            }
            catch(Exception ex)
            {
                result = false;
            }
            return result;
        }

        public static async Task<ResultInfo> ChangeUserPropertyAsync<T>(int authUserId, string propertyToChange, T valueToSet, IRepository repository, ResultInfo successResult, ResultInfo failResult)
        {
            ResultInfo result = new ResultInfo();
            try
            {
                User user = await repository.GetUserByIdAsync(authUserId);
                PropertyInfo propInfo = user.GetType().GetProperty(propertyToChange);
                if (propInfo != null)
                {
                    propInfo.SetValue(user, valueToSet, null);
                }
                else
                {
                    throw new Exception("Ошибка при сохранении нового значения свойства");
                }
                int res = await repository.UpdateUserInDatabaseAsync(user);
                result = ResultInfo.CreateResultInfo(res, successResult.Status, successResult.Info, failResult.Status, failResult.Info);
            }
            catch (Exception ex)
            {
                result = new ResultInfo(status: failResult.Status, info: ex.Message);
            }
            return result;
        }

        public static async Task<ResultInfo> ChangePasswordAsync(string password, User user, IRepository repository)
        {
            user.Password = password.GetCustomAlgoHashCode(SHA256.Create());
            int res = await repository.UpdateUserInDatabaseAsync(user);
            return ResultInfo.CreateResultInfo(res, "PasswordChanged", "Пароль обновлен", "PasswordChangeFailed", "Произошла ошибка при обновлении пароля");
        }

        public static async Task<int> CreateUserAsync(QueryUserInfo userInfo, IRepository repository)
        {
            User user = await repository.GetUserByEmailAsync(userInfo.Email);
            if (user != null)
            {
                throw new Exception("Пользователь с таким email уже существует");
            }

            User newUser = new User();
            Validator.ValidateUserInfo(userInfo, newUser);
            Validator.ValidateUserPassword(userInfo.Password, newUser);
            MessageGroup mg = new MessageGroup();
            mg.Name = "Default group";
            newUser.MessageGroups.Add(mg);
            await repository.SaveUserToDatabaseAsync(newUser);
            return newUser.Id;
        }

        public static async Task UpdateUserInfoAsync(QueryUserInfo userInfo, User userToUpdate, IRepository repository)
        {
            User user = await repository.GetUserByEmailAsync(userInfo.Email);
            if (user != null && user.Id != userInfo.Id)
            {
                throw new Exception("Пользователь с таким email уже существует");
            }

            Validator.ValidateUserInfo(userInfo, userToUpdate);
            if (!String.IsNullOrEmpty(userInfo.Password))
            {
                Validator.ValidateUserPassword(userInfo.Password, userToUpdate);
            }
        }
    }
}
