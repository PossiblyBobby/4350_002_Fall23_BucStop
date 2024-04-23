using BucStop_API.Models;
using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace BucStop_API.Services
{
    public class GameInstructionsService
    {
        private readonly HttpClient _httpClient;

        public GameInstructionsService(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }

        public async Task<GameDetails> GetGameInstructions(string gameName, string instructionsUrl)
        {
            try
            {
                var response = await _httpClient.GetAsync(instructionsUrl);
                response.EnsureSuccessStatusCode();
                var instructionsContent = await response.Content.ReadAsStringAsync();

                return new GameDetails
                {
                    GameName = gameName,
                    HowToPlay = instructionsContent,
                    // Populate other properties if available or leave them as defaults
                };
            }
            catch (HttpRequestException ex)
            {
                // Log the exception (Consider using a logging framework)
                // For now, we'll just throw it to be caught by the calling code.
                throw new ApplicationException($"An error occurred when fetching instructions for {gameName}: {ex.Message}", ex);
            }
        }
    }
}


