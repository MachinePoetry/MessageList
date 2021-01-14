using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    [Table("images")]
    public class ImageFile : File
    {
        [Column("data")]
        [MaxLength(1050000)]
        [Required]
        public byte[] Data { get; set; }

        public ImageFile(string contentType, string fileName, long length, int messageId, byte[] data) : base(contentType, fileName, length, messageId) 
        {
            Data = data;
        }
    }
}
