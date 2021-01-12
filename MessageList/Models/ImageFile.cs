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
    }
}
