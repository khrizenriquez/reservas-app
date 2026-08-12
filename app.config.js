export default {
  expo: {
    name: "Reservas UMG",
    slug: "reservas-app",
    version: "0.1.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "reservas-umg",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.khrizenriquez.reservas",
    },
    android: {
      package: "com.khrizenriquez.reservas",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#17355F",
      },
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#17355F",
          image: "./assets/splash-icon.png",
          imageWidth: 120,
        },
      ],
      [
        "expo-secure-store",
        {
          configureAndroidBackup: true,
          faceIDPermission: "Permite a Reservas UMG proteger tu sesión.",
        },
      ],
    ],
    experiments: {
      typedRoutes: false,
    },
  },
};
