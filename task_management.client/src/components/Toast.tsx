import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

const Toast = ({ id, message, type, duration = 4000, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, id, onClose]);

  const bgColor = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600',
    warning: 'bg-amber-600',
  }[type];

  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: AlertCircle,
    warning: AlertTriangle,
  }[type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg transform transition-all duration-300 ${bgColor} text-white ${
        isExiting ? 'translate-x-96 opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="font-medium text-sm flex-1">{message}</span>
      <button
        onClick={() => {
          setIsExiting(true);
          setTimeout(() => onClose(id), 300);
        }}
        className="flex-shrink-0 hover:bg-white/20 rounded p-0.5 transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast;
