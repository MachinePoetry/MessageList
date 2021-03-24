using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;

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
    }
}
