using System;
using System.ComponentModel.DataAnnotations;

namespace MessageList.Models
{
    public class BugReport
    {
        public int Id { get; set; }
        [Required]
        [MaxLength(4000)]
        public string ReportText { get; set; }
        [MaxLength(400)]
        public string ReportContacts { get; set; }
        [Required]
        public DateTime CreatedAt { get; set; }

        public BugReport() { }
        public BugReport (string bugReportText, string bugReportContacts)
        {
            ReportText = bugReportText;
            ReportContacts = bugReportContacts;
            CreatedAt = DateTime.Now;
        }
    }
}
