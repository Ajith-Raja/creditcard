using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace FintechApp.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RewardTypesController : ControllerBase
    {
        private static readonly string DataDir = Path.Combine(AppContext.BaseDirectory, "Data");
        private static readonly string FilePath = Path.Combine(DataDir, "rewardTypes.json");
        private static readonly object _lock = new object();

        private List<RewardTypeItem> ReadAll()
        {
            lock (_lock)
            {
                if (!Directory.Exists(DataDir)) Directory.CreateDirectory(DataDir);
                if (!System.IO.File.Exists(FilePath))
                {
                    System.IO.File.WriteAllText(FilePath, "[]");
                }
                var json = System.IO.File.ReadAllText(FilePath);
                return JsonSerializer.Deserialize<List<RewardTypeItem>>(json) ?? new List<RewardTypeItem>();
            }
        }

        private void WriteAll(List<RewardTypeItem> items)
        {
            lock (_lock)
            {
                var json = JsonSerializer.Serialize(items, new JsonSerializerOptions{WriteIndented=true});
                System.IO.File.WriteAllText(FilePath, json);
            }
        }

        [HttpGet]
        public ActionResult<IEnumerable<RewardTypeItem>> GetAll()
        {
            return Ok(ReadAll());
        }

        [HttpPost]
        public ActionResult<RewardTypeItem> Create([FromBody] RewardTypeCreateRequest req)
        {
            if (string.IsNullOrWhiteSpace(req?.Name)) return BadRequest("Name is required");
            var items = ReadAll();
            var item = new RewardTypeItem{ Id = Guid.NewGuid().ToString(), Name = req.Name.Trim() };
            items.Add(item);
            WriteAll(items);
            return CreatedAtAction(nameof(GetAll), new { id = item.Id }, item);
        }

        [HttpPut("{id}")]
        public ActionResult Update(string id, [FromBody] RewardTypeCreateRequest req)
        {
            if (string.IsNullOrWhiteSpace(req?.Name)) return BadRequest("Name is required");
            var items = ReadAll();
            var existing = items.FirstOrDefault(x => x.Id == id);
            if (existing == null) return NotFound();
            existing.Name = req.Name.Trim();
            WriteAll(items);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(string id)
        {
            var items = ReadAll();
            var existing = items.FirstOrDefault(x => x.Id == id);
            if (existing == null) return NotFound();
            items.Remove(existing);
            WriteAll(items);
            return NoContent();
        }
    }

    public class RewardTypeItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class RewardTypeCreateRequest
    {
        public string Name { get; set; }
    }
}
