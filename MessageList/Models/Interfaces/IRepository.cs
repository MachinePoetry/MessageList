using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using MessageList.Models.QueryModels;
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
        Task<User> GetAuthenticatedUserAsync(string email);
        Task<User> GetUserByCredentialsAsync(string email, string password);
        Task<IEnumerable<User>> GetUsersFilteredByIdsAsync(IEnumerable<int> ids);
        Task<IEnumerable<User>> GetUsersWithRolesAsync();
        Task<IEnumerable<UserRequestInfo>> GetUserRequestsHistoryAsync(int authUserId);
        Task<int> SaveUserToDatabaseAsync(User newUser);
        Task<int> UpdateUserInDatabaseAsync(User newUser);
        Task<int> RemoveUsersAsync(IEnumerable<User> usersToDelete);

        // roles actions
        Task<IEnumerable<Role>> GetRolesAsync();
        Task<Role> GetRoleByNameAsync(string roleName);
        Task<IEnumerable<RolesToUsers>> GetUserRolesAsync(int userId);
        Task<int> SaveUserRolesToDatabaseAsync(IEnumerable<RolesToUsers> userRoles);
        Task<int> RemoveUserRolesAsync(IEnumerable<RolesToUsers> rolesToRemove);

        // message groups actions
        Task<MessageGroup> GetMessageGroupByIdAsync(int selectedGroupId);
        Task<IEnumerable<MessageGroup>> GetMessageGroupsAsync(int userId);
        Task<int> ApplyActionToMessageGroup(MessageGroup messageGroup, QueryMessageGroup mg, string mode);

        // messages actions
        Task<IEnumerable<Message>> GetMessages(int groupId);
        Task<Message> GetMessageById(int messageId);
        Task<int> SaveMessageToDb(Message message);
        Task<int> UpdateMessageInDb(Message message);
        Task<int> RemoveMessageFromDb(Message message);

        // files actions
        Task<IDataFile> GetFileAsync(int fileId, string fileType);
        IEnumerable<T> GetSpecifiedFiles<T>(int fileCollectionId, IEnumerable<int> filesIds) where T : File;
        IQueryable<VideoFile> GetVideoFiles(int fileCollectionId);
        IQueryable<AudioFile> GetAudioFiles(int fileCollectionId);
        IQueryable<OtherFile> GetOtherFiles(int fileCollectionId);
    }
}
