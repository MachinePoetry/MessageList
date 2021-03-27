using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using MessageList.Models;
using MessageList.Models.Filters;
using MessageList.Models.QueryModels;
using MessageList.Models.Validators;
using MessageList.Models.Interfaces;

namespace MessageList.Controllers
{
    [Route("api/feedback")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class FeedbackController : Controller
    {
        private IRepository _repository;
        public FeedbackController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("get")]
        [AdminOnly]
        public async Task<IActionResult> GetFeedbacksAsync()
        {
            IEnumerable<Feedback> feedbacks = await _repository.GetFeedbacksAsync();
            return Json(feedbacks);         
        }

        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<IActionResult> CreateFeedbackAsync([FromBody] QueryFeedback feedback)
        {
            ResultInfo result = new ResultInfo();
            if (Validator.IsFeedbackValid(feedback.FeedbackText, feedback.FeedbackContacts))
            {
                Feedback newFeedback = new Feedback(feedbackText: feedback.FeedbackText, feedbackContacts: feedback.FeedbackContacts);
                int res = await _repository.CreateFeedbackAsync(newFeedback);
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
            IEnumerable<Feedback> feedbacksToDelete = await _repository.GetFeedbacksFilteredByIdsAsync(ids.Ids);
            int res = await _repository.RemoveFeedbacksAsync(feedbacksToDelete);
            ResultInfo result = ResultInfo.CreateResultInfo(res, "FeedbacksDeleted", "Обратная связь успешно удалена", "FeedbacksDeletionFailed", "Произошла ошибка при удалении обратной связи");
            return Json(result);
        }
    }
}
