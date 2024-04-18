using Microsoft.AspNetCore.Mvc;
using Octokit;
using bucstopapi.Enums;

namespace BucStop_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameInfoController : ControllerBase
    {
        private readonly GitHubClient _githubClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<GameInfoController> _logger;

        /// <summary>
        /// Represents the available game attributes that can be retrieved.
        /// </summary>
        public enum GameAttribute
        {
            Description,
            GenericInfo,
            // Add more attributes as needed
        }

        /// <summary>
        /// Initializes a new instance of the GameInfoController class.
        /// </summary>
        /// <param name="configuration">The configuration for accessing GitHub repository settings.</param>
        /// <param name="logger">The logger for logging messages.</param>
        public GameInfoController(IConfiguration configuration, ILogger<GameInfoController> logger)
        {
            _configuration = configuration;
            _logger = logger;

            // Create a new instance of the GitHubClient with the necessary configuration
            _githubClient = new GitHubClient(new ProductHeaderValue("GameInfoApp"))
            {
                Credentials = new Credentials(_configuration["GitHub:AccessToken"])
            };
        }

        /// <summary>
        /// Retrieves the specified game attribute for the given game ID from the GitHub repository.
        /// </summary>
        /// <param name="gameId">The ID of the game.</param>
        /// <param name="attribute">The game attribute to retrieve.</param>
        /// <returns>The value of the specified game attribute.</returns>
        [HttpGet("games/{gameId}/{attribute?}")]
        public async Task<ActionResult<string>> GetGameInfoAsync(int gameId, GameAttributes attribute = GameAttributes.GameInfo) //temp default attribute
        {
            try
            {
                var repoOwner = _configuration["GitHub:RepositoryOwner"];
                var repoName = _configuration["GitHub:RepositoryName"];

                string filePath = $"{gameId}/{attribute}.txt";
                var attributeContent = await GetFileContentAsync(repoOwner, repoName, filePath);

                return Ok(attributeContent);
            }
            catch (NotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"An error occurred while retrieving game attribute '{attribute}' for ID {gameId}");
                return StatusCode(500, $"An error occurred while retrieving game attribute '{attribute}' for ID {gameId}");
            }
        }

        [HttpGet("games")]
        public async Task<ActionResult<Dictionary<int, Dictionary<GameAttributes, string>>>> GetAllGamesInfoAsync()
        {
            try
            {
                var repoOwner = _configuration["GitHub:RepositoryOwner"];
                var repoName = _configuration["GitHub:RepositoryName"];

                var games = new Dictionary<int, Dictionary<GameAttributes, string>>();

                // Retrieve all contents of the repository
                var contents = await _githubClient.Repository.Content.GetAllContents(repoOwner, repoName);

                // Filter the contents to include only directories that represent game IDs
                var gameFolders = contents.Where(content => content.Type == ContentType.Dir && int.TryParse(content.Name, out _));

                foreach (var folder in gameFolders)
                {
                    var gameId = int.Parse(folder.Name);
                    var gameAttributes = new Dictionary<GameAttributes, string>();

                    foreach (var attribute in Enum.GetValues(typeof(GameAttributes)).Cast<GameAttributes>())
                    {
                        string filePath = $"{gameId}/{attribute}.txt";
                        var attributeContent = await GetFileContentAsync(repoOwner, repoName, filePath);

                        if (!string.IsNullOrEmpty(attributeContent))
                        {
                            gameAttributes[attribute] = attributeContent;
                        }
                    }

                    games[gameId] = gameAttributes;
                }

                return Ok(games);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while retrieving all games information");
                return StatusCode(500, "An error occurred while retrieving all games information");
            }
        }

        /// <summary>
        /// Retrieves the content of a file from the GitHub repository.
        /// </summary>
        /// <param name="repoOwner">The owner of the repository.</param>
        /// <param name="repoName">The name of the repository.</param>
        /// <param name="filePath">The path of the file.</param>
        /// <returns>The content of the file.</returns>
        private async Task<string> GetFileContentAsync(string repoOwner, string repoName, string filePath)
        {
            try
            {
                var fileContentBytes = await _githubClient.Repository.Content.GetRawContent(repoOwner, repoName, filePath);
                var fileContent = System.Text.Encoding.UTF8.GetString(fileContentBytes);
                return fileContent;
            }
            catch (NotFoundException)
            {
                return string.Empty;
            }
        }
    }
}