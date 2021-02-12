using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.IO;
using MessageList.Data;
using MessageList.Models.QueryModels;

namespace MessageList.Models.Services
{
    public static class FileService
    {
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

        public static async Task<int> SaveFilesToDatabaseAsync<T>(IEnumerable<T> files, ApplicationDbContext db, DbSet<T> targetCollection) where T : class
        {
            foreach (var file in files)
            {
                await targetCollection.AddAsync(file);
            }
            int result = await db.SaveChangesAsync();
            return result;
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
