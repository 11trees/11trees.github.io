import { HardDrive } from '@/data/type';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDriveIcon, CheckCircle, AlertTriangle, Zap, Clock, Database, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DriveResultProps {
  drives: HardDrive[];
  query: string;
  error?: string | null;
}

export default function DriveResult({ drives, query, error }: DriveResultProps) {
  const { t } = useLanguage();

  if (!query.trim()) {
    return null;
  }

  if (error) {
    return (
      <Card className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('results.error.title')}</h3>
        <p className="text-gray-600">{error}</p>
      </Card>
    );
  }

  if (drives.length === 0) {
    return (
      <Card className="p-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('results.notfound.title')}</h3>
        <p className="text-gray-600">
          {t('results.notfound.subtitle')}
        </p>
      </Card>
    );
  }

  const getTechnologyColor = (tech: string) => {
    switch (tech.toUpperCase()) {
      case 'PMR':
      case 'CMR':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SMR':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'HAMR':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTechnologyLabel = (tech: string) => {
    switch (tech.toUpperCase()) {
      case 'PMR':
        return t('tech.pmr');
      case 'CMR':
        return 'CMR';
      case 'SMR':
        return t('tech.smr');
      case 'HAMR':
        return 'HAMR';
      default:
        return tech;
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          {t('results.found').replace('{count}', drives.length.toString())}
        </h3>
      </div>
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {drives.map((drive, index) => (
          <Card key={drive.id || `${drive.brand}-${drive.model}-${index}`} className="p-5 hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <div className="space-y-4">
              {/* Header with Brand and Technology */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <HardDriveIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">
                      {drive.brand}
                    </h4>
                    {drive.series && (
                      <p className="text-sm text-gray-600 font-medium">
                        {drive.series}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <Badge 
                    variant="outline"
                    className={getTechnologyColor(drive.technology)}
                  >
                    {getTechnologyLabel(drive.technology)}
                  </Badge>
                  {(['PMR', 'CMR'].includes(drive.technology.toUpperCase())) && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>

              {/* Model Name */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-mono text-gray-800 break-all">
                  {drive.model}
                </p>
              </div>

              {/* Key Specifications */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Database className="h-4 w-4 text-blue-500" />
                  <span className="font-semibold text-lg text-blue-600">{drive.capacity}</span>
                </div>
                {drive.rpm && (
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <span className="text-gray-700">{drive.rpm} RPM</span>
                  </div>
                )}
                {drive.cache && (
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span className="text-gray-700">{drive.cache}</span>
                  </div>
                )}
                {drive.interface && (
                  <div className="text-gray-600 text-xs">
                    {drive.interface}
                  </div>
                )}
              </div>

              {/* Target Use */}
              {(drive.targetUse || drive.notes) && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-blue-800 mb-1">
                    {drive.targetUse ? 'Target Use:' : 'Notes:'}
                  </p>
                  <p className="text-sm text-blue-700">{drive.targetUse || drive.notes}</p>
                </div>
              )}

              {/* Performance & Additional Info */}
              {(drive.performance || drive.workloadRating || drive.warranty || drive.price) && (
                <div className="space-y-2 text-xs">
                  {drive.performance && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Performance:</span>
                      <span className="text-gray-800 font-medium">{drive.performance}</span>
                    </div>
                  )}
                  {drive.workloadRating && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Workload:</span>
                      <span className="text-gray-800 font-medium">{drive.workloadRating}</span>
                    </div>
                  )}
                  {drive.warranty && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Warranty:</span>
                      <span className="text-gray-800 font-medium">{drive.warranty}</span>
                    </div>
                  )}
                  {drive.price && (
                    <div className="flex items-center justify-between">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="text-green-700 font-bold">{drive.price}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Form Factor */}
              {(drive.formFactor || (drive.targetUse && drive.notes)) && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  {drive.formFactor && (
                    <span className="text-xs text-gray-500">Form Factor: {drive.formFactor}</span>
                  )}
                  {drive.targetUse && drive.notes && (
                    <span className="text-xs text-gray-500 italic max-w-xs truncate" title={drive.notes}>
                      {drive.notes}
                    </span>
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
