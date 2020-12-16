using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.QueryModels;

namespace MessageList.Controllers
{
    [Route("api/messages")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class MessageController : Controller
    {
        private ApplicationDbContext _db;
        public MessageController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("getGroupesAndMessages")]
        public async Task<JsonResult> GetGroupesAndMessagesAsync([FromQuery] int id, int? counter, int? groupId)
        {
            // Application returns only 30 messages for every group for the first load. More messages are uploaded only for group from params 
            List<MessageGroup> messageGroups = await _db.MessageGroups.Where(mg => mg.UserId == id).Include(m => m.Messages).ToListAsync();
            messageGroups.All(mg => { mg.Messages = mg.Messages.AsEnumerable().Reverse().Take(30).Reverse().ToList(); return true; });

            if (counter != null && groupId != null)
            {
                List<Message> messages = await _db.Messages.Where(mes => mes.MessageGroupId == groupId).OrderBy(m => m.CreatedAt)
                                               .Reverse().Take((int)counter).Reverse().ToListAsync();
                messageGroups.FirstOrDefault(m => m.Id == groupId).Messages = messages;
            }
            return Json(messageGroups);
        }

        [HttpGet("search")]
        public async Task<JsonResult> GetSearchedMessagesAsync([FromQuery] int id, int groupId, string stringToSearch)
        {
            List<MessageGroup> messageGroups = await _db.MessageGroups.Where(mg => mg.UserId == id).Include(u => u.Messages).ToListAsync();
            foreach (var mg in messageGroups)
            {
                if (mg.Id == groupId)
                {
                    mg.Messages = mg.Messages.Where(m => m.Text.Contains(stringToSearch)).ToList();
                }
            }
            return Json(messageGroups);
        }

        [HttpPost("create")]
        public async Task<JsonResult> CreateMessageAsync([FromBody] QueryMessage mes)
        {
            Message message = new Message(text: mes.Text, messageGroupId: mes.MessageGroupId);
            await _db.Messages.AddAsync(message);
            int res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageCreated", "Сообщение успешно сохранено", "MessageCreationFailed", "Произошла ошибка при создании сообщения");
            return Json(result);
        }

        [HttpPost("update")]
        public async Task<JsonResult> UpdateMessage([FromBody] QueryMessage mes)
        {
            int res = 0;
            Message message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == mes.Id);
            if (message != null)
            {
                message.Text = mes.Text;
                res = await _db.SaveChangesAsync();
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageUpdates", "Сообщение успешно изменено", "MessageUpdateFailed", "Произошла ошибка при изменении сообщения");
            return Json(result);
        }


        [HttpPost("delete")]
        public async Task<JsonResult> DeleteExistingMessage ([FromBody] QueryMessage mes)
        {
            int res = 0;
            Message message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == mes.Id);
            MessageGroup messageGroup = await _db.MessageGroups.FirstOrDefaultAsync(mg => mg.Id == message.MessageGroupId);
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Id == mes.AuthUserId);

            if (message != null && user != null && user.Email.Equals(User.Identity.Name))
            {
                _db.Messages.Remove(message);
                res = await _db.SaveChangesAsync();
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageDeleted", "Сообщение успешно удалено", "MessageDeletionFailed", "Произошла ошибка при удалении сообщения");
            return Json(result);
        }
    }
}
