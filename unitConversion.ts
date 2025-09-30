

export type UnitSystem = 'european' | 'american';


import type { Language } from './translations';


export const convertWeight = (value: number, from: UnitSystem, to: UnitSystem): number => {
  if (from === to) return value;

  if (from === 'european' && to === 'american') {
    
    return value * 2.20462;
  } else {
    
    return value / 2.20462;
  }
};


export const convertHeight = (value: number, from: UnitSystem, to: UnitSystem): number => {
  if (from === to) return value;

  if (from === 'european' && to === 'american') {
    
    return value / 2.54;
  } else {
    
    return value * 2.54;
  }
};


export const formatWeight = (value: number, unitSystem: UnitSystem): string => {
  const roundedValue = Math.round(value);
  return unitSystem === 'european' ? `${roundedValue}kg` : `${roundedValue}lbs`;
};


export const formatHeight = (value: number, unitSystem: UnitSystem): string => {
  if (unitSystem === 'european') {
    const roundedValue = Math.round(value);
    return `${roundedValue}cm`;
  } else {
    
    const totalInches = Math.round(value);
    const feet = Math.floor(totalInches / 12);
    const inches = totalInches % 12;
    return `${feet}'${inches}"`;
  }
};


export const parseWeight = (weightString: string): number => {
  return parseFloat(weightString.replace(/[^0-9.]/g, ''));
};


export const parseHeight = (heightString: string): number => {
  
  if (heightString.includes("'")) {
    
    const parts = heightString.split("'");
    const feet = parseInt(parts[0]);
    const inches = parseInt(parts[1].replace('"', ''));
    return feet * 12 + inches;
  } else {
    
    return parseFloat(heightString.replace(/[^0-9.]/g, ''));
  }
};


export const convertSugar = (value: number, from: UnitSystem, to: UnitSystem): number => {
  if (from === to) return value;

  if (from === 'european' && to === 'american') {
    
    return value / 28.3495;
  } else {
    
    return value * 28.3495;
  }
};


export const formatSugar = (value: number, unitSystem: UnitSystem): string => {
  if (unitSystem === 'european') {
    return `${Math.round(value)}g`;
  } else {
    
    const ozValue = value / 28.3495;
    return ozValue < 1 ? `${ozValue.toFixed(1)}oz` : `${Math.round(ozValue)}oz`;
  }
};


export const getSugarUnit = (unitSystem: UnitSystem, language: Language = 'English'): string => {
  if (unitSystem === 'european') {
    return language === 'Russian' ? 'г' : 'g';
  } else {
    return 'oz';
  }
};


export const getSugarDisplayValue = (gramValue: number, unitSystem: UnitSystem): number => {
  if (unitSystem === 'european') {
    return Math.round(gramValue * 100) / 100;
  } else {

    const ozValue = gramValue / 28.3495;
    return Math.round(ozValue * 10) / 10;
  }
};