using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace MessageList.Models
{
    [Table("files")]
    public class OtherFile : File
    {
        [Column("data")]
        [MaxLength(10500000)]
        [JsonProperty(PropertyName = "src")]
        [Required]
        public byte[] Data { get; set; }

        public OtherFile(string contentType, string fileName, long length, byte[] data) : base(contentType, fileName, length)
        {
            Data = data;
        }

        public OtherFile(string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(contentType, fileName, length, fileCollectionId)
        {
            Data = data;
        }

        public OtherFile(int id, string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(id, contentType, fileName, length, fileCollectionId)
        {
            Data = data;
        }
    }
}
