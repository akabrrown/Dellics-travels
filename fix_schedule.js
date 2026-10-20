const fs = require('fs');

// 1. Remove ScheduleModule from hotel-dump.module.ts
const modulePath = 'apps/api/src/hotel-dump/hotel-dump.module.ts';
if (fs.existsSync(modulePath)) {
  let content = fs.readFileSync(modulePath, 'utf8');
  content = content.replace("import { ScheduleModule } from '@nestjs/schedule';\n", '');
  content = content.replace("imports: [ScheduleModule.forRoot(), PrismaModule]", "imports: [PrismaModule]");
  fs.writeFileSync(modulePath, content);
  console.log('Updated hotel-dump.module.ts');
}

// 2. Remove @Cron from hotel-dump.service.ts
const servicePath = 'apps/api/src/hotel-dump/hotel-dump.service.ts';
if (fs.existsSync(servicePath)) {
  let content = fs.readFileSync(servicePath, 'utf8');
  content = content.replace("import { Cron } from '@nestjs/schedule';\n", '');
  
  // Remove the @Cron decorators and their methods since they can't run on Vercel anyway.
  // The service methods `scheduledFullDump` and `scheduledIncrementalDump` can be removed.
  content = content.replace(/\/\*\* Weekly full dump[\s\S]*?async scheduledIncrementalDump\(\): Promise<void> \{\s*this\.logger\.log\('Cron: triggering daily incremental hotel dump'\);\s*await this\.syncDump\('incremental'\);\s*\}/, '');

  fs.writeFileSync(servicePath, content);
  console.log('Updated hotel-dump.service.ts');
}

// 3. Remove @nestjs/schedule from package.json
const pkgPath = 'apps/api/package.json';
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  delete pkg.dependencies['@nestjs/schedule'];
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('Removed @nestjs/schedule from package.json');
}

