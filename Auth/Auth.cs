using Newtonsoft.Json;
using System.Text;

namespace Projet_Finale.Auth
{
    public class Auth
    {
        private static readonly HttpClient httpClient = new HttpClient();

        public static async Task<bool> ValidateSessionAsync(HttpContext context)
        {

            string? sessionId = context.Request.Cookies["session_id"];
            string? userAgent = context.Request.Headers["User-Agent"];
            string? ipAddress = context.Connection?.RemoteIpAddress?.ToString();
            
            if (sessionId == null || userAgent == null || ipAddress == null)
            {
                return false;
            }

            var requestData = new Dictionary<string, string>
            {
                {"session_id", sessionId},
                {"user_agent", userAgent},
                {"ip_address", ipAddress}
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
}
