import * as z from 'zod';

import { Router } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();

const userSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.params.id),
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const parsedData = userSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: 'Validation failed', errors: parsedData.error.errors });
    }

    const user = await prisma.user.create({
      data: {
        username: parsedData.data.username,
        email: parsedData.data.email,
        password: parsedData.data.password,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      res.status(400).json({ message: 'A user with this email already exists' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: {
        id: +req.params.id,
      },
      data: {
        username: req.body.username,
        email: req.body.email,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
