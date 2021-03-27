using System;

namespace MessageList.Models.QueryModels
{
    public class QueryFeedback
    {
        public string FeedbackText { get; set; }
        private string _feedbackText = "";
        public string FeedbackContacts { get => _feedbackText; set => _feedbackText = value != null ? value : ""; }
    }
}
