import { test } from 'node:test';import assert from 'node:assert/strict';import { spawnSync } from 'node:child_process';import {resolve} from 'node:path';
test('packaged stdio initializes and handles its declared command',()=>{
 const lines=[{id:1,method:'initialize',params:{apiVersion:1}},{id:2,method:'command.run',params:{command:'hello'}}];
 const child=spawnSync(process.execPath,[resolve('dist/index.mjs')],{cwd:'/tmp',encoding:'utf8',input:lines.map(x=>JSON.stringify({jsonrpc:'2.0',...x})).join('\n')+'\n',timeout:5000});assert.equal(child.status,0,child.stderr);const rows=child.stdout.trim().split('\n').map(JSON.parse);assert.equal(rows[0].result.ok,true);assert.equal(rows[1].result.text,'Hello, Tunnelde!');
});
