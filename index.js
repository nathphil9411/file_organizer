/**
 * CLI File Organizer
 * Organizes files in a specified directory by moving them into type-specific folders
 */

const path = require('path');
const fileManager = require('./file-manager');
const logger = require('./logger');

/**
 * Validates the command line arguments
 * @returns {string|null} - The validated target directory or null if invalid
 */
function validateArgs() {
    // Get the target directory from command line arguments
    const targetDir = process.argv[2];
    
    // Check if target directory was provided
    if (!targetDir) {
        logger.error('No target directory provided');
        console.log('Try: node index.js <target-directory>');
        return null;
    }
    
    // Return the resolved absolute path
    return path.resolve(targetDir);
}

/**
 * Main function to run the file organizer
 */
async function main() {
    try {
        // Validate command line arguments
        const targetDir = validateArgs();
        if (!targetDir) {
            return;
        }
        
        // Display start message
        logger.startMessage(targetDir);
        
        // Organize files
        const stats = await fileManager.organizeFiles(targetDir);
        
        // Display summary
        logger.summary(stats);
        
    } catch (err) {
        logger.error(`Application failed: ${err.message}`);
        process.exit(1);
    }
}

// Execute the main function
main();