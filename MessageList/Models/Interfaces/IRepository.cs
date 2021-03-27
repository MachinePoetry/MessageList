using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using MessageList.Models.Roles;

namespace MessageList.Models.Interfaces
{
    public interface IRepository
    {
          // feedbacks actions
        Task<IEnumerable<Feedback>> GetFeedbacksAsync();
        Task<IEnumerable<Feedback>> GetFeedbacksFilteredByIdsAsync(IEnumerable<int> ids);
        Task<int> CreateFeedbackAsync(Feedback newFeedback);
        Task<int> RemoveFeedbacksAsync(IEnumerable<Feedback> feedbacksToDelete);

          // users actions
        Task<User> GetUserByIdAsync(int id);
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByCredentialsAsync(string email, string password);
        Task<IEnumerable<User>> GetUsersFilteredByIdsAsync(IEnumerable<int> ids);
        Task<IEnumerable<User>> GetUsersWithRolesAsync();
        Task<int> SaveUserToDatabaseAsync(User newUser);
        Task<int> RemoveUsersAsync(IEnumerable<User> usersToDelete);

          // roles actions
        Task<IEnumerable<Role>> GetRolesAsync();
        Task<Role> GetRoleByNameAsync(string roleName);
        Task<IEnumerable<RolesToUsers>> GetUserRolesAsync(int userId);
        Task<int> SaveUserRolesToDatabaseAsync(IEnumerable<RolesToUsers> userRoles);
        Task<int> RemoveUserRolesAsync(IEnumerable<RolesToUsers> rolesToRemove);
    }
}
