import { RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface UpdateNotificationProps {
  onUpdate: () => void;
}

export function UpdateNotification({ onUpdate }: UpdateNotificationProps) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-blue-600 text-white rounded-full shadow-2xl px-6 py-3 flex items-center gap-4">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span className="font-medium">New version available!</span>
        </div>
        
        <Button
          onClick={onUpdate}
          size="sm"
          className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-4 py-2 rounded-full"
        >
          Update Now
        </Button>
      </div>
    </div>
  );
}
