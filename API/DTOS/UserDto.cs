using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class UserDto
    {
        public string DisplayName { get; set; }

        public string Username { get; set; }
        
        public string Token { get; set; }

        public string Image {get; set;}
    }
}