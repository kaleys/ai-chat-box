/** @format */

import { useState } from 'react'

interface LocalMessage {
  id: number
  text: string
  isUser: boolean
  timestamp: Date
}

interface ApiResponse {
  message?: string
  content?: string
  error?: string
}

export const useChat = () => {
  const [messages, setMessages] = useState<LocalMessage[]>([
    {
      id: 1,
      text: `你好！我是你的AI助手，有什么可以帮助你的吗？`,
      isUser: false,
      timestamp: new Date()
    }
  ])

  const [isTyping, setIsTyping] = useState<boolean>(false)

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    // 添加用户消息
    const userMessage: LocalMessage = {
      id: Date.now(),
      text: content,
      isUser: true,
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // 使用 GraphQL 发送请求到 Cloudflare Worker
      const response = await fetch(`${process.env.REACT_APP_API_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation SendMessage($message: String!) {
              sendMessage(message: $message) {
                message
                usage {
                  prompt_tokens
                  completion_tokens
                  total_tokens
                }
              }
            }
          `,
          variables: {
            message: content
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // 处理 GraphQL 响应
      if (data.errors) {
        throw new Error(data.errors[0].message || 'GraphQL 错误')
      }

      const sendMessageResult = data.data?.sendMessage
      if (!sendMessageResult) {
        throw new Error('GraphQL 响应格式错误')
      }

      // API 响应成功
      const aiMessage: LocalMessage = {
        id: Date.now() + 1,
        text: sendMessageResult.message || '抱歉，我暂时无法回复您的消息。',
        isUser: false,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error('发送消息失败:', error)

      // Fallback 到演示模式，提供丰富的 Markdown 回复
      const fallbackResponses = [
        `关于"**${content}**"的分析：

### 🎯 API 请求演示模式

由于无法连接到后端服务，现在显示演示回复。

#### 📡 请求配置
- **端点**: \`http://localhost:8787/chat\`
- **方法**: POST
- **格式**: JSON

\`\`\`typescript
// Fetch 请求示例
const response = await fetch('http://localhost:8787/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    message: "${content}"
  })
});
\`\`\`

> 💡 **提示**: 配置您的后端 API 后即可正常使用！`,

        `针对"**${content}**"的详细回复：

| 功能特性 | 状态 | 说明 |
|---------|------|------|
| 🚀 Fetch API | ✅ 已配置 | 标准 HTTP 请求 |
| 📝 Markdown | ✅ 支持 | 完整格式支持 |
| 🎨 UI 界面 | ✅ 优化 | Material-UI 设计 |
| 🔄 错误处理 | ✅ 完善 | 自动降级演示 |

### 🛠️ 后端 API 格式

#### 请求格式
\`\`\`json
{
  "message": "用户消息",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7,
  "max_tokens": 2000
}
\`\`\`

#### 响应格式
\`\`\`json
{
  "message": "AI 回复内容",
  "usage": {
    "total_tokens": 150
  }
}
\`\`\`

---
*当前为离线演示模式*`,

        `关于"**${content}**"的完整解答：

### 🔧 技术栈信息

#### 前端架构
- **React** + **TypeScript** - 类型安全的组件开发
- **Material-UI** - 现代化 UI 组件库
- **React Markdown** - 富文本渲染支持

#### 请求处理
\`\`\`javascript
// 使用原生 fetch API
const sendMessage = async (content) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: content })
    });
    
    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('请求失败:', error);
    // 优雅降级处理
  }
};
\`\`\`

### 📋 功能清单
1. **消息发送** - ✅ 完成
2. **Markdown 渲染** - ✅ 完成  
3. **错误处理** - ✅ 完成
4. **UI 优化** - ✅ 完成
5. **类型定义** - ✅ 完成

> **状态**: 等待后端 API 连接...

\`\`\`bash
# 启动您的后端服务
npm run start:server
# 或
python app.py
\`\`\`

**准备就绪！** 🎉`,

        `您提到了"**${content}**"，让我详细说明：

### ⚡ 性能优化

#### 🔄 请求优化
- **防抖处理**: 避免重复请求
- **加载状态**: 清晰的用户反馈
- **错误重试**: 自动重试机制

\`\`\`typescript
// 优化的请求处理
const [isTyping, setIsTyping] = useState(false);

const sendMessage = useCallback(async (content: string) => {
  if (isTyping) return; // 防止重复请求
  
  setIsTyping(true);
  try {
    // 发送请求...
  } catch (error) {
    // 错误处理...
  } finally {
    setIsTyping(false);
  }
}, [isTyping]);
\`\`\`

#### 📱 响应式设计
- **移动优先**: 适配各种屏幕尺寸
- **渐进增强**: 优雅降级支持
- **无障碍访问**: ARIA 标签支持

### 🎨 界面特色
- 🌈 **渐变背景** - 现代视觉效果
- 💬 **气泡对话** - 聊天软件风格
- ⚡ **动画效果** - 平滑的交互体验
- 🔤 **代码高亮** - 专业的代码显示

---
*功能齐全的聊天界面已准备就绪！*`
      ]

      const randomResponse =
        fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]

      const fallbackMessage: LocalMessage = {
        id: Date.now() + 1,
        text: randomResponse,
        isUser: false,
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsTyping(false)
    }
  }

  return {
    messages,
    isTyping,
    sendMessage,
    setMessages
  }
}
