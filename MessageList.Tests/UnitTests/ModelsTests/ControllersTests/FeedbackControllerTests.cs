using System;
using Xunit;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using MessageList.Tests.Infrastructure.Classes;
using MessageList.Controllers;
using MessageList.Models;
using MessageList.Models.QueryModels;
using MessageList.Models.Interfaces;

namespace MessageList.Tests.UnitTests.ModelsTests.ControllersTests
{
    public class FeedbackControllerTests
    {
        private static IRepository _repository = new RepositoryWithData();
        private FeedbackController _controller = new FeedbackController(_repository);

        [Fact]
        public async void ItShould_return_feedbacks_collection()
        {
            IActionResult res = await _controller.GetFeedbacksAsync();
            JsonResult result = Assert.IsType<JsonResult>(res);
            List<Feedback> actual = (List<Feedback>)result.Value;
            Assert.Equal("text1", actual.First().FeedbackText);
            Assert.Equal("contacts", actual.First().FeedbackContacts);
        }

        [Fact]
        public async void ItShould_return_success_result_if_feedback_was_created()
        {
            QueryFeedback feedbackParams = new QueryFeedback();
            feedbackParams.FeedbackText = "some feedback text";
            feedbackParams.FeedbackContacts = "some feedback contacts";
            IActionResult res = await _controller.CreateFeedbackAsync(feedbackParams);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("FeedbackCreated", actual.Status);
        }

        [Fact]
        public async void ItShould_return_fail_result_if_feedback_had_invalid_data()
        {
            QueryFeedback feedbackParams = new QueryFeedback();
            feedbackParams.FeedbackText = null;
            feedbackParams.FeedbackContacts = "some feedback contacts";
            IActionResult res = await _controller.CreateFeedbackAsync(feedbackParams);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("FeedbackCreationFailed", actual.Status);
        }

        [Fact]
        public async void ItShould_return_success_result_if_feedback_was_deleted()
        {
            Identificators idContainer = new Identificators();
            idContainer.Ids.Add(10);
            IActionResult res = await _controller.DeleteFeedbacksAsync(idContainer);
            JsonResult result = Assert.IsType<JsonResult>(res);
            ResultInfo actual = (ResultInfo)result.Value;
            Assert.Equal("FeedbacksDeleted", actual.Status);
        }
    }
}
