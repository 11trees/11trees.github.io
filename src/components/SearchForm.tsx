import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchFormProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
}

export default function SearchForm({ onSearch, isLoading = false }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  };

  const handleInputBlur = () => {
    onSearch(query.trim());
  };

  return (
    <Card className="p-6 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">{t('search.title')}</h2>
          <p className="text-gray-600">{t('search.subtitle')}</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder={t('search.placeholder')}
            value={query}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="pl-10 text-lg py-3"
            disabled={isLoading}
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full py-3 text-lg"
          disabled={isLoading || !query.trim()}
        >
          {isLoading ? t('search.searching') : t('search.button')}
        </Button>
        
        <div className="text-sm text-gray-500 text-center">
          <p>{t('search.support')}</p>
          <p className="mt-1">{t('search.example')}</p>
          <p className="mt-2 text-xs text-blue-600">
            💡 {t('language.chinese') === '中文' ? '提示：输入完成后点击其他区域或按回车键进行搜索' : 'Tip: Click outside the search box or press Enter to search'}
          </p>
        </div>
      </form>
    </Card>
  );
}
