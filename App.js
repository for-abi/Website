import React from 'react';
import { WebView } from 'react-native-webview';

export default function App() {
  return <WebView source={{uri:'https://your-website.com'}} style={{marginTop:50}}/>;
}
