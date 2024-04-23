namespace bucstopapi.Models
{
    public class LeaderboardUpdateRequest
    {
        public string GameName { get; set; }
        public string Initials {  get; set; }
        public int Score {  get; set; }
    }
}
