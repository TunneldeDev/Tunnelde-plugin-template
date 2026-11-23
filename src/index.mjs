import { createPlugin } from '@tunnelde/plugin-sdk/tunnelde-plugin.mjs';
createPlugin({
 render(){return {title:'Example Plugin',blocks:[{type:'text',text:'Hello from your independent plugin.'}]};},
 run(command){if(command!=='hello')throw new Error('Unknown command');return {text:'Hello, Tunnelde!'};}
});
