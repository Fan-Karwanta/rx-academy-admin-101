/**
 * Admin Panel Update Manager
 * Handles automatic updates for the React admin panel
 */

class AdminUpdateManager {
  constructor() {
    this.currentVersion = this.getCurrentVersion();
    this.checkInterval = null;
    this.init();
  }

  init() {
    // Check for updates every 2 minutes
    this.checkInterval = setInterval(() => {
      this.checkForUpdates();
    }, 120000);

    // Check immediately on load
    setTimeout(() => this.checkForUpdates(), 5000);

    // Check when window regains focus
    window.addEventListener('focus', () => {
      this.checkForUpdates();
    });

    // Check when page becomes visible
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkForUpdates();
      }
    });
  }

  getCurrentVersion() {
    // Try to get version from build timestamp or use current timestamp
    const buildTime = document.querySelector('meta[name="build-time"]')?.content;
    return buildTime || Date.now().toString();
  }

  async checkForUpdates() {
    try {
      // Fetch the current index.html with cache-busting
      const response = await fetch(`/index.html?t=${Date.now()}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const html = await response.text();
        
        // Extract version from the HTML (look for script tags with hashes)
        const scriptMatches = html.match(/assets\/[^"']+\.js/g);
        const cssMatches = html.match(/assets\/[^"']+\.css/g);
        
        if (scriptMatches || cssMatches) {
          const newVersion = this.generateVersionFromAssets(scriptMatches, cssMatches);
          
          if (newVersion !== this.currentVersion) {
            console.log('🔄 New admin panel version detected!');
            this.showUpdateNotification();
          }
        }
      }
    } catch (error) {
      console.log('Update check failed:', error);
    }
  }

  generateVersionFromAssets(scripts, styles) {
    const assets = [...(scripts || []), ...(styles || [])];
    return assets.join('|');
  }

  showUpdateNotification() {
    // Remove existing notification if any
    const existing = document.getElementById('admin-update-notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.id = 'admin-update-notification';
    notification.innerHTML = `
      <div style="
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 20px;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        max-width: 350px;
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.2);
        animation: slideInFromRight 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      ">
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <div style="
            width: 12px;
            height: 12px;
            background: #4ade80;
            border-radius: 50%;
            margin-top: 2px;
            animation: pulse 2s infinite;
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          "></div>
          <div style="flex: 1;">
            <div style="font-weight: 700; margin-bottom: 8px; font-size: 16px;">
              ⚡ Admin Panel Update Ready!
            </div>
            <div style="font-size: 13px; opacity: 0.95; margin-bottom: 16px; line-height: 1.4;">
              A new version of the admin panel is available with the latest features and improvements.
            </div>
            <div style="display: flex; gap: 10px;">
              <button id="admin-update-now-btn" style="
                background: rgba(255,255,255,0.25);
                border: 1px solid rgba(255,255,255,0.4);
                color: white;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 13px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
              ">
                🚀 Update Now
              </button>
              <button id="admin-update-later-btn" style="
                background: transparent;
                border: 1px solid rgba(255,255,255,0.4);
                color: white;
                padding: 10px 16px;
                border-radius: 8px;
                font-size: 13px;
                cursor: pointer;
                opacity: 0.9;
                transition: all 0.3s ease;
              ">
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes slideInFromRight {
          from { 
            transform: translateX(100%) scale(0.8); 
            opacity: 0; 
          }
          to { 
            transform: translateX(0) scale(1); 
            opacity: 1; 
          }
        }
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }
        #admin-update-now-btn:hover {
          background: rgba(255,255,255,0.35) !important;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        #admin-update-later-btn:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: translateY(-1px);
        }
      </style>
    `;

    document.body.appendChild(notification);

    // Add event listeners
    document.getElementById('admin-update-now-btn').addEventListener('click', () => {
      this.applyUpdate();
    });

    document.getElementById('admin-update-later-btn').addEventListener('click', () => {
      this.dismissNotification();
    });

    // Auto-dismiss after 15 seconds
    setTimeout(() => {
      if (document.getElementById('admin-update-notification')) {
        this.dismissNotification();
      }
    }, 15000);
  }

  async applyUpdate() {
    try {
      // Show loading state
      const notification = document.getElementById('admin-update-notification');
      if (notification) {
        notification.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            max-width: 350px;
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255,255,255,0.2);
            text-align: center;
          ">
            <div style="margin-bottom: 12px; font-size: 18px;">🔄</div>
            <div style="font-weight: 600; margin-bottom: 8px;">Updating Admin Panel...</div>
            <div style="font-size: 12px; opacity: 0.9;">
              Please wait while we load the latest version
            </div>
          </div>
        `;
      }

      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Clear localStorage version info
      localStorage.removeItem('admin-version');
      sessionStorage.clear();

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Force reload with cache bypass
      window.location.reload(true);

    } catch (error) {
      console.error('Error applying admin update:', error);
      this.dismissNotification();
    }
  }

  dismissNotification() {
    const notification = document.getElementById('admin-update-notification');
    if (notification) {
      notification.style.animation = 'slideOutToRight 0.3s ease-in';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }

  // Manual update check
  async forceUpdateCheck() {
    console.log('🔍 Forcing admin panel update check...');
    await this.checkForUpdates();
  }

  // Cleanup
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
  }
}

// Add CSS for slide out animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOutToRight {
    from { 
      transform: translateX(0) scale(1); 
      opacity: 1; 
    }
    to { 
      transform: translateX(100%) scale(0.8); 
      opacity: 0; 
    }
  }
`;
document.head.appendChild(style);

export default AdminUpdateManager;
