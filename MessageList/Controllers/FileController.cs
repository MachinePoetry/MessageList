using System;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageList.Data;

namespace MessageList.Controllers
{
    [Route("api/files")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class FileController : Controller
    {
        private ApplicationDbContext _db;
        public FileController(ApplicationDbContext db)
        {
            _db = db;
        }

        [HttpGet("fileData")]
        public IActionResult GetAudio([FromQuery] int fileId, string fileType)
        {
            dynamic file = null;

            switch(fileType)
            {
                case "image":
                    file = _db.Images.Find(fileId);
                    break;
                case "video":
                    file = _db.Video.Find(fileId);
                    break;
                case "audio":
                    file = _db.Audio.Find(fileId);
                    break;
                case "file":
                    file = _db.Files.Find(fileId);
                    break;
                default:
                    file = null;
                    break;
            }

            byte[] blob = file?.Data ?? new byte[0];
            MemoryStream ms = new MemoryStream();
            ms.Write(blob, 0, blob.Length);
            ms.Position = 0;
            FileResult resultFile = File(ms, file.ContentType, file.FileName, true);
            resultFile.EnableRangeProcessing = true;
            return resultFile;
        }
    }
}