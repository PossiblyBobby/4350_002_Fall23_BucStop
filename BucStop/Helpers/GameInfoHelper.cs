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
    /// A helper class to manage API calls to a game information API gateway.
    /// This class abstracts the complexities of executing HTTP requests.
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
        /// <param name="httpClient">HttpClient for making HTTP requests.</param>
        /// <param name="apiBaseUrl">Base URL for the API gateway.</param>
        /// <param name="logger">Logger for error and information logging.</param>
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
        /// Asynchronously retrieves game details identified by the specified game ID.
        /// </summary>
        /// <param name="gameId">Unique identifier for the game.</param>
        /// <returns>A task that represents the asynchronous operation and contains GameInfo upon completion.</returns>
        public async Task<GameInfo> GetGameDetailsAsync(int gameId)
        {
            string url = $"{_apiBaseUrl}/game/{gameId}";

            try
            {
                HttpResponseMessage response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                var stream = await response.Content.ReadAsStreamAsync();
                return await JsonSerializer.DeserializeAsync<GameInfo>(stream, _options);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching game details for ID {gameId}: {ex}");
                return null;
            }
        }

        /// <summary>
        /// Fetches game data asynchronously from the API and returns a list of games.
        /// </summary>
        /// <returns>A task that represents the asynchronous operation and contains a list of games on completion.</returns>
        public async Task<List<Game>> GetGamesAsync()
        {
            // Assume an endpoint that returns an array of Game objects as JSON
            HttpResponseMessage response = await _httpClient.GetAsync($"{_apiBaseUrl}/games");

            // Ensure the response is successful or throw an exception
            response.EnsureSuccessStatusCode();

            // Read the response content as a string asynchronously
            string jsonContent = await response.Content.ReadAsStringAsync();

            // Deserialize the JSON content to a List<Game>
            List<Game> games = JsonSerializer.Deserialize<List<Game>>(jsonContent, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            // Return the deserialized list of games, or a new empty list if the deserialization returned null
            return games ?? new List<Game>();
        }

    }
}