using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.IO;
using MessageList.Data;

namespace MessageList.Models.Services
{
    public static class FileService
    {
        public static List<File> ConvertFiles(IEnumerable<IFormFile> fileList, int relatedMessageId, Type outType)
        {
            List<File> files = new List<File>();
            if (fileList != null)
            {
                foreach (var file in fileList)
                {
                    byte[] fileData;
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        fileData = ms.ToArray();
                    }

                    switch (outType.Name)
                    {
                        case "ImageFile":
                            File imageFile = new ImageFile(file.ContentType, file.FileName, file.Length, relatedMessageId, fileData);
                            files.Add(imageFile);
                            break;
                        case "VideoFile":
                            File videoFile = new VideoFile(file.ContentType, file.FileName, file.Length, relatedMessageId, fileData);
                            files.Add(videoFile);
                            break;
                        case "AudioFile":
                            File audioFile = new AudioFile(file.ContentType, file.FileName, file.Length, relatedMessageId, fileData);
                            files.Add(audioFile);
                            break;
                        case "OtherFile":
                            File otherFile = new OtherFile(file.ContentType, file.FileName, file.Length, relatedMessageId, fileData);
                            files.Add(otherFile);
                            break;
                    }
                }
            }
            return files;
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
    }
}
