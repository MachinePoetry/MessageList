using System;

namespace MessageList.Models.QueryModels
{
    public class SearchParams
    {
        public int AuthUserId { get; set; } 
        public int GroupId { get; set; } 
        public string StringToSearch { get; set; }
        public SearchDate DateToSearch { get; set; }
    }
}
