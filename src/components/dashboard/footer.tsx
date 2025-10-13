'use client';

import { Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function DashboardFooter() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        {/* Informações da empresa */}
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <MapPin className="h-3 w-3" />
            <span>Lisboa, Portugal</span>
          </span>
          <span className="flex items-center space-x-1">
            <Phone className="h-3 w-3" />
            <span>+351 21 123 4567</span>
          </span>
          <span className="flex items-center space-x-1">
            <Mail className="h-3 w-3" />
            <span>suporte@vendemossuacasa.com</span>
          </span>
        </div>

        {/* Copyright */}
        <div className="flex items-center space-x-2">
          <span>© 2025 Vendemos Sua Casa</span>
          <span className="flex items-center space-x-1">
            <span>Feito com</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>em Portugal</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
