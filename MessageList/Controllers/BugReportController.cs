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
    [Route("api/bugReport")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class BugReportController : Controller
    {
        private ApplicationDbContext _db;
        public BugReportController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("get")]
        public async Task<JsonResult> GetReportsAsync()
        {
            List<BugReport> reports;
            reports = await _db.BugReports.ToListAsync();
            return Json(reports);         
        }

        [HttpPost("create")]
        [AllowAnonymous]
        public async Task<JsonResult> CreateReportAsync([FromBody] BugReport param)
        {
            int res = 0;
            BugReport report = new BugReport(bugReportText: param.ReportText, bugReportContacts: param.ReportContacts);
            await _db.BugReports.AddAsync(report);
            res = await _db.SaveChangesAsync();
            ResultInfo result = ResultInfo.CreateResultInfo(res, "ReportCreated", "Информация успешно передана", "ReportCreationFailed", "Произошла ошибка при создании сообщения");
            return Json(result);
        }
    }
}
