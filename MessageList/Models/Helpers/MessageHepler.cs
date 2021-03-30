using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;
using MessageList.Models.Interfaces;

namespace MessageList.Models.Helpers
{
    public static class MessageHepler
    {
        public static async Task<ResultInfo> ApplyActionToMessageGroupAsync(QueryMessageGroup mg, IRepository repository, string mode)
        {
            ResultInfo result = new ResultInfo();
            if (mode.Equals("delete") || Validator.IsMessageGroupNameValid(mg.Name))
            {
                MessageGroup messageGroup = mode.Equals("create") ? new MessageGroup(name: mg.Name, userId: mg.AuthUserId) :
                                                                    await repository.GetMessageGroupByIdAsync((int)mg.SelectedGroupId);

                int res = await repository.ApplyActionToMessageGroup(messageGroup, mg, mode);
                result = ResultInfo.CreateResultInfo(res, "ActionApplied", "Действие завершено успешно", "ActionFailed", "Произошла ошибка при выполнении действия");
            }
            else
            {
                result = new ResultInfo("ActionFailed", "Ошибка при получении данных");
            }

            return result;
        }

        public static async Task<IEnumerable<MessageGroup>> GetMessageGroupsAsync(User user, IRepository repository)
        {
            // message groups are filled only by images and url previews, because they are lightweight. Other files are uploaded to message later in controller without blob data. 
            IEnumerable<MessageGroup> messageGroups = await repository.GetMessageGroupsAsync(user.Id);
            foreach (var mg in messageGroups)
            {
                mg.Messages = mg.Messages.AsEnumerable().Reverse().Take(Validator.IsMessagesToLoadAmountValid(user.MessagesToLoadAmount) && user.MessagesToLoadAmount != 0 ?
                                                                                                              user.MessagesToLoadAmount : int.MaxValue).Reverse().ToList();
                await FillMessagesWithFilesAsync(mg.Messages, repository);
            }
            return messageGroups;
        }

        public static async Task<IEnumerable<Message>> GetMessagesAsync(int groupId, int counter, IRepository repository)
        {
            IEnumerable<Message> messages = await repository.GetMessages(groupId);
            await FillMessagesWithFilesAsync(messages, repository);
            return messages.OrderBy(m => m.CreatedAt).Reverse().Take(counter).Reverse().ToList();
        }

        public static async Task FillMessagesWithFilesAsync(IEnumerable<Message> messages, IRepository repository)
        {
            foreach (var m in messages)
            {
                m.FileCollection.Video = await repository.GetVideoFiles(m.FileCollection.Id).ToListAsync();
                m.FileCollection.Audio = await repository.GetAudioFiles(m.FileCollection.Id).ToListAsync();
                m.FileCollection.Files = await repository.GetOtherFiles(m.FileCollection.Id).ToListAsync();
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

        public static IList<T> UpdateFileCollection<T>(IList<T> fileCollection, int fileCollectionId, IEnumerable<IFormFile> files, IEnumerable<int> filesIds, IRepository repository) where T : File, IDataFile, new()
        {
            fileCollection = repository.GetSpecifiedFiles<T>(fileCollectionId, filesIds).ToList();
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
