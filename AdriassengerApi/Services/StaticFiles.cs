namespace AdriassengerApi.Services
{
    public class FileSavedResponse
    {
        public bool Success { get; set; }
        public string Path { get; set; }
    }

    public class StaticFiles : IStaticFiles
    {
        private string AvatarFolderName = "Avatars";

        public string GetAvatarPath()
        {
            return Path.Combine("wwwroot", AvatarFolderName);
        }

        private string GetUniqueFileName(string fileName)
        {
            return Guid.NewGuid() + fileName;
        }

        public async Task<FileSavedResponse> SaveAvatar(IFormFile file)
        {
            var staticFolderPath = GetAvatarPath();

            if (!Directory.Exists(staticFolderPath))
            {
                Directory.CreateDirectory(staticFolderPath);
            }

            var newFileName = GetUniqueFileName(file.FileName);
            var filePath = Path.Combine(staticFolderPath, newFileName);
            var stream = new FileStream(filePath, FileMode.Create);

            try
            {
                await file.CopyToAsync(stream);
                return new FileSavedResponse { Success = true, Path = Path.Combine("/", AvatarFolderName, newFileName) };
            }
            catch (Exception)
            {
                return new FileSavedResponse { Success = false, Path = "" };
            }
        }

        public async Task DeleteAvatar(string path)
        {
            var filePath = "wwwroot" + path;

            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
