using System;
using System.Collections.Generic;
using MessageList.Models.Helpers;

namespace MessageList.Models.QueryModels
{
    public class QueryUserInfo
    {
        public int? Id { get; set; }
        public string Email { get; set; }
        public int MessagesToLoadAmount { get; set; }
        public string ChangePasswordKey { get; set; }
        public string Password { get; set; }
        public List<int> RolesIds { get; set; }

        public QueryUserInfo()
        {
            MessagesToLoadAmount = FileHelper.MessagesToLoadAmountMin;
            RolesIds = new List<int>();
        }

        public QueryUserInfo(string email, string password)
        {
            Email = email;
            MessagesToLoadAmount = FileHelper.MessagesToLoadAmountMin;
            Password = password;
            RolesIds = new List<int>();
        }
    }
}
