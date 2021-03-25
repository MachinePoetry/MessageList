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
using MessageList.Models.Helpers;
using MessageList.Models.Validators;

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
        public async Task<IActionResult> GetGroupesAndMessagesAsync([FromQuery] int id, int? counter, int? groupId)
        {
            // messages are uploaded by parts (not all at once. 'user.MessagesToLoadAmount' is default amount). Incoming 'counter' tells that user wants to upload more messages.
            if (await UserHelper.IsAuthenticatedUserAsync(id, User.Identity.Name, _db))
            {
                User user = await _db.Users.FirstOrDefaultAsync(u => u.Id == id);
                List<MessageGroup> messageGroups = await MessageHepler.GetMessageGroups(id, _db).Take(Validator.IsMessagesToLoadAmountValid(user.MessagesToLoadAmount) &&
                                                                                                 user.MessagesToLoadAmount != 0 ? user.MessagesToLoadAmount : int.MaxValue).ToListAsync();
                foreach (var mg in messageGroups)
                {
                    await MessageHepler.FillMessagesWithFilesAsync(mg.Messages, _db);
                }

                if (counter != null && groupId != null)
                {
                    List<Message> messages = await MessageHepler.GetMessages((int)groupId, _db).OrderBy(m => m.CreatedAt).Reverse().Take((int)counter).Reverse().ToListAsync();
                    await MessageHepler.FillMessagesWithFilesAsync(messages, _db);
                    messageGroups.FirstOrDefault(mg => mg.Id == groupId).Messages = messages;
                }
                return Json(messageGroups);
            }
            else
            {
                return StatusCode(403);
            }
        }

        [HttpPost("search")]
        public async Task<IActionResult> GetSearchedMessagesAsync(SearchParams sp)
        {
            if (await UserHelper.IsAuthenticatedUserAsync(sp.AuthUserId, User.Identity.Name, _db))
            {
                List<MessageGroup> messageGroups = await MessageHepler.GetMessageGroups(sp.AuthUserId, _db).ToListAsync();
                foreach (var mg in messageGroups)
                {
                    await MessageHepler.FillMessagesWithFilesAsync(mg.Messages, _db);
                }

                if (!String.IsNullOrEmpty(sp.StringToSearch) && sp.DateToSearch == null)
                {
                    MessageHepler.FilterMessagesByExpression(messageGroups, sp.GroupId, m => m.Text != null ? m.Text.Contains(sp.StringToSearch) : false);
                }
                else if (sp.DateToSearch != null)
                {
                    DateTime date = new DateTime(sp.DateToSearch.Year, sp.DateToSearch.Month, sp.DateToSearch.Day);
                    MessageHepler.FilterMessagesByExpression(messageGroups, sp.GroupId, m => m.CreatedAt.Date == date.Date);

                }
                return Json(messageGroups);
            }
            else
            {
                return StatusCode(403);
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMessageAsync([FromForm] QueryMessage mes)
        {
            int authUserId, messageGroupId;
            bool authUserIdResult = Int32.TryParse(mes.AuthUserId, out authUserId);
            bool messageGroupIdResult = Int32.TryParse(mes.MessageGroupId, out messageGroupId);
            bool isMessageWithFiles = FileHelper.isMessageWithFiles(mes);
            bool isMessageWithUrlPreviews = FileHelper.isMessageWithUrlPreviews(mes);

            if (authUserIdResult && messageGroupIdResult && await UserHelper.IsAuthenticatedUserAsync(authUserId, User.Identity.Name, _db))
            {
                ResultInfo result = new ResultInfo();

                if (!Validator.IsMessageTextValid(mes.Text) && !isMessageWithFiles && !isMessageWithUrlPreviews)
                {
                    result = new ResultInfo(status: "MessageCreationFailed", info: "Отсутствуют данные для создания сообщения");
                }
                else if (!Validator.IsMessageTextValid(mes.Text))
                {
                    result = new ResultInfo(status: "MessageCreationFailed", info: "Недопустимая длина текста сообщения");
                }
                else
                {
                    Message message = new Message(mes.Text ?? String.Empty, messageGroupId);
                    if (isMessageWithFiles)
                    {
                        List<ImageFile> images = mes.Images.Select(i => new ImageFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                        List<VideoFile> video = mes.Video.Select(i => new VideoFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                        List<AudioFile> audio = mes.Audio.Select(i => new AudioFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                        List<OtherFile> files = mes.Files.Select(i => new OtherFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                        message.FileCollection = new FileCollection(images, video, audio, files);
                    }
                    if (isMessageWithUrlPreviews)
                    {
                        MessageHepler.AddUrlPreviewsToMessage(mes.UrlPreviews, message);
                    }
                    await _db.Messages.AddAsync(message);
                    int res = await _db.SaveChangesAsync();
                    result = ResultInfo.CreateResultInfo(res, "MessageCreated", "Сообщение успешно сохранено", "MessageCreationFailed", "Произошла ошибка при создании сообщения");
                }
                return Json(result);
            }
            else
            {
                return StatusCode(403);
            }
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateMessageAsync([FromForm] QueryMessage mes)
        {
            int authUserId, selectedMessageId;
            bool authUserIdResult = Int32.TryParse(mes.AuthUserId, out authUserId);
            bool selectedMessageIdResult = Int32.TryParse(mes.SelectedMessageId, out selectedMessageId);

            if (authUserIdResult && selectedMessageIdResult && await UserHelper.IsAuthenticatedUserAsync(authUserId, User.Identity.Name, _db))
            {
                ResultInfo result = new ResultInfo();
                Message message = await _db.Messages.Where(m => m.Id == selectedMessageId).Include(mes => mes.FileCollection).Include(mes => mes.UrlPreviews).FirstOrDefaultAsync();

                if (message != null)
                {
                    message.Text = mes.Text ?? String.Empty;
                    message.UrlPreviews = message.UrlPreviews.Where(p => mes.UrlPreviewIds.Contains(p.Id)).ToList();
                    MessageHepler.AddUrlPreviewsToMessage(mes.UrlPreviews, message);

                    message.FileCollection.Images = MessageHepler.UpdateFileCollection<ImageFile>(message.FileCollection.Images, message.FileCollection.Id, _db.Images, mes.Images, mes.ImagesIds, _db).ToList();
                    message.FileCollection.Video = MessageHepler.UpdateFileCollection<VideoFile>(message.FileCollection.Video, message.FileCollection.Id, _db.Video, mes.Video, mes.VideoIds, _db).ToList();
                    message.FileCollection.Audio = MessageHepler.UpdateFileCollection<AudioFile>(message.FileCollection.Audio, message.FileCollection.Id, _db.Audio, mes.Audio, mes.AudioIds, _db).ToList();
                    message.FileCollection.Files = MessageHepler.UpdateFileCollection<OtherFile>(message.FileCollection.Files, message.FileCollection.Id, _db.Files, mes.Files, mes.FilesIds, _db).ToList();

                    _db.Messages.Update(message);
                    int res = await _db.SaveChangesAsync();
                    result = ResultInfo.CreateResultInfo(res, "MessageUpdated", "Сообщение успешно изменено", "MessageUpdateFailed", "Произошла ошибка при изменении сообщения");
                }
                else
                {
                    result = new ResultInfo("MessageUpdateFailed", "Сообщение не найдено");
                }
                return Json(result);
            }
            else
            {
                return StatusCode(403);
            }
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteMessageAsync([FromBody] QueryDeleteMessage mes)
        {
            if (await UserHelper.IsAuthenticatedUserAsync(mes.AuthUserId, User.Identity.Name, _db))
            {
                Message message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == mes.SelectedMessageId);
                _db.Messages.Remove(message);
                int res = await _db.SaveChangesAsync();
                ResultInfo result = ResultInfo.CreateResultInfo(res, "MessageDeleted", "Сообщение успешно удалено", "MessageDeletionFailed", "Произошла ошибка при удалении сообщения");
                return Json(result);
            }
            else
            {
                return StatusCode(403);
            }
        }
    }
}
