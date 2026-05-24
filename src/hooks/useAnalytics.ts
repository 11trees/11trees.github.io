import { useEffect } from 'react';

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || 'G-XXXXXXXXXX';

export const useAnalytics = () => {
  useEffect(() => {
    // Only initialize if measurement ID is provided and not in development
    if (GA4_MEASUREMENT_ID && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      // Initialize Google Analytics
      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA4_MEASUREMENT_ID}', {
          page_title: document.title,
          page_location: window.location.href
        });
      `;
      document.head.appendChild(script2);
    }
  }, []);

  const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
    if (typeof window !== 'undefined' && window.gtag && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      window.gtag('event', eventName, {
        event_category: 'Hard Drive Query Tool',
        ...parameters
      });
    }
  };

  const trackPageView = (pagePath?: string) => {
    if (typeof window !== 'undefined' && window.gtag && GA4_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
      window.gtag('config', GA4_MEASUREMENT_ID, {
        page_path: pagePath || window.location.pathname,
        page_title: document.title,
        page_location: window.location.href
      });
    }
  };

  const trackSearch = (searchTerm: string, resultsCount: number) => {
    trackEvent('search', {
      search_term: searchTerm,
      results_count: resultsCount,
      event_label: 'Hard Drive Search'
    });
  };

  const trackFeedbackClick = () => {
    trackEvent('feedback_click', {
      event_label: 'Email Feedback Button'
    });
  };

  const trackLanguageChange = (fromLanguage: string, toLanguage: string) => {
    trackEvent('language_change', {
      from_language: fromLanguage,
      to_language: toLanguage,
      event_label: 'Language Switch'
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackSearch,
    trackFeedbackClick,
    trackLanguageChange
  };
};
