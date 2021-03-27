using System;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.Cookies;
using MessageList.Data;
using MessageList.Models;
using MessageList.Models.Interfaces;
using MessageList.Models.Services;
using MessageList.Models.Middleware;

namespace MessageList
{
    public class Startup
    {
        public IConfiguration Configuration { get; }

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers(mvcOtions =>
            {
                mvcOtions.EnableEndpointRouting = false;
            }).AddNewtonsoftJson();
            services.AddMvc();
            services.AddSpaStaticFiles(configuration => configuration.RootPath = "ClientApp/dist");
            services.AddDbContext<ApplicationDbContext>(options =>
            {
                options.UseNpgsql(Configuration["Data:MessageListDbConnection:ConnectionString"]);
            });
            services.AddSingleton<UptimeService>();
            services.AddTransient<IRepository, Repository>();
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(); // TO DO: Change this. In broswer cookies are named .AspNetCore.Cookies
            services.ConfigureApplicationCookie(options =>
            {
                options.Cookie.Name = "MessageList";
                options.ExpireTimeSpan = TimeSpan.FromDays(30);
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseMvc();
            app.Use(async (context, next) =>
            {
                if (context.User.Identity.IsAuthenticated)
                {
                    UserActivityTracker activityHelper = new UserActivityTracker(Configuration);
                    await activityHelper.LogUserRequestAsync(context, null);
                }
                await next.Invoke();
            });
            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "ClientApp";
                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });
        }
    }
}
