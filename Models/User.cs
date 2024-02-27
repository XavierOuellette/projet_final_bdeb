namespace Projet_Finale.Models
{
    public class UserList
    {
        public List<User> Users { get; set; }
    }

    public class User
    {
        public int User_Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
    }
}
