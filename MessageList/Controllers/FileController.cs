using System;
using System.Threading.Tasks;
using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MessageList.Models.Interfaces;

namespace MessageList.Controllers
{
    [Route("api/files")]
    [ApiController]
    [Authorize]
    [RequireHttps]
    public class FileController : Controller
    {
        private IRepository _repository;
        public FileController(IRepository repository)
        {
            _repository = repository;
        }

        [HttpGet("fileData")]
        public async Task<IActionResult> GetFileData([FromQuery] int fileId, string fileType)
        {
            IDataFile file = await _repository.GetFileAsync(fileId, fileType);

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