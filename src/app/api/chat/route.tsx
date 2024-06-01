import { NextRequest, NextResponse } from "next/server";
import { StreamingTextResponse, Message as VercelChatMessage } from "ai";
import { AIMessage, ChatMessage, HumanMessage } from "@langchain/core/messages";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { createRetrieverTool } from "langchain/tools/retriever";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import {
  AzureAISearchVectorStore,
  AzureAISearchQueryType,
} from "@langchain/community/vectorstores/azure_aisearch";
export const runtime = "edge";

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = (body.messages ?? []).filter(
      (message: VercelChatMessage) =>
        message.role === "user" || message.role === "assistant",
    );
    const previousMessages = messages
      .slice(0, -1)
      .map(convertVercelMessageToLangChainMessage);
    const currentMessageContent = messages[messages.length - 1].content;

    const model = new ChatOpenAI({
      temperature: 0.2,
      streaming: true,
      model: "gpt-4",
    });

    const vectorstore = await new AzureAISearchVectorStore(
      new OpenAIEmbeddings(),
      {
        search: {
          type: AzureAISearchQueryType.SimilarityHybrid,
        },
      },
    );

    const retriever = vectorstore.asRetriever({
      k: 6,
      searchType: "mmr",
      searchKwargs: {
        fetchK: 20,
        lambda: 0.5,
      },
      verbose: false,
    });

    const azure_search_tool = createRetrieverTool(retriever, {
      name: "search_latest_knowledge",
      description: "Searches and returns up-to-date general information.",
    });

    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are an artificial intelligence bot named Lita, programmed to respond to inquiries about Financial Knowledge`,
      ],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"],
      new MessagesPlaceholder("agent_scratchpad"),
    ]);

    const agent = await createOpenAIFunctionsAgent({
      llm: model,
      tools: [azure_search_tool],
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools: [azure_search_tool],
    });

    // const result = await agentExecutor.invoke({
    //   input: currentMessageContent,
    //   chat_history: previousMessages,
    // });

    const logStream = await agentExecutor.streamLog({
      input: currentMessageContent,
      chat_history: previousMessages,
    });

    console.log({ logStream });
    const textEncoder = new TextEncoder();
    const transformStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of logStream) {
          if (chunk.ops?.length > 0 && chunk.ops[0].op === "add") {
            const addOp = chunk.ops[0];
            if (
              addOp.path.startsWith("/logs/ChatOpenAI") &&
              typeof addOp.value === "string" &&
              addOp.value.length
            ) {
              controller.enqueue(textEncoder.encode(addOp.value));
            }
          }
        }
        controller.close();
      },
    });

    return new StreamingTextResponse(transformStream);

    // return NextResponse.json(
    //   {
    //     _no_streaming_response_: true,
    //     output: result.output,
    //   },
    //   { status: 200 },
    // );
  } catch (e: any) {
    console.log(e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
