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
        [JsonProperty(PropertyName = "type")]
        public string ContentType { get; set; }
        [Column("file_name")]
        [JsonProperty(PropertyName = "name")]
        public string FileName { get; set; }
        [Column("length")]
        [JsonProperty(PropertyName = "size")]
        public long Length { get; set; }
        [Column("related_file_collection_id")]
        [Required]
        public int FileCollectionId { get; set; }
        [JsonIgnore]
        public FileCollection FileCollection { get; set; }

        public File(string contentType, string fileName, long length)
        {
            ContentType = contentType;
            FileName = fileName;
            Length = length;
        }

        public File(string contentType, string fileName, long length, int fileCollectionId) : this(contentType, fileName, length)
        {
            FileCollectionId = fileCollectionId;
        }

        public File(int id, string contentType, string fileName, long length, int fileCollectionId) : this(contentType, fileName, length, fileCollectionId)
        {
            Id = id;
        }
    }
}
