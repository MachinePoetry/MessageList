using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;

namespace MessageList.Models.Helpers
{
    public static class UserHelper
    {
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
