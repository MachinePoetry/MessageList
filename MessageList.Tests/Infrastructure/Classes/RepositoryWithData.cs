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
    public class RepositoryWithData : IRepository
    {

        // feedbacks actions
        public async Task<IEnumerable<Feedback>> GetFeedbacksAsync() => await Task.Run(() => new List<Feedback> { new Feedback("text1", "contacts"), new Feedback("text1", "") });
        public async Task<IEnumerable<Feedback>> GetFeedbacksFilteredByIdsAsync(IEnumerable<int> ids) => await Task.Run(() => new List<Feedback> { new Feedback("text1", "contacts") });
        public async Task<int> CreateFeedbackAsync(Feedback newFeedback) => await Task.Run(() => 1);
        public async Task<int> RemoveFeedbacksAsync(IEnumerable<Feedback> feedbacksToDelete) => await Task.Run(() => 1);

        // users actions
        public async Task<User> GetUserByIdAsync(int id) => await Task.Run(() => new User { Id = 10, Email = "email@email.com", Password = "password_hash", MessagesToLoadAmount = 30 });
        public async Task<User> GetUserByEmailAsync(string email) => await Task.Run(() => new User { Id = 10, Email = "email@email.com", Password = "password_hash", MessagesToLoadAmount = 30, Key = "6e3b0e6bd28267dc94feba47229b4cb749cbd6685ee8286fb8cd82d4dea99790" });
        public async Task<User> GetAuthenticatedUserAsync(string email) => await Task.Run(() => new User("email@email.com", "password_hash", 30));
        public async Task<User> GetUserByCredentialsAsync(string email, string password) => await Task.Run(() => new User("email@email.com", "password_hash", 30));
        public async Task<IEnumerable<User>> GetUsersFilteredByIdsAsync(IEnumerable<int> ids) => await Task.Run(() => new List<User> { new User("email@email.com", "password_hash", 30) });
        public async Task<IEnumerable<User>> GetUsersWithRolesAsync() => await Task.Run(() => new List<User> { new User("email@email.com", "password_hash", 30) });
        public async Task<IEnumerable<UserRequestInfo>> GetUserRequestsHistoryAsync(int authUserId) => await Task.Run(() => new List<UserRequestInfo> { new UserRequestInfo("192.168.0.10", "Russia", "Perm Krai", "Perm", "", "", false, 1) });
        public async Task<int> SaveUserToDatabaseAsync(User newUser) => await Task.Run(() => 1);
        public async Task<int> UpdateUserInDatabaseAsync(User newUser) => await Task.Run(() => 1);
        public async Task<int> RemoveUsersAsync(IEnumerable<User> usersToDelete) => await Task.Run(() => 1);

        // roles actions
        public async Task<IEnumerable<Role>> GetRolesAsync() => await Task.Run(() => new List<Role> { new Role { Id = 1, Name = "User", RolesToUsers = new List<RolesToUsers>() }, new Role { Id = 2, Name = "Administrator", RolesToUsers = new List<RolesToUsers>() } });
        public async Task<Role> GetRoleByNameAsync(string roleName) => await Task.Run(() => new Role { Id = 1, Name = "User", RolesToUsers = new List<RolesToUsers>() });
        public async Task<IEnumerable<RolesToUsers>> GetUserRolesAsync(int userId) => await Task.Run(() => new List<RolesToUsers> { new RolesToUsers { UserId = 1, RoleId = 1}, new RolesToUsers { UserId = 1, RoleId = 2 } });
        public async Task<int> SaveUserRolesToDatabaseAsync(IEnumerable<RolesToUsers> userRoles) => await Task.Run(() => 1);
        public async Task<int> RemoveUserRolesAsync(IEnumerable<RolesToUsers> rolesToRemove) => await Task.Run(() => 1);

        // message groups actions
        public async Task<MessageGroup> GetMessageGroupByIdAsync(int selectedGroupId) => await Task.Run(() => new MessageGroup("New mg", 1));
        public async Task<IEnumerable<MessageGroup>> GetMessageGroupsAsync(int userId) => await Task.Run(() => new List<MessageGroup> { new MessageGroup("New mg", 1), new MessageGroup("Another mg", 1) });
        public async Task<int> ApplyActionToMessageGroup(MessageGroup messageGroup, QueryMessageGroup mg, string mode) => await Task.Run(() => 1);

        // messages actions
        public async Task<IEnumerable<Message>> GetMessages(int groupId) => await Task.Run(() => new List<Message> { new Message("Some message text", 1), new Message("Another message text", 2) });
        public async Task<Message> GetMessageById(int messageId) => await Task.Run(() => new Message("Some message text", 1));
        public async Task<int> SaveMessageToDb(Message message) => await Task.Run(() => 1);
        public async Task<int> UpdateMessageInDb(Message message) => await Task.Run(() => 1);
        public async Task<int> RemoveMessageFromDb(Message message) => await Task.Run(() => 1);

        // files actions
        public async Task<IDataFile> GetFileAsync(int fileId, string fileType) => await Task.Run(() => new ImageFile("image/jpeg", "picture.jpg", 2, new byte[100]));
        public IEnumerable<T> GetSpecifiedFiles<T>(int fileCollectionId, IEnumerable<int> filesIds) where T : File => new List<T> { };
        public IQueryable<VideoFile> GetVideoFiles(int fileCollectionId) => new List<VideoFile> { new VideoFile("video/mp4", "film.mp4", 1000, new byte[100]), new VideoFile("video/mp4", "another film.mp4", 2000, new byte[200]) }.AsQueryable();
        public IQueryable<AudioFile> GetAudioFiles(int fileCollectionId) => new List<AudioFile> { new AudioFile("audio/mp3", "music.mp3", 1000, new byte[100]), new AudioFile("audio/mp3", "another music.mp3", 2000, new byte[200]) }.AsQueryable();
        public IQueryable<OtherFile> GetOtherFiles(int fileCollectionId) => new List<OtherFile> { new OtherFile("text/plain", "file.doc", 1000, new byte[100]), new OtherFile("text/plain", "another file.doc", 2000, new byte[200]) }.AsQueryable();
    }
}
