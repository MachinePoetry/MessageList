using System;

namespace MessageList.Models.QueryModels
{
    public class QueryChangePassword
    {
        public int? AuthUserId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
