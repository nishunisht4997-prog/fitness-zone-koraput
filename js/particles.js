/**
 * Royal Gold Stardust & Luxury Champagne Particle Engine
 * Creates elegant floating gold dust, sparkling champagne bokeh, and ambient luxury embers.
 */

class GoldStardustParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = window.innerWidth < 768 ? 40 : 80;
        this.animationFrameId = null;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push(this.createParticle(true));
        }

        this.animate();
    }

    resize() {
        this.width = this.canvas.width = this.canvas.parentElement ? this.canvas.parentElement.offsetWidth : window.innerWidth;
        this.height = this.canvas.height = this.canvas.parentElement ? this.canvas.parentElement.offsetHeight : window.innerHeight;
    }

    createParticle(initial = false) {
        const colors = [
            'rgba(212, 175, 55, ',   // Royal 24K Gold
            'rgba(247, 224, 163, ',  // Champagne Gold
            'rgba(255, 215, 0, ',    // Bright Gold
            'rgba(230, 192, 123, ',  // Warm Gold
            'rgba(255, 255, 255, '   // Diamond Sparkle
        ];

        return {
            x: Math.random() * this.width,
            y: initial ? Math.random() * this.height : this.height + Math.random() * 25,
            size: Math.random() * 2.8 + 0.8,
            speedY: Math.random() * 1.2 + 0.4,
            speedX: (Math.random() - 0.5) * 0.6,
            baseAlpha: Math.random() * 0.7 + 0.2,
            alpha: Math.random() * 0.7 + 0.2,
            color: colors[Math.floor(Math.random() * colors.length)],
            flickerSpeed: Math.random() * 0.03 + 0.015,
            flickerOffset: Math.random() * Math.PI * 2,
            maxLife: Math.random() * 250 + 180,
            life: 0
        };
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.life++;
            p.y -= p.speedY;
            p.x += p.speedX + Math.sin(p.life * 0.03 + p.flickerOffset) * 0.3;
            p.alpha = p.baseAlpha * Math.sin((p.life / p.maxLife) * Math.PI);

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + Math.max(0, p.alpha) + ')';
            this.ctx.shadowColor = '#d4af37';
            this.ctx.shadowBlur = p.size * 3;
            this.ctx.fill();
            this.ctx.restore();

            // Reset when out of bounds or dead
            if (p.y < -10 || p.x < -20 || p.x > this.width + 20 || p.life >= p.maxLife) {
                this.particles[i] = this.createParticle();
            }
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.emberEngine = new GoldStardustParticleEngine('ember-canvas');
});
