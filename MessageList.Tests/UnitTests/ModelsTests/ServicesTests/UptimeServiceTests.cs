using System;
using Xunit;
using MessageList.Models.Services;

namespace MessageList.Tests.UnitTests.ModelsTests.ServicesTests
{
    public class UptimeServiceTests
    {
        [Fact]
        public void ItShould_return_true_if_uptime_service_is_created()
        {
            UptimeService service = new UptimeService();
            Assert.NotNull(service);
        }
    }
}
