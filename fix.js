const fs = require('fs');
const content = fs.readFileSync('apps/web/app/api/hotels/search/route.ts', 'utf8');
const modified = content.replace(
  /    return NextResponse\.json\(\[\]\);\r?\n  \} catch \(error: any\) \{/,
  '    return NextResponse.json({ debug: true, rawHotelsLength: rawHotels?.length, serpRes, multi, isSandbox, regionId, url: RATEHAWK_BASE_URL });\n  } catch (error: any) {'
);
fs.writeFileSync('apps/web/app/api/hotels/search/route.ts', modified);
