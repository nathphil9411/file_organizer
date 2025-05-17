// This module exports an object that categorizes various file types into different categories.
function success(message) {
    console.log(`✅ ${message}`);
}


function info(message) {
    console.log(`ℹ️ ${message}`);
}

function error(message) {
    console.error(`❌ Error: ${message}`);
}

function summary(stats) {
    console.log('\n=== Operation Summary ===');
    console.log(`Total files processed: ${stats.total}`);
    console.log(`Files moved: ${stats.moved}`);
    console.log(`Files skipped: ${stats.skipped}`);
    
    if (stats.errors > 0) {
        console.log(`Errors encountered: ${stats.errors}`);
    }
    
    console.log('========================\n');
}

// This function logs the start message for the file organization process.
function startMessage(targetDir) {
    console.log('\n=== File Organizer ===');
    console.log(`Organizing files in: ${targetDir}`);
    console.log('=====================\n');
}

module.exports = {
    success,
    info,
    error,
    summary,
    startMessage
};