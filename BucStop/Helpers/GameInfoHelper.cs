using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using BucStop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace BucStop.Helpers
{
    /// <summary>
    /// Provides methods to retrieve game information from the API gateway.
    /// </summary>
    public class GameInfoHelper
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiBaseUrl;
        private readonly JsonSerializerOptions _options;
        private readonly ILogger<GameInfoHelper> _logger;

        /// <summary>
        /// Initializes a new instance of the GameInfoHelper class.
        /// </summary>
        /// <param name="httpClient">The HttpClient for making HTTP requests.</param>
        /// <param name="apiBaseUrl">The base URL of the API gateway.</param>
        /// <param name="logger">The logger for logging messages.</param>
        public GameInfoHelper(HttpClient httpClient, string apiBaseUrl, ILogger<GameInfoHelper> logger)
        {
            _httpClient = httpClient;
            _apiBaseUrl = apiBaseUrl;
            _logger = logger;
            _options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        /// <summary>
        /// Retrieves the game details for the specified game ID from the API gateway.
        /// </summary>
        /// <param name="gameId">The ID of the game to retrieve details for.</param>
        /// <returns>The game details if found, or null if not found.</returns>
        /// <exception cref="Exception">Thrown when an error occurs while retrieving game details.</exception>
        public async Task<GameInfo> GetGameDetailsAsync(int gameId)
        {
            string url = $"{_apiBaseUrl}/game/{gameId}";

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var stream = await response.Content.ReadAsStreamAsync();
                    return await JsonSerializer.DeserializeAsync<GameInfo>(stream, _options);
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    _logger.LogWarning($"Game details not found for ID {gameId}");
                    return null;
                }
                else
                {
                    string errorMessage = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Error retrieving game details for ID {gameId}. Status code: {response.StatusCode}. Message: {errorMessage}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving game details for ID {gameId}");
                throw new Exception($"An error occurred while retrieving game details for ID {gameId}", ex);
            }
        }

        /// <summary>
        /// Retrieves the list of games from the API gateway.
        /// </summary>
        /// <returns>The list of games.</returns>
        /// <exception cref="Exception">Thrown when an error occurs while retrieving the list of games.</exception>
        public async Task<List<Game>> GetAllGamesInfoAsync()
        {
            string url = $"{_apiBaseUrl}/games";

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url);

                if (response.IsSuccessStatusCode)
                {
                    var stream = await response.Content.ReadAsStreamAsync();
                    return await JsonSerializer.DeserializeAsync<List<Game>>(stream, _options) ?? new List<Game>();
                }
                else
                {
                    string errorMessage = await response.Content.ReadAsStringAsync();
                    throw new Exception($"Error retrieving games. Status code: {response.StatusCode}. Message: {errorMessage}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving games");
                throw new Exception("An error occurred while retrieving games", ex);
            }
        }
    }
}