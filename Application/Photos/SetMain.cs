using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users
                .Include(u => u.Photos)
                .FirstOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var currentMain = user.Photos.FirstOrDefault(p => p.IsMain);
                // if (currentMain != null)
                // {
                //     if (currentMain.Id == request.Id)
                //         return Result<Unit>.Failure("This photo is already a main photo");

                //     currentMain.IsMain = false;
                // }

                if (currentMain != null) currentMain.IsMain = false;

                var photo = user.Photos.FirstOrDefault(u => u.Id == request.Id);
                photo.IsMain = true;

                return await _context.SaveChangesAsync(cancellationToken) > 0
                ? Result<Unit>.Success(Unit.Value)
                : Result<Unit>.Failure("Problem setting main photo");
            }
        }
    }
}