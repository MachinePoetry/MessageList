using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.Extensions;


namespace MessageList.Controllers
{
    [Route("api/account")]
    [ApiController]
    [RequireHttps]
    [Authorize]
    public class AccountController : Controller
    {
        private ApplicationDbContext _db;
        public AccountController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<JsonResult> LoginAsync([FromBody] Account acc)
        {
            ResultInfo result = null;
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Email == acc.Email && u.Password == acc.Password.GetCustomAlgoHashCode(SHA256.Create()));

            if (user != null)
            {
                await HttpContext.SignOutAsync();
                await Authenticate(acc.Email);
                result = new ResultInfo(status: "AuthSuccess", info: "Доступ предоставлен");
            }
            else
            {
                result = new ResultInfo(status: "AuthFailed", info: "Пользователь с таким email не найден"); // ModelState.AddModelError("", "Email или пароль введены неправильно");
            }
            
            return Json(result);
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<JsonResult> RegisterAsync([FromBody] Account acc)
        {
            User user = await _db.Users.FirstOrDefaultAsync(u => u.Email == acc.Email && u.Password == acc.Password.GetCustomAlgoHashCode(SHA256.Create()));
            ResultInfo result;

            if (user != null)
            {
                result = new ResultInfo(status: "UserExists", info: "Пользователь с таким email уже существует");
            }
            else
            {
                //TODO: Нужна валидация email перед редактированием и созданием пользователя
                MessageGroup mg = new MessageGroup();
                mg.Name = "Default group";
                User newUser = new User(email: acc.Email, password: acc.Password.GetCustomAlgoHashCode(SHA256.Create()));
                newUser.MessageGroups.Add(mg);
                await _db.Users.AddAsync(newUser);
                int res = await _db.SaveChangesAsync();
                await HttpContext.SignOutAsync();
                await Authenticate(acc.Email);
                result = ResultInfo.CreateResultInfo(res, "UserCreated", "Регистрация прошла успешно", "UserCreationFailed", "Ошибка при попытке регистрации");
            }

            return Json(result);
        }

        [HttpGet("signOut")]
        public async Task SignOut()
        {
            await HttpContext.SignOutAsync();
        }

        private async Task Authenticate(string userName)
        {
            IList<Claim> claims = new List<Claim>()
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, userName)
            };

            // TO DO: Change this below. In browser cookies it is .AspNetCore.Cookies
            ClaimsIdentity id = new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType, ClaimsIdentity.DefaultRoleClaimType); 
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(id)); // needs using Microsoft.AspNetCore.Authentication (extensions for HttpContext)
        }
    }
}
