// HomeScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/assets/types/navigation';
import { LinearGradient } from 'expo-linear-gradient';
import { registerRootComponent } from 'expo';
import App from './App'
const images = [
  require('@/assets/images/1.jpg'),
  require('@/assets/images/2.jpg'),
  require('@/assets/images/3.jpg'),
  require('@/assets/images/4.jpg'),
  require('@/assets/images/5.jpg'),
  require('@/assets/images/6.jpg'),
  require('@/assets/images/7.jpg'),
  require('@/assets/images/8.jpg'),
  require('@/assets/images/9.jpg'),
  require('@/assets/images/blogo.png')
];

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageGridContainer}>
        <View style={styles.imageGrid}>
          <View style={styles.column}>
            {images.slice(0, 3).map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={image}
                  style={[styles.gridImage, { opacity: 1 - index * 0.1 }]}
                />
                {index === 2 && (
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,1)']}
                    style={styles.gradient}
                  />
                )}
              </View>
            ))}
          </View>
          <View style={[styles.column, styles.middleColumn]}>
            {images.slice(3, 6).map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={image}
                  style={[styles.gridImage, { opacity: 1 - index * 0.1 }]}
                />
                {index === 2 && (
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,1)']}
                    style={styles.gradient}
                  />
                )}
              </View>
            ))}
          </View>
          <View style={styles.column}>
            {images.slice(6, 9).map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image
                  source={image}
                  style={[styles.gridImage, { opacity: 1 - index * 0.1 }]}
                />
                {index === 2 && (
                  <LinearGradient
                    colors={['transparent', 'rgba(255,255,255,1)']}
                    style={styles.gradient}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={styles.logoContainer}>
        <Image source={require('@/assets/images/blogo.png')} style={styles.logo} />
      </View>
      <Text style={styles.title}>We welcome you to kombinle</Text>
      <Text style={styles.information}>Discover endless outfit possibilities with Kombinle, tailored to your style and wardrobe.</Text>
      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('CreateAccount')}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      <Text style={styles.termsText}>
        By continuing, you agree to the <Text style={styles.linkText}>Terms of Service</Text> and confirm that you have read our <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  information: {
    fontSize: 12,
    fontWeight: 'light',
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 50
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  imageGridContainer: {
    width: '100%',
    overflow: 'hidden',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  imageWrapper: {
    position: 'relative',
  },
  gridImage: {
    width: 110, // 15% bigger than the middle image
    height: 160,
    margin: 5,
    borderRadius: 10,
  },
  middleColumn: {
    marginTop: -50, // Offset the middle column vertically
  },
  middleImage: {
    width: 105, // Middle image is smaller
    height: 190,
  },
  logoContainer: {
    position: 'absolute',
    top: '55%', // Adjust this value to move the logo up or down
    zIndex: 1,
    alignSelf: 'center',
  },
  logo: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: '#1EABF8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#ccc',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    width: '80%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  companyText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  linkText: {
    color: '#1EABF8',
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginTop: 40,
  },
});

export default HomeScreen;
registerRootComponent(App);