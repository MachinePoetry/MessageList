using System;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.Extensions.Configuration;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.Helpers;
using MessageList.Models.QueryModels;
using MessageList.Models.Extensions;
using MessageList.Models.Validators;
using MessageList.Models.Middleware;


namespace MessageList.Controllers
{
    [Route("api/account")]
    [ApiController]
    [RequireHttps]
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationDbContext _db;
        private IConfiguration _configuration { get; }
        public AccountController(ApplicationDbContext db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> LoginAsync([FromBody] Account acc)
        {
            ResultInfo result = new ResultInfo();
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Email.Equals(acc.Email) && u.Password.Equals(acc.Password.GetCustomAlgoHashCode(SHA256.Create())));

            if (user != null && Validator.IsEmailValid(acc.Email) && Validator.IsPasswordValid(acc.Password))
            {
                await HttpContext.SignOutAsync();
                await AuthenticateAsync(acc.Email);
                UserActivityTracker activityHelper = new UserActivityTracker(_configuration);
                activityHelper.LogUserRequestAsync(Request.HttpContext, user.Id);
                result = new ResultInfo(status: "AuthSuccess", info: "Доступ предоставлен");
            }
            else
            {
                result = new ResultInfo(status: "AuthFailed", info: "Ошибка при вводе логина или пароля");
            }
            return Json(result);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterAsync([FromBody] Account acc)
        {
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Email == acc.Email);
            QueryUserInfo userInfo = new QueryUserInfo(acc.Email, acc.Password);
            ResultInfo result = new ResultInfo();

            if (user != null)
            {
                result = new ResultInfo(status: "UserExists", info: "Пользователь с таким email уже существует");
            }
            else
            {
                try
                {
                    User newUser = await UserHelper.CreateUserAsync(userInfo, _db);
                    _db.Users.Add(newUser);
                    int res = await _db.SaveChangesAsync();
                    result = ResultInfo.CreateResultInfo(res, "UserCreated", "Новый пользователь успешно создан", "UserCreationFailed", "Произошла ошибка при создании пользователя");
                    int userRoleId = _db.Roles.FirstOrDefault(r => r.Name.Equals("User")).Id;
                    int rolesRes = await RoleHelper.AddRolesToUser(new List<int> { userRoleId }, newUser.Id, _db);
                    result = ResultInfo.CreateResultInfo(rolesRes, "UserCreated", "Новый пользователь успешно создан", "UserCreationFailed", "Произошла ошибка при добавлении ролей пользователю");

                    await HttpContext.SignOutAsync();
                    await AuthenticateAsync(acc.Email);
                    UserActivityTracker activityHelper = new UserActivityTracker(_configuration);
                    activityHelper.LogUserRequestAsync(Request.HttpContext, newUser.Id);
                }
                catch (Exception ex)
                {
                    result = new ResultInfo("UserCreationFailed", ex.Message);
                }
            }

            return Json(result);
        }

        [HttpGet("signOut")]
        public async Task SignOut()
        {
            await HttpContext.SignOutAsync();
        }

        private async Task AuthenticateAsync(string userName)
        {
            IList<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, userName)
            };

            // TODO: Change this below. In browser cookies are called .AspNetCore.Cookies
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType); 
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id));
        }
    }
}
