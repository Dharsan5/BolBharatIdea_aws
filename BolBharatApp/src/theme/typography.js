import { fontFamilies } from './fonts';

// Typography system
export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  
  // Font families (ClashDisplay)
  fontFamily: {
    extraLight: fontFamilies.extraLight,
    light: fontFamilies.light,
    regular: fontFamilies.regular,
    medium: fontFamilies.medium,
    semiBold: fontFamilies.semiBold,
    bold: fontFamilies.bold,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Text styles with ClashDisplay fonts
  h1: {
    fontFamily: fontFamilies.bold,
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  h4: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 18,
    lineHeight: 24,
  },
  body1: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontFamily: fontFamilies.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: fontFamilies.light,
    fontSize: 12,
    lineHeight: 16,
  },
  button: {
    fontFamily: fontFamilies.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  subtitle: {
    fontFamily: fontFamilies.medium,
    fontSize: 16,
    lineHeight: 24,
  },
};
