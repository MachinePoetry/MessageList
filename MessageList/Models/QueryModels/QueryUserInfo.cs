using System;

namespace MessageList.Models.QueryModels
{
    public class QueryUserInfo
    {
        public int? Id { get; set; }
        public string Email { get; set; }
        public int MessagesToLoadAmount { get; set; }
        public string ChangePasswordKey { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }

    }
}
