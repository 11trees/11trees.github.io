# 硬盘搜索 API 响应规范

## 接口地址

```
GET /api/search?q={query}
```

## 响应结构

```json
{
  "query": "ST2000DM008",
  "results": [
    {
      "brand": "Seagate",
      "model": "ST2000DM008",
      "capacity": "2TB",
      "technology": "SMR",
      "series": "Barracuda",
      "rpm": 7200,
      "cache": "256MB",
      "interface": "SATA 6Gb/s",
      "interfaceVersion": "SATA III",
      "formFactor": "3.5\"",
      "formFactorHeight": "20.2mm",
      "targetUse": "桌面存储（Desktop）",
      "grade": "consumer",
      "performance": null,
      "workloadRating": null,
      "warranty": null,
      "price": null,
      "MTBF": null,
      "notes": "2Families"
    }
  ]
}
```

## 字段说明

### 基础信息

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `brand` | string | 是 | 品牌名称，如 `"Seagate"` |
| `model` | string | 是 | 型号，如 `"ST2000DM008"` |
| `capacity` | string | 是 | 容量，如 `"2TB"` |
| `series` | string | 否 | 系列名称，如 `"Barracuda"` |

### 技术类型（核心字段）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `technology` | string | 是 | 记录技术缩写：`"SMR"` / `"PMR"` / `"CMR"` / `"HAMR"` |

### 规格参数（6 宫格展示）

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `rpm` | number \| null | 否 | 转速，如 `7200`。无数据时传 `null` |
| `cache` | string \| null | 否 | 缓存大小，如 `"256MB"`。无数据时传 `null` |
| `interface` | string \| null | 否 | 接口类型，如 `"SATA 6Gb/s"` |
| `interfaceVersion` | string \| null | 否 | 接口版本子标签，如 `"SATA III"` / `"PCIe 4.0"` |
| `formFactor` | string \| null | 否 | 盘体尺寸，如 `"3.5\""` |
| `formFactorHeight` | string \| null | 否 | 盘体厚度，如 `"20.2mm"` |

### 用途与定位

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `targetUse` | string \| null | 否 | 用途说明，如 `"桌面存储（Desktop）"` |
| `grade` | string \| null | 否 | 产品定位：`"consumer"`（消费级）/ `"enterprise"`（企业级）/ `"prosumer"`（专业级） |

### 备注

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `notes` | string \| null | 否 | 额外备注，如 `"2Families"` |

### 其他可选字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `performance` | string \| null | 否 | 性能指标 |
| `workloadRating` | string \| null | 否 | 工作负载评级 |
| `warranty` | string \| null | 否 | 保修信息 |
| `price` | string \| null | 否 | 参考价格 |
| `MTBF` | string \| null | 否 | 平均故障间隔时间 |

## 示例：PMR 硬盘

```json
{
  "brand": "Western Digital",
  "model": "WD40EZRZ",
  "capacity": "4TB",
  "technology": "PMR",
  "series": "Blue",
  "rpm": 5400,
  "cache": "64MB",
  "interface": "SATA 6Gb/s",
  "interfaceVersion": "SATA III",
  "formFactor": "3.5\"",
  "formFactorHeight": "26.1mm",
  "targetUse": "桌面存储（Desktop）",
  "grade": "consumer",
  "notes": null
}
```
