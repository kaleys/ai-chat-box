const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

// 调用 DeepSeek API 的通用函数
async function callDeepSeekAPI(messages, model = 'deepseek-chat', temperature = 0.7, max_tokens = 2000, apiKey) {
  try {
    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens,
        stream: false
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DeepSeek API 错误:', errorText);
      throw new Error('AI 服务暂时不可用');
    }

    const data = await response.json();
    return {
      message: data.choices[0]?.message?.content || '抱歉，我没能理解您的问题。',
      usage: data.usage ? {
        prompt_tokens: data.usage.prompt_tokens,
        completion_tokens: data.usage.completion_tokens,
        total_tokens: data.usage.total_tokens
      } : null
    };

  } catch (error) {
    console.error('调用 DeepSeek API 时出错:', error);
    throw new Error('服务器内部错误');
  }
}

export const resolvers = {
  Query: {
    health: () => '✅ DeepSeek GraphQL API is running!',
    
    models: () => [
      'deepseek-chat',
      'deepseek-coder',
      'deepseek-reasoning'
    ]
  },

  Mutation: {
    sendMessage: async (parent, args, context) => {
      const { message, model, temperature, max_tokens } = args;
      const { env } = context;
      
      if (!message || !message.trim()) {
        throw new Error('消息不能为空');
      }

      const messages = [
        {
          role: 'user',
          content: message
        }
      ];

      return await callDeepSeekAPI(messages, model, temperature, max_tokens, env.DEEPSEEK_API_KEY || 'sk-b445a584f232494c9fbdc9ccdebd6da2');
    },

    sendConversation: async (parent, args, context) => {
      const { messages, model, temperature, max_tokens } = args;
      const { env } = context;
      
      if (!messages || messages.length === 0) {
        throw new Error('对话消息不能为空');
      }

      // 验证消息格式
      for (const msg of messages) {
        if (!msg.role || !msg.content) {
          throw new Error('每条消息必须包含 role 和 content 字段');
        }
        if (!['system', 'user', 'assistant'].includes(msg.role)) {
          throw new Error('消息角色必须是 system、user 或 assistant 之一');
        }
      }

      return await callDeepSeekAPI(messages, model, temperature, max_tokens, env.DEEPSEEK_API_KEY || 'sk-b445a584f232494c9fbdc9ccdebd6da2');
    }
  }
};