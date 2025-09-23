export default {
  server: {
    open: true,
    fs: {
      allow: ['..', '../../../pkg'],
    },
  },
  resolve: {
    alias: {
      '@renderer': '/Users/goseungmin/Desktop/WorkSpace/FTO/packages/engine/demo/packages/renderer3d/src',
      'three': '/Users/goseungmin/Desktop/WorkSpace/FTO/packages/engine/demo/apps/3d-demo/node_modules/three',
    },
  },
};
