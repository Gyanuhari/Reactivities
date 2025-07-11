using Application.Photos;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        // Why not this
        // public async Task<IActionResult> AddPhoto([FromForm] IFormFile file)
        // {
        //     return HandleResult(await Mediator.Send(new Add.Command { File = file }));
        // }

        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMain(string id)
        {
            return HandleResult(await Mediator.Send(new SetMain.Command { Id = id }));
        }
    }
}