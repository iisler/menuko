import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import Head from 'expo-router/head';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import AppTabs from '@/components/app-tabs';
import { Colors } from '@/constants/theme';
import { hydrate } from '@/store/app-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const [ready, setReady] = useState(false);

  // Kayıtlı plan yüklenene kadar açılış ekranı kalır; böylece rastgele plan bir an görünüp değişmez.
  useEffect(() => {
    hydrate().finally(() => {
      setReady(true);
      SplashScreen.hideAsync();
    });
  }, []);

  // Web'de sayfa başlığı, kurulabilir uygulama (PWA) bilgisi ve ikonlar. Native'de etkisizdir.
  // Yollar app.json > experiments.baseUrl ('/menuko') ile aynı olmalı.
  const head = (
    <Head>
      <title>Menuko · Haftalık yemek planı</title>
      <meta name="description" content="Haftalık yemek planı ve alışveriş listesi" />
      <meta name="theme-color" content="#C8481F" />
      <link rel="manifest" href="/menuko/manifest.json" />
      <link rel="apple-touch-icon" href="/menuko/apple-touch-icon.png" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="Menuko" />
    </Head>
  );

  if (!ready) return head;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.tint,
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <ThemeProvider value={theme}>
      {head}
      <StatusBar style="auto" />
      <AppTabs />
    </ThemeProvider>
  );
}
