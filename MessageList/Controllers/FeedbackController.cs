using System;
using System.Linq;
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
        public async Task<JsonResult> GetFeedbackAsync()
        {
            List<Feedback> reports = await _db.Feedbacks.ToListAsync();
            return Json(reports);         
        }

        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<JsonResult> CreateFeedbackAsync([FromBody] Feedback feedback)
        {
            Feedback report = new Feedback(feedbackText: feedback.FeedbackText, feedbackContacts: feedback.FeedbackContacts);
            await _db.Feedbacks.AddAsync(report);
            int res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "FeedbackCreated", "Информация успешно передана", "FeedbackCreationFailed", "Произошла ошибка при создании сообщения");
            return Json(result);
        }

        [HttpPost("delete")]
        [AllowAnonymous]
        public async Task<JsonResult> DeleteFeedbackssync([FromBody] Identificators ids)
        {
            int res = 0;
            List<Feedback> feedbacksToDelete = _db.Feedbacks.Where(u => ids.Ids.Contains(u.Id)).ToList();
            foreach (var feedbackToDelete in feedbacksToDelete)
            {
                _db.Feedbacks.Remove(feedbackToDelete);
            }
            res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "FeedbacksDeleted", "Обратная связь успешно удалена", "FeedbacksDeletionFailed", "Произошла ошибка при удалении обратной связи");
            return Json(result);
        }
    }
}
