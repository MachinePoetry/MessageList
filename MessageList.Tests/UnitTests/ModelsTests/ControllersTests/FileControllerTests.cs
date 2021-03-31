using System;
using Xunit;
using Microsoft.AspNetCore.Mvc;
using MessageList.Controllers;
using MessageList.Models.Interfaces;
using MessageList.Tests.Infrastructure.Classes;

namespace MessageList.Tests.UnitTests.ModelsTests.ControllersTests
{
    public class FileControllerTests
    {
        private static IRepository _repository = new RepositoryWithData();
        private FileController _controller = new FileController(_repository);

        [Fact]
        public async void ItShould_return_file()
        {
            IActionResult res = await _controller.GetFileData(10, "str");
            FileResult result = Assert.IsType<FileStreamResult>(res);
        }
    }
}
