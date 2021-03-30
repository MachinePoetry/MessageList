using System;
using System.Linq;
using Microsoft.AspNetCore.Http;
using System.IO;
using MessageList.Models.QueryModels;

namespace MessageList.Models.Helpers
{
    public static class FileHelper
    {
        public static int MessagesToLoadAmountMin = 20;
        public static int MessagesToLoadAmountMax = 10000;
        public static byte[] getFileData(IFormFile file)
        {
            byte[] fileData;
            using (var ms = new MemoryStream())
            {
                file.CopyTo(ms);
                fileData = ms.ToArray();
            }
            return fileData;
        }

        public static bool isMessageWithFiles(QueryMessage mes)
        {
            return (mes.Images?.Count() > 0 || mes.Video?.Count() > 0 || mes.Audio?.Count() > 0 || mes.Files?.Count() > 0);
        }

        public static bool isMessageWithUrlPreviews(QueryMessage mes)
        {
            return mes.UrlPreviews.Count > 0;
        }
    }
}
