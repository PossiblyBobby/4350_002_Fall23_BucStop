using Microsoft.AspNetCore.Mvc;
using BucStop_API.Models;
using Microsoft.AspNetCore.Mvc;
using BucStop_API.Models;
using System.Threading.Tasks;
using bucstopapi; // assuming your GitHubApiClient is within this namespace
using System;

namespace BucStop_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameInfoController : ControllerBase
    {
        private readonly GithubAPIFile.GitHubApiClient _gitHubApiClient;
        private static GitHubLeaderboardUpdater _leaderboardUpdater;
        private readonly IConfiguration _configuration;
        private readonly string _personalAccessToken;
        private readonly string _repoOwner;
        private readonly string _repoName;
        private readonly string _filePath;

        public GameInfoController(IConfiguration configuration)
        {
            // Assuming the Personal Access Token (PAT) is securely stored/retrieved
            // THIS IS WHERE THE TOKEN WOULD GO, CONSULT THE DOC!
            _configuration = configuration;
            // Abstract away for security reasons
            _personalAccessToken = _configuration["GitHubSettings:PersonalAccessToken"];
            _repoOwner = configuration["RepoSettings:RepoOwner"];
            _repoName = configuration["RepoSettings:RepoName"];
            _filePath = configuration["RepoSettings:FilePath"];
            _gitHubApiClient = new GithubAPIFile.GitHubApiClient(_personalAccessToken);
        }

        [HttpGet("{gameName}")]
        public async Task<ActionResult<GameDetails>> GetGameDetails(string gameName, string repoName, string repoOwner)
        {
            // GitHub repository details
            string path = $"{repoOwner}/{gameName}/{gameName}description.txt"; // Path to the game details file
            //////////////////////////////////// NOTE: RN THIS ONLY RETREIVES GAME DESCRIPTION, TODO: MODIFY FOR RELEASE \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

            try
            {
                // Fetch the raw content from GitHub. No decoding or JSON parsing here.
                var gameDetailsContent = await _gitHubApiClient.GetRepositoryContentsAsync(repoOwner, repoName, path);

                // Decode from base64, then directly use the fetched content. For illustration, we'll just simulate populating a GameDetails object.
                // Assuming gameDetailsContent contains simple delimited text or similar structure.
                var base64GameDetails = GithubAPIFile.DecodeContentFromBase64(gameDetailsContent);
                return Ok(base64GameDetails);
                //var gameDetails = new GameDetails
                //{
                //    // Example of setting properties. Adjust based on actual content structure.
                //    GameName = gameName,
                //    GameDescription = "Extracted Description from gameDetailsContent",
                //    HowToPlay = "Extracted Instructions",
                //    GameThumbnail = "Extracted Thumbnail URL",
                //    GameJavaScript = "Extracted JavaScript",
                //    LeaderboardInfo = "Extracted Leaderboard Data"
                //};

                //return Ok(gameDetails);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred while fetching game details for '{gameName}': {ex.Message}" });
            }
        }

        [HttpPost("UpdateLeaderboard")]
        public async Task<ActionResult> UpdateLeaderboard(string gameName, string initials, int score)
        {
            try
            {
                // Assume UpdateGitHubLeaderboardAsync is a method that updates the leaderboard
                // on GitHub using the provided game name, initials, and score.
                await _leaderboardUpdater.UpdateGitHubLeaderboardAsync(_repoOwner, _repoName, _filePath, initials, score);

                // Dummy return to be replaced
                return Ok(true);
            }
            catch (Exception ex)
            {
                // Log the error and return an error response
                
                // Dummy return to be replaced
                return Ok(true);
            }
        }
    }
}
