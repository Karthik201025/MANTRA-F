from pathlib import Path
from collections import deque
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "models" / "characters"
DEST = ROOT / "public" / "images" / "characters" / "processed"
DEST.mkdir(parents=True, exist_ok=True)

files = [p for p in SOURCE.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]

def remove_background(image: Image.Image) -> tuple[Image.Image, str]:
    image = image.convert("RGBA")
    pixels = image.load()
    width, height = image.size
    if image.getbbox() is None:
        return image, "already-transparent"
    corners = [(0, 0), (width - 1, 0), (0, height - 1), (width - 1, height - 1)]
    samples = [pixels[x, y][:3] for x, y in corners]
    queue = deque(corners)
    seen = set(corners)
    tolerance = 34
    while queue:
        x, y = queue.popleft()
        base = pixels[x, y][:3]
        if min(sum((base[i] - sample[i]) ** 2 for i in range(3)) ** 0.5 for sample in samples) > tolerance:
            continue
        pixels[x, y] = (*base, 0)
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in seen:
                seen.add((nx, ny))
                queue.append((nx, ny))
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if not bbox:
        return image, "manual-review-empty"
    return image.crop(bbox), "auto-corner-extraction"

for source in sorted(files):
    extracted, status = remove_background(Image.open(source))
    extracted.thumbnail((440, 440), Image.Resampling.LANCZOS)
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    x = (512 - extracted.width) // 2
    y = 448 - extracted.height
    canvas.alpha_composite(extracted, (x, max(16, y)))
    output = DEST / f"{source.stem.lower().replace(' ', '-').replace('_', '-')}.png"
    canvas.save(output, "PNG", optimize=True)
    print(f"{source.name}\t{output.relative_to(ROOT)}\t{status}\t{output.stat().st_size}")
