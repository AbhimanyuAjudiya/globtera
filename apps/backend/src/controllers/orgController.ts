import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import { generateToken } from '../utils/jwtUtils';

const prisma = new PrismaClient();

export const registerOrg = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const org = await prisma.org.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    const token = generateToken(org.id, org.email);
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Organization registration failed' });
  }
};

export const authOrg = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const org = await prisma.org.findUnique({ where: { email } });

    if (org && (await bcrypt.compare(password, org.password))) {
      const token = generateToken(org.id, org.email);
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Organization authentication failed' });
  }
};

export const getAllOrgs = async (req: Request, res: Response) => {
  try {
    const orgs = await prisma.org.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        totalDonation: true,
        
      },
    });
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch organizations' });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const { title, content, orgId } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        publishedOn: new Date(),
        publishedBy: 'org', 
        orgId,
      },
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};


export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        org: true,
      },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};
export const getPostById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const post = await prisma.post.findUnique({
        where: { id: Number(id) },
        include: {
          org: true,
        },
      });
      res.json(post);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  };
  
  export const getOrgDetails = async (req: Request, res: Response) => {
    const orgId = req.user.id; // Assuming req.user is set by auth middleware
  
    console.log('Fetching details for org:', orgId); // Add logging
  
    try {
      const org = await prisma.org.findUnique({
        where: { id: orgId },
        select: {
          id: true,
          email: true,
          name: true,
          walletAddress: true,
          totalDonation: true,
        },
      });
      res.json(org);
    } catch (error) {
      console.error('Error fetching org details:', error);
      res.status(500).json({ error: 'Failed to fetch organization details' });
    }
  };
  