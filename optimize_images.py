import os
from PIL import Image

def optimize_image(path):
    try:
        with Image.open(path) as img:
            format = img.format
            original_size = os.path.getsize(path)
            
            # Skip small images (< 300KB)
            if original_size < 300 * 1024:
                return

            print(f"Optimizing {path} (Original: {original_size / 1024 / 1024:.2f} MB)")
            
            # Convert RGBA to RGB for JPEG if needed, but since we preserve format, PNG stays PNG
            if format == 'JPEG':
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                
                # Resize if too large
                max_dim = 1600
                if img.width > max_dim or img.height > max_dim:
                    img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                
                img.save(path, 'JPEG', quality=75, optimize=True)
                
            elif format == 'PNG':
                # Resize if too large
                max_dim = 1600
                if img.width > max_dim or img.height > max_dim:
                    img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
                
                img.save(path, 'PNG', optimize=True)
                
            new_size = os.path.getsize(path)
            print(f"  -> Reduced to {new_size / 1024 / 1024:.2f} MB")
            
    except Exception as e:
        print(f"Failed to optimize {path}: {e}")

def main():
    folder = 'c:/Users/PC/Desktop/test2'
    for root, _, filenames in os.walk(folder):
        if '.git' in root: continue
        for f in filenames:
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                optimize_image(os.path.join(root, f))

if __name__ == '__main__':
    main()
