using Microsoft.AspNetCore.Mvc;
using BucStop_API.Models;
using BucStop_API.Services;
using Microsoft.AspNetCore.Mvc;
using BucStop_API.Models;
using System.Threading.Tasks;
using bucstopapi; // assuming your GitHubApiClient is within this namespace
using System;
using bucstopapi.Models;
using Microsoft.Extensions.Configuration;


namespace BucStop_API.Controllers
{
    [ApiController]
    [Route("bucstopapi/[controller]")]
    public class GameInfoController : ControllerBase
    {
        private readonly GithubAPIFile.GitHubApiClient _gitHubApiClient;
        private static GitHubLeaderboardUpdater _leaderboardUpdater;
        private readonly IConfiguration _configuration;
        private readonly string _personalAccessToken;
        private readonly string _repoOwner;
        private readonly string _repoName;

        private string _gameFilePath;
        private GitHubLeaderboardUpdater leaderboardUpdater;

        private readonly ILogger<GameInfoController> _logger;

        private readonly HttpClient _httpClient;

        private readonly GameInstructionsService _gameInstructionsService;
        private readonly Dictionary<string, string> _gameUrls = new Dictionary<string, string>
        {
            {"Tetris", "https://raw.githubusercontent.com/ccrawford02/BucStopTetris/main/howtoplaytetris.txt"},
            {"Snake", "https://raw.githubusercontent.com/ccrawford02/BucStopSnake/main/HowToPlaySnake.txt"},
            {"Pong", "https://raw.githubusercontent.com/ccrawford02/BucStopPong/main/howtoplaypong.txt"}
        };

        public string GameFilePath
        {
            get { return _gameFilePath; }
            set { _gameFilePath = value; }
        }

        public GameInfoController(IConfiguration configuration, GameInstructionsService gameInstructionsService, ILogger<GameInfoController> logger)
        {
            // Assuming the Personal Access Token (PAT) is securely stored/retrieved
            // THIS IS WHERE THE TOKEN WOULD GO, CONSULT THE DOC!
            _configuration = configuration;
            // Abstract away for security reasons
            _personalAccessToken = _configuration["GitHubSettings:PersonalAccessToken"];
            _repoOwner = configuration["RepoSettings:RepoOwner"];
            _repoName = configuration["RepoSettings:RepoName"];
            _leaderboardUpdater = new GitHubLeaderboardUpdater(_personalAccessToken);
            _gitHubApiClient = new GithubAPIFile.GitHubApiClient(_personalAccessToken);
            _gameInstructionsService = gameInstructionsService;
            _logger = logger;
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

        [HttpPost("updateleaderboard")]
        public async Task<ActionResult> UpdateLeaderboard([FromBody] LeaderboardUpdateRequest request)
        {
            try
            {
                switch (request.GameName)
                {
                    case "Tetris":
                        GameFilePath = "1";
                        break;
                    case "Snake":
                        GameFilePath = "2";
                        break;
                    case "Pong":
                        GameFilePath = "3";
                        break;
                    default:
                        break;
                }
                // Assume UpdateGitHubLeaderboardAsync is a method that updates the leaderboard
                // on GitHub using the provided game name, initials, and score.
                await _leaderboardUpdater.UpdateGitHubLeaderboardAsync(_repoOwner, _repoName, GameFilePath, request.Initials, request.Score);

                // Dummy return to be replaced
                return Ok(true);
            }
            catch (Exception ex)
            {
                // Log the error and return an error response

                // Dummy return to be replaced
                return StatusCode(500, "An error occurred while updating the leaderboard in GameInfoController.");
            }
        }

        //Implementing the GetGameInstructions method to fetch the HowToPlay instructions for the game

        /// <summary>
        /// Retrieves the game instructions for the specified game.
        /// </summary>
        /// <param name="gameName">The name of the game.</param>
        /// <returns>The game instructions.</returns>
        [HttpGet("Instructions/{gameName}")]
        public async Task<ActionResult<GameDetails>> GetGameInstructions(string gameName)
        {
            // Check if the game instructions URL exists for the specified game
            if (!_gameUrls.TryGetValue(gameName, out var instructionsUrl))
            {
                _logger.LogWarning($"Instructions URL for {gameName} not found.");
                return NotFound($"Instructions for {gameName} not found.");
            }

            try
            {
                _logger.LogInformation($"Attempting to fetch game instructions for {gameName} from {instructionsUrl}");
                // Fetch the game instructions content using the GameInstructionsService
                var instructionsContent = await _gameInstructionsService.GetGameInstructions(gameName, instructionsUrl);

                _logger.LogInformation($"Successfully fetched instructions for {gameName}");
                return Ok(instructionsContent);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching instructions for {gameName}: {ex.Message}");
                return StatusCode(500, new { message = $"An error occurred while fetching game instructions for '{gameName}': {ex.Message}" });
            }
        }

    }

}

