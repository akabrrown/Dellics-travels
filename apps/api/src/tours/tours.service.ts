import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TourPackageDto, TourPackageResult } from './tours.types';

export const CATALOG_TOURS: TourPackageResult[] = [
  {
    id: 'tour-gh-cc-01',
    name: 'Cape Coast Castle Heritage & Kakum Canopy Walk',
    slug: 'cape-coast-castle-heritage-kakum',
    destination: 'Central Region, Ghana',
    price: '$120',
    rawPrice: 120,
    currency: 'USD',
    duration: 'Full Day Tour',
    badge: 'Historic Heritage',
    image: '/images/africa/cape-coast-castle.jpg',
    copy: 'Walk through the UNESCO World Heritage slave dungeons at Cape Coast Castle, cross the rainforest canopy suspension bridge at Kakum National Park, and savor local Ghanaian cuisine.',
    includes: [
      'Cape Coast Castle & Museum Entrance',
      'Kakum Rainforest Canopy Walk Tickets',
      'Round-trip Executive AC Transport from Accra',
      'Traditional Ghanaian Lunch & Refreshments',
      'Licensed Historic Tour Guide',
    ],
    highlights: ['Door of No Return', 'Kakum Canopy Bridge', 'Gulf of Guinea Coastline', 'Elmina Township'],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: 'https://www.viator.com/search/Cape%20Coast%20Ghana?sortType=featured',
    status: 'PUBLISHED',
  },
  {
    id: 'tour-sv-02',
    name: 'Safari Valley Eco Resort Full Day Escape',
    slug: 'safari-valley-eco-resort',
    destination: 'Okere Hills, Ghana',
    price: '$150',
    rawPrice: 150,
    currency: 'USD',
    duration: 'Full Day Tour',
    badge: 'Ghana Eco-Luxury',
    image: '/images/services/day-tip-to-safari-valley.jpg',
    copy: "Ghana's premier luxury eco-retreat escape. Experience pure nature, exotic wildlife encounters, kayaking, lawn bowling, and outdoor dining in the tranquil Okere Hills.",
    includes: [
      'Resort Entrance & Conservation Fee',
      'Buffet Gourmet 3-Course Lunch',
      'Swimming Pool & Kayaking Access',
      'Guided Wildlife Feeding Encounter',
      'Professional Dellics Tour Host',
      'Round-trip AC Transport from Accra',
    ],
    highlights: ['Wildlife Encounters', 'Gourmet Buffet', 'Eco Kayaking', 'Guided Forest Trails'],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: 'https://www.viator.com/search/Ghana%20Safari%20Valley?sortType=featured',
    status: 'PUBLISHED',
  },
  {
    id: 'tour-dxb-03',
    name: 'Dubai 5-Night Luxury Holiday & Desert Safari',
    slug: 'dubai-luxury-desert-safari',
    destination: 'Dubai, United Arab Emirates',
    price: '$1,890',
    rawPrice: 1890,
    currency: 'USD',
    duration: '6 Days / 5 Nights',
    badge: 'Bestseller',
    image: '/images/services/winter-dubai.jpg',
    copy: 'Experience the ultimate Arabian luxury escape! Includes Emirates flights, Dubai Mall shopping, 4x4 desert dune safari with BBQ dinner, and Marina yacht dinner cruise.',
    includes: [
      'Return Flights from Accra',
      '4-Star Luxury Hotel in Downtown Dubai',
      'Desert Dune 4x4 Safari with BBQ Dinner & Shows',
      'Dubai Marina Luxury Yacht Cruise',
      'Executive Airport Transfers',
      'Dubai Tourist Visa Processing',
    ],
    highlights: ['Burj Khalifa', 'Desert Safari BBQ', 'Marina Yacht Cruise', 'Dubai Mall'],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: 'https://www.viator.com/search/Dubai%20Desert%20Safari?sortType=featured',
    status: 'PUBLISHED',
  },
  {
    id: 'tour-znz-04',
    name: 'Zanzibar Island Spice & Coral Reef Beach Escape',
    slug: 'zanzibar-island-spice-beach-escape',
    destination: 'Zanzibar, Tanzania',
    price: '$1,450',
    rawPrice: 1450,
    currency: 'USD',
    duration: '5 Days / 4 Nights',
    badge: 'Tropical Beach',
    image: '/images/packages/zanzibar-beach.jpg',
    copy: 'Pristine turquoise waters, historic Stone Town walking tours, aromatic organic spice plantation tastings, and private sunset catamaran sailing cruises.',
    includes: [
      'Beachfront 4-Star Resort Accommodation',
      'Stone Town Guided UNESCO Heritage Tour',
      'Spice Farm Organic Plantation Walk',
      'Sunset Dhow Boat Cruise with Refreshments',
      'Daily Gourmet Breakfast & Dinner',
      'Return Airport & Ferry Transfers',
    ],
    highlights: ['Stone Town', 'Nungwi Beach', 'Organic Spice Farm', 'Sunset Dhow Sailing'],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: 'https://www.viator.com/search/Zanzibar%20Stone%20Town?sortType=featured',
    status: 'PUBLISHED',
  },
  {
    id: 'tour-ct-05',
    name: '5 Nights in Cape Town Luxury Experience',
    slug: 'cape-town-luxury-experience',
    destination: 'Cape Town, South Africa',
    price: '$1,899',
    rawPrice: 1899,
    currency: 'USD',
    duration: '6 Days / 5 Nights',
    badge: 'South Africa Special',
    image: '/images/africa/cape-town-and-table-mountain.jpg',
    copy: 'Discover the Mother City where adventure meets luxury! Table Mountain cableway, Cape Point penguin encounters, and V&A Waterfront.',
    includes: [
      'Table Mountain Cableway Priority Ticket',
      'Cape Point & Boulders Beach Penguin Sanctuary',
      'V&A Waterfront Private Tour',
      '4-Star Luxury Waterfront Hotel',
      'Daily Gourmet Breakfast',
      'Executive Airport Transfers',
    ],
    highlights: ['Table Mountain', 'Cape Point', 'Boulders Beach', 'V&A Waterfront'],
    isFeatured: true,
    isDellicsSignature: true,
    viatorUrl: 'https://www.viator.com/search/Cape%20Town%20Table%20Mountain?sortType=featured',
    status: 'PUBLISHED',
  },
  {
    id: 'tour-par-06',
    name: 'Paris Romance & Louvre Museum Private Access',
    slug: 'paris-romance-louvre',
    destination: 'Paris, France',
    price: '$2,100',
    rawPrice: 2100,
    currency: 'USD',
    duration: '5 Days / 4 Nights',
    badge: 'European Romance',
    image: '/images/europe/paris-and-eiffel-tower.jpg',
    copy: 'Priority entrance to the Louvre, Seine river dinner cruise at dusk, and a gourmet walking tour through Montmartre and Le Marais.',
    includes: [
      'Skip-the-Line Louvre Museum Tickets',
      'Seine River Gourmet Dinner Cruise',
      'Boutique Central Paris Hotel',
      'Eiffel Tower Summit Access',
    ],
    highlights: ['Louvre Museum', 'Eiffel Tower', 'Seine River', 'Montmartre'],
    isFeatured: true,
    isDellicsSignature: false,
    viatorUrl: 'https://www.viator.com/search/Paris%20Louvre?sortType=featured',
    status: 'PUBLISHED',
  },
];

@Injectable()
export class ToursService {
  private readonly logger = new Logger(ToursService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns list of tours with optional filters (featured, destination, status)
   */
  async getTours(query: { featured?: string | boolean; destination?: string; status?: string } = {}): Promise<{
    status: string;
    provider: string;
    count: number;
    data: TourPackageResult[];
  }> {
    try {
      if (this.prisma && (this.prisma as any).tourPackage) {
        const where: any = {};
        if (query.featured === 'true' || query.featured === true) {
          where.is_featured = true;
        }
        if (query.destination) {
          where.destination = { contains: query.destination, mode: 'insensitive' };
        }

        const dbTours = await (this.prisma as any).tourPackage.findMany({
          where,
          orderBy: { created_at: 'desc' },
        });

        if (dbTours && dbTours.length > 0) {
          const mappedDbTours: TourPackageResult[] = dbTours.map((t: any) => ({
            id: t.id,
            name: t.title,
            slug: t.slug,
            destination: t.destination,
            price: `$${Number(t.price).toLocaleString()}`,
            rawPrice: Number(t.price),
            currency: t.currency || 'USD',
            duration: t.duration,
            badge: t.badge || 'Curated Package',
            image: t.image_url,
            copy: t.overview,
            includes: t.includes || [],
            highlights: t.highlights || [],
            isFeatured: Boolean(t.is_featured),
            isDellicsSignature: true,
            viatorUrl: `https://www.viator.com/search/${encodeURIComponent(t.destination)}?sortType=featured`,
            status: 'PUBLISHED',
          }));

          return {
            status: 'success',
            provider: 'database',
            count: mappedDbTours.length,
            data: mappedDbTours,
          };
        }
      }
    } catch (err: any) {
      this.logger.warn(`TourPackage DB lookup error: ${err.message}. Serving catalog dataset.`);
    }

    // Filter in-memory catalog
    let filtered = CATALOG_TOURS;
    if (query.featured === 'true' || query.featured === true) {
      filtered = filtered.filter((t) => t.isFeatured);
    }
    if (query.destination) {
      const d = query.destination.toLowerCase();
      filtered = filtered.filter((t) => t.destination.toLowerCase().includes(d));
    }

    return {
      status: 'success',
      provider: 'catalog',
      count: filtered.length,
      data: filtered,
    };
  }

  /**
   * Fetch single tour package by ID or slug
   */
  async getTourByIdOrSlug(idOrSlug: string): Promise<TourPackageResult> {
    try {
      if (this.prisma && (this.prisma as any).tourPackage) {
        const t = await (this.prisma as any).tourPackage.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          },
        });

        if (t) {
          return {
            id: t.id,
            name: t.title,
            slug: t.slug,
            destination: t.destination,
            price: `$${Number(t.price).toLocaleString()}`,
            rawPrice: Number(t.price),
            currency: t.currency || 'USD',
            duration: t.duration,
            badge: t.badge || 'Curated Package',
            image: t.image_url,
            copy: t.overview,
            includes: t.includes || [],
            highlights: t.highlights || [],
            isFeatured: Boolean(t.is_featured),
            isDellicsSignature: true,
            viatorUrl: `https://www.viator.com/search/${encodeURIComponent(t.destination)}?sortType=featured`,
            status: 'PUBLISHED',
          };
        }
      }
    } catch (err: any) {
      this.logger.warn(`Tour DB lookup by slug failed: ${err.message}`);
    }

    const fallback = CATALOG_TOURS.find((t) => t.id === idOrSlug || t.slug === idOrSlug);
    if (fallback) return fallback;

    throw new NotFoundException(`Tour package with identifier '${idOrSlug}' not found.`);
  }

  /**
   * Creates a new tour package from Admin Tour Designer
   */
  async createTour(dto: TourPackageDto): Promise<TourPackageResult> {
    if (!dto.title || !dto.destination) {
      throw new BadRequestException('Title and destination are required.');
    }

    const slug =
      dto.slug ||
      dto.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const rawPrice =
      typeof dto.price === 'string' ? parseFloat(dto.price.replace(/[^0-9.]/g, '')) || 100 : Number(dto.price) || 100;

    try {
      if (this.prisma && (this.prisma as any).tourPackage) {
        const created = await (this.prisma as any).tourPackage.create({
          data: {
            title: dto.title,
            slug,
            destination: dto.destination,
            price: rawPrice,
            currency: dto.currency || 'USD',
            duration: dto.duration || 'Full Day',
            badge: dto.badge || 'Curated Experience',
            image_url: dto.image || '/images/services/winter-dubai.jpg',
            overview: dto.overview || dto.tagline || dto.title,
            includes: dto.includes || ['Executive Transport', 'Guided Tours', 'Entrance Fees'],
            highlights: dto.highlights || ['Verified Itinerary', 'Expert Guide', 'All Entry Passes'],
            is_featured: dto.isFeatured ?? true,
          },
        });

        this.logger.log(`Created new tour package in database: ${created.id} (${created.title})`);

        return {
          id: created.id,
          name: created.title,
          slug: created.slug,
          destination: created.destination,
          price: `$${Number(created.price).toLocaleString()}`,
          rawPrice: Number(created.price),
          currency: created.currency,
          duration: created.duration,
          badge: created.badge,
          image: created.image_url,
          copy: created.overview,
          includes: created.includes,
          highlights: created.highlights,
          isFeatured: created.is_featured,
          isDellicsSignature: true,
          viatorUrl: `https://www.viator.com/search/${encodeURIComponent(created.destination)}?sortType=featured`,
          status: 'PUBLISHED',
        };
      }
    } catch (err: any) {
      this.logger.error(`Database error creating tour: ${err.message}`);
    }

    // In-memory fallback
    const newTour: TourPackageResult = {
      id: dto.id || `tour-${Date.now()}`,
      name: dto.title,
      slug,
      destination: dto.destination,
      price: `$${rawPrice.toLocaleString()}`,
      rawPrice,
      currency: dto.currency || 'USD',
      duration: dto.duration || 'Full Day',
      badge: dto.badge || 'New Experience',
      image: dto.image || '/images/services/winter-dubai.jpg',
      copy: dto.overview || dto.title,
      includes: dto.includes || ['Executive Transport', 'Guided Tours'],
      highlights: dto.highlights || ['Verified Itinerary'],
      isFeatured: dto.isFeatured ?? true,
      isDellicsSignature: true,
      viatorUrl: `https://www.viator.com/search/${encodeURIComponent(dto.destination)}?sortType=featured`,
      status: dto.status || 'PUBLISHED',
    };

    CATALOG_TOURS.unshift(newTour);
    return newTour;
  }

  /**
   * Updates an existing tour package
   */
  async updateTour(id: string, dto: Partial<TourPackageDto>): Promise<TourPackageResult> {
    const rawPrice =
      dto.price !== undefined
        ? typeof dto.price === 'string'
          ? parseFloat(dto.price.replace(/[^0-9.]/g, '')) || 100
          : Number(dto.price) || 100
        : undefined;

    try {
      if (this.prisma && (this.prisma as any).tourPackage) {
        const updateData: any = {};
        if (dto.title) updateData.title = dto.title;
        if (dto.slug) updateData.slug = dto.slug;
        if (dto.destination) updateData.destination = dto.destination;
        if (rawPrice !== undefined) updateData.price = rawPrice;
        if (dto.currency) updateData.currency = dto.currency;
        if (dto.duration) updateData.duration = dto.duration;
        if (dto.badge) updateData.badge = dto.badge;
        if (dto.image) updateData.image_url = dto.image;
        if (dto.overview) updateData.overview = dto.overview;
        if (dto.includes) updateData.includes = dto.includes;
        if (dto.highlights) updateData.highlights = dto.highlights;
        if (dto.isFeatured !== undefined) updateData.is_featured = dto.isFeatured;

        const updated = await (this.prisma as any).tourPackage.update({
          where: { id },
          data: updateData,
        });

        return {
          id: updated.id,
          name: updated.title,
          slug: updated.slug,
          destination: updated.destination,
          price: `$${Number(updated.price).toLocaleString()}`,
          rawPrice: Number(updated.price),
          currency: updated.currency,
          duration: updated.duration,
          badge: updated.badge,
          image: updated.image_url,
          copy: updated.overview,
          includes: updated.includes,
          highlights: updated.highlights,
          isFeatured: updated.is_featured,
          isDellicsSignature: true,
          viatorUrl: `https://www.viator.com/search/${encodeURIComponent(updated.destination)}?sortType=featured`,
          status: 'PUBLISHED',
        };
      }
    } catch (err: any) {
      this.logger.warn(`Tour update error: ${err.message}`);
    }

    const idx = CATALOG_TOURS.findIndex((t) => t.id === id || t.slug === id);
    if (idx !== -1) {
      CATALOG_TOURS[idx] = {
        ...CATALOG_TOURS[idx],
        ...(dto.title ? { name: dto.title } : {}),
        ...(dto.destination ? { destination: dto.destination } : {}),
        ...(rawPrice !== undefined ? { rawPrice, price: `$${rawPrice.toLocaleString()}` } : {}),
        ...(dto.duration ? { duration: dto.duration } : {}),
        ...(dto.badge ? { badge: dto.badge } : {}),
        ...(dto.image ? { image: dto.image } : {}),
        ...(dto.overview ? { copy: dto.overview } : {}),
      };
      return CATALOG_TOURS[idx];
    }

    throw new NotFoundException(`Tour package '${id}' not found.`);
  }

  /**
   * Delete tour package
   */
  async deleteTour(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (this.prisma && (this.prisma as any).tourPackage) {
        await (this.prisma as any).tourPackage.delete({
          where: { id },
        });
        return { success: true, message: `Tour package ${id} deleted successfully.` };
      }
    } catch (err: any) {
      this.logger.warn(`Tour delete DB error: ${err.message}`);
    }

    const idx = CATALOG_TOURS.findIndex((t) => t.id === id || t.slug === id);
    if (idx !== -1) {
      CATALOG_TOURS.splice(idx, 1);
      return { success: true, message: `Tour package ${id} removed from catalog.` };
    }

    throw new NotFoundException(`Tour package '${id}' not found.`);
  }
}
