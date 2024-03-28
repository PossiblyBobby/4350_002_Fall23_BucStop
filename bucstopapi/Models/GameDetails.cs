namespace BucStop_API.Models
{
    public class GameDetails
    {
        public string GameName { get; set; }
        public string GameDescription { get; set; }
        public string HowToPlay { get; set; }
        public string GameThumbnail { get; set; } // URL or base64
        public string GameJavaScript { get; set; }
        public string LeaderboardInfo { get; set; } // JSON or plain text
    }
}
