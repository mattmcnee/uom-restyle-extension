$sourceDirectory = "C:\Users\mattr\Documents\3rd Year UoM\web dev\uom-restyle-extension"

# Specify the files to zip
$filePaths = @(
    "$sourceDirectory\content.css",
    "$sourceDirectory\content.js",
    "$sourceDirectory\icon-16.png",
    "$sourceDirectory\icon-48.png",
    "$sourceDirectory\icon-128.png",
    "$sourceDirectory\iframe.css",
    "$sourceDirectory\manifest.json",
    "$sourceDirectory\popup.css",
    "$sourceDirectory\popup.html",
    "$sourceDirectory\popup.js",
    "$sourceDirectory\README.md"
)

# Create a standard zip file in the source directory
Compress-Archive -Path $filePaths -DestinationPath "$sourceDirectory\uom-restyle-extension.zip" -Force


