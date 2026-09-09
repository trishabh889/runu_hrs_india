# RUNO HRS INDIA - Automated Windows Shortcut Creator
$ErrorActionPreference = 'SilentlyContinue'

$WshShell = New-Object -ComObject WScript.Shell
$DesktopFolders = @([System.Environment]::GetFolderPath('Desktop'))
if ($env:USERPROFILE -and (Test-Path "$env:USERPROFILE\Desktop")) {
    $UserProfileDesktop = "$env:USERPROFILE\Desktop"
    if ($DesktopFolders -notcontains $UserProfileDesktop) {
        $DesktopFolders += $UserProfileDesktop
    }
}
$Programs = [System.Environment]::GetFolderPath('Programs')

# Determine paths
$ExePath = Join-Path $PSScriptRoot "dist\RUNO_HRS_INDIA_MIS\RUNO_HRS_INDIA_MIS.exe"
$WorkingDir = Join-Path $PSScriptRoot "dist\RUNO_HRS_INDIA_MIS"
$IconPath = Join-Path $PSScriptRoot "src\assets\app.ico"

# If run directly inside dist folder
if (-not (Test-Path $ExePath)) {
    $ExePath = Join-Path $PSScriptRoot "RUNO_HRS_INDIA_MIS.exe"
    $WorkingDir = $PSScriptRoot
    $IconPath = Join-Path $PSScriptRoot "app.ico"
}

if (Test-Path $ExePath) {
    # 1. Desktop Shortcuts (covers standard Desktop & OneDrive synced Desktop)
    foreach ($Desktop in $DesktopFolders) {
        $DesktopShortcut = $WshShell.CreateShortcut("$Desktop\RUNO HRS INDIA - MIS.lnk")
        $DesktopShortcut.TargetPath = $ExePath
        $DesktopShortcut.WorkingDirectory = $WorkingDir
        if (Test-Path $IconPath) {
            $DesktopShortcut.IconLocation = "$IconPath,0"
        } else {
            $DesktopShortcut.IconLocation = "$ExePath,0"
        }
        $DesktopShortcut.Description = "RUNO HRS INDIA - Management Information System"
        $DesktopShortcut.Save()
        Write-Host "[OK] Desktop Shortcut created: $Desktop\RUNO HRS INDIA - MIS.lnk" -ForegroundColor Green
    }

    # 2. Start Menu Shortcut (allows search from Windows Start key)
    $StartShortcut = $WshShell.CreateShortcut("$Programs\RUNO HRS INDIA - MIS.lnk")
    $StartShortcut.TargetPath = $ExePath
    $StartShortcut.WorkingDirectory = $WorkingDir
    if (Test-Path $IconPath) {
        $StartShortcut.IconLocation = "$IconPath,0"
    } else {
        $StartShortcut.IconLocation = "$ExePath,0"
    }
    $StartShortcut.Description = "RUNO HRS INDIA - Management Information System"
    $StartShortcut.Save()
    Write-Host "[OK] Start Menu Shortcut created: $Programs\RUNO HRS INDIA - MIS.lnk" -ForegroundColor Green

    # Refresh Windows Shell Icon Cache
    try {
        $code = @'
        [System.Runtime.InteropServices.DllImport("shell32.dll")]
        public static extern void SHChangeNotify(int wEventId, int uFlags, int dwItem1, int dwItem2);
'@
        $type = Add-Type -MemberDefinition $code -Name ShellNotify -Namespace Win32 -PassThru -ErrorAction SilentlyContinue
        if ($type) { $type::SHChangeNotify(0x08000000, 0, 0, 0) }
    } catch {}
} else {
    Write-Host "[ERROR] Could not locate RUNO_HRS_INDIA_MIS.exe" -ForegroundColor Red
}

