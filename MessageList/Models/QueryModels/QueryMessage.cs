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
        public List<int> ImagesIds { get; set; }
        public List<int> VideoIds { get; set; }
        public List<int> AudioIds { get; set; }
        public List<int> FilesIds { get; set; }
        public List<int> UrlPreviewIds { get; set; }
        public List<string> UrlPreviews { get; set; }

        public QueryMessage()
        {
            Images = new List<IFormFile>();
            Video = new List<IFormFile>();
            Audio = new List<IFormFile>();
            Files = new List<IFormFile>();
            ImagesIds = new List<int>();
            VideoIds = new List<int>();
            AudioIds = new List<int>();
            FilesIds = new List<int>();
            UrlPreviews = new List<string>();
            UrlPreviewIds = new List<int>();
        }
    }
}
