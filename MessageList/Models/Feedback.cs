using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    [Table("feedbacks")]
    public class Feedback
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("feedback_text")]
        [Required]
        [MaxLength(4000)]
        public string FeedbackText { get; set; }
        [Column("feedback_contacts")]
        [MaxLength(400)]
        public string FeedbackContacts { get; set; }
        [Column("created_at")]
        [Required]
        public DateTime CreatedAt { get; set; }

        public Feedback() { }
        public Feedback (string feedbackText, string feedbackContacts)
        {
            FeedbackText = feedbackText;
            FeedbackContacts = feedbackContacts;
            CreatedAt = DateTime.Now;
        }
    }
}
