import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Pressable, Animated, useWindowDimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Plane, Compass, Award } from 'lucide-react-native';
import { HomeSkeleton } from '../src/components/Skeleton';

const SLIDES = [
  {
    id: '1',
    title: 'Everything in\none place',
    description: 'Book flights, hotels, and cars without jumping between apps.',
    icon: Plane,
    color: '#0A0060',
    bg: '#EAF0FA',
  },
  {
    id: '2',
    title: 'Catch the\ncheapest days',
    description: 'Track prices across the whole month and never miss a drop.',
    icon: Compass,
    color: '#F4740D',
    bg: '#FFF3E8',
  },
  {
    id: '3',
    title: 'Earn rewards\ninstantly',
    description: 'Every trip earns you points towards your next getaway with Dellics.',
    icon: Award,
    color: '#1E7A34',
    bg: '#EAF4EC',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const safeWidth = Math.max(width, 1);
  const [isChecking, setIsChecking] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const listener = scrollX.addListener(({ value }) => {
      setCurrentIndex(Math.round(value / safeWidth));
    });
    return () => scrollX.removeListener(listener);
  }, [scrollX, safeWidth]);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('@has_seen_onboarding');
        if (hasSeen === 'true') {
          router.replace('/(tabs)');
        } else {
          setIsChecking(false);
        }
      } catch (e) {
        setIsChecking(false);
      }
    };
    checkOnboarding();
  }, [router]);

  const finishOnboarding = async (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      await AsyncStorage.setItem('@has_seen_onboarding', 'true');
    } catch (e) {}
    router.replace(path as any);
  };

  const nextSlide = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scrollViewRef.current?.scrollTo({ x: safeWidth * index, animated: true });
  };

  if (isChecking) {
    return <HomeSkeleton />;
  }

  const backgroundColor = scrollX.interpolate({
    inputRange: SLIDES.map((_, i) => i * safeWidth),
    outputRange: SLIDES.map(s => s.bg),
    extrapolate: 'clamp',
  });

  const activeColor = scrollX.interpolate({
    inputRange: SLIDES.map((_, i) => i * safeWidth),
    outputRange: SLIDES.map(s => s.color),
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.root, { backgroundColor }]}>
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>

        {/* ROW 1: Skip button — sits OUTSIDE the ScrollView so it always receives taps */}
        <View style={styles.skipRow}>
          <Pressable onPress={() => finishOnboarding('/(tabs)')} hitSlop={12} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* ROW 2: Horizontal pager — takes remaining vertical space */}
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.root}
          contentContainerStyle={styles.scrollContent}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
        >
          {SLIDES.map((slide, index) => {
            const inputRange = [(index - 1) * safeWidth, index * safeWidth, (index + 1) * safeWidth];

            const scale = scrollX.interpolate({
              inputRange,
              outputRange: [0.5, 1, 0.5],
              extrapolate: 'clamp',
            });

            const iconTranslateY = scrollX.interpolate({
              inputRange,
              outputRange: [60, 0, 60],
              extrapolate: 'clamp',
            });

            const textOpacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            });

            const SlideIcon = slide.icon;

            return (
              <View key={slide.id} style={[styles.slide, { width: safeWidth }]}>
                <Animated.View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: slide.color,
                      transform: [{ scale }, { translateY: iconTranslateY }],
                    },
                  ]}
                >
                  <SlideIcon size={100} color="white" />
                </Animated.View>

                <Animated.View style={[styles.textBlock, { opacity: textOpacity, transform: [{ translateY: iconTranslateY }] }]}>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideDesc}>{slide.description}</Text>
                </Animated.View>
              </View>
            );
          })}
        </Animated.ScrollView>

        {/* ROW 3: Footer — sits OUTSIDE the ScrollView so buttons always receive taps */}
        <View style={styles.footer}>
          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, i) => {
              const dotW = scrollX.interpolate({
                inputRange: [(i - 1) * safeWidth, i * safeWidth, (i + 1) * safeWidth],
                outputRange: [8, 32, 8],
                extrapolate: 'clamp',
              });
              const dotOp = scrollX.interpolate({
                inputRange: [(i - 1) * safeWidth, i * safeWidth, (i + 1) * safeWidth],
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return (
                <Animated.View
                  key={i}
                  style={{
                    width: dotW,
                    opacity: dotOp,
                    height: 8,
                    backgroundColor: activeColor,
                    borderRadius: 999,
                    marginHorizontal: 4,
                  }}
                />
              );
            })}
          </View>

          {/* Action Buttons */}
          {currentIndex === SLIDES.length - 1 ? (
            <View style={styles.ctaColumn}>
              <Pressable
                onPress={() => finishOnboarding('/auth/login?mode=SIGNUP')}
                style={styles.primaryCta}
                hitSlop={8}
              >
                <Text style={styles.primaryCtaText}>Get Started</Text>
              </Pressable>
              <Pressable
                onPress={() => finishOnboarding('/auth/login?mode=LOGIN')}
                style={styles.secondaryCta}
                hitSlop={8}
              >
                <Text style={styles.secondaryCtaText}>Log In</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.nextRow}>
              <Pressable onPress={() => nextSlide(currentIndex + 1)} hitSlop={8}>
                <Animated.View style={[styles.nextButton, { backgroundColor: activeColor }]}>
                  <Text style={styles.nextButtonText}>Next</Text>
                </Animated.View>
              </Pressable>
            </View>
          )}
        </View>

      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skipRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: '#6B7280',
    fontWeight: '700',
    fontSize: 17,
  },
  scrollContent: {
    alignItems: 'center',
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconCircle: {
    width: 224,
    height: 224,
    borderRadius: 112,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.8)',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
  },
  textBlock: {
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
    lineHeight: 42,
  },
  slideDesc: {
    fontSize: 18,
    textAlign: 'center',
    color: '#6B7280',
    lineHeight: 28,
    fontWeight: '500',
    paddingHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  ctaColumn: {
    alignItems: 'center',
    width: '100%',
  },
  primaryCta: {
    backgroundColor: '#0A0060',
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    elevation: 4,
    shadowColor: '#0A0060',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
  secondaryCta: {
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  secondaryCtaText: {
    color: '#0A0060',
    fontWeight: '700',
    fontSize: 16,
  },
  nextRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  nextButton: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 999,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 18,
  },
});

