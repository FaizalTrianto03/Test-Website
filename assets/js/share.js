/**
 * Share functionality for the learning platform
 * Enables sharing content sections via social media and copy link
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize share buttons
    initShareButtons();
    
    // Re-initialize when content is dynamically loaded
    document.addEventListener('contentLoaded', initShareButtons);
});

/**
 * Initialize share buttons throughout the page
 */
function initShareButtons() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get share data from button attributes
            const shareTitle = button.getAttribute('data-share-title') || document.title;
            const shareText = button.getAttribute('data-share-text') || '';
            const shareUrl = button.getAttribute('data-share-url') || window.location.href;
            const shareType = button.getAttribute('data-share-type') || 'link';
            
            // Handle different share types
            switch(shareType) {
                case 'twitter':
                    shareToTwitter(shareTitle, shareText, shareUrl);
                    break;
                case 'facebook':
                    shareToFacebook(shareUrl);
                    break;
                case 'whatsapp':
                    shareToWhatsApp(shareText, shareUrl);
                    break;
                case 'telegram':
                    shareToTelegram(shareText, shareUrl);
                    break;
                case 'link':
                default:
                    copyLinkToClipboard(shareUrl, button);
                    break;
            }
        });
    });
}

/**
 * Share content to Twitter
 */
function shareToTwitter(title, text, url) {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank');
}

/**
 * Share content to Facebook
 */
function shareToFacebook(url) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank');
}

/**
 * Share content to WhatsApp
 */
function shareToWhatsApp(text, url) {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text + ' ' + url)}`;
    window.open(whatsappUrl, '_blank');
}

/**
 * Share content to Telegram
 */
function shareToTelegram(text, url) {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(telegramUrl, '_blank');
}

/**
 * Copy link to clipboard and show feedback
 */
function copyLinkToClipboard(url, button) {
    navigator.clipboard.writeText(url).then(() => {
        // Store original button content
        const originalContent = button.innerHTML;
        
        // Show success message
        button.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
        button.classList.add('bg-green-500', 'text-white');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('bg-green-500', 'text-white');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy link: ', err);
        
        // Show error message
        button.innerHTML = '<i class="fas fa-times"></i> Copy Failed';
        button.classList.add('bg-red-500', 'text-white');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('bg-red-500', 'text-white');
        }, 2000);
    });
}