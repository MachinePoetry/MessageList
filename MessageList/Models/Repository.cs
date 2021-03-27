using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models.Extensions;
using MessageList.Models.Interfaces;
using MessageList.Models.Roles;

namespace MessageList.Models
{
    public class Repository : IRepository
    {
        private ApplicationDbContext _db;
        public Repository(ApplicationDbContext db)
        {
            _db = db;
        }

          // feedbacks actions
        public async Task<IEnumerable<Feedback>> GetFeedbacksAsync() => await _db.Feedbacks.ToListAsync();
        public async Task<IEnumerable<Feedback>> GetFeedbacksFilteredByIdsAsync(IEnumerable<int> ids) => await _db.Feedbacks.Where(u => ids.Contains(u.Id)).ToListAsync();
        public async Task<int> CreateFeedbackAsync(Feedback newFeedback)
        {
            _db.Feedbacks.Add(newFeedback);
            return await _db.SaveChangesAsync();
        }
        public async Task<int> RemoveFeedbacksAsync(IEnumerable<Feedback> feedbacksToDelete)
        {
            _db.Feedbacks.RemoveRange(feedbacksToDelete);
            return await _db.SaveChangesAsync();
        }

          // users actions
        public async Task<User> GetUserByIdAsync(int id) => await Task.Run(() => _db.Users.Find(id));
        public async Task<User> GetUserByEmailAsync(string email) => await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
        public async Task<User> GetUserByCredentialsAsync(string email, string password) => await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(email) && u.Password.Equals(password.GetCustomAlgoHashCode(SHA256.Create())));
        public async Task<IEnumerable<User>> GetUsersFilteredByIdsAsync(IEnumerable<int> ids) => await _db.Users.Where(u => ids.Contains(u.Id)).ToListAsync();
        public async Task<IEnumerable<User>> GetUsersWithRolesAsync() => await _db.Users.Include(u => u.RolesToUsers).ToListAsync();
        public async Task<int> SaveUserToDatabaseAsync(User newUser)
        {
            _db.Users.Add(newUser);
            return await _db.SaveChangesAsync();
        }
        public async Task<int> RemoveUsersAsync(IEnumerable<User> usersToDelete)
        {
            _db.Users.RemoveRange(usersToDelete);
            return await _db.SaveChangesAsync();
        }

          // roles actions
        public async Task<IEnumerable<Role>> GetRolesAsync() => await _db.Roles.ToListAsync();
        public async Task<Role> GetRoleByNameAsync(string roleName) => await _db.Roles.FirstOrDefaultAsync(r => r.Name.Equals(roleName));
        public async Task<IEnumerable<RolesToUsers>> GetUserRolesAsync(int userId) => await _db.RolesToUsers.Where(r => r.UserId == userId).ToListAsync();
        public async Task<int> SaveUserRolesToDatabaseAsync(IEnumerable<RolesToUsers> userRoles)
        {
            _db.RolesToUsers.AddRange(userRoles);
            return await _db.SaveChangesAsync();
        }
        public async Task<int> RemoveUserRolesAsync(IEnumerable<RolesToUsers> rolesToRemove)
        {
            _db.RolesToUsers.RemoveRange(rolesToRemove);
            return await _db.SaveChangesAsync();
        }
    }
}
