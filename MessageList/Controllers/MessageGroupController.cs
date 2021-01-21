using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.QueryModels;

namespace MessageList.Controllers
{
    [Route("api/messageGroup")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class MessageGroupController : Controller
    {
        private ApplicationDbContext _db;
        public MessageGroupController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("create")]
        public async Task<JsonResult> CreateMessageGroupAsync([FromBody] MessageGroup mg)
        {
            ResultInfo result;
            MessageGroup messageGroup = new MessageGroup(name: mg.Name, userId: mg.UserId);
            await _db.MessageGroups.AddAsync(messageGroup);
            int res = await _db.SaveChangesAsync();
            result = ResultInfo.CreateResultInfo(res, "MessageGroupCreated", "Группа сообщений успешно создана", "MessageGroupCreationFailed", "Произошла ошибка при создании группы сообщений");
            return Json(result);
        }

        [HttpPost("update")]
        public async Task<JsonResult> UpdateMessageGroup([FromBody] MessageGroup mg)
        {
            int res = 0;
            MessageGroup messageGroup = await _db.MessageGroups.FirstOrDefaultAsync(mesgr => mesgr.Id == mg.Id);
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Id == mg.UserId);
            if (messageGroup != null && user != null && user.Email.Equals(User.Identity.Name))
            {
                messageGroup.Name = mg.Name;
                res = await _db.SaveChangesAsync();
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageGroupUpdated", "Группа сообщений успешно отредактирована", "MessageGroupUpdateFailed", "Произошла ошибка при редактировании группы сообщений");
            return Json(result);
        }

        [HttpPost("delete")]
        public async Task<JsonResult> DeleteMessageGroup([FromBody] QueryMessageGroup mg)
        {
            int res = 0;
            MessageGroup messageGroup = await _db.MessageGroups.FirstOrDefaultAsync(mGroup => mGroup.Id == mg.SelectedGroupId);
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Id == mg.AuthUserId);
            if (messageGroup != null && user != null && user.Email.Equals(User.Identity.Name))
            {
                _db.MessageGroups.Remove(messageGroup);
                res = await _db.SaveChangesAsync();
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageGroupDeleted", "Группа сообщений успешно удалена", "MessageGroupDeletionFailed", "Произошла ошибка при удалении группы сообщений");
            return Json(result);
        }
    }
}
