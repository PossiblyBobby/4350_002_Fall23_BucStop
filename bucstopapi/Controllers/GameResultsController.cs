using Microsoft.AspNetCore.Mvc;
using BucStop_API.Models;

namespace BucStop_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GameResultsController : ControllerBase
    {
        [HttpPost]
        public IActionResult PostGameResult(GameResult gameResult)
        {
            // Logic to forward game result to the specific game's application
            return Ok("Result received and will be forwarded");
        }
    }
}
