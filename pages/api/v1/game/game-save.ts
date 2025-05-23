import prisma from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGetRequest(req, res);
        break;
      case 'POST':
        await handlePostRequest(req, res);
        break;
      case 'PUT':
        await handlePutRequest(req, res);
        break;
      case 'DELETE':
        await handleDeleteRequest(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id, ...query } = req.query;

  // 获取单个游戏存档
  if (id) {
    const gameSave = await prisma.gameSave.findUnique({
      where: { id: Number(id) }
    });
    if (!gameSave) {
      return res.status(404).json({ error: '游戏存档不存在' });
    }
    return res.status(200).json(gameSave);
  }

  // 分页参数处理
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(Math.max(1, Number(query.limit) || 10), 50);
  delete query.page;
  delete query.limit;

  // 获取游戏存档列表
  const where = buildWhereCondition(query);
  const [gameSaves, total] = await Promise.all([
    prisma.gameSave.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.gameSave.count({ where })
  ]);

  res.status(200).json({
    data: gameSaves,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}

async function handlePostRequest(req: NextApiRequest, res: NextApiResponse) {
  const gameSaveData = req.body;

  // 验证必要字段
  if (!gameSaveData.name || !gameSaveData.url || !gameSaveData.articleId || !gameSaveData.authorId) {
    return res.status(400).json({
      error: '存档名称、下载链接、游戏ID和作者ID为必填项'
    });
  }

  const gameSave = await prisma.gameSave.create({
    data: gameSaveData
  });
  res.status(201).json(gameSave);
}

async function handlePutRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const gameSaveData = req.body;

  if (!id) {
    return res.status(400).json({ error: '存档ID为必填项' });
  }

  const gameSave = await prisma.gameSave.update({
    where: { id: Number(id) },
    data: gameSaveData
  });

  res.status(200).json(gameSave);
}

async function handleDeleteRequest(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: '存档ID为必填项' });
  }

  await prisma.gameSave.delete({ where: { id: Number(id) } });
  res.status(204).end();
}

// 构建查询条件
function buildWhereCondition(query: any) {
  const where: any = {};

  // 基本字段过滤
  if (query.name) where.name = { contains: query.name };
  if (query.articleId) where.articleId = Number(query.articleId);
  if (query.authorId) where.authorId = Number(query.authorId);
  if (query.status) where.status = query.status;
  if (query.gameVersion) where.gameVersion = { contains: query.gameVersion };

  // 数值范围过滤
  if (query.minRating) where.rating = { gte: Number(query.minRating) };
  if (query.maxRating) where.rating = { ...(where.rating || {}), lte: Number(query.maxRating) };

  // 日期范围过滤
  if (query.startDate && query.endDate) {
    where.createdAt = {
      gte: new Date(query.startDate),
      lte: new Date(query.endDate)
    };
  }

  return where;
}; 