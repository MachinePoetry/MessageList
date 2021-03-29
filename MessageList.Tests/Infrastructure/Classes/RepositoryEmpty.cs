using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MessageList.Models;
using MessageList.Models.Roles;
using MessageList.Models.QueryModels;
using MessageList.Models.Interfaces;

namespace MessageList.Tests.Infrastructure.Classes
{
    public class RepositoryEmpty : IRepository
    {
        // feedbacks actions
        public async Task<IEnumerable<Feedback>> GetFeedbacksAsync() => await Task.Run(() => new List<Feedback>());
        public async Task<IEnumerable<Feedback>> GetFeedbacksFilteredByIdsAsync(IEnumerable<int> ids) => await Task.Run(() => new List<Feedback>());
        public async Task<int> CreateFeedbackAsync(Feedback newFeedback) => await Task.Run(() => 0);
        public async Task<int> RemoveFeedbacksAsync(IEnumerable<Feedback> feedbacksToDelete) => await Task.Run(() => 0);

        // users actions
        public async Task<User> GetUserByIdAsync(int id) => null;
        public async Task<User> GetUserByEmailAsync(string email) => null;
        public async Task<User> GetAuthenticatedUserAsync(string email) => null;
        public async Task<User> GetUserByCredentialsAsync(string email, string password) => null;
        public async Task<IEnumerable<User>> GetUsersFilteredByIdsAsync(IEnumerable<int> ids) => await Task.Run(() => new List<User>());
        public async Task<IEnumerable<User>> GetUsersWithRolesAsync() => await Task.Run(() => new List<User>());
        public async Task<IEnumerable<UserRequestInfo>> GetUserRequestsHistoryAsync(int authUserId) => await Task.Run(() => new List<UserRequestInfo>());
        public async Task<int> SaveUserToDatabaseAsync(User newUser) => await Task.Run(() => 0);
        public async Task<int> UpdateUserInDatabaseAsync(User newUser) => await Task.Run(() => 0);
        public async Task<int> RemoveUsersAsync(IEnumerable<User> usersToDelete) => await Task.Run(() => 0);

        // roles actions
        public async Task<IEnumerable<Role>> GetRolesAsync() => await Task.Run(() => new List<Role>());
        public async Task<Role> GetRoleByNameAsync(string roleName) => null;
        public async Task<IEnumerable<RolesToUsers>> GetUserRolesAsync(int userId) => await Task.Run(() => new List<RolesToUsers>());
        public async Task<int> SaveUserRolesToDatabaseAsync(IEnumerable<RolesToUsers> userRoles) => await Task.Run(() => 0);
        public async Task<int> RemoveUserRolesAsync(IEnumerable<RolesToUsers> rolesToRemove) => await Task.Run(() => 0);

        // message groups actions
        public async Task<MessageGroup> GetMessageGroupByIdAsync(int selectedGroupId) => null;
        public async Task<IEnumerable<MessageGroup>> GetMessageGroupsAsync(int userId) => await Task.Run(() => new List<MessageGroup>());
        public async Task<int> ApplyActionToMessageGroup(MessageGroup messageGroup, QueryMessageGroup mg, string mode) => await Task.Run(() => 0);

        // messages actions
        public async Task<IEnumerable<Message>> GetMessages(int groupId) => await Task.Run(() => new List<Message>());
        public async Task<Message> GetMessageById(int messageId) => null;
        public async Task<int> SaveMessageToDb(Message message) => await Task.Run(() => 0);
        public async Task<int> UpdateMessageInDb(Message message) => await Task.Run(() => 0);
        public async Task<int> RemoveMessageFromDb(Message message) => await Task.Run(() => 0);

        // files actions
        public async Task<IDataFile> GetFileAsync(int fileId, string fileType) => null;
        public IEnumerable<T> GetSpecifiedFiles<T>(int fileCollectionId, IEnumerable<int> filesIds) where T : File => new List<T>();
        public IQueryable<VideoFile> GetVideoFiles(int fileCollectionId) => new List<VideoFile>().AsQueryable();
        public IQueryable<AudioFile> GetAudioFiles(int fileCollectionId) => new List<AudioFile>().AsQueryable();
        public IQueryable<OtherFile> GetOtherFiles(int fileCollectionId) => new List<OtherFile>().AsQueryable();
    }
}
