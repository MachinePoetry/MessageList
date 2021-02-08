using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace MessageList.Models
{
    [Table("images")]
    public class ImageFile : File
    {
        [Column("data")]
        [MaxLength(1050000)]
        [JsonProperty(PropertyName = "src")]
        [Required]
        public byte[] Data { get; set; }

        public ImageFile(string contentType, string fileName, long length, int fileCollectionId, byte[] data) : base(contentType, fileName, length, fileCollectionId) 
        {
            Data = data;
        }
    }
}
