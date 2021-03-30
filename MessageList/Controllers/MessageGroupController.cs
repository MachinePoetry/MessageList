using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageList.Models;
using MessageList.Models.Helpers;
using MessageList.Models.Interfaces;
using MessageList.Models.QueryModels;

namespace MessageList.Controllers
{
    [Route("api/messageGroup")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class MessageGroupController : Controller
    {
        private IRepository _repository;
        public MessageGroupController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMessageGroupAsync([FromBody] QueryMessageGroup mg)
        {
            ResultInfo result = new ResultInfo();
            if (await UserHelper.IsAuthenticatedUserAsync(mg.AuthUserId, User.Identity.Name, _repository))
            {
                result = await MessageHepler.ApplyActionToMessageGroupAsync(mg, _repository, "create");
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
            if (await UserHelper.IsAuthenticatedUserAsync(mg.AuthUserId, User.Identity.Name, _repository))
            {
                result = await MessageHepler.ApplyActionToMessageGroupAsync(mg, _repository, "update");
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
            if (await UserHelper.IsAuthenticatedUserAsync(mg.AuthUserId, User.Identity.Name, _repository))
            {
                result = await MessageHepler.ApplyActionToMessageGroupAsync(mg, _repository, "delete");
            }
            else
            {
                return StatusCode(403);
            }

            return Json(result);
        }
    }
}
