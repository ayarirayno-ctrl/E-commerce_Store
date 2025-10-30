import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';
import Button from '../ui/Button';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed');
    if (dismissed) {
      const dismissedDate = new Date(dismissed);
      const daysSinceDismissal = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Don't show for 7 days after dismissal
      if (daysSinceDismissal < 7) {
        return;
      }
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 30 seconds or on second visit
      const visitCount = parseInt(localStorage.getItem('pwa-visit-count') || '0');
      localStorage.setItem('pwa-visit-count', (visitCount + 1).toString());
      
      if (visitCount >= 1) {
        setTimeout(() => setShowPrompt(true), 30000); // 30 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for successful installation
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed successfully');
    } else {
      console.log('PWA installation dismissed');
      localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
  };

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>

          {/* Title */}
          <h3 className="text-white font-bold text-xl mb-2">
            Install Our App
          </h3>

          {/* Description */}
          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            Get the best shopping experience! Install our app for faster access, offline browsing, and exclusive notifications.
          </p>

          {/* Features */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center text-white/90 text-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
              Works offline
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
              Lightning fast
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <div className="w-1.5 h-1.5 bg-white rounded-full mr-2"></div>
              Push notifications
            </div>
          </div>

          {/* Install button */}
          <Button
            onClick={handleInstall}
            className="w-full bg-white text-blue-600 hover:bg-gray-100 font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Install Now
          </Button>

          {/* Later link */}
          <button
            onClick={handleDismiss}
            className="w-full text-white/80 hover:text-white text-sm mt-3 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
