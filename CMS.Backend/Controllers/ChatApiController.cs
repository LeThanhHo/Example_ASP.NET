/*
 Ten: Le Thanh Ho | MSSV: 2123110125 | Lop: CCQ2311D
*/
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers.Api
{
    // 💡 ĐÃ SỬA: Ép cứng chuỗi cố định, loại bỏ hoàn toàn tự dịch [controller] tránh lỗi 404
    [Route("api/ChatApi")]
    [ApiController]
    public class ChatApiController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly string _geminiApiKey = "AIzaSyB0FDVTad6-gBY_SbhlH4uSu-pWv3M1Z58";

        public ChatApiController(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        // 💡 ĐÃ SỬA: Đường dẫn đầy đủ lúc này bắt buộc là: api/ChatApi/send-message
        [HttpPost("send-message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatRequestDto model)
        {
            if (string.IsNullOrWhiteSpace(model.Message))
                return BadRequest(new { message = "Nội dung tin nhắn không được để trống!" });

            try
            {
                var client = _httpClientFactory.CreateClient();
                // 💡 ĐÃ SỬA: Đổi từ gemini-1.5-flash sang gemini-1.5-pro để khớp với phân quyền của Key
                string url = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key={_geminiApiKey}";

                var requestBody = new
                {
                    contents = new[]
                    {
                        new {
                            parts = new[] {
                                new { text = "Bạn là một trợ lý ảo thông minh của trang web quản lý hệ thống cơ khí đồ án của Lê Thanh Hồ. Hãy trả lời ngắn gọn câu hỏi sau: " + model.Message }
                            }
                        }
                    }
                };

                var serializeOptions = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                var jsonPayload = JsonSerializer.Serialize(requestBody, serializeOptions);
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(url, content);
                if (!response.IsSuccessStatusCode)
                {
                    var errorResponse = await response.Content.ReadAsStringAsync();
                    return StatusCode((int)response.StatusCode, new { message = "Google Gemini từ chối gói tin!", details = errorResponse });
                }

                var responseString = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(responseString);

                string aiResponse = jsonDoc.RootElement
                    .GetProperty("candidates")[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text").GetString();

                return Ok(new { reply = aiResponse });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Server C# bị gãy nội bộ!",
                    errorType = ex.GetType().Name,
                    errorText = ex.Message,
                    stackTrace = ex.StackTrace
                });
            }
        }
    }

    public class ChatRequestDto
    {
        public string Message { get; set; }
    }
}