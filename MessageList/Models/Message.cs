using System;
using System.Text.Json.Serialization;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    public class Message
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(5000)]
        public string Text { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
        [Required]
        [Column("RelatedMessageGroup")]
        public int MessageGroupId {get; set;}
        [JsonIgnore]
        public MessageGroup MessageGroup { get; set; }

        public Message() { }
        public Message (string text, int messageGroupId)
        {
            Text = text;
            MessageGroupId = messageGroupId;
            CreatedAt = DateTime.Now;
        }
    }
}
