using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models.QueryModels;
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

        private async Task<int> _applyActionToDb(Action action)
        {
            action();
            return await _db.SaveChangesAsync();
        }

        // feedbacks actions
        public async Task<IEnumerable<Feedback>> GetFeedbacksAsync() => await _db.Feedbacks.ToListAsync();
        public async Task<IEnumerable<Feedback>> GetFeedbacksFilteredByIdsAsync(IEnumerable<int> ids) => await _db.Feedbacks.Where(u => ids.Contains(u.Id)).ToListAsync();
        public async Task<int> CreateFeedbackAsync(Feedback newFeedback) => await _applyActionToDb(() => _db.Feedbacks.Add(newFeedback));
        public async Task<int> RemoveFeedbacksAsync(IEnumerable<Feedback> feedbacksToDelete) => await _applyActionToDb(() => _db.Feedbacks.RemoveRange(feedbacksToDelete));

        // users actions
        public async Task<User> GetUserByIdAsync(int id) => await Task.Run(() => _db.Users.Find(id));
        public async Task<User> GetUserByEmailAsync(string email) => await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(email));
        public async Task<User> GetAuthenticatedUserAsync(string email) => await _db.Users.Where(u => u.Email.Equals(email)).AsNoTracking().Include(u => u.RolesToUsers).FirstOrDefaultAsync();
        public async Task<User> GetUserByCredentialsAsync(string email, string password) => await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(email) && u.Password.Equals(password.GetCustomAlgoHashCode(SHA256.Create())));
        public async Task<IEnumerable<User>> GetUsersFilteredByIdsAsync(IEnumerable<int> ids) => await _db.Users.Where(u => ids.Contains(u.Id)).ToListAsync();
        public async Task<IEnumerable<User>> GetUsersWithRolesAsync() => await _db.Users.Include(u => u.RolesToUsers).ToListAsync();
        public async Task<IEnumerable<UserRequestInfo>> GetUserRequestsHistoryAsync(int authUserId) => await _db.UserRequestsHistory.Where(r => r.UserId == authUserId).OrderByDescending(req => req.Id).Take(20).ToListAsync();
        public async Task<int> SaveUserToDatabaseAsync(User newUser) => await _applyActionToDb(() => _db.Users.Add(newUser));
        public async Task<int> UpdateUserInDatabaseAsync(User newUser) => await _applyActionToDb(() => _db.Users.Update(newUser));
        public async Task<int> RemoveUsersAsync(IEnumerable<User> usersToDelete) => await _applyActionToDb(() => _db.Users.RemoveRange(usersToDelete));

        // roles actions
        public async Task<IEnumerable<Role>> GetRolesAsync() => await _db.Roles.ToListAsync();
        public async Task<Role> GetRoleByNameAsync(string roleName) => await _db.Roles.FirstOrDefaultAsync(r => r.Name.Equals(roleName));
        public async Task<IEnumerable<RolesToUsers>> GetUserRolesAsync(int userId) => await _db.RolesToUsers.Where(r => r.UserId == userId).ToListAsync();
        public async Task<int> SaveUserRolesToDatabaseAsync(IEnumerable<RolesToUsers> userRoles) => await _applyActionToDb(() => _db.RolesToUsers.AddRange(userRoles));
        public async Task<int> RemoveUserRolesAsync(IEnumerable<RolesToUsers> rolesToRemove) => await _applyActionToDb(() => _db.RolesToUsers.RemoveRange(rolesToRemove));

        // message groups actions
        public async Task<MessageGroup> GetMessageGroupByIdAsync(int selectedGroupId) => await _db.MessageGroups.FirstOrDefaultAsync(mGroup => mGroup.Id == selectedGroupId);
        public async Task<IEnumerable<MessageGroup>> GetMessageGroupsAsync(int userId) => await _db.MessageGroups.Where(mg => mg.UserId == userId).AsNoTracking().AsSplitQuery()
                                                                                                    .Include(m => m.Messages).ThenInclude(mes => mes.FileCollection.Images)
                                                                                                    .Include(m => m.Messages).ThenInclude(mes => mes.UrlPreviews).ToListAsync();
        public async Task<int> ApplyActionToMessageGroup(MessageGroup messageGroup, QueryMessageGroup mg, string mode)
        {
            switch (mode)
            {
                case "create":
                    _db.MessageGroups.Add(messageGroup);
                    break;
                case "update":
                    messageGroup.Name = mg.Name;
                    _db.MessageGroups.Update(messageGroup);
                    break;
                case "delete":
                    _db.MessageGroups.Remove(messageGroup);
                    break;
            }
            return await _db.SaveChangesAsync();
        }

        // messages actions
        public async Task<IEnumerable<Message>> GetMessages(int groupId) => await _db.Messages.Where(mes => mes.MessageGroupId == groupId).Include(m => m.FileCollection.Images).Include(m => m.UrlPreviews).ToListAsync();
        public async Task<Message> GetMessageById(int messageId) => await _db.Messages.Where(m => m.Id == messageId).Include(mes => mes.FileCollection).Include(mes => mes.UrlPreviews).FirstOrDefaultAsync();
        public async Task<int> SaveMessageToDb(Message message) => await _applyActionToDb(() => _db.Messages.Add(message));
        public async Task<int> UpdateMessageInDb(Message message) => await _applyActionToDb(() => _db.Messages.Update(message));
        public async Task<int> RemoveMessageFromDb(Message message) => await _applyActionToDb(() => _db.Messages.Remove(message));

        // files actions
        public async Task<IDataFile> GetFileAsync(int fileId, string fileType)
        {
            IDataFile file = null;

            switch (fileType)
            {
                case "image":
                    file = await Task.Run(() => _db.Images.Find(fileId));
                    break;
                case "video":
                    file = await Task.Run(() => _db.Video.Find(fileId));
                    break;
                case "audio":
                    file = await Task.Run(() => _db.Audio.Find(fileId));
                    break;
                case "file":
                    file = await Task.Run(() => _db.Files.Find(fileId));
                    break;
                default:
                    file = null;
                    break;
            }

            return file;
        }
        public IEnumerable<T> GetSpecifiedFiles<T>(int fileCollectionId, IEnumerable<int> filesIds) where T : File
        {
            DbSet<T> dbSet = _db.Set<T>(typeof(T).ToString());
            List<T> fileCollection = dbSet.Where(i => i.FileCollectionId == fileCollectionId).ToList();
            return fileCollection.Where(i => filesIds.Contains(i.Id));
        }
        public IQueryable<VideoFile> GetVideoFiles(int fileCollectionId) =>  _db.Video.Where(video => video.FileCollectionId == fileCollectionId).Select(v => new VideoFile(v.Id, v.ContentType, v.FileName, v.Length, v.FileCollectionId, null));
        public IQueryable<AudioFile> GetAudioFiles(int fileCollectionId) => _db.Audio.Where(audio => audio.FileCollectionId == fileCollectionId).Select(a => new AudioFile(a.Id, a.ContentType, a.FileName, a.Length, a.FileCollectionId, null));
        public IQueryable<OtherFile> GetOtherFiles(int fileCollectionId) => _db.Files.Where(file => file.FileCollectionId == fileCollectionId).Select(f => new OtherFile(f.Id, f.ContentType, f.FileName, f.Length, f.FileCollectionId, null));
    }
}
