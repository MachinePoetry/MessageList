using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    [Table("messages")]
    public class Message
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("text")]
        [MaxLength(5000)]
        public string Text { get; set; }
        [Column("created_at")]
        [Required]
        public DateTime CreatedAt { get; set; }
        public FileCollection FileCollection { get; set; }
        public List<UrlPreview> UrlPreviews { get; set; }
        [Column("related_message_group")]
        [Required]
        public int MessageGroupId { get; set; }
        [JsonIgnore]
        public MessageGroup MessageGroup { get; set; }


        public Message() {
            Text = String.Empty;
            CreatedAt = DateTime.Now;
            FileCollection = new FileCollection();
            UrlPreviews = new List<UrlPreview>();
        }
        public Message (string text, int messageGroupId)
        {
            Text = text;
            MessageGroupId = messageGroupId;
            CreatedAt = DateTime.Now;
            FileCollection = new FileCollection();
            UrlPreviews = new List<UrlPreview>();
        }
    }
}
