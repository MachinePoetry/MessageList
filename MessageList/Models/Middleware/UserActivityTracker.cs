using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using MessageList.Data;


namespace MessageList.Models.Middleware
{
    public class UserActivityTracker
    {
        public IConfiguration Configuration { get; }

        public UserActivityTracker(IConfiguration configuration)
        {
            Configuration = configuration;
        }
        public Task LogUserRequestAsync(HttpContext context, int? authUserId)
        {
            // powered by "https://ip-api.com/docs/api:json" service

            return Task.Run(async () => {
                var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
                optionsBuilder.UseNpgsql(Configuration["Data:MessageListDbConnection:ConnectionString"]);
                ApplicationDbContext db = new ApplicationDbContext(optionsBuilder.Options);
                User user = authUserId != null ? db.Users.Find(authUserId) : db.Users.Where(u => u.Email.Equals(context.User.Identity.Name)).FirstOrDefault();

                if (user != null)
                {
                    UserRequestInfo previousUserRequest = db.UserRequestsHistory.Where(req => req.UserId == user.Id).OrderByDescending(r => r.Id).Count() > 0 ?
                                                          db.UserRequestsHistory.Where(req => req.UserId == user.Id).OrderByDescending(r => r.Id).FirstOrDefault() : null;
                    string userIp = context.Connection.RemoteIpAddress.ToString();
                    //string userIp = "5.166.180.69";
                    string requestString = $"http://ip-api.com/json/{userIp}?fields=query,status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile";
                    //string requestString = "http://ip-api.com/json/5.166.180.69?fields=query,status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,mobile";
                    DateTime currentDate = DateTime.Now;
                    DateTime lastUserVisit = Convert.ToDateTime(previousUserRequest?.RequestDate);
                    TimeSpan userInactiveHours = currentDate - lastUserVisit;
                    double hours = userInactiveHours.TotalHours;

                    if ((previousUserRequest != null && (!previousUserRequest.Ip.Equals(userIp) || (previousUserRequest.Ip.Equals(userIp) && hours > 2.0))) || previousUserRequest == null)
                    {
                        HttpClient client = new HttpClient();
                        string apiResponse = await client.GetStringAsync(requestString);
                        JObject jObj = JObject.Parse(apiResponse);
                        if (jObj != null && jObj.HasValues && jObj.Property("status").Value.ToString().Equals("success"))
                        {
                            string ip = jObj.Property("query").Value.ToString() ?? String.Empty;
                            string country = jObj.Property("country").Value.ToString() ?? String.Empty;
                            string regionName = jObj.Property("regionName").Value.ToString() ?? String.Empty;
                            string city = jObj.Property("city").Value.ToString() ?? String.Empty;
                            string provider = jObj.Property("org").Value.ToString() ?? String.Empty;
                            string timezone = jObj.Property("timezone").Value.ToString() ?? String.Empty;
                            bool isMobile = false;
                            bool.TryParse(jObj.Property("mobile").Value.ToString(), out isMobile);
                            UserRequestInfo userRequestInfo = new UserRequestInfo(ip, country, regionName, city, provider, timezone, isMobile, user.Id);
                            db.UserRequestsHistory.Add(userRequestInfo);
                            await db.SaveChangesAsync();
                        }
                    }
                }
            });
        }
    }
}

