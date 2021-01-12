using System;

namespace MessageList.Models
{
    public class ResultInfo
    {
        public string Status { get; set; }
        public string Info { get; set; }
        public static ResultInfo CreateResultInfo(int res, string successStatus, string successInfo, string failStatus, string failInfo)
        {
            ResultInfo result;
            if (res > 0)
            {
                result = new ResultInfo(status: successStatus, info: successInfo);
            }
            else
            {
                result = new ResultInfo(status: failStatus, info: failInfo);
            }
            return result;
        }

        public ResultInfo() { }

        public ResultInfo(string status, string info)
        {
            Status = status;
            Info = info;
        }
    }
}
