using System;
using Xunit;
using System.Text;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using MessageList.Models;
using MessageList.Models.QueryModels;
using MessageList.Models.Helpers;
using MessageList.Models.Interfaces;
using MessageList.Tests.Infrastructure.Classes;

namespace MessageList.Tests.UnitTests.ModelsTests.HelpersTests
{
    public class MessageHelperTests
    {
        private IFormFile _file = new FormFile(new MemoryStream(Encoding.UTF8.GetBytes("This is a some file")), 0, 100, "Data", "image.jpeg")
        {
            Headers = new HeaderDictionary(),
            ContentType = "image/jpeg"
        };

        [Fact]
        public async void ItShould_return_sucess_result_if_action_was_applied()
        {
            IRepository repository = new RepositoryWithData();
            QueryMessageGroup mg = new QueryMessageGroup();
            mg.SelectedGroupId = 10;
            ResultInfo actual = await MessageHepler.ApplyActionToMessageGroupAsync(mg, repository, "delete");
            Assert.Equal("ActionApplied", actual.Status);
        }

        [Fact]
        public async void ItShould_return_fail_result_if_invalid_data_was_given()
        {
            IRepository repository = new RepositoryWithData();
            QueryMessageGroup mg = new QueryMessageGroup();
            mg.Name = "some very very very long name unbelievable";
            mg.SelectedGroupId = 10;
            ResultInfo actual = await MessageHepler.ApplyActionToMessageGroupAsync(mg, repository, "create");
            Assert.Equal("ActionFailed", actual.Status);
        }

        [Fact]
        public async void ItShould_return_message_groups_collection()
        {
            IRepository repository = new RepositoryWithData();
            User user = new User();
            IEnumerable<MessageGroup> actual = await MessageHepler.GetMessageGroupsAsync(user, repository);
            Assert.True(actual.Count() == 2);
        }

        [Fact]
        public async void ItShould_filter_messages_by_expression()
        {
            IRepository repository = new RepositoryWithData();
            User user = new User();
            IEnumerable<MessageGroup> actual = await MessageHepler.GetMessageGroupsAsync(user, repository);
            MessageHepler.FilterMessagesByExpression(actual, 0, m => m.Id == 1);
            Assert.True(actual.First().Messages.Count() == 0);
        }

        [Fact]
        public void ItShould_update_collection_of_files()
        {
            IRepository repository = new RepositoryWithData();
            IEnumerable<IFormFile> files = new List<IFormFile> { _file, _file };
            IList<ImageFile> actual = MessageHepler.UpdateFileCollection<ImageFile>(new List<ImageFile>(), 1, files, new List<int>(), repository);
            Assert.True(actual.Count() == 2);
        }

        [Fact]
        public void ItShould_update_collection_of_url_previews_in_message()
        {
            Message message = new Message("some text", 10);
            string urlPreviewJson = "{\"title\":\"title\", \"description\":\"description\", \"image\":\"image\", \"url\":\"url\"}";
            IEnumerable<string> urlPreviewsJsons = new List<string> { urlPreviewJson, urlPreviewJson };
            MessageHepler.AddUrlPreviewsToMessage(urlPreviewsJsons, message);
            Assert.True(message.UrlPreviews.Count() == 2);
        }
    }
}
