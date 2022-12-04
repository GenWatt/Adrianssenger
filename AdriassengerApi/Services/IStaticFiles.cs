namespace AdriassengerApi.Services
{
    public interface IStaticFiles
    {
        string GetAvatarPath();
        Task<FileSavedResponse> SaveAvatar(IFormFile file);
        Task DeleteAvatar(string filename);
    }
}