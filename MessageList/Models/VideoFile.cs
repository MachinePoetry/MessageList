using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using MessageList.Models.Interfaces;

namespace MessageList.Models { 

    [Table("video")]
    public class VideoFile : File, IDataFile
    {
        [Column("data")]
        [MaxLength(105000000)]
        [JsonProperty(PropertyName = "src")]
        [Required]
        public byte[] Data { get; set; }

        public VideoFile() { }
        public VideoFile(string contentType, string fileName, long length, byte[] data) : base(contentType, fileName, length)
        {
            Data = data;
        }

        public VideoFile(string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(contentType, fileName, length, fileCollectionId)
        {
            Data = data;
        }

        public VideoFile(int id, string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(id, contentType, fileName, length, fileCollectionId)
        {
            Data = data;
        }
    }
}
