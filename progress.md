# LLM Device Matcher - Development Progress

## Phase 1: 类型系统 + 硬件检测重构 ✅

- [x] `src/types/index.ts` — 共享类型定义（HardwareSpecs, LLMModel, OllamaModel, FilterState 等）
- [x] `src/data/gpu-database.ts` — GPU 型号 VRAM 映射表（NVIDIA/AMD/Intel，~50 款）
- [x] `src/services/hardware.ts` — WebGPU 优先 + WebGL fallback 硬件检测
- [x] `src/hooks/useHardware.ts` — 硬件检测 hook

## Phase 2: Ollama 集成 ✅

- [x] `src/services/ollama.ts` — Ollama API 客户端（3s 超时）
- [x] `src/hooks/useOllama.ts` — Ollama 连接状态管理
- [x] `src/data/models.ts` — 添加 id, source 字段，重命名 export 为 staticModels

## Phase 3: 过滤/搜索/排序 ✅

- [x] `src/hooks/useModels.ts` — 模型合并 + 过滤 + 排序逻辑
- [x] `src/components/filters/FilterBar.tsx` + CSS — 搜索、家族/兼容性/大小/量化过滤、排序
- [x] `src/components/filters/FilterChip.tsx` + CSS — 胶囊形筛选芯片

## Phase 4: Apple 风格 UI 重设计 ✅

- [x] `src/components/layout/Header.tsx` + CSS — 页面标题 + Ollama 状态
- [x] `src/components/layout/Footer.tsx` + CSS — 页脚信息
- [x] `src/components/hardware/HardwareDashboard.tsx` + CSS — 硬件仪表盘
- [x] `src/components/hardware/HardwareCard.tsx` + CSS — 单个硬件指标卡
- [x] `src/components/models/ModelGrid.tsx` + CSS — 模型网格
- [x] `src/components/models/ModelCard.tsx` + CSS — 单个模型卡片
- [x] `src/components/models/CompatibilityBadge.tsx` + CSS — 兼容性状态徽章
- [x] `src/components/ollama/OllamaStatus.tsx` + CSS — Ollama 连接状态
- [x] `src/App.tsx` — 重写为容器组件（~80 行）
- [x] `src/index.css` — Apple 风格设计系统（#000 背景，#1d1d1f 卡片，#2997ff 强调色）
- [x] 删除 `src/App.css`
- [x] 删除 `src/utils/hardware.ts`

## Phase 5: 集成测试 + 收尾 ✅

- [x] `npm run build` 构建成功
- [x] `npm run lint` 无 lint 错误
- [x] `npx tsc --noEmit` 类型检查通过

## Phase 6: HuggingFace API 集成 ✅

- [x] `src/services/huggingface.ts` — HF API 客户端（获取热门 GGUF 模型，自动解析量化版本和 VRAM 估算）
- [x] `src/hooks/useHuggingFace.ts` — HF 数据 hook
- [x] 更新 `src/hooks/useModels.ts` — 三源合并（Ollama > 静态 > HuggingFace）
- [x] 更新 `src/App.tsx` — 集成 HuggingFace hook
- [x] 构建通过，lint 通过
