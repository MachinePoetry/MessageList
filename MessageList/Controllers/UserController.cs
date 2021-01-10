using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Models;
using MessageList.Models.Extensions;
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
    }
}
