using System;

namespace MessageList.Models.QueryModels
{
    public class QueryMessage
    {
        public int? Id { get; set; }
        public string Text { get; set; }
        public int AuthUserId { get; set; }
        public int MessageGroupId { get; set; }
    }
}
