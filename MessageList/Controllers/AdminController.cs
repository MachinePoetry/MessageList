using System;
using System.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageList.Models;
using MessageList.Models.Helpers;
using MessageList.Models.Interfaces;
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
        private IRepository _repository;
        public AdminController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("getUsers")]
        public async Task<IActionResult> GetUsersAsync()
        {
            IEnumerable<User> users = await _repository.GetUsersWithRolesAsync();
            IEnumerable<Role> roles = await _repository.GetRolesAsync();
            foreach (var user in users)
            {
                user.RolesNames = RoleHelper.GetUserRolesNames(user, roles).ToList();
            }
            return Json(users);
        }

        [HttpGet("getRoles")]
        public async Task<IActionResult> GetRolesAsync()
        {
            return Json(await _repository.GetRolesAsync());
        }

        [HttpPost("createUser")]
        public async Task<IActionResult> CreateUserAsync([FromBody] QueryUserInfo userInfo)
        {
            ResultInfo result = new ResultInfo();
            try
            {
                int newUserId = await UserHelper.CreateUserAsync(userInfo, _repository);
                await RoleHelper.CheckThatRoleUserIsInAsync(userInfo.RolesIds, _repository);
                int res = await RoleHelper.AddRolesToUserAsync(userInfo.RolesIds, newUserId, _repository);
                result = ResultInfo.CreateResultInfo(res, "UserCreated", "Новый пользователь успешно создан", "UserCreationFailed", "Произошла ошибка при добавлении ролей пользователю");
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
                User user = await _repository.GetUserByIdAsync((int)userInfo.Id);
                await UserHelper.UpdateUserInfoAsync(userInfo, user, _repository);
                await RoleHelper.CheckThatRoleUserIsInAsync(userInfo.RolesIds, _repository);
                int res = await RoleHelper.ChangeUserRolesAsync(userInfo.RolesIds, user, _repository);
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
            User authenticatedUser = await _repository.GetUserByEmailAsync(User.Identity.Name);
            IEnumerable<int> filteredIds = ids.Ids.Where(id => id != authenticatedUser.Id);
            IEnumerable<User> usersToDelete = await _repository.GetUsersFilteredByIdsAsync(filteredIds);
            int res = await _repository.RemoveUsersAsync(usersToDelete);
            ResultInfo result = ResultInfo.CreateResultInfo(res, "UsersDeleted", "Пользователи успешно удалены", "UsersDeletionFailed", "Произошла ошибка при удалении пользователей");
            return Json(result);
        }
    }
}
