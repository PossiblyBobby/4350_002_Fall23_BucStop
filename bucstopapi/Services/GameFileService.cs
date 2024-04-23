using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using System.IO;

namespace BucStop_API.Services
{
    public class GameFileService
    {
        private readonly HttpClient _httpClient;

        private readonly ILogger<GameFileService> _logger;

        private readonly string _baseRepoUrl = "https://raw.githubusercontent.com/ccrawford02/BucStopGames/main/";

        public GameFileService(HttpClient httpClient, ILogger<GameFileService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }
        /// <summary>
        /// Retrieves the file path for the specified game ID and file type according to https://github.com/ccrawford02/BucStopGames
        /// </summary>
        /// <param name="gameId">The ID of the game.</param>
        /// <param name="fileType">The type of the file.</param>
        /// <returns>The file path, or null if the file type is invalid.</returns>
        public string GetFilePath(string gameId, string fileType)
        {
            var fileName = fileType switch
            {
                "description" => "Description.txt",
                "js" => "GameCode.js",
                "info" => "GameInfo.txt",
                "howtoplay" => "HowToPlay.txt",
                "leaderboard" => "Leaderboard.txt",
                "thumbnail" => "Thumbnail.jpg",
                _ => null
            };

            if (fileName == null)
            {
                _logger.LogError($"Invalid file type requested: {fileType}");
                return null;
            }

            return $"{_baseRepoUrl}{gameId}/{fileName}";
        }




        /// <summary>
        /// Retrieves a game file as a stream from the specified game ID and file type.
        /// </summary>
        /// <param name="gameId">The ID of the game.</param>
        /// <param name="fileType">The type of the file to retrieve.</param>
        /// <returns>A stream containing the game file, or null if the file could not be retrieved.</returns>
        public async Task<Stream> GetGameFileAsStream(string gameId, string fileType)
        {
            string fileUrl = GetFilePath(gameId, fileType);
            if (fileUrl == null) return null;

            try
            {
                _logger.LogInformation($"Fetching file from URL: {fileUrl}");
                var response = await _httpClient.GetAsync(fileUrl);
                response.EnsureSuccessStatusCode();
                return await response.Content.ReadAsStreamAsync();
            }
            catch (HttpRequestException ex)
            {
                _logger.LogError($"Error fetching file: {ex.Message}");
                return null;
            }
        }
    }
}
