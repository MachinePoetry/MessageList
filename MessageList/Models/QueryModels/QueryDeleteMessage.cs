using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageList.Models.QueryModels
{
    public class QueryDeleteMessage
    {
        public int AuthUserId { get; set; }
        public int SelectedMessageId { get; set; }
    }
}
