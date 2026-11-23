import assert from 'node:assert/strict';
import { readFile,writeFile } from 'node:fs/promises';
const [id,name,owner,repository,author=owner]=process.argv.slice(2);
assert.match(id??'',/^[a-z0-9][a-z0-9_-]{0,63}$/,'Usage: npm run init -- my-plugin "My Plugin" owner repository [author]');
assert.ok(name?.trim()&&!/[\r\n]/.test(name));
for(const value of [owner,repository])assert.match(value??'',/^[A-Za-z0-9_.-]+$/);
assert.ok(author?.trim()&&!/[\r\n]/.test(author));
const manifest=JSON.parse(await readFile('tunnelde-plugin.json','utf8'));assert.equal(manifest.id,'example-plugin','Template already initialized');
manifest.id=id;manifest.name=name;manifest.author=author;manifest.views[0].title=name;
const pkg=JSON.parse(await readFile('package.json','utf8'));pkg.name=`tunnelde-plugin-${id}`;pkg.repository=`https://github.com/${owner}/${repository}`;
const files=new Map();files.set('tunnelde-plugin.json',JSON.stringify(manifest,null,2)+'\n');files.set('package.json',JSON.stringify(pkg,null,2)+'\n');
for(const file of ['README.md','README.en-us.md','README.zh-cn.md'])files.set(file,(await readFile(file,'utf8')).replaceAll('YOUR_OWNER',owner).replaceAll('YOUR_REPOSITORY',repository).replaceAll('YOUR_NAME',author).replaceAll('example-plugin',id).replaceAll('Example Plugin',name));
files.set('src/index.mjs',(await readFile('src/index.mjs','utf8')).replace("'Example Plugin'",JSON.stringify(name)));
for(const [file,text] of files)assert.ok(!/YOUR_OWNER|YOUR_REPOSITORY|YOUR_NAME|example-plugin|Example Plugin/.test(text),`Remaining placeholder in ${file}`);
try {const lock=JSON.parse(await readFile('package-lock.json','utf8'));lock.name=pkg.name;lock.packages[''].name=pkg.name;files.set('package-lock.json',JSON.stringify(lock,null,2)+'\n');}catch(error){if(error.code!=='ENOENT')throw error;}
for(const [file,text] of files)await writeFile(file,text);
console.log(`Initialized ${id}. Review permissions and README before publishing.`);
