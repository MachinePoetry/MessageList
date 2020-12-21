﻿using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    [Table("message_groups")]
    public class MessageGroup
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("name")]
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = "DefaultName";
        public List<Message> Messages { get; set; }
        [Column("related_user_id")]
        [Required]
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
