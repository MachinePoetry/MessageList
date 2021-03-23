using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.Helpers;
using MessageList.Models.Roles;
using MessageList.Models.QueryModels;
using MessageList.Models.Filters;

namespace MessageList.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize]
    [AdminOnly]
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
        public async Task<IActionResult> GetUsersAsync()
        {
            IEnumerable<User> users = _db.Users.Include(u => u.RolesToUsers);
            IEnumerable<Role> roles = await _db.Roles.ToListAsync();
            foreach (var user in users)
            {
                user.RolesNames = RoleHelper.GetUserRolesNames(user, roles).ToList();
            }
            return Json(users);
        }

        [HttpGet("getRoles")]
        public async Task<IActionResult> GetRolesAsync()
        {
            return Json(await _db.Roles.ToListAsync());
        }

        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            ResultInfo result = new ResultInfo();
            try
            {
                User newUser = await UserHelper.CreateUserAsync(userInfo, _db);
                _db.Users.Add(newUser);
                int res = await _db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, "UserCreated", "Новый пользователь успешно создан", "UserCreationFailed", "Произошла ошибка при создании пользователя");
                RoleHelper.CheckThatRoleUserIsIn(userInfo.RolesIds, _db.Roles);
                int roleRes = await RoleHelper.AddRolesToUser(userInfo.RolesIds, newUser.Id, _db);
                result = ResultInfo.CreateResultInfo(roleRes, "UserCreated", "Новый пользователь успешно создан", "UserCreationFailed", "Произошла ошибка при добавлении ролей пользователю");
            }
            catch (Exception ex)
            {
                result = new ResultInfo("UserCreationFailed", ex.Message);
            }
            return Json(result);
        }

        [HttpPost("updateUser")]
        public async Task<IActionResult> UpdateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            ResultInfo result = new ResultInfo();
            try
            {
                User user = _db.Users.Find(userInfo.Id);
                await UserHelper.UpdateUserInfo(userInfo, user, _db);
                RoleHelper.CheckThatRoleUserIsIn(userInfo.RolesIds, _db.Roles);
                RoleHelper.ChangeUserRoles(userInfo.RolesIds, user, _db.RolesToUsers);
                _db.Users.Update(user);
                int res = await _db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, "UserUpdated", "Данные пользователя успешно обновлены", "UserUpdateFailed", "Произошла ошибка при обновлении данных пользователя");
            }
            catch (Exception ex)
            {
                result = new ResultInfo(status:"UserUpdateFailed", info: ex.Message);
            }

            return Json(result);
        }

        [HttpPost("deleteUsers")]
        public async Task<IActionResult> DeleteUserAsync([FromBody] Identificators ids)
        {
            User authenticatedUser = await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(User.Identity.Name));
            List<int> filteredIds = ids.Ids.Where(id => id != authenticatedUser.Id).ToList();
            List<User> usersToDelete = _db.Users.Where(u => filteredIds.Contains(u.Id)).ToList();
            int res = 0;
            _db.Users.RemoveRange(usersToDelete);
            res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "UsersDeleted", "Пользователи успешно удалены", "UsersDeletionFailed", "Произошла ошибка при удалении пользователей");
            return Json(result);
        }
    }
}
