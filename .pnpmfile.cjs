function readPackage(pkg, context) {
  if (pkg.dependencies) {
    if (pkg.dependencies['flatted']) pkg.dependencies['flatted'] = '^3.4.4';
    if (pkg.dependencies['minimatch']) pkg.dependencies['minimatch'] = '^9.0.5';
    if (pkg.dependencies['image-size']) pkg.dependencies['image-size'] = '^1.2.1';
    if (pkg.dependencies['@xmldom/xmldom']) pkg.dependencies['@xmldom/xmldom'] = '^0.9.12';
    if (pkg.dependencies['deepmerge-ts']) pkg.dependencies['deepmerge-ts'] = '^8.0.2';
    if (pkg.dependencies['nanoid']) pkg.dependencies['nanoid'] = '^5.1.3';
    if (pkg.dependencies['brace-expansion']) pkg.dependencies['brace-expansion'] = '^2.0.2';
    if (pkg.dependencies['postcss']) pkg.dependencies['postcss'] = '^8.5.28';
    if (pkg.dependencies['js-yaml']) pkg.dependencies['js-yaml'] = '^4.1.1';
    if (pkg.dependencies['picomatch']) pkg.dependencies['picomatch'] = '^4.0.7';
    if (pkg.dependencies['fast-uri']) pkg.dependencies['fast-uri'] = '^4.1.5';
    if (pkg.dependencies['decode-uri-component']) pkg.dependencies['decode-uri-component'] = '^0.5.0';
    if (pkg.dependencies['multer']) pkg.dependencies['multer'] = '^2.3.0';
    if (pkg.dependencies['uuid']) pkg.dependencies['uuid'] = '^14.0.1';
    if (pkg.dependencies['qs']) pkg.dependencies['qs'] = '^6.16.0';
    if (pkg.dependencies['@humanfs/node']) pkg.dependencies['@humanfs/node'] = '^0.16.8';
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
