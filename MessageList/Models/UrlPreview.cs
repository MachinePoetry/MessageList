using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace MessageList.Models
{
    [Table("url_previews")]
    public class UrlPreview
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("title")]
        public string Title { get; set; }
        [Column("description")]
        public string Description { get; set; }
        [Column("image")]
        public string Image { get; set; }
        [Column("url")]
        public string Url { get; set; }
        [Column("related_message_id")]
        [Required]
        public int MessageId { get; set; }
        [JsonIgnore]
        public Message Message { get; set; }

        public UrlPreview() { }
        public UrlPreview(string title, string description, string image, string url) 
        {
            Title = title;
            Description = description;
            Image = image;
            Url = url;
        }
    }
}
