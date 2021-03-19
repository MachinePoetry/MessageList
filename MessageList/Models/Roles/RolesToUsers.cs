using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace MessageList.Models.Roles
{
    [Table("roles_to_users")]
    public class RolesToUsers
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("related_user_id")]
        [Required]
        public int UserId { get; set; }
        public User User { get; set; }
        [Column("related_role_id")]
        [Required]
        public int RoleId { get; set; }
        public Role Role { get; set; }



        public RolesToUsers() { }
        public RolesToUsers(int userId, int roleId)
        {
            UserId = userId;
            RoleId = roleId;
        }
    }
}
