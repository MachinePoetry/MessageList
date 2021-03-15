using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models;

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

        [HttpGet("getUser")]
        //TODO: Создать и дать атрибут [AdminOnly]
        public async Task<JsonResult> GetUser([FromQuery] int id)
        {

            User user = await _db.Users.FirstOrDefaultAsync(userId => userId.Id == id);
            return Json(user);
        }

        [HttpGet("getUsers")]
        //TODO: Создать и дать атрибут [AdminOnly]
        public async Task<JsonResult> GetUsers()
        {
            return Json(await _db.Users.ToListAsync());
        }

        // create User взять из регистрации
        // update гнаписать свой, а в MessageController Update метод переименовать на updateCredentials

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
