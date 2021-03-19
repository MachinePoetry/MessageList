using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace MessageList.Models.Roles
{
    [Table("roles")]
    public class Role
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("name")]
        [Required]
        [MaxLength(300)]
        public string Name { get; set; }
        [JsonIgnore]
        public List<RolesToUsers> RolesToUsers { get; set; }



        public Role()
        {
            RolesToUsers = new List<RolesToUsers>();
        }
    }
}
