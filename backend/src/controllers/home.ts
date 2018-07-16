import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { Organization } from "../models/organization"

/**
 * GET /
 * Home page.
 */
export const index = asyncHandler(async (req: Request, res: Response) => {
  const orgs = await Organization.find()
  res.json(orgs.map(org => ({ id: org.id })))
})
