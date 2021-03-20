using System;
using System.Linq;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.Extensions;
using MessageList.Models.Roles;
using MessageList.Models.QueryModels;

namespace MessageList.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    // учетка админа: admin@admin.com / admin. Если зайти под ним, в профиле будут 2 дополнительные кнопки: 'Управление пользователями' и 'Просмотр обратной связи'.
    public class AdminController : Controller  
    {
        private ApplicationDbContext _db;
        public AdminController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("getUsers")]
        //TODO: Создать и дать атрибут [AdminOnly]
        public async Task<JsonResult> GetUsers()  // эта шткуа повторяется еще и в UserController GetUserInfo()
        {
            IEnumerable<User> users = _db.Users.Include(u => u.RolesToUsers);
            IEnumerable<Role> roles = await _db.Roles.ToListAsync();
            foreach (var user in users)
            {
                if (user.RolesToUsers.Count() > 0)
                {
                    IEnumerable<int> userRolesIds = user.RolesToUsers.Select(r => r.RoleId);
                    user.RolesNames = roles.Where(r => userRolesIds.Contains(r.Id)).Select(role => role.Name).ToList();
                }
            }
            return Json(users);
        }

        [HttpGet("getRoles")]
        //TODO: Создать и дать атрибут [AdminOnly]
        public async Task<JsonResult> GetRoles()
        {
            return Json(await _db.Roles.ToListAsync());
        }

        [HttpPost("createUser")]
        public async Task<JsonResult> CreateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Email == userInfo.Email);
            ResultInfo result = new ResultInfo();
            if (user != null)
            {
                result = new ResultInfo(status: "UserExists", info: "Пользователь с таким email уже существует");
            }
            else
            {
                if (userInfo != null)
                {

                    User newUser = new User(userInfo.Email, userInfo.Password.GetCustomAlgoHashCode(SHA256.Create()), userInfo.MessagesToLoadAmount);
                    if (userInfo.ChangePasswordKey != null)
                    {
                        newUser.Key = userInfo.ChangePasswordKey;
                    }
                    _db.Users.Add(newUser);
                    int res = await _db.SaveChangesAsync();
                    IEnumerable<int> uniqueRolesIds = userInfo.RolesIds.Distinct();
                    foreach (var id in uniqueRolesIds)
                    {
                        RolesToUsers newUserRole = new RolesToUsers(userId: newUser.Id, roleId: id);
                        _db.RolesToUsers.Add(newUserRole);
                    }
                    res = await _db.SaveChangesAsync();
                    result = ResultInfo.CreateResultInfo(res, "UserCreated", "Новый пользователь успешно создан", "UserCreationFailed", "Произошла ошибка при создании пользователя");
                }
                else
                {
                    result = new ResultInfo(status: "UserCreationFailed", info: "Ошибка при получении данных для создания пользователя");
                }
            }
            return Json(result);
        }

        [HttpPost("updateUser")]
        public async Task<JsonResult> UpdateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            ResultInfo result = new ResultInfo();
            if (userInfo != null)
            {
                User user = _db.Users.Find(userInfo.Id);
                if (!String.IsNullOrEmpty(userInfo.Password))
                {
                    user.Password = userInfo.Password.GetCustomAlgoHashCode(SHA256.Create());
                }
                if (userInfo.ChangePasswordKey != null)
                {
                    user.Key = userInfo.ChangePasswordKey;
                }

                int userRoleId = _db.Roles.Where(r => r.Name.Equals("User")).Select(role => role.Id).FirstOrDefault();  // метод GetUnique Role Ids in Helper ?
                if (!userInfo.RolesIds.Contains(userRoleId))
                {
                    userInfo.RolesIds.Add(userRoleId);
                }
                IEnumerable<int> uniqueRolesIds = userInfo.RolesIds.Distinct();
                IEnumerable<RolesToUsers> existingUserRoles = _db.RolesToUsers.Where(r => r.UserId == user.Id).ToList();
                if (uniqueRolesIds.Count() < existingUserRoles.Count()) // можно написать большой обобщенный метод тупо Filter все, что угодно. В данном случае <RolesToUsers, int>
                {
                    IEnumerable<RolesToUsers> rolesToRemove = existingUserRoles.Where(r => !uniqueRolesIds.Contains(r.RoleId));
                    foreach (var role in rolesToRemove)
                    {
                        _db.RolesToUsers.Remove(role);
                    }
                }
                else
                {
                    IEnumerable<int> existingUserRolesIds = existingUserRoles.Select(r => r.RoleId);  // TODO: написать комментарии, что тут вообще происходит.
                    IEnumerable<int> rolesIdsToAdd = uniqueRolesIds.Except(existingUserRolesIds);
                    foreach (var id in rolesIdsToAdd)
                    {
                        RolesToUsers newUserRole = new RolesToUsers(userId: user.Id, roleId: id);
                        _db.RolesToUsers.Add(newUserRole);
                    }
                }

                _db.Users.Update(user);
                int res = await _db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, "UserUpdated", "Данные пользователя успешно обновлены", "UserUpdateFailed", "Произошла ошибка при обновлении данных пользователя");
            }
            else
            {
                result = new ResultInfo(status: "UserUpdateFailed", info: "Ошибка при получении данных для редактирования пользователя");
            }
            return Json(result);
        }

        [HttpPost("deleteUsers")]
        public async Task<JsonResult> DeleteUserAsync([FromBody] Identificators ids)
        {
            // убрать это в Валидатор. Из массива пришедших Id надо отфильтровать Id самого юзера, чтоб он сам себя не удалил.
            User authenticatedUser = await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(User.Identity.Name));
            int res = 0;
            List<int> filteredIds = ids.Ids.Where(id => id != authenticatedUser.Id).ToList();
            List<User> usersToDelete = _db.Users.Where(u => filteredIds.Contains(u.Id)).ToList();
            foreach (var userToDelete in usersToDelete)
            {
                _db.Users.Remove(userToDelete);
            }
            res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "UsersDeleted", "Пользователи успешно удалены", "UsersDeletionFailed", "Произошла ошибка при удалении пользователей");
            return Json(result);
        }
    }
}
