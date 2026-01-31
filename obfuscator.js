/**
 * Lua Obfuscator V2 - Web Edition
 * Combines multiple obfuscation techniques for Lua code protection
 */

class LuaObfuscator {
    constructor() {
        this.variables = new Map();
        this.strings = new Map();
        this.numbers = new Map();
        this.variableCounter = 0;
        this.lua51Keywords = new Set([
            'and', 'break', 'do', 'else', 'elseif', 'end', 'false', 'for',
            'function', 'if', 'in', 'local', 'nil', 'not', 'or', 'repeat',
            'return', 'then', 'true', 'until', 'while'
        ]);
        this.globalFunctions = new Set([
            'print', 'assert', 'error', 'type', 'next', 'pairs', 'ipairs',
            'tostring', 'tonumber', 'load', 'loadstring', 'setmetatable',
            'getmetatable', 'rawset', 'rawget', 'rawlen', 'select', 'unpack',
            'table', 'string', 'math', 'os', 'io', 'debug', 'bit', 'jit'
        ]);
    }

    /**
     * Generates a short variable name
     */
    generateVariableName(index) {
        const letters = 'abcdefghijklmnopqrstuvwxyz';
        let result = '';
        
        result += letters.charAt(index % letters.length);
        index = Math.floor(index / letters.length);
        
        while (index > 0) {
            result += letters.charAt(index % letters.length);
            index = Math.floor(index / letters.length);
        }
        
        return result;
    }

    /**
     * Remove comments from Lua code
     */
    removeComments(code) {
        // Remove single-line comments
        code = code.replace(/--\[\[[\s\S]*?\]\]/g, ''); // Block comments
        code = code.replace(/--[^\n]*/g, ''); // Single-line comments
        return code;
    }

    /**
     * Extract and replace string literals
     */
    extractStrings(code) {
        const stringPattern = /(["'])(?:(?=(\\?))\2.)*?\1|\[\[[\s\S]*?\]\]/g;
        const strings = [];
        const stringMap = {};
        let stringCounter = 0;

        code = code.replace(stringPattern, (match) => {
            if (!strings.includes(match)) {
                strings.push(match);
                stringMap['__STR_' + stringCounter] = match;
                const varName = this.generateVariableName(stringCounter);
                this.strings.set(varName, match);
                stringCounter++;
            }
            const idx = strings.indexOf(match);
            return '__STR_' + idx;
        });

        return { code, strings, stringMap };
    }

    /**
     * Extract and replace numeric literals
     */
    extractNumbers(code) {
        const numberPattern = /\b(\d+\.?\d*|\.\d+)\b/g;
        const numbers = [];
        const numberMap = {};
        let numberCounter = 0;

        code = code.replace(numberPattern, (match) => {
            if (!numbers.includes(match)) {
                numbers.push(match);
                numberMap['__NUM_' + numberCounter] = match;
                const varName = this.generateVariableName(numberCounter);
                this.numbers.set(varName, match);
                numberCounter++;
            }
            const idx = numbers.indexOf(match);
            return '__NUM_' + idx;
        });

        return { code, numbers, numberMap };
    }

    /**
     * Obfuscate variable names
     */
    obfuscateVariables(code) {
        // Find all local and global variable declarations
        const localVarPattern = /\blocal\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const globalVarPattern = /(?<![a-zA-Z0-9_])([a-zA-Z_][a-zA-Z0-9_]*)(?=[^a-zA-Z0-9_=\.]|\s*=)/g;

        // Extract local variables
        let match;
        const localVars = new Map();
        const localVarRegex = /\blocal\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
        
        while ((match = localVarRegex.exec(code)) !== null) {
            const varName = match[1];
            if (!this.lua51Keywords.has(varName) && !this.globalFunctions.has(varName)) {
                if (!localVars.has(varName)) {
                    const obfName = this.generateVariableName(this.variableCounter++);
                    localVars.set(varName, obfName);
                }
            }
        }

        // Replace variable names
        for (const [original, obfuscated] of localVars) {
            // Match the variable but not inside strings or comments
            const regex = new RegExp(`\\b${original}\\b`, 'g');
            code = code.replace(regex, obfuscated);
        }

        return code;
    }

    /**
     * Minify Lua code by removing unnecessary whitespace
     */
    minifyCode(code) {
        // Remove leading/trailing whitespace from each line
        code = code.split('\n').map(line => line.trim()).join('');
        
        // Remove spaces around operators (but be careful with string concatenation)
        code = code.replace(/\s*([=+\-*/%<>!~&|^(){}\[\],:;])\s*/g, '$1');
        
        // Clean up multiple spaces
        code = code.replace(/\s+/g, ' ');
        
        // Remove spaces before/after some keywords
        code = code.replace(/\s+(and|or|not|if|then|else|elseif|end|do|while|for|function|return)\s+/g, ' $1 ');
        
        // Clean up again
        code = code.replace(/\s+/g, ' ').trim();
        
        return code;
    }

    /**
     * Reconstruct code with string and number substitutions
     */
    reconstructCode(code, strings, numbers) {
        // Replace string placeholders with obfuscated references
        for (let i = 0; i < strings.length; i++) {
            const varName = this.generateVariableName(i);
            code = code.replace(new RegExp('__STR_' + i, 'g'), `__STRINGS[${i}]`);
        }

        // Replace number placeholders with obfuscated references
        for (let i = 0; i < numbers.length; i++) {
            const varName = this.generateVariableName(i);
            code = code.replace(new RegExp('__NUM_' + i, 'g'), `__NUMBERS[${i}]`);
        }

        return code;
    }

    /**
     * Wrap code with string and number tables
     */
    wrapWithTables(code, strings, numbers) {
        const stringsTableCode = strings.length > 0 
            ? `local __STRINGS={${strings.map((s, i) => `[${i}]=${s}`).join(',')}};`
            : '';
        
        const numbersTableCode = numbers.length > 0
            ? `local __NUMBERS={${numbers.map((n, i) => `[${i}]=${n}`).join(',')}};`
            : '';

        return `${stringsTableCode}${numbersTableCode}${code}`;
    }

    /**
     * Main obfuscation function
     */
    obfuscate(code, options = {}) {
        const {
            encryptStrings = true,
            compressCode = true,
            obfuscateVariables = true,
            removeComments = true,
            includeVM = false
        } = options;

        let result = code;

        // Step 1: Remove comments
        if (removeComments) {
            result = this.removeComments(result);
        }

        // Step 2: Extract strings
        let extractedStrings = { strings: [] };
        if (encryptStrings) {
            extractedStrings = this.extractStrings(result);
            result = extractedStrings.code;
        }

        // Step 3: Extract numbers
        let extractedNumbers = { numbers: [] };
        if (encryptStrings) {
            extractedNumbers = this.extractNumbers(result);
            result = extractedNumbers.code;
        }

        // Step 4: Obfuscate variable names
        if (obfuscateVariables) {
            result = this.obfuscateVariables(result);
        }

        // Step 5: Minify code
        if (compressCode) {
            result = this.minifyCode(result);
        }

        // Step 6: Wrap with tables
        if (encryptStrings && (extractedStrings.strings.length > 0 || extractedNumbers.numbers.length > 0)) {
            result = this.wrapWithTables(result, extractedStrings.strings, extractedNumbers.numbers);
        }

        // Step 7: Include VM if requested
        if (includeVM) {
            result = this.wrapWithVM(result);
        }

        return result;
    }

    /**
     * Wrap code in a VM for additional protection
     */
    wrapWithVM(code) {
        // Simple VM wrapper - wraps the code in a local function for additional obfuscation
        // This adds another layer of protection by making the code harder to parse
        const vmWrapper = `local function _VM()${code}end;_VM()`;
        return vmWrapper;
    }
}

// UI Controller
class UIController {
    constructor() {
        this.obfuscator = new LuaObfuscator();
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('obfuscateBtn').addEventListener('click', () => this.handleObfuscate());
        document.getElementById('clearInput').addEventListener('click', () => this.clearInput());
        document.getElementById('clearOutput').addEventListener('click', () => this.clearOutput());
        document.getElementById('copyOutput').addEventListener('click', () => this.copyOutput());
        document.getElementById('downloadOutput').addEventListener('click', () => this.downloadOutput());
        document.getElementById('loadExample').addEventListener('click', () => this.loadExample());
        document.getElementById('inputCode').addEventListener('input', () => this.updateStats());
    }

    getOptions() {
        return {
            encryptStrings: document.getElementById('encryptStrings').checked,
            compressCode: document.getElementById('compressCode').checked,
            obfuscateVariables: document.getElementById('obfuscateVariables').checked,
            removeComments: document.getElementById('removeComments').checked,
            includeVM: document.getElementById('includeVM').checked
        };
    }

    handleObfuscate() {
        const input = document.getElementById('inputCode').value;
        const btn = document.getElementById('obfuscateBtn');
        
        if (!input.trim()) {
            this.showNotification('Please enter Lua code to obfuscate', 'error');
            return;
        }

        btn.disabled = true;
        const startTime = performance.now();

        try {
            const options = this.getOptions();
            const output = this.obfuscator.obfuscate(input, options);
            
            document.getElementById('outputCode').value = output;
            
            const endTime = performance.now();
            this.updateStats();
            
            const processingTime = (endTime - startTime).toFixed(2);
            document.getElementById('processingTime').textContent = processingTime;
            
            this.showNotification('Code obfuscated successfully!', 'success');
        } catch (error) {
            this.showNotification('Error: ' + error.message, 'error');
            console.error(error);
        } finally {
            btn.disabled = false;
        }
    }

    clearInput() {
        document.getElementById('inputCode').value = '';
        this.updateStats();
    }

    clearOutput() {
        document.getElementById('outputCode').value = '';
        this.updateStats();
    }

    copyOutput() {
        const output = document.getElementById('outputCode');
        if (!output.value) {
            this.showNotification('No output to copy', 'error');
            return;
        }
        navigator.clipboard.writeText(output.value).then(() => {
            this.showNotification('Code copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Failed to copy code', 'error');
        });
    }

    downloadOutput() {
        const output = document.getElementById('outputCode').value;
        if (!output) {
            this.showNotification('No output to download', 'error');
            return;
        }

        const blob = new Blob([output], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated.lua';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        this.showNotification('Code downloaded successfully!', 'success');
    }

    loadExample() {
        const exampleCode = `-- Example Lua Program
-- This is a comment
print("Hello World")

local function greet(name)
    print("Hello, " .. name .. "!")
    print("Welcome to the Lua Obfuscator")
end

greet("Alice")
greet("Bob")

-- Simple calculation
local a = 10
local b = 20
local result = a + b
print("Result: " .. result)

-- Table example
local data = {
    name = "LuaObfuscator",
    version = 2,
    features = {"minify", "obfuscate", "encrypt"}
}

print(data.name .. " v" .. data.version)`;
        
        document.getElementById('inputCode').value = exampleCode;
        this.updateStats();
        this.showNotification('Example code loaded!', 'success');
    }

    updateStats() {
        const input = document.getElementById('inputCode').value;
        const output = document.getElementById('outputCode').value;
        
        const inputSize = new Blob([input]).size;
        const outputSize = new Blob([output]).size;
        const ratio = inputSize > 0 ? ((1 - outputSize / inputSize) * 100).toFixed(1) : 0;

        document.getElementById('inputSize').textContent = inputSize;
        document.getElementById('outputSize').textContent = outputSize;
        document.getElementById('compressionRatio').textContent = ratio + '%';
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = `notification show ${type}`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});
