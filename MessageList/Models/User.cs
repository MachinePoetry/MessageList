using System;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MessageList.Models
{
    [Table("users")]
    public class User
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("email")]
        [Required]
        [MaxLength(300)]
        public string Email { get; set; }
        [Column("password")]
        [Required]
        [MaxLength(64)]
        [JsonIgnore]
        public string Password { get; set; }
        [Column("change_password_key")]
        [MaxLength(64)]
        [JsonIgnore]
        public string Key { get; set; }
        [NotMapped]
        public bool isChangePasswordKeySet { get { return Key?.Length > 0; } set { } }
        [Column("created_at")]
        [Required]
        public DateTime CreatedAt { get; set; }
        [Column("is_greeted")]
        public bool IsGreeted { get; set; }
        [Column("messages_to_load_amount")]
        public int MessagesToLoadAmount { get; set; } = 20;
        [Column("is_admin")]
        public bool IsAdmin { get; set; }
        public List<MessageGroup> MessageGroups { get; set; }



        public User(string email, string password, int messagesToLoadAmount)
        {
            Email = email;
            Password = password;
            CreatedAt = DateTime.Now;
            MessagesToLoadAmount = messagesToLoadAmount;
            IsAdmin = false;
            MessageGroups = new List<MessageGroup>();
        }
    }
}
