$url = "https://github.com/skeeto/w64devkit/releases/download/v2.5.0/w64devkit-x64-2.5.0.zip"
$outFile = "C:\Users\tuand\Downloads\w64devkit.zip"
Write-Host "Downloading w64devkit from $url..."
Invoke-WebRequest -Uri $url -OutFile $outFile -UseBasicParsing
Write-Host "Downloaded to $outFile"
Write-Host "Extracting..."
Expand-Archive -Path $outFile -DestinationPath "C:\tools" -Force
Write-Host "Extracted to C:\tools\w64devkit"
Write-Host "Done!"
