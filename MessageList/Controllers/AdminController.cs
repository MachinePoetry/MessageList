using System;
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
            ResultInfo result = new ResultInfo();
            if (userInfo != null)
            {
                User newUser = new User(userInfo.Email, userInfo.Password.GetCustomAlgoHashCode(SHA256.Create()), userInfo.MessagesToLoadAmount);
                newUser.IsAdmin = userInfo.IsAdmin;
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
            return Json(result);
        }

        [HttpPost("updateUser")]
        public async Task<JsonResult> UpdateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            ResultInfo result = new ResultInfo();
            if (userInfo != null)
            {
                User newUser = _db.Users.Find(userInfo.Id);
                newUser.IsAdmin = userInfo.IsAdmin;
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

        [HttpPost("delete")]
        public async Task<JsonResult> DeleteUserAsync([FromBody] List<int> ids)
        {
            User user = await _db.Users.FirstOrDefaultAsync(userId => userId.Id == ids[0]);
            int res = 0;

            if (user != null)
            {
                _db.Users.Remove(user);
                res = await _db.SaveChangesAsync();
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "UserDeleted", "Пользователь успешно удален", "UserDeletionFailed", "Произошла ошибка при удалении пользователя");
            return Json(result);
        }
    }
}
