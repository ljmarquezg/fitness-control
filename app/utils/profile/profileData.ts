export const calculateBMI = (weightKg: number, heightCm: number, sex: 'male' | 'female') => {
  const heightM = heightCm / 100;
  let bmi = weightKg / (heightM * heightM);

  if (sex === 'female') {
    bmi *= 0.97;
  } else {
    bmi *= 1.03;
  }

  return Number(bmi.toFixed(2));
};

export const getSexIcon = (sex) => {
  switch (sex) {
  case 'male':
    return 'i-lucide-mars';
  case 'female':
    return 'i-lucide-venus';
  default:
    return 'i-lucide-genderless';
  }
}