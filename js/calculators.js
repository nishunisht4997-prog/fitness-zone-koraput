/**
 * FITNESS ZONE KORAPUT - Luxury Biometric & Fitness Calculators
 * 1. Live BMI & Advanced Body Composition Meter (Body Fat %, Ideal Weight, Water)
 * 2. Beast Daily Calorie & Protein Macro Fuel Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. LIVE BMI & DETAILED BODY COMPOSITION CALCULATOR
    // =========================================================================
    const bmiForm = document.getElementById('bmi-form');
    const heightInput = document.getElementById('bmi-height');
    const weightInput = document.getElementById('bmi-weight');
    const ageInput = document.getElementById('bmi-age');
    const genderSelect = document.getElementById('bmi-gender');
    const bmiCalcBtn = document.getElementById('bmi-calc-btn');

    const bmiValueEl = document.getElementById('bmi-value');
    const bmiStatusEl = document.getElementById('bmi-status');
    const bmiAdviceEl = document.getElementById('bmi-advice');
    const bmiNeedleEl = document.getElementById('bmi-gauge-needle');
    const bmiBodyFatEl = document.getElementById('bmi-bodyfat');
    const bmiIdealWeightEl = document.getElementById('bmi-ideal-weight');
    const bmiWaterEl = document.getElementById('bmi-water');

    function calculateBMI() {
        if (!heightInput || !weightInput) return;

        const heightCm = parseFloat(heightInput.value) || 175;
        const weightKg = parseFloat(weightInput.value) || 75;
        const age = parseFloat(ageInput ? ageInput.value : 24) || 24;
        const gender = genderSelect ? genderSelect.value : 'male';

        if (heightCm <= 0 || weightKg <= 0) return;

        const heightM = heightCm / 100;
        const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

        // 1. Update BMI Number
        if (bmiValueEl) {
            bmiValueEl.innerText = bmi.toFixed(1);
        }

        // 2. Determine Category, Color, Advice & Needle Rotation
        let status = '';
        let color = '#10b981';
        let advice = '';

        if (bmi < 18.5) {
            status = 'UNDERWEIGHT • LEAN BULK PHASE';
            color = '#38bdf8';
            advice = 'High-calorie surplus (+500 kcal), heavy compound lifts (Squat, Deadlift, Bench Press) & 2.2g protein per kg.';
        } else if (bmi >= 18.5 && bmi <= 24.9) {
            status = 'OPTIMAL ATHLETIC MASS';
            color = '#10b981';
            advice = 'Ideal beast zone! Focus on progressive overload, lean muscle hypertrophy, and conditioning.';
        } else if (bmi >= 25.0 && bmi <= 29.9) {
            status = 'OVERWEIGHT • POWER RECOMP PHASE';
            color = '#f59e0b';
            advice = 'Begin a moderate deficit (-400 kcal) with high-intensity HIIT circuits & heavy strength training.';
        } else {
            status = 'HIGH FAT MASS • SHRED PHASE';
            color = '#ff334b';
            advice = 'Structured calorie deficit, daily cardio circuit, strength endurance, and coach-guided macro planning.';
        }

        if (bmiStatusEl) {
            bmiStatusEl.innerText = status;
            bmiStatusEl.style.color = color;
        }

        if (bmiAdviceEl) {
            bmiAdviceEl.innerText = advice;
        }

        // 3. Smooth Dynamic Gauge Needle (-80deg for BMI 15 to +80deg for BMI 38)
        if (bmiNeedleEl) {
            const minBmi = 15;
            const maxBmi = 38;
            const clampedBmi = Math.min(maxBmi, Math.max(minBmi, bmi));
            const angle = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 160 - 80;
            bmiNeedleEl.style.transform = `rotate(${angle.toFixed(1)}deg)`;
        }

        // 4. Clinical Body Fat % (Deurenberg Formula)
        if (bmiBodyFatEl) {
            const genderFactor = (gender === 'female') ? 0 : 1;
            let bodyFat = (1.20 * bmi) + (0.23 * age) - (10.8 * genderFactor) - 5.4;
            bodyFat = Math.max(5, Math.min(50, bodyFat));
            bmiBodyFatEl.innerText = `~ ${bodyFat.toFixed(1)}%`;
        }

        // 5. Ideal Body Weight Range (BMI 18.5 - 24.9)
        if (bmiIdealWeightEl) {
            const minWeight = Math.round(18.5 * heightM * heightM);
            const maxWeight = Math.round(24.9 * heightM * heightM);
            bmiIdealWeightEl.innerText = `${minWeight} - ${maxWeight} KG`;
        }

        // 6. Daily Water Intake (35-40 ml per kg)
        if (bmiWaterEl) {
            const waterL = (weightKg * 0.042).toFixed(1);
            bmiWaterEl.innerText = `${waterL} L`;
        }
    }

    // Bind real-time input events for BMI Form
    if (bmiForm) {
        ['input', 'change', 'keyup'].forEach(evtName => {
            bmiForm.addEventListener(evtName, calculateBMI);
        });
        if (bmiCalcBtn) {
            bmiCalcBtn.addEventListener('click', calculateBMI);
        }
        calculateBMI(); // Run on startup
    }

    // =========================================================================
    // 2. BEAST DAILY CALORIE & PROTEIN MACRO ENGINE
    // =========================================================================
    const macroForm = document.getElementById('macro-form');
    const macroWeight = document.getElementById('macro-weight');
    const macroHeight = document.getElementById('macro-height');
    const macroAge = document.getElementById('macro-age');
    const macroActivity = document.getElementById('macro-activity');
    const macroGoal = document.getElementById('macro-goal');
    const macroCalcBtn = document.getElementById('macro-calc-btn');

    const calResultEl = document.getElementById('macro-calories');
    const proteinResultEl = document.getElementById('macro-protein');
    const carbsResultEl = document.getElementById('macro-carbs');
    const fatsResultEl = document.getElementById('macro-fats');

    function calculateMacros() {
        if (!macroWeight || !macroHeight || !calResultEl) return;

        const weight = parseFloat(macroWeight.value) || 75;
        const height = parseFloat(macroHeight.value) || 175;
        const age = parseFloat(macroAge ? macroAge.value : 24) || 24;
        const activity = parseFloat(macroActivity ? macroActivity.value : 1.55) || 1.55;
        const goal = macroGoal ? macroGoal.value : 'bulk';

        if (weight <= 0 || height <= 0) return;

        // Mifflin-St Jeor Equation for BMR
        const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        const tdee = bmr * activity;

        let targetCalories = tdee;
        let proteinPerKg = 2.0;

        if (goal === 'bulk') {
            targetCalories += 500; // Muscle hyper-surplus
            proteinPerKg = 2.2;
        } else if (goal === 'cut') {
            targetCalories -= 450; // Aggressive fat loss deficit
            proteinPerKg = 2.4;
        } else if (goal === 'strength') {
            targetCalories += 200; // Clean strength power recomp
            proteinPerKg = 2.0;
        }

        targetCalories = Math.max(1200, Math.round(targetCalories));
        const proteinGrams = Math.round(weight * proteinPerKg);
        const fatCalories = targetCalories * 0.25;
        const fatGrams = Math.round(fatCalories / 9);
        const remainingCals = targetCalories - (proteinGrams * 4) - fatCalories;
        const carbGrams = Math.max(30, Math.round(remainingCals / 4));

        calResultEl.innerText = `${targetCalories.toLocaleString()} kcal`;
        if (proteinResultEl) proteinResultEl.innerText = `${proteinGrams}g`;
        if (carbsResultEl) carbsResultEl.innerText = `${carbGrams}g`;
        if (fatsResultEl) fatsResultEl.innerText = `${fatGrams}g`;
    }

    // Bind real-time input events for Macro Form
    if (macroForm) {
        ['input', 'change', 'keyup'].forEach(evtName => {
            macroForm.addEventListener(evtName, calculateMacros);
        });
        if (macroCalcBtn) {
            macroCalcBtn.addEventListener('click', calculateMacros);
        }
        calculateMacros(); // Run on startup
    }
});
