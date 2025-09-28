import { ViewerApp } from './app/viewerApp';

const appElement = document.getElementById('app');

if (appElement) {
  const app = new ViewerApp(appElement, document);
  app.init().then(() => {
    app.start();
    console.log('ViewerApp initialized and started.');
  }).catch(err => {
    console.error('Failed to initialize ViewerApp', err);
  });

  // Make the app instance available for debugging in the console
  (window as any).fto_viewer = app;
} else {
  console.error('Mount element #app not found.');
}