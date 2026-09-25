/**
 * FITNESS ZONE KORAPUT - Main Application Script
 * Features: 3D Tilt Engine, Interactive Muscle Explorer, Schedule Tabs,
 * Pricing Switcher, Lead Modal & WhatsApp Direct Booking Generator.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. MOBILE NAVBAR TOGGLE
    // ----------------------------------------------------
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const header = document.getElementById('main-header');

    if (menuBtn && navLinks) {
        const icon = menuBtn.querySelector('i');
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isActive = navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active', isActive);
            if (icon) {
                if (isActive) {
                    icon.classList.remove('fa-bars-staggered');
                    icon.classList.add('fa-xmark');
                } else {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars-staggered');
                }
            }
        });

        // Close when clicking nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars-staggered');
                }
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                if (icon) {
                    icon.classList.remove('fa-xmark');
                    icon.classList.add('fa-bars-staggered');
                }
            }
        });
    }

    // Header scroll background blur effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ----------------------------------------------------
    // 2. 3D CARD TILT ENGINE
    // ----------------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

            // Glare position
            const glare = card.querySelector('.tilt-glare');
            if (glare) {
                const percentX = (x / rect.width) * 100;
                const percentY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 30, 56, 0.25), transparent 70%)`;
                glare.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            const glare = card.querySelector('.tilt-glare');
            if (glare) glare.style.opacity = '0';
        });
    });

    // ----------------------------------------------------
    // 3. INTERACTIVE MUSCLE TARGET EXPLORER
    // ----------------------------------------------------
    const muscleData = {
        chest: {
            title: "BEAST CHEST FORGE",
            subtitle: "Upper, Mid & Lower Pectoral Destruction",
            exercises: [
                { name: "Barbell Incline Bench Press", sets: "4 Sets × 6-8 Reps", tip: "Tuck elbows at 45 degrees for maximum upper chest hypertrophy." },
                { name: "Flat Heavy Dumbbell Press", sets: "4 Sets × 8-10 Reps", tip: "Deep stretch at bottom, explosive drive with peak contraction." },
                { name: "Weighted Chest Dips", sets: "3 Sets × 10-12 Reps", tip: "Lean forward 30 degrees to recruit lower pectoral fibers." },
                { name: "Low-to-High Cable Flyes", sets: "3 Sets × 15 Reps", tip: "Squeeze for 2 seconds at the top to carve the inner chest line." }
            ],
            badge: "POWER & HYPERTROPHY"
        },
        back: {
            title: "DEMON BACK WINGS",
            subtitle: "Lats, Rhomboids, Lower Back & Traps",
            exercises: [
                { name: "Raw Conventional Deadlift", sets: "5 Sets × 3-5 Reps", tip: "Brace core, engage lats, push the floor away with leg drive." },
                { name: "Heavy Barbell Bent-Over Rows", sets: "4 Sets × 8 Reps", tip: "Pull bar to lower sternum with locked spine integrity." },
                { name: "Weighted Wide-Grip Pull-ups", sets: "4 Sets × 8-10 Reps", tip: "Full dead-hang stretch and chin over bar on every rep." },
                { name: "Meadows Row / T-Bar Row", sets: "3 Sets × 12 Reps", tip: "Great for building monstrous mid-back thickness." }
            ],
            badge: "DENSITY & WIDTH"
        },
        legs: {
            title: "TITAN LEG PILLARS",
            subtitle: "Quadriceps, Hamstrings, Glutes & Calves",
            exercises: [
                { name: "Olympic Barbell Back Squats", sets: "5 Sets × 5 Reps", tip: "Hit below parallel depth with explosive hip drive." },
                { name: "Heavy Romanian Deadlifts (RDL)", sets: "4 Sets × 8-10 Reps", tip: "Hinge at the hips until maximum hamstring tension." },
                { name: "Leg Press (Monster Load)", sets: "4 Sets × 12-15 Reps", tip: "Control the 3-second eccentric negative to build quads." },
                { name: "Standing Heavy Calf Raises", sets: "4 Sets × 20 Reps", tip: "Pause 2 seconds at the top and full stretch at the bottom." }
            ],
            badge: "RAW POWER FOUNDATION"
        },
        shoulders: {
            title: "BOULDER 3D SHOULDERS",
            subtitle: "Front, Lateral & Rear Deltoid Fortress",
            exercises: [
                { name: "Standing Overhead Military Press", sets: "4 Sets × 6 Reps", tip: "Tight glutes and core to transfer raw power overhead." },
                { name: "Dumbbell Lateral Raises (Drop-set)", sets: "4 Sets × 12-15 Reps", tip: "Lead with the elbows and control the slow descent." },
                { name: "Rear Delt Facepulls on Rope", sets: "4 Sets × 15-20 Reps", tip: "Pull towards eyes and rotate hands externally for healthy joints." },
                { name: "Heavy Dumbbell Shrugs", sets: "4 Sets × 12 Reps", tip: "Pause 2 seconds at peak contraction to build thick traps." }
            ],
            badge: "3D CANNONBALL DELTS"
        },
        arms: {
            title: "IRON ARMS ARSENAL",
            subtitle: "Biceps Peak & Triceps Horseshoe Mass",
            exercises: [
                { name: "Barbell EZ-Bar 21s & Curls", sets: "4 Sets × 8-10 Reps", tip: "Keep elbows pinned to your ribs, no swinging momentum." },
                { name: "Close-Grip Bench Press", sets: "4 Sets × 6-8 Reps", tip: "Dominant tricep overload for raw pushing strength." },
                { name: "Incline Dumbbell Hammer Curls", sets: "3 Sets × 12 Reps", tip: "Targets the brachialis to push the bicep peak upward." },
                { name: "Overhead Tricep Cable Extensions", sets: "3 Sets × 15 Reps", tip: "Maximum stretch on the long head of the triceps." }
            ],
            badge: "PEAK GUN MASS"
        },
        core: {
            title: "BEAST CORE ARMOR",
            subtitle: "Abs, Obliques & Spinal Stabilizers",
            exercises: [
                { name: "Hanging Leg Raises to Bar", sets: "4 Sets × 12-15 Reps", tip: "Roll your pelvis up toward your chest, don't just swing legs." },
                { name: "Heavy Cable Woodchoppers", sets: "3 Sets × 12 Reps/side", tip: "Rotational power for explosive athletic performance." },
                { name: "Weighted Ab Wheel Rollouts", sets: "4 Sets × 10 Reps", tip: "Maintain posterior pelvic tilt and control extension." },
                { name: "Plank with 20kg Plate", sets: "3 Sets × 60 Secs", tip: "Full body tension brace from head to heels." }
            ],
            badge: "BULLETPROOF CORE"
        }
    };

    const muscleBtns = document.querySelectorAll('.muscle-btn');
    const muscleContent = document.getElementById('muscle-exercise-content');

    function renderMuscleData(groupKey) {
        const data = muscleData[groupKey];
        if (!data || !muscleContent) return;

        let exercisesHtml = data.exercises.map(ex => `
            <div class="exercise-card">
                <div class="ex-header">
                    <h4>${ex.name}</h4>
                    <span class="ex-badge">${ex.sets}</span>
                </div>
                <p class="ex-tip"><i class="fa-solid fa-bullseye"></i> <strong>Pro Tip:</strong> ${ex.tip}</p>
            </div>
        `).join('');

        muscleContent.innerHTML = `
            <div class="muscle-display-box">
                <div class="muscle-box-header">
                    <div>
                        <span class="sub-badge">${data.badge}</span>
                        <h3>${data.title}</h3>
                        <p class="text-muted">${data.subtitle}</p>
                    </div>
                </div>
                <div class="exercise-grid">
                    ${exercisesHtml}
                </div>
            </div>
        `;
    }

    muscleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            muscleBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const group = btn.getAttribute('data-muscle');
            renderMuscleData(group);
        });
    });

    // Render initial group (Chest)
    renderMuscleData('chest');

    // ----------------------------------------------------
    // 4. CLASS SCHEDULE TIMETABLE FILTER
    // ----------------------------------------------------
    const scheduleData = {
        mon: [
            { time: "05:30 AM - 07:00 AM", name: "Heavy Chest & Triceps Blitz", coach: "Coach Vikram", slot: "Morning Power Slot", tag: "Strength" },
            { time: "07:30 AM - 09:00 AM", name: "Beast HIIT & Calorie Burn", coach: "Coach Rohit", slot: "Morning Power Slot", tag: "Cardio" },
            { time: "09:00 AM - 10:30 AM", name: "Olympic Powerlifting 101", coach: "Coach Arjun", slot: "Morning Power Slot", tag: "Power" },
            { time: "05:00 PM - 06:30 PM", name: "Raw Bodybuilding Hypertrophy", coach: "Coach Vikram", slot: "Evening Beast Slot", tag: "Hypertrophy" },
            { time: "07:00 PM - 08:30 PM", name: "Monster Bench Press Syndicate", coach: "Coach Arjun", slot: "Evening Beast Slot", tag: "Strength" },
            { time: "08:30 PM - 10:00 PM", name: "Late Night Iron Warriors", coach: "Open Rig / Pro Staff", slot: "Evening Beast Slot", tag: "Open Iron" }
        ],
        tue: [
            { time: "05:30 AM - 07:00 AM", name: "Demon Back & Biceps Warfare", coach: "Coach Arjun", slot: "Morning Power Slot", tag: "Strength" },
            { time: "07:30 AM - 09:00 AM", name: "Core & Functional Agility", coach: "Coach Rohit", slot: "Morning Power Slot", tag: "Agility" },
            { time: "09:00 AM - 10:30 AM", name: "Deadlift Mechanics & PR Lab", coach: "Coach Vikram", slot: "Morning Power Slot", tag: "Power" },
            { time: "05:00 PM - 06:30 PM", name: "Back Thickness & Lat Spread", coach: "Coach Arjun", slot: "Evening Beast Slot", tag: "Hypertrophy" },
            { time: "07:00 PM - 08:30 PM", name: "High-Volume Arm Destruction", coach: "Coach Rohit", slot: "Evening Beast Slot", tag: "Hypertrophy" },
            { time: "08:30 PM - 10:00 PM", name: "Late Night Iron Warriors", coach: "Open Rig / Pro Staff", slot: "Evening Beast Slot", tag: "Open Iron" }
        ],
        wed: [
            { time: "05:30 AM - 07:00 AM", name: "Titan Leg Day & Squat Lab", coach: "Coach Vikram", slot: "Morning Power Slot", tag: "Legs" },
            { time: "07:30 AM - 09:00 AM", name: "Beast Metabolic Conditioning", coach: "Coach Rohit", slot: "Morning Power Slot", tag: "Cardio" },
            { time: "09:00 AM - 10:30 AM", name: "Hamstrings & Glute Overload", coach: "Coach Arjun", slot: "Morning Power Slot", tag: "Strength" },
            { time: "05:00 PM - 06:30 PM", name: "Quad Sweep Hypertrophy", coach: "Coach Vikram", slot: "Evening Beast Slot", tag: "Legs" },
            { time: "07:00 PM - 08:30 PM", name: "Olympic Squat PR Challenge", coach: "Coach Arjun", slot: "Evening Beast Slot", tag: "Power" },
            { time: "08:30 PM - 10:00 PM", name: "Late Night Iron Warriors", coach: "Open Rig / Pro Staff", slot: "Evening Beast Slot", tag: "Open Iron" }
        ],
        thu: [
            { time: "05:30 AM - 07:00 AM", name: "Boulder 3D Shoulders & Traps", coach: "Coach Arjun", slot: "Morning Power Slot", tag: "Strength" },
            { time: "07:30 AM - 09:00 AM", name: "Heavy Bag & Combat Fitness", coach: "Coach Rohit", slot: "Morning Power Slot", tag: "Combat" },
            { time: "09:00 AM - 10:30 AM", name: "Military Overhead Press Clinic", coach: "Coach Vikram", slot: "Morning Power Slot", tag: "Power" },
            { time: "05:00 PM - 06:30 PM", name: "Cannonball Delts Giant Sets", coach: "Coach Arjun", slot: "Evening Beast Slot", tag: "Hypertrophy" },
            { time: "07:00 PM - 08:30 PM", name: "Strongman Farmers Walk & Carry", coach: "Coach Vikram", slot: "Evening Beast Slot", tag: "Strength" },
            { time: "08:30 PM - 10:00 PM", name: "Late Night Iron Warriors", coach: "Open Rig / Pro Staff", slot: "Evening Beast Slot", tag: "Open Iron" }
        ],
        fri: [
            { time: "05:30 AM - 07:00 AM", name: "Full Body Compound Shock", coach: "Coach Rohit", slot: "Morning Power Slot", tag: "Full Body" },
            { time: "07:30 AM - 09:00 AM", name: "Calisthenics & Weighted Dips", coach: "Coach Arjun", slot: "Morning Power Slot", tag: "Calisthenics" },
            { time: "09:00 AM - 10:30 AM", name: "Grip & Forearm Steel Training", coach: "Coach Vikram", slot: "Morning Power Slot", tag: "Strength" },
            { time: "05:00 PM - 06:30 PM", name: "Arms Race & Bicep Peak War", coach: "Coach Rohit", slot: "Evening Beast Slot", tag: "Hypertrophy" },
            { time: "07:00 PM - 08:30 PM", name: "Heavy Barbell PR Friday", coach: "Coach Vikram", slot: "Evening Beast Slot", tag: "Power" },
            { time: "08:30 PM - 10:00 PM", name: "Late Night Iron Warriors", coach: "Open Rig / Pro Staff", slot: "Evening Beast Slot", tag: "Open Iron" }
        ],
        sat: [
            { time: "05:30 AM - 07:30 AM", name: "Koraput Beast Outdoor Circuit", coach: "All Coaches", slot: "Morning Power Slot", tag: "Circuit" },
            { time: "08:00 AM - 10:30 AM", name: "Max Lift Testing & Weak Point Fix", coach: "Coach Vikram & Arjun", slot: "Morning Power Slot", tag: "Power" },
            { time: "05:00 PM - 07:30 PM", name: "Beast Team Cross-Training Challenge", coach: "Coach Rohit", slot: "Evening Beast Slot", tag: "Crossfit" },
            { time: "08:00 PM - 10:00 PM", name: "Community Iron Jam & Recovery", coach: "Open Rig", slot: "Evening Beast Slot", tag: "Recovery" }
        ]
    };

    const dayBtns = document.querySelectorAll('.day-tab-btn');
    const scheduleGrid = document.getElementById('schedule-cards-grid');

    function renderSchedule(dayKey) {
        const list = scheduleData[dayKey] || [];
        if (!scheduleGrid) return;

        scheduleGrid.innerHTML = list.map(item => `
            <div class="schedule-item tilt-card">
                <div class="tilt-glare"></div>
                <div class="schedule-time">
                    <i class="fa-regular fa-clock"></i> ${item.time}
                </div>
                <div class="schedule-details">
                    <span class="slot-badge">${item.tag}</span>
                    <h4>${item.name}</h4>
                    <p><i class="fa-solid fa-user-ninja"></i> <strong>Instructor:</strong> ${item.coach}</p>
                    <span class="slot-time-type"><i class="fa-solid fa-bolt"></i> ${item.slot}</span>
                </div>
            </div>
        `).join('');
    }

    dayBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            dayBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const day = btn.getAttribute('data-day');
            renderSchedule(day);
        });
    });

    renderSchedule('mon');

    // ----------------------------------------------------
    // 5. PRICING BILLING SWITCHER (Monthly vs Annual)
    // ----------------------------------------------------
    const pricingSwitch = document.getElementById('pricing-switch');
    const priceAmounts = document.querySelectorAll('.plan-amount');
    const periodTexts = document.querySelectorAll('.plan-period');
    const discountBadges = document.querySelectorAll('.annual-save-badge');

    if (pricingSwitch) {
        pricingSwitch.addEventListener('change', () => {
            const isAnnual = pricingSwitch.checked;

            priceAmounts.forEach(p => {
                const monthlyPrice = p.getAttribute('data-monthly');
                const annualPrice = p.getAttribute('data-annual');
                p.innerText = isAnnual ? '₹' + annualPrice : '₹' + monthlyPrice;
            });

            periodTexts.forEach(period => {
                period.innerText = isAnnual ? '/ Year' : '/ Month';
            });

            discountBadges.forEach(badge => {
                badge.style.display = isAnnual ? 'inline-block' : 'none';
            });
        });
    }

    // ----------------------------------------------------
    // 6. MODAL & DIRECT WHATSAPP BOOKING GENERATOR
    // ----------------------------------------------------
    const modal = document.getElementById('booking-modal');
    const modalClose = document.getElementById('modal-close');
    const openModalBtns = document.querySelectorAll('.open-pass-modal');
    const modalForm = document.getElementById('trial-pass-form');
    const toast = document.getElementById('toast-notification');

    function openModal(planName = '3-Day Free Trial Pass') {
        if (!modal) return;
        const planInput = document.getElementById('pass-plan-type');
        if (planInput) planInput.value = planName;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    openModalBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const plan = btn.getAttribute('data-plan') || '3-Day Free Trial Pass';
            openModal(plan);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }

    function showToast(msg) {
        if (!toast) return;
        toast.innerText = msg;
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 4000);
    }

    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('pass-name').value.trim();
            const phone = document.getElementById('pass-phone').value.trim();
            const goal = document.getElementById('pass-goal').value;
            const plan = document.getElementById('pass-plan-type').value;

            if (!name || !phone) {
                alert('Please enter your name and phone number.');
                return;
            }

            // WhatsApp link with pre-filled message for Fitness Zone Koraput (083289 10274)
            const gymPhoneNumber = "918328910274";
            const textMsg = `🔥 *FITNESS ZONE KORAPUT - BOOKING ENQUIRY* 🔥%0A%0A` +
                            `👤 *Name:* ${encodeURIComponent(name)}%0A` +
                            `📞 *Phone:* ${encodeURIComponent(phone)}%0A` +
                            `🎯 *Goal:* ${encodeURIComponent(goal)}%0A` +
                            `🎟️ *Selected Pass/Plan:* ${encodeURIComponent(plan)}%0A%0A` +
                            `_Hi Fitness Zone Koraput Team, I want to confirm my membership/trial pass!_`;

            const whatsappUrl = `https://wa.me/${gymPhoneNumber}?text=${textMsg}`;

            showToast(`🔥 Pass Generated for ${name}! Redirecting to WhatsApp...`);
            closeModal();
            modalForm.reset();

            // Open WhatsApp in new tab
            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
            }, 800);
        });
    }

    // Direct WhatsApp / Call buttons in Hero & Header
    const directWaBtns = document.querySelectorAll('.direct-wa-btn');
    directWaBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const msg = `Hi Fitness Zone Koraput, I want to enquire about gym admission, timings and membership fees!`;
            window.open(`https://wa.me/918328910274?text=${encodeURIComponent(msg)}`, '_blank');
        });
    });

    // ----------------------------------------------------
    // 7. ANIMATED STAT COUNTERS ON SCROLL
    // ----------------------------------------------------
    const statCounters = document.querySelectorAll('.stat-number');
    let counted = false;

    function animateStats() {
        if (counted) return;
        const statsSection = document.querySelector('.stats-strip');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.85) {
            statCounters.forEach(counter => {
                const target = +counter.getAttribute('data-target');
                let count = 0;
                const speed = target / 50;

                const updateCount = () => {
                    count += speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count);
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
            counted = true;
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Initial check

    // ----------------------------------------------------
    // 8. HERO FULL-SCREEN BACKGROUND SLIDER ENGINE
    // ----------------------------------------------------
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('slider-prev-btn');
    const nextBtn = document.getElementById('slider-next-btn');
    const counterNum = document.getElementById('slider-curr-num');
    const heroSlider = document.querySelector('.hero-section');
    const hudCards = document.querySelectorAll('.floating-hud-card');

    let currentSlide = 0;
    const totalSlides = slides.length;
    let slideInterval = null;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        if (counterNum) {
            counterNum.innerText = (index + 1 < 10 ? '0' : '') + (index + 1);
        }

        currentSlide = index;
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 4500);
    }

    function stopAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
    }

    if (slides.length > 0) {
        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

        dots.forEach((dot) => {
            dot.addEventListener('click', () => {
                const target = parseInt(dot.getAttribute('data-slide'), 10);
                goToSlide(target);
                startAutoSlide();
            });
        });

        // Touch Swipe on mobile
        let touchStartX = 0;
        let touchEndX = 0;

        if (heroSlider) {
            heroSlider.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            heroSlider.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    nextSlide(); // Swiped left
                    startAutoSlide();
                } else if (touchEndX - touchStartX > 50) {
                    prevSlide(); // Swiped right
                    startAutoSlide();
                }
            }, { passive: true });

            // Pause on hover
            heroSlider.addEventListener('mouseenter', stopAutoSlide);
            heroSlider.addEventListener('mouseleave', startAutoSlide);

            // Subtle parallax for HUD cards
            if (window.innerWidth > 1024) {
                heroSlider.addEventListener('mousemove', (e) => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 2;
                    const y = (e.clientY / window.innerHeight - 0.5) * 2;

                    hudCards.forEach((card, index) => {
                        const depth = (index + 1) * 6;
                        card.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
                    });
                });

                heroSlider.addEventListener('mouseleave', () => {
                    hudCards.forEach(card => {
                        card.style.transform = 'translate(0px, 0px)';
                    });
                });
            }
        }

        // Start auto slide
        startAutoSlide();
    }
});
