using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace MessageList.Models
{
    [Table("file_collections")]
    public class FileCollection
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("related_message_id")]
        [Required]
        public int MessageId { get; set; }
        [JsonIgnore]
        public Message Message { get; set; }
        public List<ImageFile> Images { get; set; }
        public List<VideoFile> Video { get; set; }
        public List<AudioFile> Audio { get; set; }
        public List<OtherFile> Files { get; set; }

        public FileCollection()
        {
            Images = new List<ImageFile>();
            Video = new List<VideoFile>();
            Audio = new List<AudioFile>();
            Files = new List<OtherFile>();
        }
    }
}
