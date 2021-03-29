using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Authorization;
using MessageList.Models;
using MessageList.Models.Extensions;
using MessageList.Models.Helpers;
using MessageList.Models.Validators;
using MessageList.Models.Roles;
using MessageList.Models.QueryModels;
using MessageList.Models.Interfaces;

namespace MessageList.Controllers
{
    [Route("api/users")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class UserController : Controller
    {
        private IRepository _repository;
        public UserController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("getAuthUserInfo")]
        [AllowAnonymous]
        public async Task<IActionResult> GetAuthUserInfoAsync()
        {
            User user = await _repository.GetAuthenticatedUserAsync(User.Identity.Name);
            IEnumerable<Role> roles = await _repository.GetRolesAsync();
            if (user != null)
            {
                user.RolesNames = RoleHelper.GetUserRolesNames(user, roles).ToList();
            }
            return Json(user);
        }

        [HttpPost("setMessagesToLoadCounter")]
        public async Task<IActionResult> SetMessagesToLoadCounterAsync([FromBody] QueryMessagesToLoadAmount amountInfo)
        {
            ResultInfo result = new ResultInfo();
            ResultInfo successResult = new ResultInfo(status: "AmountOfLoadedMessagesChanged", info: "Данные успешно обновлены");
            ResultInfo failResult = new ResultInfo(status: "AmountOfLoadedMessagesFailed", info: "Произошла ошибка при обновлении данных");
            if (await UserHelper.IsAuthenticatedUserAsync(amountInfo.AuthUserId, User.Identity.Name, _repository))
            {
                result = Validator.IsMessagesToLoadAmountValid(amountInfo.MessagesToLoadAmount) ?
                         await UserHelper.ChangeUserPropertyAsync<int>(amountInfo.AuthUserId, "MessagesToLoadAmount", amountInfo.MessagesToLoadAmount, _repository, successResult, failResult) :
                         new ResultInfo(status: "AmountOfLoadedMessagesFailed", "Недопустимое количество загружаемых сообщений");
            }
            else
            {
                return StatusCode(403);
            }
            return Json(result);
        }

        [HttpPost("setChangePasswordKey")]
        public async Task<IActionResult> SetChangePasswordKeyAsync([FromBody] QuerySetKey keyInfo)
        {
            ResultInfo result = new ResultInfo();
            ResultInfo successResult = new ResultInfo(status: "KeySaved", info: "Ключ успешно сохранен");
            ResultInfo failResult = new ResultInfo(status: "KeyChangeFailed", info: "Произошла ошибка при сохранении ключа");
            if (await UserHelper.IsAuthenticatedUserAsync(keyInfo.AuthUserId, User.Identity.Name, _repository))
            {
                result = Validator.IsChangePasswordKeyValid(keyInfo.Key) ? 
                         await UserHelper.ChangeUserPropertyAsync<string>(keyInfo.AuthUserId, "Key", keyInfo.Key.GetCustomAlgoHashCode(SHA256.Create()), _repository, successResult, failResult) :
                         new ResultInfo(status: "KeyChangeFailed", "Недопустимый формат ключа");
            }
            else
            {
                return StatusCode(403);
            }
            return Json(result);
        }

        [HttpPost("validateChangePasswordKey")]
        [AllowAnonymous]
        public async Task<IActionResult> ValidateChangePasswordKeyAsync([FromBody] QueryValidateKey keyInfo)
        {
            User user = await _repository.GetUserByEmailAsync(keyInfo.Email);
            ResultInfo result = new ResultInfo();
            if (user != null && (Validator.IsChangePasswordKeyValid(user.Key) || !user.Key.Equals(keyInfo.Key.GetCustomAlgoHashCode(SHA256.Create()))))
            {
                result = new ResultInfo("InvalidKey", "Неверный ключ восстановления пароля или недопустимый формат ключа");
            }
            else if (user != null && user.Key.Equals(keyInfo.Key.GetCustomAlgoHashCode(SHA256.Create())))
            {
                return Json(user);
            }
            else 
            {
                result = new ResultInfo("UserNotFound", "Пользователь не найден");
            }
            return Json(result);
        }

        [HttpPost("changePassword")]
        [AllowAnonymous]
        public async Task<IActionResult> ChangePasswordAsync([FromBody] QueryChangePassword newPasswordInfo)
        {
            User user = await _repository.GetUserByIdAsync(newPasswordInfo.AuthUserId);
            ResultInfo result = new ResultInfo();
            try
            {
                if (user == null)
                {
                    throw new Exception("Пользователь для смены пароля не найден");
                }
                else
                {
                    if (newPasswordInfo.Mode.Equals("profile") && await UserHelper.IsAuthenticatedUserAsync(newPasswordInfo.AuthUserId, User.Identity.Name, _repository))
                    {
                        if (Validator.IsPasswordValid(newPasswordInfo.OldPassword) && Validator.IsPasswordValid(newPasswordInfo.NewPassword))
                        {
                            if (!user.Password.Equals(newPasswordInfo.OldPassword.GetCustomAlgoHashCode(SHA256.Create())))
                            {
                                throw new Exception("Старый пароль указан неверно");
                            }
                            else
                            {
                                result = await UserHelper.ChangePasswordAsync(newPasswordInfo.NewPassword, user, _repository);
                            }
                        }
                        else
                        {
                            throw new ArgumentException("Неверный формат пароля");
                        }
                    }
                    else if (newPasswordInfo.Mode.Equals("restore"))
                    {
                        if (Validator.IsPasswordValid(newPasswordInfo.NewPassword))
                        {
                            result = await UserHelper.ChangePasswordAsync(newPasswordInfo.NewPassword, user, _repository);
                        }
                        else
                        {
                            throw new ArgumentException("Неверный формат пароля");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                result = new ResultInfo(status: "PasswordChangeFailed", info:ex.Message);
            }

            return Json(result);
        }

        [HttpPost("greeting")]
        public async Task<IActionResult> GreetUserAsync([FromBody] Identificator idContainer)
        {
            User user = await _repository.GetUserByIdAsync(idContainer.Id);
            ResultInfo result = new ResultInfo();
            if (user != null)
            {
                user.IsGreeted = true;
                int res = await _repository.UpdateUserInDatabaseAsync(user);
                result = ResultInfo.CreateResultInfo(res, "UserGreeted", "Приветственное сообщение отключено", "GreetingFailed", "Произошла ошибка при отключении приветственного сообщения");
            }
            else
            {
                result = new ResultInfo(status: "GreetingFailed", info: "Пользователь не найден");
            }
            return Json(result);
        }

        [HttpGet("getUserActivityHistory")]
        public async Task<IActionResult> GetUserActivityHistoryAsync([FromQuery] int authUserId)
        {
            IEnumerable<UserRequestInfo> requests = new List<UserRequestInfo>();
            if (await UserHelper.IsAuthenticatedUserAsync(authUserId, User.Identity.Name, _repository))
            {
                requests = await _repository.GetUserRequestsHistoryAsync(authUserId);
            }
            else
            {
                return StatusCode(403);
            }
            return Json(requests);
        }

        [HttpGet("getLastUserActivity")]
        public async Task<IActionResult> GetLastUserActivityAsync([FromQuery] int authUserId)
        {
            UserRequestInfo lastUserRequest = new UserRequestInfo();
            if (await UserHelper.IsAuthenticatedUserAsync(authUserId, User.Identity.Name, _repository))
            {
                IEnumerable<UserRequestInfo> userRequests = await _repository.GetUserRequestsHistoryAsync(authUserId);
                lastUserRequest = userRequests.Count() > 0 ? userRequests.FirstOrDefault() : new UserRequestInfo();
            }
            else
            {
                return StatusCode(403);
            }
            return Json(lastUserRequest);
        }
    }
}
