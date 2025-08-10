import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Helper function to execute command with proper PowerShell/CMD handling
 * @param command - Command to execute
 * @param usePowerShell - Whether to try PowerShell first (default: true)
 * @param fallbackToCmd - Whether to fallback to CMD if PowerShell fails (default: true)
 * @returns Promise with stdout and stderr
 */
export async function executeCommand(
  command: string, 
  usePowerShell: boolean = true,
  fallbackToCmd: boolean = true
): Promise<{ stdout: string; stderr: string }> {
  try {
    if (usePowerShell) {
      // Try PowerShell with proper parameters
      const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "${command.replace(/"/g, '\\"')}"`;
      return await execAsync(psCommand);
    } else {
      // Use CMD directly
      return await execAsync(command);
    }
  } catch (error) {
    if (usePowerShell && fallbackToCmd) {
      // If PowerShell fails, try CMD
      try {
        console.warn(`PowerShell failed, falling back to CMD for: ${command}`);
        return await execAsync(command);
      } catch (cmdError) {
        console.error(`Both PowerShell and CMD failed for: ${command}`);
        throw cmdError;
      }
    } else {
      throw error;
    }
  }
}

/**
 * Execute command with PowerShell first, fallback to CMD
 * @param command - Command to execute
 * @returns Promise with stdout and stderr
 */
export async function executeWithPowerShellPriority(command: string): Promise<{ stdout: string; stderr: string }> {
  try {
    // Sử dụng PowerShell với parameters đúng cách
    const psCommand = `powershell -NoProfile -ExecutionPolicy Bypass -Command "${command.replace(/"/g, '\\"')}"`;
    return await execAsync(psCommand);
  } catch (error) {
    console.error('PowerShell execution failed, falling back to Node.js method:', error);
    throw error;
  }
}

/**
 * Execute command with CMD first, fallback to PowerShell
 * @param command - Command to execute
 * @returns Promise with stdout and stderr
 */
export async function executeWithCmdPriority(command: string): Promise<{ stdout: string; stderr: string }> {
  return executeCommand(command, false, true);
}

/**
 * Execute command with PowerShell only (no fallback)
 * @param command - Command to execute
 * @returns Promise with stdout and stderr
 */
export async function executePowerShellOnly(command: string): Promise<{ stdout: string; stderr: string }> {
  return executeCommand(command, true, false);
}

/**
 * Execute command with CMD only (no fallback)
 * @param command - Command to execute
 * @returns Promise with stdout and stderr
 */
export async function executeCmdOnly(command: string): Promise<{ stdout: string; stderr: string }> {
  return executeCommand(command, false, false);
}

/**
 * Check if PowerShell is available
 * @returns Promise<boolean>
 */
export async function isPowerShellAvailable(): Promise<boolean> {
  try {
    await execAsync('powershell -Command "Write-Host \'PowerShell is available\'"');
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Get the best execution method for the current system
 * @returns Promise<'powershell' | 'cmd'>
 */
export async function getBestExecutionMethod(): Promise<'powershell' | 'cmd'> {
  const hasPowerShell = await isPowerShellAvailable();
  return hasPowerShell ? 'powershell' : 'cmd';
}

/**
 * Execute PowerShell script safely with proper encoding and error handling
 * @param script - PowerShell script to execute
 * @param timeout - Timeout in milliseconds (default: 30000)
 * @returns Promise with stdout and stderr
 */
export async function executePowerShellScript(script: string, timeout: number = 30000): Promise<{ stdout: string; stderr: string }> {
  const fs = require('fs');
  const path = require('path');
  const os = require('os');
  
  // Create temporary script file
  const tempDir = os.tmpdir();
  const scriptPath = path.join(tempDir, `ps_script_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.ps1`);
  
  try {
    // Write script to temporary file
    fs.writeFileSync(scriptPath, script, 'utf8');
    
    const command = `powershell -NoProfile -ExecutionPolicy Bypass -File "${scriptPath}"`;
    
    console.log(`Executing PowerShell: ${command}`);
    
    const result = await execAsync(command, { 
      timeout,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    return result;
  } catch (error: any) {
    console.error('PowerShell script execution failed:', error.message);
    throw error;
  } finally {
    // Clean up temporary file
    try {
      if (fs.existsSync(scriptPath)) {
        fs.unlinkSync(scriptPath);
      }
    } catch (cleanupError) {
      console.warn('Failed to cleanup temporary script file:', cleanupError);
    }
  }
}

/**
 * Execute CMD command safely with proper error handling
 * @param command - CMD command to execute
 * @param timeout - Timeout in milliseconds (default: 30000)
 * @returns Promise with stdout and stderr
 */
export async function executeCmdCommand(command: string, timeout: number = 30000): Promise<{ stdout: string; stderr: string }> {
  try {
    console.log(`Executing CMD: ${command}`);
    
    const result = await execAsync(command, { 
      timeout,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 10 // 10MB buffer
    });
    
    return result;
  } catch (error: any) {
    console.error('CMD command execution failed:', error.message);
    throw error;
  }
}

/**
 * Execute command with automatic method selection and retry logic
 * @param command - Command to execute
 * @param preferPowerShell - Whether to prefer PowerShell over CMD
 * @param timeout - Timeout in milliseconds
 * @returns Promise with stdout and stderr
 */
export async function executeCommandSafe(
  command: string, 
  preferPowerShell: boolean = false,
  timeout: number = 30000
): Promise<{ stdout: string; stderr: string }> {
  const bestMethod = await getBestExecutionMethod();
  
  if (preferPowerShell && bestMethod === 'powershell') {
    try {
      return await executePowerShellScript(command, timeout);
    } catch (error) {
      console.warn('PowerShell failed, trying CMD...');
      return await executeCmdCommand(command, timeout);
    }
  } else {
    try {
      return await executeCmdCommand(command, timeout);
    } catch (error) {
      if (bestMethod === 'powershell') {
        console.warn('CMD failed, trying PowerShell...');
        return await executePowerShellScript(command, timeout);
      }
      throw error;
    }
  }
}
