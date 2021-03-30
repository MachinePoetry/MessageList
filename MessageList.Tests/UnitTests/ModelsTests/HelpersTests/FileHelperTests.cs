using System;
using Xunit;
using System.Text;
using System.IO;
using Microsoft.AspNetCore.Http;
using MessageList.Models.QueryModels;
using MessageList.Models.Helpers;

namespace MessageList.Tests.UnitTests.ModelsTests.HelpersTests
{
    public class FileHelperTests
    {
        private IFormFile _file = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("This is a some file")), 0, 100, "Data", "file.txt");

        [Fact]
        public void ItShould_return_byte_array_of_file_data()
        {
            byte[] actual = FileHelper.getFileData(_file);
            Assert.True(actual.Length > 0);
        }

        [Fact]
        public void ItShould_return_true_if_collection_has_files()
        {
            QueryMessage message = new QueryMessage();
            message.Images.Add(_file);
            message.Video.Add(_file);
            bool actual = FileHelper.isMessageWithFiles(message);
            Assert.True(actual == true);
        }

        [Fact]
        public void ItShould_return_false_if_collection_has_no_files()
        {
            QueryMessage message = new QueryMessage();
            bool actual = FileHelper.isMessageWithFiles(message);
            Assert.True(actual == false);
        }

        [Fact]
        public void ItShould_return_true_if_collection_has_url_previews()
        {
            QueryMessage message = new QueryMessage();
            message.UrlPreviews.Add("some json with preview data");
            bool actual = FileHelper.isMessageWithUrlPreviews(message);
            Assert.True(actual == true);
        }

        [Fact]
        public void ItShould_return_false_if_collection_has_no_url_previews()
        {
            QueryMessage message = new QueryMessage();
            bool actual = FileHelper.isMessageWithUrlPreviews(message);
            Assert.True(actual == false);
        }
    }
}
