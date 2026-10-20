const fs = require('fs');

const file = 'C:\\Users\\Dell\\Desktop\\PROjects\\Dellics Travels\\apps\\admin\\src\\app\\(dashboard)\\content\\[id]\\page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('ImageUploader')) {
  content = content.replace(
    /import \{ Plus, Trash2, Save, GripVertical, Check, X, ArrowLeft \} from "lucide-react";/,
    'import { Plus, Trash2, Save, GripVertical, Check, X, ArrowLeft } from "lucide-react";\nimport { ImageUploader } from "@/components/image-uploader";'
  );
}

const targetBlock = `                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Image Path / CDN URL
                </label>
                <input
                  type="text"
                  value={heroImage}
                  onChange={(e) => setHeroImage(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono text-[11px]"
                  placeholder="/images/packages/cape-coast.jpg"
                />`;

const replacementBlock = `                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hero Image
                </label>
                <ImageUploader 
                  value={heroImage} 
                  onChange={setHeroImage} 
                />`;

content = content.replace(targetBlock, replacementBlock);
fs.writeFileSync(file, content, 'utf8');
console.log("Replaced successfully");
