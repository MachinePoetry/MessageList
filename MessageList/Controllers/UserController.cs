using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Models;
using MessageList.Models.Extensions;
using MessageList.Models.QueryModels;
using MessageList.Data;

namespace MessageList.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class UserController : Controller
    {
        private ApplicationDbContext _db;
        public UserController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("getUsers")]
        //TODO: Создать и дать атрибут [AdminOnly]
        public async Task<JsonResult> GetUsers()
        {
            return Json(await _db.Users.ToListAsync());
        }

        [HttpGet("getUser")]
        //TODO: Создать и дать атрибут [AdminOnly]
        public async Task<JsonResult> GetUser([FromQuery] int id)
        {

            User user = await _db.Users.FirstOrDefaultAsync(userId => userId.Id == id);
            return Json(user);
        }

        [HttpGet("getAuthUserInfo")]
        [AllowAnonymous]
        public async Task<JsonResult> GetAuthUserInfo()
        {
            User user = await _db.Users.Where(u => u.Email.Equals(User.Identity.Name)).FirstOrDefaultAsync();
            return Json(user);
        }

        [HttpPost("setMessagesToLoadCounter")]
        public async Task<JsonResult> SetMessagesToLoadCounterAsync([FromBody] QueryMessagesToLoadAmount mes)
        {
            User user = await _db.Users.Where(u => u.Id == mes.AuthUserId).FirstOrDefaultAsync();
            user.MessagesToLoadAmount = mes.MessagesToLoadAmount;
            int res = 0;
            _db.Users.Update(user);
            res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "AmountOfLoadedMessagesChanged", "Данные успешно обновлены", "AmountOfLoadedMessagesFailed", "Произошла ошибка при обновлении даныых");
            return Json(result);
        }

        [HttpPost("setChangePasswordKey")]
        public async Task<JsonResult> SetChangePasswordKeyAsync([FromBody] QuerySetKey keyInfo)
        {
            User user = _db.Users.Find(keyInfo.AuthUserId);    // Method Find()
            int res = 0;
            ResultInfo result = new ResultInfo();
            if (user != null)
            {
                user.Key = keyInfo.Key.GetCustomAlgoHashCode(SHA256.Create());
                user.isChangePasswordKeySet = true;
                _db.Users.Update(user);
                res = await _db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, "KeySaved", "Ключ успешно сохранен", "KeyChangeFailed", "Произошла ошибка при сохранении ключа");
            }
            else 
            {
                result = new ResultInfo("UserNotFound", "Пользователь не найден");
            }
            return Json(result);
        }

        [HttpPost("validateChangePasswordKey")]
        [AllowAnonymous]
        public async Task<JsonResult> ValidateChangePasswordKeyAsync([FromBody] QueryValidateKey keyInfo)
        {
            User user = await _db.Users.Where(u => u.Email.Equals(keyInfo.Email)).FirstOrDefaultAsync();
            ResultInfo result = new ResultInfo();
            if (user != null && (String.IsNullOrEmpty(user.Key) || !user.Key.Equals(keyInfo.Key.GetCustomAlgoHashCode(SHA256.Create()))))
            {
                result = new ResultInfo("InvalidKey", "Неверный ключ восстановления пароля");
            }
            else if (user != null && user.Key.Equals(keyInfo.Key.GetCustomAlgoHashCode(SHA256.Create())))
            {
                return Json(user);
            }
            else 
            {
                result = new ResultInfo("UserNotFound", "Пользователь не найден");
            }
            return Json(result);
        }

        [HttpPost("changePassword")]
        [AllowAnonymous]
        public async Task<JsonResult> ChangePasswordAsync([FromBody] QueryChangePassword newPasswordInfo)
        {
            User user = await _db.Users.Where(u => u.Id == newPasswordInfo.AuthUserId).FirstOrDefaultAsync();
            ResultInfo result = new ResultInfo();
            int res = 0;
            if (user == null)
            {
                result = new ResultInfo("UserNotFound", "Пользователь не найден");
            }
            else         
            {
                if (newPasswordInfo.Mode.Equals("profile") && !String.IsNullOrEmpty(newPasswordInfo.OldPassword) && !String.IsNullOrEmpty(newPasswordInfo.NewPassword))
                {
                    if (!user.Password.Equals(newPasswordInfo.OldPassword.GetCustomAlgoHashCode(SHA256.Create())))
                    {
                        result = new ResultInfo("OldPasswordMismatch", "Старый пароль указан неверно");
                    }
                    else
                    {
                        user.Password = newPasswordInfo.NewPassword.GetCustomAlgoHashCode(SHA256.Create());
                        _db.Users.Update(user);
                        var us = user;
                        res = await _db.SaveChangesAsync();
                        result = ResultInfo.CreateResultInfo(res, "PasswordChanged", "Пароль обновлен", "PasswordChangeFailed", "Произошла ошибка при обновлении пароля");
                    }
                }
                else if (newPasswordInfo.Mode.Equals("restore") && !String.IsNullOrEmpty(newPasswordInfo.NewPassword))
                {
                    user.Password = newPasswordInfo.NewPassword.GetCustomAlgoHashCode(SHA256.Create());
                    _db.Users.Update(user);
                    var us = user;
                    res = await _db.SaveChangesAsync();
                    result = ResultInfo.CreateResultInfo(res, "PasswordChanged", "Пароль обновлен", "PasswordChangeFailed", "Произошла ошибка при обновлении пароля");
                }

            } 
            return Json(result);
        }

        [HttpPost("update")]
        public async Task<JsonResult> UpdateUserAsync([FromBody] Account acc)
        {
            User user = await _db.Users.FirstOrDefaultAsync(userId => userId.Id == acc.Id);
            int res = 0;
            //TODO: Нужна валидация email и пароля перед редактированием и созданием пользователя

            if (user != null && !String.IsNullOrEmpty(acc.Password))
            {
                if (!String.IsNullOrEmpty(acc.Email))
                {
                    user.Email = acc.Email;
                }
                if (!String.IsNullOrEmpty(acc.Password))
                {
                    user.Password = acc.Password.GetCustomAlgoHashCode(SHA256.Create());
                }

                res = await _db.SaveChangesAsync();
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "UserUpdated", "Данные успешно обновлены", "UserUpdateFailed", "Произошла ошибка при обновлении даныых");
            return Json(result);

        }

        [HttpPost("greeting")]
        public async Task<JsonResult> GreetUserAsync([FromBody] Identificator idContainer)
        {
            User user = await _db.Users.FirstOrDefaultAsync(userId => userId.Id == idContainer.Id);
            int res = 0;

            if (user != null)
            {
                user.IsGreeted = true;
                res = await _db.SaveChangesAsync();
            }
            return Json("Приветственное модальное окно отключено");

        }

        [HttpPost("delete")]
        public async Task<JsonResult> DeleteUserAsync([FromBody] int id)
        {
            User user = await _db.Users.FirstOrDefaultAsync(userId => userId.Id == id);
            int res = 0;

            if (user != null)
            {
                _db.Users.Remove(user);
                res = await _db.SaveChangesAsync();
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "UserDeleted", "Пользователь успешно удален", "UserDeletionFailed", "Произошла ошибка при удалении пользователя");
            return Json(result);

        }

        [HttpGet("getUserActivityHistory")]
        public async Task<JsonResult> GetUserActivityHistoryAsync([FromQuery] int authUserId)
        {
            List<UserRequestInfo> requests = await _db.UserRequestsHistory.Where(r => r.UserId == authUserId).OrderByDescending(req => req.Id).Take(20).ToListAsync();
            return Json(requests);
        }

        [HttpGet("getLastUserActivity")]
        public JsonResult GetLastUserActivity([FromQuery] int authUserId)
        {
            UserRequestInfo lastUserRequest = _db.UserRequestsHistory.Where(r => r.UserId == authUserId).OrderBy(req => req.Id).Last();
            return Json(lastUserRequest);
        }
    }
}
