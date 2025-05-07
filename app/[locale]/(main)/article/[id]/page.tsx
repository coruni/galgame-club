
import { Article } from "@/types/article";
import { findArticle } from "model/content/article";
import { Metadata } from "next";
import GameDetailClient from "./GameDetailClient";

// 1定义 Params 类型（用 Promise 包装）
type Params = {
  params: Promise<{ id: number }>;
};

// 生成元数据函数（用于SEO）
export async function generateMetadata({
  params
}: Params): Promise<Metadata> {
  const { id } = await params;

  // 获取游戏数据
  const gameData = await findArticle({ id: Number(id) })

  return {
    title: `${gameData?.title}`,
    description: gameData?.summary?.substring(0, 160) || gameData?.content?.substring(0, 160) || '',
    openGraph: {
      title: gameData?.title || '',
      description: gameData?.content?.substring(0, 160),
      images: [{ url: "https://t.alcy.cc/pc", alt: gameData?.title ?? '' }],
      type: 'article',
    },
  };
}

// 获取分类路

// 主页面组件（服务器组件）
export default async function ArticleDetailPage({ params }: Params) {
  const { id } = await params;
  const gameData: Article = await findArticle({
    id: Number(id),
  }) as unknown as Article;


  // 如果没有找到游戏数据，可以处理错误情况
  if (!gameData) {
    // 这里可以选择重定向到404页面或显示错误信息
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">游戏不存在或已被删除</h1>
      </div>
    );
  }


  // 服务器端渲染游戏的基本信息（对SEO友好）
  return <GameDetailClient gameData={gameData} />;
}