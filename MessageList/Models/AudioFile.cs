using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MessageList.Models
{
    [Table("audio")]
    public class AudioFile : File
    {
        [Column("data")]
        [MaxLength(20500000)]
        [Required]
        public byte[] Data { get; set; }
    }
}
