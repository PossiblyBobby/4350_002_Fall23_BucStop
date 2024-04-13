using Microsoft.AspNetCore.Mvc;
using Octokit;
using BucStop.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BucStop_API.Models;
using System.Net.Http.Headers;
using System.Net;

namespace BucStop_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameInfoController : ControllerBase
    {
        private readonly GitHubClient _githubClient;
        private const string RepoOwner = "ccrawford02";
        private const string RepoName = "BucStopGames";

        public GameInfoController()
        {
            // Configuration for the GitHub client
            _githubClient = new GitHubClient(new Octokit.ProductHeaderValue("GameInfoApp"))
            {
                Credentials = new Credentials("WHERE THE TOKEN WOULD BE", AuthenticationType.Bearer)
            };
        }

        [HttpGet("games")]
        public async Task<ActionResult<IEnumerable<GameInfo>>> GetAllGamesAsync()
        {
            try
            {
                List<GameInfo> allGames = new List<GameInfo>();
                // Fetch all contents of the repository root, assuming folders are directly under root
                var repositoryContents = await _githubClient.Repository.Content.GetAllContents(RepoOwner, RepoName);

                // Filter contents to only include folders, and folders that follow a numeric naming convention
                var gameFolders = repositoryContents.Where(content => content.Type == ContentType.Dir && int.TryParse(content.Name, out _));

                foreach (var folder in gameFolders)
                {
                    // Assuming each game folder contains exactly one relevant file with details
                    var folderContents = await _githubClient.Repository.Content.GetAllContents(RepoOwner, RepoName, folder.Path);
                    var gameDetailFile = folderContents[0];  // Assuming the first file is the correct one to read

                    // Decode the base64 encoded file content and create a GameInfo object from it
                    string gameDetailsJson = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(gameDetailFile.Content));
                    GameInfo gameInfo = System.Text.Json.JsonSerializer.Deserialize<GameInfo>(gameDetailsJson);

                    allGames.Add(gameInfo);
                }

                return Ok(allGames);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"An error occurred while fetching game information: {ex.Message}");
            }
        }
    }
}