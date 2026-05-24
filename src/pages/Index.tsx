import { useState, useEffect, useRef } from 'react';
import { HardDrive } from '@/data/type';
import { DriveSearchError, searchHardDrives } from '@/lib/driveSearchApi';
import SearchForm from '@/components/SearchForm';
import DriveResult from '@/components/DriveResult';
import TechExplanation from '@/components/TechExplanation';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import FeedbackButton from '@/components/FeedbackButton';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAnalytics } from '@/hooks/useAnalytics';

export default function Index() {
  const [searchResults, setSearchResults] = useState<HardDrive[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const activeSearchRef = useRef<AbortController | null>(null);
  const activeSearchQueryRef = useRef<string | null>(null);
  const { t } = useLanguage();
  const { trackPageView, trackSearch, trackFeedbackClick } = useAnalytics();

  // Track initial page view
  useEffect(() => {
    trackPageView();
  }, [trackPageView]);

  const handleSearch = async (query: string) => {
    const trimmedQuery = query.trim();
    setSearchQuery(trimmedQuery);
    setSearchError(null);

    if (!trimmedQuery) {
      activeSearchRef.current?.abort();
      activeSearchQueryRef.current = null;
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    if (activeSearchQueryRef.current === trimmedQuery) {
      return;
    }

    activeSearchRef.current?.abort();
    const controller = new AbortController();
    activeSearchRef.current = controller;
    activeSearchQueryRef.current = trimmedQuery;
    setIsLoading(true);

    try {
      const results = await searchHardDrives(trimmedQuery, controller.signal);
      setSearchResults(results);
      trackSearch(trimmedQuery, results.length);
    } catch (error) {
      if (controller.signal.aborted) return;
      setSearchResults([]);
      setSearchError(error instanceof DriveSearchError ? error.message : t('results.error.subtitle'));
    } finally {
      if (activeSearchRef.current === controller) {
        activeSearchRef.current = null;
        activeSearchQueryRef.current = null;
        setIsLoading(false);
      }
    }
  };

  const handleFooterFeedbackClick = () => {
    // Track footer feedback click
    trackFeedbackClick();
    
    const subject = encodeURIComponent(t('feedback.email.subject'));
    const body = encodeURIComponent(t('feedback.email.body'));
    const mailtoLink = `mailto:sfijd@qq.com?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header with Language Switcher */}
        <div className="flex justify-between items-start mb-8">
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
              {t('page.title')}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('page.subtitle')}
            </p>
          </div>
          <div className="ml-4">
            <LanguageSwitcher />
          </div>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        {(searchQuery || searchResults.length > 0) && (
          <div className="mb-8">
            <DriveResult drives={searchResults} query={searchQuery} error={searchError} />
          </div>
        )}

        {/* Feedback Section - Show after search results or before tech explanation */}
        {(searchQuery || searchResults.length > 0) && (
          <div className="mb-8">
            <FeedbackButton />
          </div>
        )}

        {/* Separator */}
        <div className="mb-12">
          <Separator className="my-8" />
        </div>

        {/* Technology Explanation Section */}
        <div className="mb-8">
          <TechExplanation />
        </div>

        {/* Footer with additional feedback option */}
        <footer className="text-center text-sm text-gray-500 mt-12 pt-8 border-t">
          <p>
            {t('footer.disclaimer')}
          </p>
          <p className="mt-2">
            {t('footer.feedback')}
          </p>
              
        {/* Github PR suggestion */}
        <a
          href="https://github.com/11trees/hard-drive-type-checker"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          {t('feedback.submitPR')}
        </a>
        </footer>
      </div>
    </div>
  );
}
