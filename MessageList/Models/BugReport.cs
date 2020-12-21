using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    [Table("bug_reports")]
    public class BugReport
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("report_text")]
        [Required]
        [MaxLength(4000)]
        public string ReportText { get; set; }
        [Column("report_contacts")]
        [MaxLength(400)]
        public string ReportContacts { get; set; }
        [Column("created_at")]
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
