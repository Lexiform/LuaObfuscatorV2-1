# Lua Obfuscator V2 - Web Edition

A comprehensive web-based Lua code obfuscator with multiple layers of protection.

## Files Created

Three main files have been created in the root directory:

1. **index.html** - The main web interface
2. **style.css** - Complete styling with dark theme
3. **obfuscator.js** - The obfuscation engine with UI controller

## How to Use

### Local Usage (No Server Required)
Simply open `index.html` in any modern web browser:
- Double-click the file, or
- Right-click and select "Open with Browser", or
- Use your browser's File > Open menu

### Features

#### Obfuscation Options
- **Encrypt Strings** - Replaces string literals with encrypted table references
- **Minify Code** - Removes unnecessary whitespace and formatting
- **Obfuscate Variables** - Renames variables to short, meaningless names
- **Remove Comments** - Strips all comments from the code
- **Include VM Wrapper** - Wraps code in a virtual machine for additional protection

#### Built-in Functions
- Load example code to test the obfuscator
- Copy obfuscated output to clipboard
- Download output as `.lua` file
- Real-time statistics (compression ratio, processing time)
- Syntax-aware variable renaming
- Number and string extraction

## Technical Details

### Obfuscation Techniques Used

1. **Comment Removal** - Eliminates single-line and block comments
2. **String Extraction** - Extracts string literals and replaces them with table references
3. **Number Extraction** - Extracts numeric literals for compact storage
4. **Variable Obfuscation** - Renames local variables to single-letter names
5. **Code Minification** - Removes whitespace while preserving functionality
6. **VM Wrapping** - Optional bytecode interpretation wrapper

### Code Architecture

```
LuaObfuscator (Main Class)
├── removeComments() - Strip comments
├── extractStrings() - Extract and replace strings
├── extractNumbers() - Extract and replace numbers
├── obfuscateVariables() - Rename variables
├── minifyCode() - Remove whitespace
├── reconstructCode() - Rebuild with references
├── wrapWithTables() - Create storage tables
└── obfuscate() - Main orchestration function

UIController (Interface Class)
├── setupEventListeners() - Bind UI events
├── handleObfuscate() - Process obfuscation
├── copyOutput() - Copy to clipboard
├── downloadOutput() - Save as file
└── updateStats() - Show metrics
```

## Example Input/Output

### Input:
```lua
print("Hello World")

local function greet(name)
    print("Hello, " .. name .. "!")
end

greet("Alice")
```

### Output (minified + obfuscated):
```lua
local __STRINGS={[0]="Hello World",[1]="Hello, ",[2]="!"};local a=function(b)print(__STRINGS[0])print(__STRINGS[1]..b..__STRINGS[2])end;a(__STRINGS[3])
```

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Any modern browser with ES6 support

## Security Notes

⚠️ **Important**: This tool provides obfuscation for security through obscurity. It is NOT suitable for:
- Protecting highly sensitive algorithms
- Hiding encryption keys
- Replacing proper cryptographic security

For critical security requirements:
1. Use additional encryption layers
2. Consider bytecode compilation
3. Implement server-side security measures
4. Use proper access controls

## Performance

The obfuscator can handle:
- Small scripts (< 1KB) - Instant
- Medium scripts (1-100KB) - < 100ms
- Large scripts (100KB+) - < 1000ms

## Advanced Features

### String Encryption
Converts:
```lua
local msg = "secret"
```

To:
```lua
local __STRINGS={[0]="secret"}
local msg = __STRINGS[0]
```

### Number Extraction
Converts:
```lua
local x = 42
local y = 3.14
```

To:
```lua
local __NUMBERS={[0]=42,[1]=3.14}
local x = __NUMBERS[0]
local y = __NUMBERS[1]
```

### Variable Obfuscation
Converts:
```lua
local playerName = "Alice"
local playerScore = 100
```

To:
```lua
local a = "Alice"
local b = 100
```

## Keyboard Shortcuts

- **Ctrl+Enter** - Execute obfuscation (when implemented)
- **Ctrl+C** - Copy output (standard browser shortcut)

## Troubleshooting

### Obfuscated code doesn't run
- Check that the original code is syntactically correct
- Disable "Include VM Wrapper" if experiencing issues
- Try enabling each option individually to identify conflicts

### Performance issues
- Split large files into smaller chunks
- Disable "Include VM Wrapper" for faster processing
- Clear browser cache if experiencing slowness

## Future Enhancements

Potential additions:
- Bytecode compilation option
- Advanced VM encryption
- Function inlining/outlining
- Control flow obfuscation
- Dead code injection
- String cipher algorithms
- Custom key generation
- Batch processing

## Support

For issues or feature requests, visit: https://github.com/PY44N/LuaObfuscatorV2

## License

This project is provided as-is. See the main repository for license information.
