using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    public class MessageGroup
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = "DefaultName";
        public List<Message> Messages { get; set; }
        [Required]
        [Column("RelatedUserId")]
        public int UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        public MessageGroup() { }
        public MessageGroup(string name, int userId)
        {
            Name = name;
            UserId = userId;
        }
    }
}
