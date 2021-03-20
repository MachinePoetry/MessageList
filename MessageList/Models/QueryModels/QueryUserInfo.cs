using System;
using System.Collections.Generic;

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

    }
}
