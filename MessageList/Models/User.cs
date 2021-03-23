using System;
using System.Linq;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using MessageList.Models.Roles;

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
        public bool isChangePasswordKeySet { get => !String.IsNullOrEmpty(Key); }
        [Column("created_at")]
        [Required]
        public DateTime CreatedAt { get; set; }
        [Column("is_greeted")]
        public bool IsGreeted { get; set; }
        [Column("messages_to_load_amount")]
        public int MessagesToLoadAmount { get; set; }
        [JsonIgnore]
        public List<RolesToUsers> RolesToUsers { get; set; }
        [NotMapped]
        [JsonProperty("roles")]
        public List<string> RolesNames { get ; set; }
        public List<MessageGroup> MessageGroups { get; set; }



        public User() 
        {
            CreatedAt = DateTime.Now;
            MessagesToLoadAmount = 20;
            IsGreeted = false;
            MessageGroups = new List<MessageGroup>();
            RolesToUsers = new List<RolesToUsers>();
            RolesNames = new List<string>();
        }
        public User(string email, string password, int messagesToLoadAmount)
        {
            Email = email;
            Password = password;
            CreatedAt = DateTime.Now;
            MessagesToLoadAmount = messagesToLoadAmount;
            IsGreeted = false;
            MessageGroups = new List<MessageGroup>();
            RolesToUsers = new List<RolesToUsers>();
            RolesNames = new List<string>();
        }
    }
}
