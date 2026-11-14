import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DEFAULT_CATALOG_SCHOOLS } from './default-catalog';
import { CreateCatalogSchoolDto } from './dto/create-school.dto';

@Injectable()
export class CatalogService {
  private readonly logger = new Logger(CatalogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSchools(country?: string) {
    const where: any = {};
    if (country && country !== 'all') {
      where.country = { equals: country, mode: 'insensitive' };
    }

    const schools = await this.prisma.catalogSchool.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    // Fallback to DEFAULT_CATALOG_SCHOOLS if DB table is empty
    if (schools.length === 0) {
      this.logger.log('Catalog table is empty; returning DEFAULT_CATALOG_SCHOOLS fallback.');
      let filtered = DEFAULT_CATALOG_SCHOOLS;
      if (country && country !== 'all') {
        filtered = filtered.filter(
          (s) => s.country.toLowerCase() === country.toLowerCase()
        );
      }
      return { success: true, data: filtered, source: 'default_fallback' };
    }

    return { success: true, data: schools, source: 'database' };
  }

  async createSchool(dto: CreateCatalogSchoolDto) {
    const school = await this.prisma.catalogSchool.create({
      data: {
        name: dto.name,
        country: dto.country,
        flag: dto.flag || '🎓',
        programs_count: dto.programs_count || 10,
        tuition: dto.tuition || 'Contact for Fees',
        popular_programs: dto.popular_programs || [],
      },
    });

    return { success: true, data: school };
  }

  async deleteSchool(id: string) {
    const existing = await this.prisma.catalogSchool.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Catalog school not found.');
    }

    await this.prisma.catalogSchool.delete({ where: { id } });
    return { success: true, message: `School ${existing.name} removed from catalog.` };
  }
}
