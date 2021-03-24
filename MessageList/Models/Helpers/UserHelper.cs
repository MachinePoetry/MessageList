using System;
using System.Threading.Tasks;
using System.Security.Cryptography;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models.Extensions;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;

namespace MessageList.Models.Helpers
{
    public static class UserHelper
    {
        public static async Task<bool> IsAuthenticatedUserAsync(int userFromRequestId, string authUserEmailEmail, ApplicationDbContext db)
        {
            bool result = false;
            try
            {
                User userFromRequest = db.Users.Find(userFromRequestId);
                User authenticatedUser = await db.Users.FirstOrDefaultAsync(u => u.Email.Equals(authUserEmailEmail));
                result = userFromRequest.Id == authenticatedUser.Id;
            }
            catch(Exception ex)
            {
                result = false;
            }
            return result;
        }

        public static async Task<ResultInfo> ChangeUserPropertyAsync<T>(int authUserId, string propertyToChange, T valueToSet, ApplicationDbContext db, ResultInfo successResult, ResultInfo failResult)
        {
            ResultInfo result = new ResultInfo();
            try
            {
                User user = db.Users.Find(authUserId);
                PropertyInfo propInfo = user.GetType().GetProperty(propertyToChange);
                if (propInfo != null)
                {
                    propInfo.SetValue(user, valueToSet, null);
                }
                else
                {
                    throw new Exception("Ошибка при сохранении нового значения свойства");
                }
                db.Users.Update(user);
                int res = await db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, successResult.Status, successResult.Info, failResult.Status, failResult.Info);
            }
            catch (Exception ex)
            {
                result = new ResultInfo(status: failResult.Status, info: ex.Message);
            }
            return result;
        }

        public static async Task<ResultInfo> ChangePasswordAsync(string password, User user, ApplicationDbContext db)
        {
            user.Password = password.GetCustomAlgoHashCode(SHA256.Create());
            db.Users.Update(user);
            int res = await db.SaveChangesAsync();
            return ResultInfo.CreateResultInfo(res, "PasswordChanged", "Пароль обновлен", "PasswordChangeFailed", "Произошла ошибка при обновлении пароля");
        }

        public static async Task<User> CreateUserAsync(QueryUserInfo userInfo, ApplicationDbContext db)
        {
            User user = await db.Users.FirstOrDefaultAsync(u => u.Email.Equals(userInfo.Email));
            User newUser = new User();
            if (user != null)
            {
                throw new Exception("Пользователь с таким email уже существует");
            }

            Validator.ValidateUserInfo(userInfo, newUser);
            Validator.ValidateUserPassword(userInfo.Password, newUser);
            MessageGroup mg = new MessageGroup();
            mg.Name = "Default group";
            newUser.MessageGroups.Add(mg);
            return newUser;
        }

        public static async Task UpdateUserInfo(QueryUserInfo userInfo, User userToUpdate, ApplicationDbContext db)
        {
            User user = await db.Users.FirstOrDefaultAsync(u => u.Email.Equals(userInfo.Email));
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
