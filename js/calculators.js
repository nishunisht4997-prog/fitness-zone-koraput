/**
 * Hardcore Beast Fitness Calculators
 * 1. Live BMI & Body Composition Meter
 * 2. Beast Daily Calorie & Protein Macro Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. BMI CALCULATOR LOGIC
    // ----------------------------------------------------
    const bmiForm = document.getElementById('bmi-form');
    const heightInput = document.getElementById('bmi-height');
    const weightInput = document.getElementById('bmi-weight');
    const ageInput = document.getElementById('bmi-age');
    const genderSelect = document.getElementById('bmi-gender');
    
    const bmiValueEl = document.getElementById('bmi-value');
    const bmiStatusEl = document.getElementById('bmi-status');
    const bmiAdviceEl = document.getElementById('bmi-advice');
    const bmiNeedleEl = document.getElementById('bmi-gauge-needle');

    function calculateBMI() {
        if (!heightInput || !weightInput) return;

        const heightCm = parseFloat(heightInput.value);
        const weightKg = parseFloat(weightInput.value);

        if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
            return;
        }

        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);

        if (bmiValueEl) {
            bmiValueEl.innerText = bmi;
        }

        let status = '';
        let color = '#ff1e38';
        let advice = '';
        let needleAngle = -90; // -90deg (left) to 90deg (right)

        if (bmi < 18.5) {
            status = 'UNDERWEIGHT (HARDCORE BULK NEEDED)';
            color = '#38bdf8';
            advice = 'High-calorie surplus, heavy compound lifts (Squat, Deadlift, Bench), and 2.2g protein per kg.';
            needleAngle = -70;
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            status = 'OPTIMAL ATHLETIC MASS';
            color = '#10b981';
            advice = 'Ideal beast zone! Focus on progressive overload, lean muscle hypertrophy, and conditioning.';
            needleAngle = -20;
        } else if (bmi >= 25 && bmi <= 29.9) {
            status = 'OVERWEIGHT / POWERLIFTER ZONE';
            color = '#f59e0b';
            advice = 'Begin a moderate deficit (-400 kcal) with high-intensity interval training (HIIT) & heavy lifting.';
            needleAngle = 35;
        } else {
            status = 'HIGH FAT MASS (TRANSFORMATION PHASE)';
            color = '#ff1e38';
            advice = 'Structured calorie deficit, daily cardio circuit, strength endurance, and elite coach guidance.';
            needleAngle = 80;
        }

        if (bmiStatusEl) {
            bmiStatusEl.innerText = status;
            bmiStatusEl.style.color = color;
        }

        if (bmiAdviceEl) {
            bmiAdviceEl.innerText = advice;
        }

        if (bmiNeedleEl) {
            bmiNeedleEl.style.transform = `rotate(${needleAngle}deg)`;
        }
    }

    if (bmiForm) {
        bmiForm.addEventListener('input', calculateBMI);
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            calculateBMI();
        });
        // Initial run
        calculateBMI();
    }

    // ----------------------------------------------------
    // 2. MACRO & CALORIE ENGINE
    // ----------------------------------------------------
    const macroWeight = document.getElementById('macro-weight');
    const macroHeight = document.getElementById('macro-height');
    const macroAge = document.getElementById('macro-age');
    const macroActivity = document.getElementById('macro-activity');
    const macroGoal = document.getElementById('macro-goal');

    const calResultEl = document.getElementById('macro-calories');
    const proteinResultEl = document.getElementById('macro-protein');
    const carbsResultEl = document.getElementById('macro-carbs');
    const fatsResultEl = document.getElementById('macro-fats');

    function calculateMacros() {
        if (!macroWeight || !macroHeight || !macroAge || !calResultEl) return;

        const weight = parseFloat(macroWeight.value) || 75;
        const height = parseFloat(macroHeight.value) || 175;
        const age = parseFloat(macroAge.value) || 24;
        const activity = parseFloat(macroActivity ? macroActivity.value : 1.55) || 1.55;
        const goal = macroGoal ? macroGoal.value : 'bulk';

        // Mifflin-St Jeor Formula (Approx Male baseline)
        let bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        let tdee = bmr * activity;

        let targetCalories = tdee;
        let proteinPerKg = 2.0;

        if (goal === 'bulk') {
            targetCalories += 500; // Muscle mass building surplus
            proteinPerKg = 2.2;
        } else if (goal === 'cut') {
            targetCalories -= 450; // Fat shredded deficit
            proteinPerKg = 2.4;
        } else if (goal === 'strength') {
            targetCalories += 250; // Clean strength power recomp
            proteinPerKg = 2.0;
        }

        const proteinGrams = Math.round(weight * proteinPerKg);
        const fatCalories = targetCalories * 0.25;
        const fatGrams = Math.round(fatCalories / 9);
        const remainingCals = targetCalories - (proteinGrams * 4) - fatCalories;
        const carbGrams = Math.max(0, Math.round(remainingCals / 4));

        calResultEl.innerText = Math.round(targetCalories) + ' kcal';
        if (proteinResultEl) proteinResultEl.innerText = proteinGrams + 'g';
        if (carbsResultEl) carbsResultEl.innerText = carbGrams + 'g';
        if (fatsResultEl) fatsResultEl.innerText = fatGrams + 'g';
    }

    const macroContainer = document.getElementById('macro-form');
    if (macroContainer) {
        macroContainer.addEventListener('input', calculateMacros);
        calculateMacros();
    }
});
