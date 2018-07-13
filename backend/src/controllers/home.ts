import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import db from "../database"

/**
 * GET /
 * Home page.
 */
export const index = asyncHandler(async (req: Request, res: Response) => {
  const orgs = await db.Organization.all()
  res.json(orgs.map(org => org.toJSON()))
})
