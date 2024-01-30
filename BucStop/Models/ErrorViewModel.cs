namespace BucStop.Models
{
    //Gets error ID and returns it if needed 
    //THIS IS A DOCUMENTATION EDIT TEST
    public class ErrorViewModel
    {
        public string? RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}