using System;
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
        [Column("related_message_group")]
        [Required]
        public int MessageGroupId { get; set; }
        [JsonIgnore]
        public MessageGroup MessageGroup { get; set; }


        public Message() {
            FileCollection = new FileCollection();
        }
        public Message (string text, int messageGroupId)
        {
            Text = text;
            MessageGroupId = messageGroupId;
            CreatedAt = DateTime.Now;
            FileCollection = new FileCollection();
        }
    }
}
