import { Request, Response } from 'express';
import Content from '../models/Content';

// Obtenir tous les contenus avec filtres
export const getAllContents = async (req: Request, res: Response) => {
  try {
    const { type, isActive, search, limit = 100 } = req.query;

    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    const contents = await Content.find(filter)
      .sort({ position: 1, createdAt: -1 })
      .limit(Number(limit));

    res.json({
      success: true,
      count: contents.length,
      data: contents,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contenus',
      error: error.message,
    });
  }
};

// Obtenir un contenu par ID
export const getContentById = async (req: Request, res: Response) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé',
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contenu',
      error: error.message,
    });
  }
};

// Obtenir un contenu par slug (pour les pages)
export const getContentBySlug = async (req: Request, res: Response) => {
  try {
    const content = await Content.findOne({ slug: req.params.slug, isActive: true });

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Page non trouvée',
      });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la page',
      error: error.message,
    });
  }
};

// Créer un nouveau contenu
export const createContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Contenu créé avec succès',
      data: content,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la création du contenu',
      error: error.message,
    });
  }
};

// Mettre à jour un contenu
export const updateContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Contenu mis à jour avec succès',
      data: content,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: 'Erreur lors de la mise à jour du contenu',
      error: error.message,
    });
  }
};

// Supprimer un contenu
export const deleteContent = async (req: Request, res: Response) => {
  try {
    const content = await Content.findByIdAndDelete(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: 'Contenu non trouvé',
      });
    }

    res.json({
      success: true,
      message: 'Contenu supprimé avec succès',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contenu',
      error: error.message,
    });
  }
};

// Obtenir les statistiques
export const getContentStats = async (req: Request, res: Response) => {
  try {
    const [total, banners, sliders, pages, active] = await Promise.all([
      Content.countDocuments(),
      Content.countDocuments({ type: 'banner' }),
      Content.countDocuments({ type: 'slider' }),
      Content.countDocuments({ type: 'page' }),
      Content.countDocuments({ isActive: true }),
    ]);

    res.json({
      success: true,
      data: {
        total,
        banners,
        sliders,
        pages,
        active,
        inactive: total - active,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message,
    });
  }
};

// Réorganiser les positions
export const reorderContents = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // [{ id, position }]

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Format invalide',
      });
    }

    const updatePromises = items.map((item) =>
      Content.findByIdAndUpdate(item.id, { position: item.position })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Ordre mis à jour avec succès',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la réorganisation',
      error: error.message,
    });
  }
};
