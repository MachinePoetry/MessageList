using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
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
        [Column("is_email_confirmed")]
        public bool IsEmailConfirmed { get; set; }
        [Column("created_at")]
        [Required]
        public DateTime CreatedAt { get; set; }
        [Column("is_admin")]
        public bool IsAdmin { get; set; }
        public List<MessageGroup> MessageGroups { get; set; }



        public User(string email, string password)
        {
            Email = email;
            Password = password;
            IsEmailConfirmed = false;
            CreatedAt = DateTime.Now;
            IsAdmin = false;
        }
    }
}
