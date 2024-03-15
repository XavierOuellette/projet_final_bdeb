namespace Projet_Finale.Auth
{
    public class SessionData
    {
        public string? SessionID { get; private set; }
        public string? UserAgent { get; private set; }
        public string? IpAddress { get; private set; }

        public bool IsValid { get; private set; }

        public SessionData(HttpContext context)
        {
            SessionID = context.Request.Cookies["session_id"];
            UserAgent = context.Request.Headers["User-Agent"];
            IpAddress = context.Connection?.RemoteIpAddress?.ToString();
            IsValid = (SessionID != null && UserAgent != null && IpAddress != null);
        }

    }
}
