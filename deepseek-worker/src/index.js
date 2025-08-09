import { createYoga, createSchema } from 'graphql-yoga';
import { resolvers } from './resolvers.js';

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

function corsHeaders(origin) {
	return {
		'Access-Control-Allow-Origin': origin || '*',
		'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
		'Access-Control-Allow-Headers': 'Content-Type, Authorization',
		'Access-Control-Max-Age': '86400',
	};
}

// 创建 GraphQL Schema
const schema = createSchema({
	typeDefs: /* GraphQL */ `
		type Message {
			id: ID!
			content: String!
			role: String!
			timestamp: String!
		}

		type ChatResponse {
			message: String!
			usage: Usage
		}

		type Usage {
			prompt_tokens: Int
			completion_tokens: Int
			total_tokens: Int
		}

		type Query {
			health: String!
			models: [String!]!
		}

		type Mutation {
			sendMessage(
				message: String!
				model: String = "deepseek-chat"
				temperature: Float = 0.7
				max_tokens: Int = 2000
			): ChatResponse!
			
			sendConversation(
				messages: [MessageInput!]!
				model: String = "deepseek-chat"
				temperature: Float = 0.7
				max_tokens: Int = 2000
			): ChatResponse!
		}

		input MessageInput {
			role: String!
			content: String!
		}
	`,
	resolvers
});

// 创建 GraphQL Yoga 实例
const yoga = createYoga({
	schema,
	context: async ({ request, env }) => ({
		request,
		env
	}),
	cors: {
		origin: '*',
		credentials: false,
	},
	graphiql: {
		title: 'DeepSeek GraphQL API',
		endpoint: '/graphql'
	}
});

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const origin = request.headers.get('Origin');
		
		// Handle CORS preflight for all endpoints
		if (request.method === 'OPTIONS') {
			return new Response(null, {
				status: 200,
				headers: corsHeaders(origin),
			});
		}

		// GraphQL 端点
		if (url.pathname === '/graphql') {
			const response = await yoga.fetch(request, {
				...ctx,
				env
			});
			return response;
		}

		// 保持原有的 REST API 兼容性
		if (request.method === 'POST' && url.pathname === '/chat') {
			try {
				const { message } = await request.json();
				
				if (!message) {
					return new Response(JSON.stringify({ error: '消息不能为空' }), {
						status: 400,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders(origin),
						},
					});
				}

				// 调用 DeepSeek API
				const response = await fetch(DEEPSEEK_API_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Authorization': `Bearer ${env.DEEPSEEK_API_KEY}`,
					},
					body: JSON.stringify({
						model: 'deepseek-chat',
						messages: [
							{
								role: 'user',
								content: message
							}
						],
						temperature: 0.7,
						max_tokens: 2000,
						stream: false
					}),
				});

				if (!response.ok) {
					const errorText = await response.text();
					console.error('DeepSeek API 错误:', errorText);
					return new Response(JSON.stringify({ error: 'AI 服务暂时不可用' }), {
						status: 500,
						headers: {
							'Content-Type': 'application/json',
							...corsHeaders(origin),
						},
					});
				}

				const data = await response.json();
				const aiMessage = data.choices[0]?.message?.content || '抱歉，我没能理解您的问题。';

				return new Response(JSON.stringify({ message: aiMessage }), {
					status: 200,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders(origin),
					},
				});

			} catch (error) {
				console.error('处理请求时出错:', error);
				return new Response(JSON.stringify({ error: '服务器内部错误' }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json',
						...corsHeaders(origin),
					},
				});
			}
		}

		// 默认响应
		return new Response(`
			<h1>🚀 DeepSeek Chat Worker</h1>
			<p>✅ GraphQL Endpoint: <a href="/graphql">/graphql</a></p>
			<p>✅ REST API: <a href="/chat">/chat</a></p>
		`, {
			headers: {
				'Content-Type': 'text/html',
				...corsHeaders(origin),
			},
		});
	},
};
