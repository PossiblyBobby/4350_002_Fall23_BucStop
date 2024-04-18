using BucStop.Helpers;
using BucStop.Models;
using BucStop.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BucStop.Controllers
{
    [Authorize]
    public class GamesController : Controller
    {
        private readonly GameInfoHelper _gameInfoHelper;
        private readonly PlayCountManager _playCountManager;
        private readonly GameService _gameService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogger<GamesController> _logger;

        /// <summary>
        /// Initializes a new instance of the GamesController class.
        /// </summary>
        /// <param name="gameInfoHelper">Helper for retrieving game information from the API.</param>
        /// <param name="playCountManager">Manager for handling play counts.</param>
        /// <param name="gameService">Service for accessing game data.</param>
        /// <param name="webHostEnvironment">Web hosting environment to manage files and server environment.</param>
        /// <param name="logger">Logger for logging messages.</param>
        public GamesController(GameInfoHelper gameInfoHelper, PlayCountManager playCountManager, GameService gameService, IWebHostEnvironment webHostEnvironment, ILogger<GamesController> logger)
        {
            _gameInfoHelper = gameInfoHelper;
            _playCountManager = playCountManager;
            _gameService = gameService;
            _webHostEnvironment = webHostEnvironment;
            _logger = logger;
        }

        /// <summary>
        /// Displays the index page with the list of games.
        /// </summary>
        /// <returns>The view with the list of games.</returns>
        [HttpGet]
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> Index()
        {
            try
            {
                var games = await GetGamesWithUpdatedInfo();
                return View(games);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while retrieving games.");
                return View("Error");
            }
        }

        /// <summary>
        /// Retrieves the list of games with updated information.
        /// </summary>
        /// <returns>The list of games with updated information.</returns>
        private async Task<List<Game>> GetGamesWithUpdatedInfo()
        {
            var games = await _gameInfoHelper.GetAllGamesInfoAsync();
            foreach (var game in games)
            {
                game.PlayCount = _playCountManager.GetPlayCount(game.Id);
            }
            return games;
        }

        /// <summary>
        /// Handles the logic for playing a game and updating the play count.
        /// </summary>
        /// <param name="id">The ID of the game to play.</param>
        /// <returns>The view for the game or a 404 Not Found response if the game is not found.</returns>
        [HttpGet]
        public async Task<IActionResult> Play(int id)
        {
            try
            {
                var games = await GetGamesWithUpdatedInfo();
                var game = games.FirstOrDefault(g => g.Id == id);
                if (game == null)
                {
                    return NotFound();
                }
                _playCountManager.IncrementPlayCount(id);
                game.PlayCount = _playCountManager.GetPlayCount(id);
                return View(game);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error occurred while retrieving game details for ID {id}.");
                return View("Error");
            }
        }

        /// <summary>
        /// Displays the Snake game view.
        /// </summary>
        /// <returns>The view for the Snake game.</returns>
        [HttpGet]
        public IActionResult Snake()
        {
            return View();
        }

        /// <summary>
        /// Displays the Tetris game view.
        /// </summary>
        /// <returns>The view for the Tetris game.</returns>
        [HttpGet]
        public IActionResult Tetris()
        {
            return View();
        }
    }
}