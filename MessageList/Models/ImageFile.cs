using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;
using MessageList.Models.Interfaces;

namespace MessageList.Models
{
    [Table("images")]
    public class ImageFile : File, IDataFile
    {
        [Column("data")]
        [MaxLength(1050000)]
        [JsonProperty(PropertyName = "src")]
        [Required]
        public byte[] Data { get; set; }

        public ImageFile() { }
        public ImageFile(string contentType, string fileName, long length, byte[] data) : base(contentType, fileName, length)
        {
            Data = data;
        }

        public ImageFile(string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(contentType, fileName, length, fileCollectionId) 
        {
            Data = data;
        }

        public ImageFile(int id, string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(id, contentType, fileName, length, fileCollectionId)
        {
            Data = data;
        }
    }
}
