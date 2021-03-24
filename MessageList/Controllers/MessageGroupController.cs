using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.Helpers;
using MessageList.Models.QueryModels;

namespace MessageList.Controllers
{
    [Route("api/messageGroup")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class MessageGroupController : Controller
    {
        private ApplicationDbContext _db;
        public MessageGroupController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMessageGroupAsync([FromBody] QueryMessageGroup mg)
        {
            ResultInfo result = new ResultInfo();
            if (await UserHelper.IsAuthenticatedUserAsync(mg.AuthUserId, User.Identity.Name, _db))
            {
                result = await MessageHepler.ApplyActionToMessageGroup(mg, _db, "create");
            }
            else
            {
                return StatusCode(403);
            }
            return Json(result);
        }

        [HttpPost("update")]
        public async Task<IActionResult> UpdateMessageGroupAsync([FromBody] QueryMessageGroup mg)
        {
            ResultInfo result = new ResultInfo();
            if (await UserHelper.IsAuthenticatedUserAsync(mg.AuthUserId, User.Identity.Name, _db))
            {
                result = await MessageHepler.ApplyActionToMessageGroup(mg, _db, "update");
            }
            else
            {
                return StatusCode(403);
            }

            return Json(result);
        }

        [HttpPost("delete")]
        public async Task<IActionResult> DeleteMessageGroupAsync([FromBody] QueryMessageGroup mg)
        {
            ResultInfo result = new ResultInfo();
            if (await UserHelper.IsAuthenticatedUserAsync(mg.AuthUserId, User.Identity.Name, _db))
            {
                result = await MessageHepler.ApplyActionToMessageGroup(mg, _db, "delete");
            }
            else
            {
                return StatusCode(403);
            }

            return Json(result);
        }
    }
}
