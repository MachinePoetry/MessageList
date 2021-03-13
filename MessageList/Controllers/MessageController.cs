using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.QueryModels;
using MessageList.Models.Helpers;

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
            // Application returns only 20 messages for every group for the first load. More messages are uploaded manualy by 'counter' and 'group' params

            User user = _db.Users.Find(id);
            List<MessageGroup> messageGroups = await _db.MessageGroups.Where(mg => mg.UserId == id).AsNoTracking().AsSplitQuery().Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Images)
                                                                                                                                 .Include(m => m.Messages).ThenInclude(mes => mes.UrlPreviews).ToListAsync();
            foreach (var mg in messageGroups)
            {
                foreach (var m in mg.Messages)
                {
                    m.FileCollection.Video = await _db.Video.Where(video => video.FileCollectionId == m.FileCollection.Id).Select(v => new VideoFile(v.Id, v.ContentType, v.FileName, v.Length, v.FileCollectionId, null)).ToListAsync();
                    m.FileCollection.Audio = await _db.Audio.Where(audio => audio.FileCollectionId == m.FileCollection.Id).Select(a => new AudioFile(a.Id, a.ContentType, a.FileName, a.Length, a.FileCollectionId, null)).ToListAsync();
                    m.FileCollection.Files = await _db.Files.Where(file => file.FileCollectionId == m.FileCollection.Id).Select(f => new OtherFile(f.Id, f.ContentType, f.FileName, f.Length, f.FileCollectionId, null)).ToListAsync();
                }
            }

            if (user.MessagesToLoadAmount != 0)
            { 
                messageGroups.ForEach(mg => mg.Messages = mg.Messages.AsEnumerable().Reverse().Take(user.MessagesToLoadAmount).Reverse().ToList());
            }

            if (counter != null && groupId != null)
            {
                List<Message> messages = await _db.Messages.Where(mes => mes.MessageGroupId == groupId).Include(m => m.FileCollection.Images)
                                                                                                        .Include(m => m.FileCollection.Video)
                                                                                                        .Include(m => m.FileCollection.Audio)
                                                                                                        .Include(m => m.FileCollection.Files)
                                                                                                        .Include(m => m.UrlPreviews)
                                                                                                        .OrderBy(m => m.CreatedAt).Reverse().Take((int)counter).Reverse().ToListAsync();
                messageGroups.FirstOrDefault(m => m.Id == groupId).Messages = messages;
            }
            return Json(messageGroups);
        }

        [HttpPost("search")]
        public async Task<JsonResult> GetSearchedMessagesAsync(SearchParams sp)
        {
            List<MessageGroup> messageGroups = await _db.MessageGroups.Where(mg => mg.UserId == sp.AuthUserId)
                                                                                            .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Images)
                                                                                            .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Video)
                                                                                            .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Audio)
                                                                                            .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Files)
                                                                                            .Include(m => m.Messages).ThenInclude(mes => mes.UrlPreviews).ToListAsync();
            if (!String.IsNullOrEmpty(sp.StringToSearch) && sp.DateToSearch == null)
            {
                foreach (var mg in messageGroups)
                {
                    if (mg.Id == sp.GroupId)
                    {
                        mg.Messages = mg.Messages.Where(m => m.Text != null ? m.Text.Contains(sp.StringToSearch) : false).ToList();
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
            bool isMessageWithFiles = FileHelper.isMessageWithFiles(mes);
            bool isMessageWithUrlPreviews = FileHelper.isMessageWithUrlPreviews(mes);

            int res = 0;
            ResultInfo result = new ResultInfo();
            Message message = new Message();
            message.MessageGroupId = reqMessageGroupId;

            if (String.IsNullOrEmpty(mes.Text) && !isMessageWithFiles && !isMessageWithUrlPreviews)
            {
                result = new ResultInfo(status: "MessageCreationFailed", info: "Отсутствуют данные для создания сообщения");
            }
            else 
            {
                if (authUserIdResult && messageGroupIdResult && !String.IsNullOrEmpty(mes.Text))
                {
                    message.Text = mes.Text;
                }
                if (authUserIdResult && messageGroupIdResult && isMessageWithFiles)
                {
                    List<ImageFile> images = mes.Images.Select(i => new ImageFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                    List<VideoFile> video = mes.Video.Select(i => new VideoFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                    List<AudioFile> audio = mes.Audio.Select(i => new AudioFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                    List<OtherFile> files = mes.Files.Select(i => new OtherFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                    message.FileCollection = new FileCollection(images, video, audio, files);
                }
                if (authUserIdResult && messageGroupIdResult && isMessageWithUrlPreviews)
                {
                    foreach (var jStr in mes.UrlPreviews)
                    {
                        JObject jObj = JObject.Parse(jStr);
                        if (jObj != null && jObj.HasValues)
                        {
                            string title = jObj.Property("title").Value.ToString();
                            string description = jObj.Property("description").Value.ToString();
                            string image = jObj.Property("image").Value.ToString();
                            string url = jObj.Property("url").Value.ToString();
                            UrlPreview preview = new UrlPreview(title, description, image, url);
                            message.UrlPreviews.Add(preview);
                        }
                    }
                }
                await _db.Messages.AddAsync(message);
                res = await _db.SaveChangesAsync();
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
                Message message = await _db.Messages.Where(m => m.Id == selectedMessageId).Include(mes => mes.FileCollection).Include(mes => mes.UrlPreviews).FirstOrDefaultAsync();

                if (message != null)
                {
                    message.Text = mes.Text;
                    message.UrlPreviews = message.UrlPreviews.Where(p => mes.UrlPreviewIds.Contains(p.Id)).ToList();
                    foreach (var jStr in mes.UrlPreviews)
                    {
                        JObject jObj = JObject.Parse(jStr);
                        if (jObj != null && jObj.HasValues)
                        {
                            string title = jObj.Property("title").Value.ToString();
                            string description = jObj.Property("description").Value.ToString();
                            string image = jObj.Property("image").Value.ToString();
                            string url = jObj.Property("url").Value.ToString();
                            UrlPreview preview = new UrlPreview(title, description, image, url);
                            message.UrlPreviews.Add(preview);
                        }
                    }
                    message.FileCollection.Images = await _db.Images.Where(i => i.FileCollectionId == message.FileCollection.Id).ToListAsync();
                    message.FileCollection.Images = message.FileCollection.Images.Where(i => mes.ImagesIds.Contains(i.Id)).ToList();
                    List<ImageFile> newImages = mes.Images.Select(i => new ImageFile(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
                    message.FileCollection.Images.AddRange(newImages);

                    message.FileCollection.Video = await _db.Video.Where(v => v.FileCollectionId == message.FileCollection.Id).ToListAsync();
                    message.FileCollection.Video = message.FileCollection.Video.Where(v => mes.VideoIds.Contains(v.Id)).ToList();
                    List<VideoFile> newVideo = mes.Video.Select(v => new VideoFile(v.ContentType, v.FileName, v.Length, FileHelper.getFileData(v))).ToList();
                    message.FileCollection.Video.AddRange(newVideo);

                    message.FileCollection.Audio = await _db.Audio.Where(a => a.FileCollectionId == message.FileCollection.Id).ToListAsync();
                    message.FileCollection.Audio = message.FileCollection.Audio.Where(a => mes.AudioIds.Contains(a.Id)).ToList();
                    List<AudioFile> newAudio = mes.Audio.Select(a => new AudioFile(a.ContentType, a.FileName, a.Length, FileHelper.getFileData(a))).ToList();
                    message.FileCollection.Audio.AddRange(newAudio);

                    message.FileCollection.Files = await _db.Files.Where(f => f.FileCollectionId == message.FileCollection.Id).ToListAsync();
                    message.FileCollection.Files = message.FileCollection.Files.Where(f => mes.FilesIds.Contains(f.Id)).ToList();
                    List<OtherFile> newFiles = mes.Files.Select(f => new OtherFile(f.ContentType, f.FileName, f.Length, FileHelper.getFileData(f))).ToList();
                    message.FileCollection.Files.AddRange(newFiles);

                    _db.Messages.Update(message);
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
