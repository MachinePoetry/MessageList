using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.Filters;
using MessageList.Models.QueryModels;

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
        [AdminOnly]
        public async Task<IActionResult> GetFeedbacksAsync()
        {
            List<Feedback> feedbacks = await _db.Feedbacks.ToListAsync();
            return Json(feedbacks);         
        }

        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateFeedbackAsync([FromBody] QueryFeedback feedback)
        {
            ResultInfo result = new ResultInfo();
            if (feedback.FeedbackText.Length <= 4000 && feedback.FeedbackContacts.Length <= 400)
            {
                Feedback newFeedback = new Feedback(feedbackText: feedback.FeedbackText, feedbackContacts: feedback.FeedbackContacts);
                await _db.Feedbacks.AddAsync(newFeedback);
                int res = await _db.SaveChangesAsync();
                result = ResultInfo.CreateResultInfo(res, "FeedbackCreated", "Информация успешно передана", "FeedbackCreationFailed", "Произошла ошибка при создании сообщения");
            }
            else
            {
                result = new ResultInfo("FeedbackCreationFailed", "Слишком длинный текст сообщения или контактов");
            }
            return Json(result);
        }

        [HttpPost("delete")]
        [AdminOnly]
        public async Task<IActionResult> DeleteFeedbacksAsync([FromBody] Identificators ids)
        {
            List<Feedback> feedbacksToDelete = _db.Feedbacks.Where(u => ids.Ids.Contains(u.Id)).ToList();
            _db.Feedbacks.RemoveRange(feedbacksToDelete);
            int res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "FeedbacksDeleted", "Обратная связь успешно удалена", "FeedbacksDeletionFailed", "Произошла ошибка при удалении обратной связи");
            return Json(result);
        }
    }
}
