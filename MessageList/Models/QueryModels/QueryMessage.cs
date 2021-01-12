using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;

namespace MessageList.Models.QueryModels
{
    public class QueryMessage
    {
        public string Text { get; set; }
        public string AuthUserId { get; set; }
        public string MessageGroupId { get; set; }
        public string SelectedMessageId { get; set; }
        public List<IFormFile> Images { get; set; }
        public List<IFormFile> Video { get; set; }
        public List<IFormFile> Audio { get; set; }
        public List<IFormFile> Files { get; set; }
    }
}
