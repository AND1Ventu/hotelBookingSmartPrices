import { Request, Response } from 'express';
import * as authService from './auth.service';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, fullName, hotelId } = req.body;
    const { user, tokens } = await authService.register({ email, password, fullName, hotelId });
    res.status(201).json({ user, tokens });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const { user, tokens } = await authService.login(email, password);
    res.status(200).json({ user, tokens });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}

export async function refreshToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
}
