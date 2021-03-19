using System;
using System.Linq;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models.Extensions;
using MessageList.Models;
using MessageList.Models.QueryModels;

namespace MessageList.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class AdminController : Controller
    {
        private ApplicationDbContext _db;
        public AdminController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("getUsers")]
        //TODO: Создать и дать атрибут [AdminOnly]
        public async Task<JsonResult> GetUsers()
        {
            return Json(await _db.Users.ToListAsync());
        }

        [HttpPost("createUser")]
        public async Task<JsonResult> CreateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Email == userInfo.Email);
            ResultInfo result = new ResultInfo();
            if (user != null)
            {
                result = new ResultInfo(status: "UserExists", info: "Пользователь с таким email уже существует");
            }
            else
            {
                if (userInfo != null)
                {

                    User newUser = new User(userInfo.Email, userInfo.Password.GetCustomAlgoHashCode(SHA256.Create()), userInfo.MessagesToLoadAmount);
                    if (userInfo.ChangePasswordKey != null)
                    {
                        newUser.Key = userInfo.ChangePasswordKey;
                    }
                    _db.Users.Add(newUser);
                    int res = await _db.SaveChangesAsync();
                    result = ResultInfo.CreateResultInfo(res, "UserCreated", "Новый пользователь успешно создан", "UserCreationFailed", "Произошла ошибка при создании пользователя");
                }
                else
                {
                    result = new ResultInfo(status: "UserCreationFailed", info: "Ошибка при получении данных для создания пользователя");
                }
            }
            return Json(result);
        }

        [HttpPost("updateUser")]
        public async Task<JsonResult> UpdateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            ResultInfo result = new ResultInfo();
            if (userInfo != null)
            {
                User newUser = _db.Users.Find(userInfo.Id);
                if (!String.IsNullOrEmpty(userInfo.Password))
                {
                    newUser.Password = userInfo.Password.GetCustomAlgoHashCode(SHA256.Create());
                }
                if (userInfo.ChangePasswordKey != null)
                {
                    newUser.Key = userInfo.ChangePasswordKey;
                }
                _db.Users.Update(newUser);
                int res = await _db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, "UserUpdated", "Данные пользователя успешно обновлены", "UserUpdateFailed", "Произошла ошибка при обновлении данных пользователя");
            }
            else
            {
                result = new ResultInfo(status: "UserUpdateFailed", info: "Ошибка при получении данных для редактирования пользователя");
            }
            return Json(result);
        }

        [HttpPost("deleteUsers")]
        public async Task<JsonResult> DeleteUserAsync([FromBody] Identificators ids)
        {
            // убрать это в Валидатор. Из массива пришедших Id надо отфильтровать Id самого юзера, чтоб он сам себя не удалил.
            User authenticatedUser = await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(User.Identity.Name));
            int res = 0;
            List<int> filteredIds = ids.Ids.Where(id => id != authenticatedUser.Id).ToList();
            List<User> usersToDelete = _db.Users.Where(u => filteredIds.Contains(u.Id)).ToList();
            foreach (var userToDelete in usersToDelete)
            {
                _db.Users.Remove(userToDelete);
            }
            res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "UsersDeleted", "Пользователи успешно удалены", "UsersDeletionFailed", "Произошла ошибка при удалении пользователей");
            return Json(result);
        }
    }
}
