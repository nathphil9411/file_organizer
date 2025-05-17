
const fileTypes = {
    // Documents
    documents: [
        'pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 
        'xls', 'xlsx', 'csv', 'ppt', 'pptx'
    ],
    
    // Images
    images: [
        'jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 
        'webp', 'tiff', 'ico'
    ],
    
    // Videos
    videos: [
        'mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 
        'webm', '3gp', 'mpeg'
    ],
    
    // Audio
    audio: [
        'mp3', 'wav', 'ogg', 'flac', 'aac', 
        'm4a', 'wma'
    ],
    
    // Archives
    archives: [
        'zip', 'rar', '7z', 'tar', 'gz', 'bz2', 
        'iso', 'dmg'
    ],
    
    // Code
    code: [
        'js', 'py', 'java', 'c', 'cpp', 'cs', 'php', 
        'html', 'css', 'json', 'xml', 'yaml', 'sql'
    ],
    
    // Executables
    executables: [
        'exe', 'msi', 'bat', 'sh', 'app', 'dmg'
    ]
};

module.exports = fileTypes;