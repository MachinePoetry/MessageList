using System;
using System.Text.Json.Serialization;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace MessageList.Models
{
    public class User
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(300)]
        public string Email { get; set; }
        [Required]
        [MaxLength(64)]
        [JsonIgnore]
        public string Password { get; set; }
        public bool IsEmailConfirmed { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }
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
