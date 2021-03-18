using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MessageList.Data;
using MessageList.Models;

namespace MessageList.Controllers
{
    [Route("api/feedback")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class FeedbackController : Controller
    {
        private ApplicationDbContext _db;
        public FeedbackController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("get")]
        public async Task<JsonResult> GetReportsAsync()
        {
            List<Feedback> reports = await _db.Feedbacks.ToListAsync();
            return Json(reports);         
        }

        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<JsonResult> CreateReportAsync([FromBody] Feedback param)
        {
            Feedback report = new Feedback(feedbackText: param.FeedbackText, feedbackContacts: param.FeedbackContacts);
            await _db.Feedbacks.AddAsync(report);
            int res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "FeedbackCreated", "Информация успешно передана", "FeedbackCreationFailed", "Произошла ошибка при создании сообщения");
            return Json(result);
        }
    }
}
