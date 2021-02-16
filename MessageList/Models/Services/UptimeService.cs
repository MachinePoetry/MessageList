using System;
using System.Diagnostics;

namespace MessageList.Models.Services
{
    public class UptimeService
    {
        private Stopwatch timer;
        public UptimeService()
        {
            timer = Stopwatch.StartNew();
        }
        public long GetUptime() => timer.ElapsedMilliseconds;
    }
}
