using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models { 

    [Table("video")]
    public class VideoFile : File
    {
        [Column("data")]
        [MaxLength(105000000)]
        [Required]
        public byte[] Data { get; set; }

        public VideoFile(string contentType, string fileName, long length, int messageId, byte[] data) : base(contentType, fileName, length, messageId)
        {
            Data = data;
        }
    }
}
