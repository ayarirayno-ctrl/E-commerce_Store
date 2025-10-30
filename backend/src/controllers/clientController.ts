import { Request, Response } from 'express';
import Client from '../models/Client';
import bcrypt from 'bcryptjs';

export const clientController = {
  // GET /api/clients - Get all clients (Admin only)
  async getAllClients(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const query: any = {};
      
      // Filter by blocked status
      if (req.query.blocked !== undefined) {
        query.blocked = req.query.blocked === 'true';
      }

      // Search by name or email
      if (req.query.search) {
        query.$or = [
          { name: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } }
        ];
      }

      const clients = await Client.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Client.countDocuments(query);

      res.json({
        clients,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalClients: total
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving clients' });
    }
  },

  // GET /api/clients/:id - Get client by ID
  async getClientById(req: Request, res: Response) {
    try {
      const client = await Client.findById(req.params.id).select('-password');

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(client);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving client' });
    }
  },

  // POST /api/clients - Create new client
  async createClient(req: Request, res: Response) {
    try {
      const { name, email, password, address, phone } = req.body;

      // Check if client already exists
      const existingClient = await Client.findOne({ email });
      if (existingClient) {
        return res.status(400).json({ error: 'Client with this email already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      const client = new Client({
        name,
        email,
        password: hashedPassword,
        address,
        phone
      });

      await client.save();

      // Remove password from response
      const clientResponse: any = client.toObject();
      delete clientResponse.password;

      res.status(201).json(clientResponse);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error creating client' });
    }
  },

  // PUT /api/clients/:id - Update client
  async updateClient(req: Request, res: Response) {
    try {
      const { password, ...updateData } = req.body;

      // If password is being updated, hash it
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      const client = await Client.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).select('-password');

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error updating client' });
    }
  },

  // PUT /api/clients/:id/block - Block/Unblock client (Admin only)
  async toggleBlockClient(req: Request, res: Response) {
    try {
      const { blocked } = req.body;

      const client = await Client.findByIdAndUpdate(
        req.params.id,
        { blocked },
        { new: true, runValidators: true }
      ).select('-password');

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json(client);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Error updating client status' });
    }
  },

  // DELETE /api/clients/:id - Delete client (Admin only)
  async deleteClient(req: Request, res: Response) {
    try {
      const client = await Client.findByIdAndDelete(req.params.id);

      if (!client) {
        return res.status(404).json({ error: 'Client not found' });
      }

      res.json({ message: 'Client deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error deleting client' });
    }
  },

  // GET /api/clients/:id/orders - Get client order history
  async getClientOrders(req: Request, res: Response) {
    try {
      const Order = require('../models/Order').default;
      
      const orders = await Order.find({ user: req.params.id })
        .populate('items.product', 'name price images')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Error retrieving client orders' });
    }
  }
};
