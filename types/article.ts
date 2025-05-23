import {
  ArticleTag,
  Category,
  Character,
  Developer,
  Download,
  DownloadLog,
  Feedback,
  GamePatch,
  GameSave,
  LikeLog,
  Article as PrismaArticle,
  Publisher,
  Tag,
  User
} from "@prisma/client";

export type Article = PrismaArticle & {
  // 关联字段
  tags?: (ArticleTag & { tag: Tag })[];
  category?: Category;
  author?: User;
  publisher?: Publisher;
  developer?: Developer;
  likeLog?: LikeLog[];
  feedback?: Feedback[];
  download?: Download[];
  gameSave?: GameSave[];
  gamePatch?: GamePatch[];
  character?: Character[];
  recommendedTo?: Article[];
  recommendedBy?: Article[];
  downloadLogs?: DownloadLog[];
};
