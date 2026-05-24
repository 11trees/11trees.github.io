import { HardDrive } from '@/data/type';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CheckCircle,
  Database,
  Gauge,
  Cpu,
  Usb,
  Maximize2,
  Activity,
  Monitor,
  X,
  HelpCircle,
  Info,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface DriveResultProps {
  drives: HardDrive[];
  query: string;
  error?: string | null;
}

interface CompatItem {
  label: string;
  recommended: boolean;
}

const getCompatibility = (tech: string): CompatItem[] => {
  const ok = tech.toUpperCase() === 'PMR' || tech.toUpperCase() === 'CMR';
  return [
    { label: 'NAS', recommended: ok },
    { label: 'RAID 重建', recommended: ok },
    { label: 'ZFS / 数据库', recommended: ok },
  ];
};

const getTechFullLabel = (tech: string): string => {
  switch (tech.toUpperCase()) {
    case 'PMR':
      return 'PMR（垂直磁记录）';
    case 'CMR':
      return 'CMR（传统磁记录）';
    case 'SMR':
      return 'SMR（叠瓦磁记录）';
    case 'HAMR':
      return 'HAMR（热辅助磁记录）';
    default:
      return tech;
  }
};

const getTechBadgeStyle = (tech: string): string => {
  switch (tech.toUpperCase()) {
    case 'PMR':
    case 'CMR':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'SMR':
      return 'bg-red-50 text-red-700 border-red-200';
    case 'HAMR':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

const getGradeLabel = (grade?: string | null): string => {
  switch (grade) {
    case 'enterprise':
      return '企业级硬盘';
    case 'prosumer':
      return '专业级硬盘';
    default:
      return '消费级硬盘';
  }
};

const getSMRNote = (): string =>
  'SMR 硬盘在持续写入场景下性能可能下降，不适合频繁写入或多盘位 RAID 使用。';

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
        <p className="text-gray-600">{t('results.notfound.subtitle')}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900">
          {t('results.found').replace('{count}', drives.length.toString())}
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {drives.map((drive, index) => {
          const isSMR = drive.technology.toUpperCase() === 'SMR';
          const techLabel = getTechFullLabel(drive.technology);
          const compat = getCompatibility(drive.technology);

          return (
            <Card
              key={drive.id || `${drive.brand}-${drive.model}-${index}`}
              className="p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="space-y-5">
                {/* Header: Model + Tech Badge */}
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-bold text-gray-900">{drive.model}</h2>
                  <Badge
                    variant="outline"
                    className={`${getTechBadgeStyle(drive.technology)} text-sm px-3 py-1 font-medium`}
                  >
                    {isSMR && <AlertTriangle className="h-4 w-4 mr-1" />}
                    {techLabel}
                  </Badge>
                </div>

                {/* Series */}
                <p className="text-lg text-gray-500">
                  {drive.brand} {drive.series}
                </p>

                {/* Divider */}
                <div className="border-t border-gray-200" />

                {/* Specs Grid — 3 cols x 2 rows */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {/* 容量 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Database className="h-5 w-5" />
                      <span className="text-sm">容量</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{drive.capacity}</p>
                  </div>

                  {/* 转速 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Gauge className="h-5 w-5" />
                      <span className="text-sm">转速</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {drive.rpm ?? '-'}{' '}
                      <span className="text-lg font-normal text-gray-500">RPM</span>
                    </p>
                  </div>

                  {/* 缓存 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Cpu className="h-5 w-5" />
                      <span className="text-sm">缓存</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{drive.cache ?? '-'}</p>
                  </div>

                  {/* 接口 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Usb className="h-5 w-5" />
                      <span className="text-sm">接口</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{drive.interface ?? '-'}</p>
                    {drive.interfaceVersion && (
                      <p className="text-sm text-gray-400">{drive.interfaceVersion}</p>
                    )}
                  </div>

                  {/* 规格 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Maximize2 className="h-5 w-5" />
                      <span className="text-sm">规格</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{drive.formFactor ?? '-'}</p>
                    {drive.formFactorHeight && (
                      <p className="text-sm text-gray-400">{drive.formFactorHeight}</p>
                    )}
                  </div>

                  {/* 记录方式 */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Activity className="h-5 w-5" />
                      <span className="text-sm">记录方式</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`text-2xl font-bold ${isSMR ? 'text-red-600' : 'text-gray-900'}`}>
                        {drive.technology}
                      </span>
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Usage + Compatibility */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 用途 */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Monitor className="h-5 w-5 text-blue-500" />
                      <span className="text-sm text-gray-600">用途</span>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {drive.targetUse || drive.notes || '-'}
                    </p>
                    <Badge variant="outline" className="mt-2 bg-white text-blue-600 border-blue-200">
                      {getGradeLabel(drive.grade)}
                    </Badge>
                  </div>

                  {/* 兼容性建议 */}
                  <div className="bg-amber-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-amber-900">兼容性建议</span>
                      <HelpCircle className="h-4 w-4 text-amber-400" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      {compat.map((item) => (
                        <div key={item.label} className="space-y-1">
                          <p className="text-xs text-gray-600">{item.label}</p>
                          {item.recommended ? (
                            <div className="flex items-center justify-center gap-1 text-green-600">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-xs">推荐</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1 text-red-500">
                              <X className="h-4 w-4" />
                              <span className="text-xs">不推荐</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 备注 / SMR 警告 */}
                {isSMR && (
                  <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
                    <Info className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">备注</p>
                      <p className="text-sm text-gray-600">{getSMRNote()}</p>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100 text-sm text-gray-500">
                  {drive.formFactor && drive.formFactorHeight && (
                    <span>Form Factor: {drive.formFactor} {drive.formFactorHeight}</span>
                  )}
                  {drive.notes && !drive.targetUse && <span>{drive.notes}</span>}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
