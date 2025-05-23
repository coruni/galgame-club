import prisma from "@/lib/prisma"
// @ts-ignore - 忽略类型错误
import { Prisma } from "@prisma/client"

/**
 * 根据唯一条件查询单个角色
 * @param params 查询条件
 * @returns 返回单个角色或null
 */
export const findCharacter = async (params: Prisma.CharacterWhereUniqueInput) => {
  return prisma.character.findUnique({
    where: params,
  })
}

/**
 * 根据条件查询多个角色
 * @param params 查询条件
 * @returns 返回角色数组
 */
export const findCharacters = async (params: Prisma.CharacterWhereInput) => {
  return prisma.character.findMany({ where: params })
}

/**
 * 统计符合条件的角色数量
 * @param params 查询条件
 * @returns 返回角色数量
 */
export const findCharacterCount = async (params: Prisma.CharacterWhereInput) => {
  return prisma.character.count({ where: params })
}

/**
 * 创建新角色
 * @param data 角色数据
 * @returns 返回创建的角色
 */
export const createCharacter = async (data: Prisma.CharacterCreateInput) => {
  return prisma.character.create({ data })
}

/**
 * 更新角色信息
 * @param params 查询条件（用于定位要更新的角色）
 * @param data 更新数据
 * @returns 返回更新后的角色
 */
export const updateCharacter = async (
  params: Prisma.CharacterWhereUniqueInput,
  data: Prisma.CharacterUpdateInput
) => {
  return prisma.character.update({ where: params, data })
}

/**
 * 删除角色
 * @param params 查询条件（用于定位要删除的角色）
 * @returns 返回被删除的角色
 */
export const deleteCharacter = async (params: Prisma.CharacterWhereUniqueInput) => {
  return prisma.character.delete({ where: params })
}