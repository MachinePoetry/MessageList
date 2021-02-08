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
using MessageList.Models.Services;

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
            // Application returns only 30 messages for every group for the first load. More messages are uploaded manualy by 'counter' and 'group' params

            List<MessageGroup> messageGroups = await _db.MessageGroups.Where(mg => mg.UserId == id).Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Images)
                                                                                                    .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Video)
                                                                                                    .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Audio)
                                                                                                    .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Files).ToListAsync();
            messageGroups.ForEach(mg => mg.Messages = mg.Messages.AsEnumerable().Reverse().Take(30).Reverse().ToList());

            if (counter != null && groupId != null)
            {
                List<Message> messages = await _db.Messages.Where(mes => mes.MessageGroupId == groupId).Include(m => m.FileCollection.Images)
                                                                                                        .Include(m => m.FileCollection.Video)
                                                                                                        .Include(m => m.FileCollection.Audio)
                                                                                                        .Include(m => m.FileCollection.Files)
                                                                                                        .OrderBy(m => m.CreatedAt).Reverse().Take((int)counter).Reverse().ToListAsync();
                messageGroups.FirstOrDefault(m => m.Id == groupId).Messages = messages;
            }
            return Json(messageGroups);
        }

        [HttpPost("search")]
        public async Task<JsonResult> GetSearchedMessagesAsync(SearchParams sp)
        {
            //TODO: Rewrite for Linq subcycle
            List<MessageGroup> messageGroups = await _db.MessageGroups.Where(mg => mg.UserId == sp.Id).Include(u => u.Messages).ToListAsync();
            if (!String.IsNullOrEmpty(sp.StringToSearch) && sp.DateToSearch == null)
            {
                foreach (var mg in messageGroups)
                {
                    if (mg.Id == sp.GroupId)
                    {
                        mg.Messages = mg.Messages.Where(m => m.Text.Contains(sp.StringToSearch)).ToList();
                    }
                }
            }
            else if (sp.DateToSearch != null)
            {
                DateTime date = new DateTime(sp.DateToSearch.Year, sp.DateToSearch.Month, sp.DateToSearch.Day);
                foreach (var mg in messageGroups)
                {
                    if (mg.Id == sp.GroupId)
                    {
                        mg.Messages = mg.Messages.Where(m => m.CreatedAt.Date == date.Date).ToList();
                    }
                }

            }
            return Json(messageGroups);
        }

        [HttpPost("create")]
        public async Task<JsonResult> CreateMessageAsync([FromForm] QueryMessage mes)
        {
            int reqAuthUserId, reqMessageGroupId;
            bool authUserIdResult = Int32.TryParse(mes.AuthUserId, out reqAuthUserId);
            bool messageGroupIdResult = Int32.TryParse(mes.MessageGroupId, out reqMessageGroupId);
            bool isMessageWithFiles = (mes.Images?.Count() > 0 || mes.Video?.Count() > 0 || mes.Audio?.Count() > 0 || mes.Files?.Count() > 0);

            int res = 0;
            ResultInfo result = new ResultInfo();

            if (authUserIdResult && messageGroupIdResult && !isMessageWithFiles)
            {
                if (!String.IsNullOrEmpty(mes.Text))
                {
                    Message message = new Message(text: mes.Text, messageGroupId: reqMessageGroupId);
                    await _db.Messages.AddAsync(message);
                    res = await _db.SaveChangesAsync();
                }
                else
                {
                    result = new ResultInfo(status: "MessageCreationFailed", info: "Отсутствует текст сообщения");
                }

            }
            else if (authUserIdResult && messageGroupIdResult && isMessageWithFiles)
            {
                Message message = new Message(text: mes.Text ?? String.Empty, messageGroupId: reqMessageGroupId);
                await _db.Messages.AddAsync(message);
                res = await _db.SaveChangesAsync();
                // Save message in database anyway (either has it text or not), then retrieve it to get it's id and give it to files in database's table
                Message mesForFiles = await _db.Messages.FirstOrDefaultAsync(m => m.Equals(message));
                if (mesForFiles != null)
                {
                    IEnumerable<ImageFile> images = FileService.ConvertFiles(mes.Images, mesForFiles.Id, typeof(ImageFile)).Cast<ImageFile>();
                    await FileService.SaveFilesToDatabaseAsync<ImageFile>(images, _db, _db.Images);
                    IEnumerable<VideoFile> video = FileService.ConvertFiles(mes.Video, mesForFiles.Id, typeof(VideoFile)).Cast<VideoFile>();
                    await FileService.SaveFilesToDatabaseAsync<VideoFile>(video, _db, _db.Video);
                    IEnumerable<AudioFile> audio = FileService.ConvertFiles(mes.Audio, mesForFiles.Id, typeof(AudioFile)).Cast<AudioFile>();
                    await FileService.SaveFilesToDatabaseAsync<AudioFile>(audio, _db, _db.Audio);
                    IEnumerable<OtherFile> files = FileService.ConvertFiles(mes.Files, mesForFiles.Id, typeof(OtherFile)).Cast<OtherFile>();
                    await FileService.SaveFilesToDatabaseAsync<OtherFile>(files, _db, _db.Files);
                }
            }
            result = ResultInfo.CreateResultInfo(res, "MessageCreated", "Сообщение успешно сохранено", "MessageCreationFailed", "Произошла ошибка при создании сообщения");
            return Json(result);
        }

        [HttpPost("update")]
        public async Task<JsonResult> UpdateMessage([FromForm] QueryMessage mes)
        {
            int selectedMessageId;
            bool selectedMessageIdResult = Int32.TryParse(mes.SelectedMessageId, out selectedMessageId);
            int res = 0;
            if (selectedMessageIdResult)
            {
                Message message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == selectedMessageId);
                if (message != null)
                {
                    message.Text = mes.Text;
                    res = await _db.SaveChangesAsync();
                }
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageUpdates", "Сообщение успешно изменено", "MessageUpdateFailed", "Произошла ошибка при изменении сообщения");
            return Json(result);
        }

        [HttpPost("delete")]
        public async Task<JsonResult> DeleteExistingMessage([FromBody] QueryMessage mes)
        {
            int authUserId, selectedMessageId;
            bool authUserIdResult = Int32.TryParse(mes.AuthUserId, out authUserId);
            bool selectedMessageIdResult = Int32.TryParse(mes.SelectedMessageId, out selectedMessageId);

            int res = 0;

            if (authUserIdResult && selectedMessageIdResult)
            {
                Message message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == selectedMessageId);
                User user = await _db.Users.FirstOrDefaultAsync(u => u.Id == authUserId);

                if (message != null && user != null && user.Email.Equals(User.Identity.Name))
                {
                    _db.Messages.Remove(message);
                    res = await _db.SaveChangesAsync();
                }
            }
            ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageDeleted", "Сообщение успешно удалено", "MessageDeletionFailed", "Произошла ошибка при удалении сообщения");
            return Json(result);
        }
    }
}
