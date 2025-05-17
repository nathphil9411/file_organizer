/**
 * File Manager module for handling file system operations
 */
const fs = require('fs').promises;
const path = require('path');
const fileTypes = require('./file-types');
const logger = require('./logger');

/**
 * Gets the destination folder name based on file extension
 * @param {string} fileExtension - The file extension (without the dot)
 * @returns {string|null} - The folder name or null if extension not recognized 
 */
function getDestinationFolder(fileExtension) {
    // Convert extension to lowercase for consistency
    const ext = fileExtension.toLowerCase();
    
    // Check each category to find matching extension
    for (const [category, extensions] of Object.entries(fileTypes)) {
        if (extensions.includes(ext)) {
            return category;
        }
    }
    
    // If no match found, return "other"
    return "other";
}

/**
 * Creates destination folders if they don't exist
 * @param {string} targetDir - The base directory path
 * @returns {Promise<void>}
 */
async function createDestinationFolders(targetDir) {
    try {
        // Get all unique folder names from fileTypes
        const folderNames = [...Object.keys(fileTypes), 'other'];
        
        for (const folder of folderNames) {
            const folderPath = path.join(targetDir, folder);
            
            try {
                // Check if folder exists
                await fs.access(folderPath);
                logger.info(`Folder already exists: ${folder}`);
            } catch (err) {
                // If folder doesn't exist, create it
                await fs.mkdir(folderPath);
                logger.success(`Created folder: ${folder}`);
            }
        }
    } catch (err) {
        logger.error(`Failed to create destination folders: ${err.message}`);
        throw err;
    }
}

/**
 * Moves a file to its destination folder
 * @param {string} filePath - The full path to the file
 * @param {string} destFolder - The destination folder path
 * @returns {Promise<boolean>} - True if successful, false otherwise
 */
async function moveFile(filePath, destFolder) {
    try {
        const fileName = path.basename(filePath);
        const destPath = path.join(destFolder, fileName);
        
        await fs.rename(filePath, destPath);
        return true;
    } catch (err) {
        logger.error(`Failed to move file ${path.basename(filePath)}: ${err.message}`);
        return false;
    }
}

/**
 * Reads the contents of a directory
 * @param {string} dirPath - The directory path to read
 * @returns {Promise<Array>} - Array of file entries
 */
async function readDirectory(dirPath) {
    try {
        return await fs.readdir(dirPath);
    } catch (err) {
        logger.error(`Failed to read directory: ${err.message}`);
        throw err;
    }
}

/**
 * Checks if path is a file
 * @param {string} filePath - Path to check
 * @returns {Promise<boolean>} - True if path is a file
 */
async function isFile(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.isFile();
    } catch (err) {
        logger.error(`Failed to check if path is a file: ${err.message}`);
        return false;
    }
}

/**
 * Processes and organizes files in the target directory
 * @param {string} targetDir - The directory to organize
 * @returns {Promise<Object>} - Stats about the operation
 */
async function organizeFiles(targetDir) {
    try {
        const stats = {
            total: 0,
            moved: 0,
            skipped: 0,
            errors: 0
        };

        // Create destination folders
        await createDestinationFolders(targetDir);
        
        // Read all items in the directory
        const items = await readDirectory(targetDir);
        
        for (const item of items) {
            const itemPath = path.join(targetDir, item);
            
            // Skip if it's a directory
            if (!(await isFile(itemPath))) {
                logger.info(`Skipping directory: ${item}`);
                continue;
            }
            
            stats.total++;
            
            // Get the file extension
            const fileExtension = path.extname(item).slice(1); // Remove the dot
            
            // Skip if it's a hidden file or has no extension
            if (item.startsWith('.') || !fileExtension) {
                logger.info(`Skipping file: ${item} (hidden or no extension)`);
                stats.skipped++;
                continue;
            }
            
            // Get destination folder
            const destFolderName = getDestinationFolder(fileExtension);
            const destFolderPath = path.join(targetDir, destFolderName);
            
            // Skip if the file is already in its type folder
            if (path.dirname(itemPath) === destFolderPath) {
                logger.info(`File already in correct folder: ${item}`);
                stats.skipped++;
                continue;
            }
            
            // Move the file
            logger.info(`Moving ${item} to ${destFolderName}/`);
            const success = await moveFile(itemPath, destFolderPath);
            
            if (success) {
                stats.moved++;
            } else {
                stats.errors++;
            }
        }
        
        return stats;
    } catch (err) {
        logger.error(`Failed to organize files: ${err.message}`);
        throw err;
    }
}

module.exports = {
    organizeFiles,
    getDestinationFolder,
    readDirectory,
    isFile,
    moveFile,
    createDestinationFolders
};