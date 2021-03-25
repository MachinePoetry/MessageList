using System;

namespace MessageList.Models.Interfaces
{
    public interface IDataFile
    {
        int Id { get; set; }
        string ContentType { get; set; }
        string FileName { get; set; }
        long Length { get; set; }
        int FileCollectionId { get; set; }
        FileCollection FileCollection { get; set; }
        byte[] Data { get; set; }
    }
}
