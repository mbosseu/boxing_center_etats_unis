import os
import glob
from PIL import Image

def convert_and_update():
    folder = 'c:/Users/PC/Desktop/test2'
    
    # 1. Find all large PNGs
    large_pngs = []
    for root, _, filenames in os.walk(folder):
        if '.git' in root: continue
        for f in filenames:
            if f.lower().endswith('.png'):
                path = os.path.join(root, f)
                if os.path.getsize(path) > 400 * 1024:  # > 400KB
                    large_pngs.append(path)

    # 2. Convert to JPG
    renames = {}
    for png_path in large_pngs:
        try:
            with Image.open(png_path) as img:
                jpg_path = png_path.rsplit('.', 1)[0] + '.jpg'
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                img.save(jpg_path, 'JPEG', quality=80, optimize=True)
                
                # Get relative paths for search/replace
                rel_png = os.path.relpath(png_path, folder).replace('\\', '/')
                rel_jpg = os.path.relpath(jpg_path, folder).replace('\\', '/')
                renames[rel_png] = rel_jpg
                
                print(f"Converted {rel_png} to {rel_jpg}")
                
            os.remove(png_path)
        except Exception as e:
            print(f"Failed to convert {png_path}: {e}")

    # 3. Update all HTML/CSS files
    target_files = glob.glob(os.path.join(folder, '**/*.html'), recursive=True) + \
                   glob.glob(os.path.join(folder, '**/*.css'), recursive=True)
                   
    for tf in target_files:
        if '.git' in tf: continue
        try:
            with open(tf, 'r', encoding='utf-8') as f:
                content = f.read()
            
            updated = False
            for old_name, new_name in renames.items():
                # We only want the filename and maybe folder, e.g. "photo_salle/mma_cage.png"
                name_only = old_name.split('/')[-1]
                new_name_only = new_name.split('/')[-1]
                
                if old_name in content or name_only in content:
                    content = content.replace(old_name, new_name)
                    content = content.replace(name_only, new_name_only)
                    updated = True
                    
            if updated:
                with open(tf, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated references in {tf}")
        except Exception as e:
            print(f"Failed to update {tf}: {e}")

if __name__ == '__main__':
    convert_and_update()
