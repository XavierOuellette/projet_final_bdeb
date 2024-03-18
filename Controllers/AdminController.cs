using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Projet_Finale.Auth;
using Projet_Finale.Models;

namespace Projet_Finale.Controllers
{
    public class AdminController : Controller
    {
        private readonly HttpClient _httpClient;

        public AdminController()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("http://127.0.0.1:5000");
        }

        public async Task<ActionResult> ManageUser()
        {
            SessionData session = new SessionData(HttpContext);
            var response = await _httpClient.GetAsync($"/all_users?session_id={session.SessionID}&user_agent={session.UserAgent}&ip_address={session.IpAddress}");
            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                var userList = JsonConvert.DeserializeObject<UserList>(content);
                ViewBag.Roles = new List<String>{"Admin","User"};
                return View(userList.Users);
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
    }
}
