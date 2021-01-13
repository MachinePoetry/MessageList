using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace MessageList.Models
{
    public class File
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("content_type")]
        public string ContentType { get; set; }
        [Column("file_name")]
        public string FileName { get; set; }
        [Column("length")]
        public long Length { get; set; }
        [Column("related_message_id")]
        [Required]
        public int RelatedMessageId { get; set; }
        [JsonIgnore]
        [NotMapped]
        public Message Message { get; set; }

        public File(string contentType, string fileName, long length, int relatedMessageId)
        {
            ContentType = contentType;
            FileName = fileName;
            Length = length;
            RelatedMessageId = relatedMessageId;
        }
    }
}
