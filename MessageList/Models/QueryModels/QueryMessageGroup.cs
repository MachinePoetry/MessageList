using System;

namespace MessageList.Models.QueryModels
{
    public class QueryMessageGroup
    {
        public int AuthUserId { get; set; }
        public string Name { get; set; }
        public int? SelectedGroupId { get; set; }
    }
}
