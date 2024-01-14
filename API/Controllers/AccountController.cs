using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOS;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (result)
                return CreateUserDto(user);

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            var userNameAlreadyExists = await _userManager.Users.AnyAsync(x => x.UserName.Equals(registerDto.Username));
            if (userNameAlreadyExists)
            {
                ModelState.AddModelError("userName", "Username already taken!");
                return ValidationProblem();
            }

            //Can be done in IdentityService, however, we did here for better error format.
            var emailAlreadyExists = await _userManager.Users.AnyAsync(x => x.Email.Equals(registerDto.Email));
            if (emailAlreadyExists)
            {
                ModelState.AddModelError("email", "Email already taken!");
                return ValidationProblem();
            }

            var user = new AppUser()
            {
                DisplayName = registerDto.DisplayName,
                UserName = registerDto.Username,
                Email = registerDto.Email,
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (result.Succeeded)
                return CreateUserDto(user);

            return BadRequest("Problem registering the user!");
        }

        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserDto(user);
        }

        private UserDto CreateUserDto(AppUser user)
        {
            return new UserDto()
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Image = null,
                Token = _tokenService.CreateToken(user),
            };
        }
    }
}