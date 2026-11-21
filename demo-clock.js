// Applies only inside the generated public synthetic iframe, never the Agent/Viewer host.
(()=>{const Native=Date,clock=Native.parse(parent.FactoryLitePreviewClock());if(!Number.isFinite(clock))throw new Error('Invalid demo clock');window.Date=class extends Native{constructor(...args){super(...(args.length?args:[clock]));}static now(){return clock;}};})();
