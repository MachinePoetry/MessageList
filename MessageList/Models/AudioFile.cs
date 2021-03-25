using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using MessageList.Models.Interfaces;

namespace MessageList.Models
{
    [Table("audio")]
    public class AudioFile : File, IDataFile
    {
        [Column("data")]
        [MaxLength(20500000)]
        [JsonProperty(PropertyName = "src")]
        [Required]
        public byte[] Data { get; set; }

        public AudioFile() { }
        public AudioFile(string contentType, string fileName, long length, byte[] data) : base(contentType, fileName, length)
        {
            Data = data;
        }

        public AudioFile(string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(contentType, fileName, length, fileCollectionId)
        {
            Data = data;
        }

        public AudioFile(int id, string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(id, contentType, fileName, length, fileCollectionId)
        {
            Data = data;
        }
    }
}
