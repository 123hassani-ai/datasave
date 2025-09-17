/**
 * Test Script for Data Management Module
 * اسکریپت آزمایش برای ماژول مدیریت داده‌ها
 */

// Test the module loading and functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🧪 Testing Data Management Module...');
    
    // Check if the upload section exists
    const uploadSection = document.getElementById('uploadSection');
    if (uploadSection) {
        console.log('✅ Upload section found');
        
        // Test drag and drop styles
        uploadSection.addEventListener('dragenter', function() {
            console.log('🎯 Drag enter detected');
        });
        
        uploadSection.addEventListener('dragover', function(e) {
            e.preventDefault();
            console.log('🎯 Drag over detected');
        });
        
        uploadSection.addEventListener('drop', function(e) {
            e.preventDefault();
            console.log('🎯 Drop detected');
        });
        
    } else {
        console.log('❌ Upload section not found');
    }
    
    // Check if upload button exists
    const uploadButton = document.getElementById('uploadButton');
    if (uploadButton) {
        console.log('✅ Upload button found');
        
        uploadButton.addEventListener('click', function() {
            console.log('🔘 Upload button clicked');
        });
    } else {
        console.log('❌ Upload button not found');
    }
    
    // Test file input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        console.log('✅ File input found');
        
        fileInput.addEventListener('change', function(e) {
            console.log('📁 File selected:', e.target.files[0]?.name);
        });
    } else {
        console.log('❌ File input not found');
    }
});

// Test module availability
setTimeout(() => {
    if (window.dataManagement) {
        console.log('✅ DataManagement module available globally');
        console.log('📊 Module stats:', window.dataManagement.getStats?.());
    } else {
        console.log('❌ DataManagement module not available globally');
    }
}, 1000);