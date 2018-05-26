param (
    [switch]$getUsr,
    [switch]$getPer,
    [switch]$setPer,
    [string]$dir,
    [string]$usr,
    [string]$per
)
function Get-UsersList ($full) {
    #test for not being in domain or handle the error

    if ((Get-WmiObject win32_computersystem).partofdomain) {
        $domain = ((Get-WmiObject Win32_ComputerSystem).Domain).Split(".")[0] # short domain name 
        $UsrList = @{} 
    
        $users = ([adsisearcher]"objectcategory=user")
        foreach ($user in $($users.FindAll())) {
            if ((($user.Properties.samaccountname).Length -lt $domain.Length + 1) -and (($user.Properties.displayname).Length -gt 1)) {
                # filter out non domain and builtin accounts
                $UsrList.Add($($user.Properties.samaccountname), $($user.Properties.displayname)) | Out-Null
            } 
        }
        
        $UsrListSort = $UsrList.GetEnumerator() | Sort-Object -Property Value
    
        if ($full) {$UsrListSort | ConvertTo-Json -Compress}
        else {$UsrListSort.value | ConvertTo-Json -Compress}
        
    } else {
        $UsrListSort = Get-LocalUser
        $UsrListSort.Name | ConvertTo-Json -Compress
    }
}
function Get-DirPermissions ($dir) {
    $acl = Get-Acl $dir
    $usrs = $acl.Access
    $usrs | ConvertTo-Html -Property FileSystemRights, AccessControlType, IdentityReference -Fragment
}
function Set-DirPermissions ($dir, $usr, $per) {
    Write-Output "dir Parameter: $dir"
    Write-Output "usr Parameter: $usr"
    Write-Output "per Parameter: $per"

    # $UsrList = Get-UsersList -full true | ConvertFrom-Json
    # $usrFound = $UsrList.GetEnumerator() | Where-Object {$_.Value -eq $usr}
    # $usrFound = $usrFound.Key
    $usrFound = $usr

    Write-Output "usr Found: $usrFound"

    $acl = Get-Acl $dir

    if ($per -eq 'read') {
        $new = 'true'
    }
    if ($per -eq 'modify') {
        $new = 'true'
    }
    if ($per -eq 'remove') {
        $acl.Access | Where-Object {
            $_.IdentityReference.Value -match $usrFound
        } | ForEach-Object {
            $acl.RemoveAccessRule($_) | Out-Null
        }
    } 

    if ($new) {
        Write-Output "dir:$dir per:$per usr:$usrFound"
        $ar = New-Object  system.security.accesscontrol.filesystemaccessrule("$usrFound", "$per", "ContainerInherit, ObjectInherit", "None", "Allow")
        $acl.SetAccessRule($ar)
    }
    Set-Acl $dir $acl
}

if ($getUsr) {Get-UsersList}
if ($getPer) {Get-DirPermissions $dir}
if ($setPer) {Set-DirPermissions $dir $usr $per}
