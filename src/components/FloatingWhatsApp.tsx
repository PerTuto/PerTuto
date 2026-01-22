import { MessageCircle } from 'lucide-react';
import { logEvent } from '../services/analytics';

export const FloatingWhatsApp = () => {
    return (
        <a
            href="https://wa.me/919899266498?text=Hi%20PerTuto,%20I'm%20interested%20in%20a%20Gap%20Assessment%20for%20my%20child."
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logEvent('Engagement', 'WhatsApp Click', 'Floating Button')}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 group"
            aria-label="Chat on WhatsApp"
        >
            <div className="bg-white text-black px-4 py-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hidden md:block">
                <span className="font-bold text-sm">Chat with an Expert</span>
            </div>
            <div className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 relative">
                <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>
                <MessageCircle size={32} className="text-white fill-white" />
            </div>
        </a>
    );
};
