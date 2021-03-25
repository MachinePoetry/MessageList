using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using MessageList.Data;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;
using MessageList.Models.Interfaces;

namespace MessageList.Models.Helpers
{
    public static class MessageHepler
    {
        public static async Task<ResultInfo> ApplyActionToMessageGroup(QueryMessageGroup mg, ApplicationDbContext db, string mode)
        {
            ResultInfo result = new ResultInfo();
            if (mode.Equals("delete") || Validator.IsMessageGroupNameValid(mg.Name))
            {
                MessageGroup messageGroup = mode.Equals("create") ? new MessageGroup(name: mg.Name, userId: mg.AuthUserId) : 
                                                                    await db.MessageGroups.FirstOrDefaultAsync(mGroup => mGroup.Id == mg.SelectedGroupId);
                switch (mode)
                {
                    case "create":
                        db.MessageGroups.Add(messageGroup);
                        break;
                    case "update":
                        messageGroup.Name = mg.Name;
                        db.MessageGroups.Update(messageGroup);
                        break;
                    case "delete":
                        db.MessageGroups.Remove(messageGroup);
                        break;
                }
                int res = await db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, "ActionApplied", "Действие завершено успешно", "ActionFailed", "Произошла ошибка при выполнении действия");
            }
            else
            {
                result = new ResultInfo("ActionFailed", "Ошибка при получении данных");
            }

            return result;
        }

        public static IQueryable<MessageGroup> GetMessageGroups(int authUserId, ApplicationDbContext db)
        {
            // message groups are filled only by images and url previews, because they are lightweight. Other files are uploaded to message later in controller without blob data. 
            return db.MessageGroups.Where(mg => mg.UserId == authUserId).AsNoTracking().AsSplitQuery().Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Images)
                                                                                                      .Include(m => m.Messages).ThenInclude(mes => mes.UrlPreviews);
        }

        public static IQueryable<Message> GetMessages(int groupId, ApplicationDbContext db)
        {
            return db.Messages.Where(mes => mes.MessageGroupId == groupId).Include(m => m.FileCollection.Images).Include(m => m.UrlPreviews);
        }

        public static async Task FillMessagesWithFilesAsync(IEnumerable<Message> messages, ApplicationDbContext db)
        {
            foreach (var m in messages)
            {
                m.FileCollection.Video = await db.Video.Where(video => video.FileCollectionId == m.FileCollection.Id).Select(v => new VideoFile(v.Id, v.ContentType, v.FileName, v.Length, v.FileCollectionId, null)).ToListAsync();
                m.FileCollection.Audio = await db.Audio.Where(audio => audio.FileCollectionId == m.FileCollection.Id).Select(a => new AudioFile(a.Id, a.ContentType, a.FileName, a.Length, a.FileCollectionId, null)).ToListAsync();
                m.FileCollection.Files = await db.Files.Where(file => file.FileCollectionId == m.FileCollection.Id).Select(f => new OtherFile(f.Id, f.ContentType, f.FileName, f.Length, f.FileCollectionId, null)).ToListAsync();
            }
        }

        public static void FilterMessagesByExpression(IEnumerable<MessageGroup> messageGroups, int groupIdToFilter, Func<Message, bool> expression)
        {
            foreach (var mg in messageGroups)
            {
                if (mg.Id == groupIdToFilter)
                {
                    mg.Messages = mg.Messages.Where(expression).ToList();
                }
            }
        }

        public static IList<T> UpdateFileCollection<T>(IList<T> fileCollection, int fileCollectionId, DbSet<T> dbSet, IEnumerable<IFormFile> files, IEnumerable<int> filesIds, ApplicationDbContext db) where T : File, IDataFile, new()
        {
            fileCollection = dbSet.Where(i => i.FileCollectionId == fileCollectionId).ToList();
            fileCollection = fileCollection.Where(i => filesIds.Contains(i.Id)).ToList();
            //List<T> newFiles = files.Select(i => new T(i.ContentType, i.FileName, i.Length, FileHelper.getFileData(i))).ToList();
            foreach (var file in files)
            {
                T newFile = new T();
                newFile.ContentType = file.ContentType;
                newFile.FileName = file.FileName;
                newFile.Length = file.Length;
                newFile.Data = FileHelper.getFileData(file);
                fileCollection.Add(newFile);
            }
            return fileCollection;
        }

        public static void AddUrlPreviewsToMessage(IEnumerable<string> urlPreviewJsons, Message message)
        {
            foreach (var jStr in urlPreviewJsons)
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
    }
}
