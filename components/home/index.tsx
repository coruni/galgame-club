import PortraitCard from "@/components/portrait-card/PortraitCard";
import { findArticles } from "@/model";
import type { Article } from "@/types/article";

export default async function HomeComponent() {
  // 获取文章信息
  const articles = await findArticles({
    category: {
      type: 'ARTICLE',
      layout: 'PORTRAIT'
    }
  }, { take: 30, skip: 0 }) as unknown as Article[];
  return (
    <>
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {articles.map((article) => (
            <PortraitCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </>
  );
}