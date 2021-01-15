using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace MessageList.Models
{
    [Table("audio")]
    public class AudioFile : File
    {
        [Column("data")]
        [MaxLength(20500000)]
        [JsonProperty(PropertyName = "src")]
        [Required]
        public byte[] Data { get; set; }

        public AudioFile(string contentType, string fileName, long length, int messageId, byte[] data) : base(contentType, fileName, length, messageId)
        {
            Data = data;
        }
    }
}
