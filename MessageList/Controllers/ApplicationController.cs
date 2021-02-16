using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageList.Models.Services;

namespace MessageList.Controllers
{
    [Route("api/application")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class ApplicationController : Controller
    {
        private UptimeService _uptime;
        public ApplicationController(UptimeService uptime)
        {
            _uptime = uptime;
        }

        [HttpGet("getUptime")]
        public long GetUptime()
        {
            return _uptime.GetUptime();
        }
    }
}
