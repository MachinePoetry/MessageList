using System;
using System.ComponentModel.DataAnnotations.Schema;


namespace MessageList.Models
{
    [Table("user_requests_history")]
    public class UserRequestInfo
    {
        [Column("id")]
        public int Id { get; set; }
        [Column("ip")]
        public string Ip { get; set; }
        [Column("country")]
        public string Country { get; set; }
        [Column("region_name")]
        public string RegionName { get; set; }
        [Column("city")]
        public string City { get; set; }
        [Column("provider")]
        public string Provider { get; set; }
        [Column("timezone")]
        public string Timezone { get; set; }
        [Column("is_mobile")]
        public bool IsMobile { get; set; }
        [Column("request_date")]
        public DateTime RequestDate { get; set; }
        [Column("user_id")]
        public int UserId { get; set; }



        public UserRequestInfo(string ip, string country, string regionName, string city, string provider, string timezone, bool isMobile, int userId)
        {
            Ip = ip;
            Country = country;
            RegionName = regionName;
            City = city;
            Provider = provider;
            Timezone = timezone;
            IsMobile = isMobile;
            RequestDate = DateTime.Now;
            UserId = userId;
        }
    }
}
