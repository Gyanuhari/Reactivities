using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : Controller
    {
        private IMediator _mediator;

        protected IMediator Mediator => _mediator ??=
            HttpContext.RequestServices.GetService<IMediator>();

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if (result == null || (result.IsSuccess && result.Value == null))
                return NotFound();

            if (result.IsSuccess && result.Value != null)
                return Ok(result.Value);

            return BadRequest(result.Error);
        }
    }
}