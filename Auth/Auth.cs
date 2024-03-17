using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using System.Text;

namespace Projet_Finale.Auth
{
    public class Auth : ActionFilterAttribute
    {
        private static readonly HttpClient httpClient = new HttpClient();

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            // Inject session data
            filterContext.HttpContext.Items["SessionData"] = new SessionData(filterContext.HttpContext);
        }

        public static async Task<bool> ValidateSessionAsync(SessionData session)
        {
            if (!session.IsValid)
            {
                return false;
            }

            var requestData = new Dictionary<string, string>
            {
                {"session_id", session.SessionID},
                {"user_agent", session.UserAgent},
                {"ip_address", session.IpAddress}
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");
            HttpResponseMessage response = await httpClient.PostAsync("http://127.0.0.1:5000/validate_session", content);

            return response.IsSuccessStatusCode;
        }

        public static async Task<bool> ValidatePermission(HttpContext context, string permission)
        {
            string? sessionId = context.Request.Cookies["session_id"];
            if(sessionId == null)
            {
                return false;
            }

            HttpResponseMessage response = await httpClient.GetAsync($"http://127.0.0.1:5000/has_permission?session_id={sessionId}&permission={permission}");
            return response.IsSuccessStatusCode;
        }
    }

    public static class MvcBuilderExtensions
    {
        public static IMvcBuilder AddGlobalFilter<TFilter>(this IMvcBuilder builder) where TFilter : IFilterMetadata
        {
            if (builder == null)
            {
                throw new ArgumentNullException(nameof(builder));
            }

            builder.Services.Configure<MvcOptions>(options =>
            {
                options.Filters.Add(typeof(TFilter));
            });

            return builder;
        }
    }
}
