/**
 * Access Control for Mirror IA
 * 
 * Hide Mirror IA links from non-salon users across all pages
 * Usage: Add this script to any page that has Mirror IA links
 */

(function () {
    'use strict';

    /**
     * Check if current user has access to Mirror IA
     * @returns {boolean} true if user is salon/admin, false otherwise
     */
    function hasMirrorAccess() {
        const userStr = localStorage.getItem('asesoriaimss_user');
        if (!userStr) return false;

        try {
            const user = JSON.parse(userStr);
            return user.role === 'salon' || user.is_salon_owner || user.role === 'admin';
        } catch (e) {
            console.error('Error parsing user data:', e);
            return false;
        }
    }

    /**
     * Hide Mirror IA elements for non-salon users
     */
    function hideMirrorForNonSalon() {
        if (hasMirrorAccess()) {
            // User has access, don't hide anything
            return;
        }

        // Find and hide all links to /mirror
        const mirrorLinks = document.querySelectorAll('a[href="/mirror"]');
        mirrorLinks.forEach(link => {
            link.style.display = 'none';

            // Also hide parent elements if they're list items or nav items
            const parent = link.closest('li, .nav-item, .sidebar-item');
            if (parent) {
                parent.style.display = 'none';
            }
        });

        console.log(`🔒 [Access Control] Hidden ${mirrorLinks.length} Mirror IA link(s) from non-salon user`);
    }

    // Execute on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', hideMirrorForNonSalon);
    } else {
        hideMirrorForNonSalon();
    }
})();
