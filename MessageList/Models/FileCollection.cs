using System;
using System.Collections.Generic;

namespace MessageList.Models
{
    public class FileCollection
    {
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
