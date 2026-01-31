# 🚀 Quick Start Guide - Lua Obfuscator Web Edition

## 30-Second Setup

No installation needed! Just open `index.html` in your browser.

### Open in Browser:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html

# Or: Double-click the file
```

## First Use (2 Minutes)

1. **Open the App**
   - Navigate to `/workspaces/LuaObfuscatorV2/`
   - Double-click `index.html`
   - Browser opens with the obfuscator

2. **Load an Example**
   - Click "Load Example" button
   - Sample code appears in left panel

3. **Obfuscate**
   - Click "⚡ Obfuscate" button
   - Wait < 1 second
   - See result in right panel

4. **Copy or Download**
   - Click "Copy" to clipboard
   - OR "Download" to save as `.lua` file

## Three Options to Use

### Option A: Web Browser (Simplest)
```
Open index.html → Paste code → Click Obfuscate → Copy result
```

### Option B: HTTP Server
```bash
# Terminal 1: Start server
cd /workspaces/LuaObfuscatorV2
python -m http.server 8000

# Terminal 2: Open browser
# Visit: http://localhost:8000
```

### Option C: IDE Integration
```
File → Open File → Select index.html → Use in editor
```

## Settings Explained

| Setting | Effect | When to Use |
|---------|--------|------------|
| **Encrypt Strings** | Hides text in tables | Always enabled |
| **Minify Code** | Removes spaces (40% smaller) | Always enabled |
| **Obfuscate Variables** | Renames variables | Always enabled |
| **Remove Comments** | Strips documentation | Always enabled |
| **Include VM Wrapper** | Maximum protection | If needed |

## Common Workflows

### Protect Simple Script
1. Load Example
2. Keep all defaults
3. Click Obfuscate
4. Download

### Ultra-Compact Output
1. Enable: Minify + Obfuscate Variables
2. Disable: Include VM Wrapper
3. Obfuscate
4. Result: Smallest possible size

### Maximum Security
1. Enable all options
2. Enable: Include VM Wrapper
3. Obfuscate
4. Result: Hardest to reverse

## Real-World Examples

### Example 1: Simple Function
**Before:**
```lua
function hello(name)
    print("Hello " .. name)
end
```

**After:**
```lua
local __STRINGS={[0]="Hello "};local a=function(b)print(__STRINGS[0]..b)end
```

### Example 2: Game Script
**Before:** 300 lines, readable variables
**After:** 150 lines, confusing names

**Compression:** ~50% smaller
**Readability:** ~10% (obfuscated)

## Troubleshooting

### "Browser won't open file"
→ Try right-click → "Open with" → Choose browser

### "Code doesn't work after obfuscation"
→ Check original code is valid Lua
→ Try disabling options one-by-one

### "Output looks wrong"
→ Browser console may show errors (F12)
→ Refresh page and try again

### "How do I undo?"
→ Keep original code in left panel
→ No changes saved until you download

## Features in 10 Seconds

- ⚡ Instant processing
- 📋 Copy to clipboard
- 📥 Download as .lua file
- 📊 Live statistics
- 🎨 Dark modern theme
- 📱 Works on mobile
- 🔒 100% browser-based
- 🚀 No dependencies

## Keyboard Tips

| Shortcut | Action |
|----------|--------|
| Ctrl+A | Select all code |
| Ctrl+C | Copy (standard) |
| Ctrl+V | Paste (standard) |
| Tab | Indent (in textarea) |

## File Sizes

```
Input:  100 KB → Output: 40-60 KB (50% reduction typical)
Input:  1 KB   → Output: 500-700 bytes (typical)
```

## Browser Support

✅ Chrome/Edge 90+
✅ Firefox 88+
✅ Safari 14+
✅ All modern mobile browsers

## Need Help?

1. **Read**: `WEB_EDITION_README.md` (detailed docs)
2. **See**: `IMPLEMENTATION_SUMMARY.md` (technical details)
3. **Ask**: Check GitHub issues at original repo

## Next Steps

- ✅ Open `index.html` now
- 📝 Try obfuscating your own code
- 🔗 Download results
- 🎓 Learn the obfuscation techniques

## Advanced: Run Multiple Tools

```bash
# Terminal method (optional)
cd /workspaces/LuaObfuscatorV2

# Start Python server
python3 -m http.server 8000 &

# Start in browser
# http://localhost:8000/index.html
```

---

**That's it!** You now have a professional Lua obfuscator. Enjoy! 🎉
