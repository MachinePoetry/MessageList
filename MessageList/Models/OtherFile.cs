using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    [Table("files")]
    public class OtherFile : File
    {
        [Column("data")]
        [MaxLength(10500000)]
        [Required]
        public byte[] Data { get; set; }

        public OtherFile(string contentType, string fileName, long length, int relatedMessageId, byte[] data) : base(contentType, fileName, length, relatedMessageId)
        {
            Data = data;
        }
    }
}
