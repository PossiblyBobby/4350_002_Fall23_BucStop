using BucStop.Helpers;
using BucStop.Models;
using BucStop.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BucStop.Controllers
{
    [Authorize]
    public class GamesController : Controller
    {
        private readonly GameInfoHelper _gameInfoHelper;
        private readonly PlayCountManager _playCountManager;
        private readonly GameService _gameService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        /// <summary>
        /// Constructor initializes services and helpers used within the controller.
        /// </summary>
        /// <param name="gameInfoHelper">Helper for retrieving game information.</param>
        /// <param name="playCountManager">Manager for handling play counts.</param>
        /// <param name="gameService">Service for accessing game data.</param>
        /// <param name="webHostEnvironment">Web hosting environment to manage files and server environment.</param>
        public GamesController(GameInfoHelper gameInfoHelper, PlayCountManager playCountManager, GameService gameService, IWebHostEnvironment webHostEnvironment)
        {
            _gameInfoHelper = gameInfoHelper;
            _playCountManager = playCountManager;
            _gameService = gameService;
            _webHostEnvironment = webHostEnvironment;
        }

        /// <summary>
        /// Displays the index page with updated games list.
        /// </summary>
        /// <returns>An asynchronous task that renders the Index view.</returns>
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public async Task<IActionResult> IndexAsync()
        {
            List<Game> games = await GetGamesWithUpdatedInfo();
            foreach (Game game in games)
            {
                game.PlayCount = _playCountManager.GetPlayCount(game.Id);
            }
            return View(games);
        }

        /// <summary>
        /// Fetches and updates game details using the GameInfoHelper which retrieves data via API.
        /// </summary>
        /// <returns>A task resulting in a list of fully updated game data.</returns>
        public async Task<List<Game>> GetGamesWithUpdatedInfo()
        {
            List<Game> games = await _gameInfoHelper.GetGamesAsync();
            return games;
        }

        /// <summary>
        /// Handles the logic for playing a game, updating and displaying play counts.
        /// </summary>
        /// <param name="id">Game ID.</param>
        /// <returns>ActionResult to either play the game or show a 'NotFound' page.</returns>
        public async Task<IActionResult> Play(int id)
        {
            List<Game> games = await GetGamesWithUpdatedInfo();
            Game game = games.FirstOrDefault(x => x.Id == id);
            if (game == null) return NotFound();
            _playCountManager.IncrementPlayCount(id);
            game.PlayCount = _playCountManager.GetPlayCount(id);
            return View(game);
        }

        /// <summary>
        /// View for a deprecated game, Snake.
        /// </summary>
        /// <returns>ActionResult rendering the Snake game view.</returns>
        public IActionResult Snake()
        {
            return View();
        }

        /// <summary>
        /// View for another deprecated game, Tetris.
        /// </summary>
        /// <returns>ActionResult rendering the Tetris game view.</returns>
        public IActionResult Tetris()
        {
            return View();
        }
    }
}