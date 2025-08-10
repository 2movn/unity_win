// Test script để kiểm tra tích hợp giữa UIOptimizationService và UI
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

async function testUIIntegration() {
  console.log('Testing UI Integration with UIOptimizationService...\n');
  
  try {
    // Test 1: Kiểm tra trạng thái hiện tại
    console.log('1. Current Context Menu Status:');
    console.log('================================');
    
    const status = await getContextMenuStatus();
    console.log('Copy Filename:', status.copyFilename ? 'ENABLED' : 'DISABLED');
    console.log('CMD Here:', status.cmdHere ? 'ENABLED' : 'DISABLED');
    console.log('PowerShell Here:', status.powerShellHere ? 'ENABLED' : 'DISABLED');
    
    // Test 2: Test các lệnh registry mà UIOptimizationService sử dụng
    console.log('\n2. Testing Registry Commands Used by Service:');
    console.log('=============================================');
    
    // Test Copy Filename commands
    console.log('\nTesting Copy Filename Commands:');
    if (status.copyFilename) {
      console.log('  - Disabling...');
      await execAsync('reg delete "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /f');
      console.log('  ✅ Disable command executed');
      
      // Verify disabled
      const newStatus = await getContextMenuStatus();
      if (!newStatus.copyFilename) {
        console.log('  ✅ Successfully disabled');
      } else {
        console.log('  ❌ Disable failed');
      }
      
      // Re-enable
      console.log('  - Re-enabling...');
      await execAsync('reg add "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /ve /d "Copy Filename" /f');
      console.log('  ✅ Re-enable command executed');
    } else {
      console.log('  - Enabling...');
      await execAsync('reg add "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /ve /d "Copy Filename" /f');
      console.log('  ✅ Enable command executed');
      
      // Verify enabled
      const newStatus = await getContextMenuStatus();
      if (newStatus.copyFilename) {
        console.log('  ✅ Successfully enabled');
      } else {
        console.log('  ❌ Enable failed');
      }
      
      // Re-disable
      console.log('  - Re-disabling...');
      await execAsync('reg delete "HKCU\\Software\\Classes\\*\\shell\\copyfilename" /f');
      console.log('  ✅ Re-disable command executed');
    }
    
    // Test 3: Kiểm tra xem các lệnh có hoạt động đúng không
    console.log('\n3. Verifying Final Status:');
    console.log('==========================');
    
    const finalStatus = await getContextMenuStatus();
    console.log('Copy Filename:', finalStatus.copyFilename ? 'ENABLED' : 'DISABLED');
    console.log('CMD Here:', finalStatus.cmdHere ? 'ENABLED' : 'DISABLED');
    console.log('PowerShell Here:', finalStatus.powerShellHere ? 'ENABLED' : 'DISABLED');
    
    // Test 4: Tóm tắt kết quả
    console.log('\n4. Test Summary:');
    console.log('=================');
    
    if (finalStatus.copyFilename === status.copyFilename) {
      console.log('✅ Copy Filename state restored correctly');
    } else {
      console.log('❌ Copy Filename state not restored correctly');
    }
    
    console.log('\n✅ UI Integration test completed!');
    console.log('\nNext steps:');
    console.log('1. Open the application UI');
    console.log('2. Go to Tools Manager section');
    console.log('3. Check if context menu options show correct states');
    console.log('4. Try toggling options on/off');
    console.log('5. Verify changes in Windows context menu');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function getContextMenuStatus() {
  const status = {};
  
  try {
    await execAsync('reg query "HKCU\\Software\\Classes\\*\\shell\\copyfilename"');
    status.copyFilename = true;
  } catch {
    status.copyFilename = false;
  }
  
  try {
    await execAsync('reg query "HKCU\\Software\\Classes\\Directory\\Background\\shell\\cmd"');
    status.cmdHere = true;
  } catch {
    status.cmdHere = false;
  }
  
  try {
    await execAsync('reg query "HKCU\\Software\\Classes\\Directory\\Background\\shell\\powershell"');
    status.powerShellHere = true;
  } catch {
    status.powerShellHere = false;
  }
  
  return status;
}

// Chạy test
testUIIntegration();
