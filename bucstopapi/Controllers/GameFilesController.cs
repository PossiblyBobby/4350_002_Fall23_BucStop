using Microsoft.AspNetCore.Mvc;
using BucStop_API.Services;
using System.Threading.Tasks;

namespace BucStop_API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameFilesController : ControllerBase
    {
        private readonly GameFileService _gameFileService;

        public GameFilesController(GameFileService gameFileService)
        {
            _gameFileService = gameFileService;
        }

        /// <summary>
        /// Retrieves the content of a game file as a stream.
        /// </summary>
        /// <param name="gameId"></param>
        /// <param name="fileType"></param>
        /// <returns></returns>

        [HttpGet("{gameId}/{fileType}")]
        public async Task<IActionResult> GetGameFile(string gameId, string fileType)
        {
            var fileContent = await _gameFileService.GetGameFileAsStream(gameId, fileType);
            if (fileContent == null)
            {
                return NotFound("File not found.");
            }
            return Ok(fileContent);
        }



        //Method to get the thumbnail of the game by game id
        /// <summary>
        /// Retrieves the thumbnail of a game as a stream.
        /// </summary>
        /// <param name="gameId"></param>
        /// <returns></returns>


        [HttpGet("{gameId}/thumbnail")]


        public async Task<IActionResult> GetThumbnail(int gameId)
        {
            var imageStream = await _gameFileService.GetGameFileAsStream(gameId.ToString(), "thumbnail");
            if (imageStream == null)
            {
                return NotFound("Image not found");
            }

            return File(imageStream, "image/jpg"); // Ensure the MIME type matches your image format
        }


    }
}
