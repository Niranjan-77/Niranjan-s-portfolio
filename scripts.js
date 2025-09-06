// Initialize lucide icons
window.addEventListener('DOMContentLoaded', () => {
	lucide.createIcons();
	initNav();
	initHeroRoles();
	initAnimations();
	initCircularProgress();
	initCertificatesFilter();
	initProjects();
	initContactForm();
	initFooterYear();
	initImageFallback();
	ensureResumeExists();
	bindResumeDownloads();
	initEducationSection();
});

function initNav() {
	const toggle = document.getElementById('mobile-menu-toggle');
	const mobileNav = document.getElementById('mobile-nav');
	const links = document.querySelectorAll('.nav-link');
	const sections = ['home','about','skills','certificates','projects','contact'].map(id => document.getElementById(id));

	if (toggle) {
		toggle.addEventListener('click', () => {
			mobileNav.classList.toggle('hidden');
			const icon = toggle.querySelector('i[data-lucide]');
			if (icon) {
				icon.remove();
				toggle.insertAdjacentHTML('beforeend', `<i data-lucide="${mobileNav.classList.contains('hidden') ? 'menu' : 'x'}"></i>`);
				lucide.createIcons();
			}
		});
	}

	links.forEach(btn => {
		btn.addEventListener('click', () => {
			const target = btn.getAttribute('data-target');
			if (target) document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
			mobileNav?.classList.add('hidden');
		});
	});

	// Home section button navigation
	const homeButtons = document.querySelectorAll('[data-scroll]');
	homeButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			const target = btn.getAttribute('data-scroll');
			if (target) {
				document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
			}
		});
	});

	// Active section on scroll
	const onScroll = () => {
		const y = window.scrollY + 100;
		let activeId = 'home';
		for (const sec of sections) {
			if (!sec) continue;
			const top = sec.offsetTop;
			const bottom = top + sec.offsetHeight;
			if (y >= top && y < bottom) { activeId = sec.id; break; }
		}
		document.querySelectorAll('#desktop-nav .nav-link').forEach(el => {
			el.classList.toggle('nav-active', el.getAttribute('data-target') === activeId);
		});
		// mobile does not show underline, but keep same logic if open
		document.querySelectorAll('#mobile-nav .nav-link').forEach(el => {
			el.classList.toggle('text-primary', el.getAttribute('data-target') === activeId);
		});
	};
	window.addEventListener('scroll', onScroll);
	onScroll();
}

function initHeroRoles() {
	const roleText = document.getElementById('role-text');
	if (!roleText) return;
	const roles = ['Web Developer', 'AWS Learner', 'Gen AI Explorer', 'Software Developer'];
	let roleIndex = 0;
	let charIndex = 0;
	let deleting = false;
	const typeDelay = 90; // ms per character
	const holdDelay = 1000; // pause after typing a word

	function type() {
		const current = roles[roleIndex];
		if (!deleting) {
			charIndex = Math.min(charIndex + 1, current.length);
			roleText.textContent = current.slice(0, charIndex);
			if (charIndex === current.length) {
				setTimeout(() => { deleting = true; type(); }, holdDelay);
				return;
			}
			setTimeout(type, typeDelay);
		} else {
			charIndex = Math.max(charIndex - 1, 0);
			roleText.textContent = current.slice(0, charIndex);
			if (charIndex === 0) {
				deleting = false;
				roleIndex = (roleIndex + 1) % roles.length;
				setTimeout(type, typeDelay);
				return;
			}
			setTimeout(type, Math.max(50, typeDelay - 20));
		}
	}
	type();
}

function initAnimations() {
	const els = document.querySelectorAll('[data-animate]');
	const io = new IntersectionObserver(entries => {
		for (const entry of entries) {
			if (entry.isIntersecting) {
				const el = entry.target;
				const type = el.getAttribute('data-animate');
				const delay = el.getAttribute('data-delay') || '0';
				if (type === 'slide-in-up') el.classList.add('animate-slide-in-up');
				if (type === 'slide-in-left') el.classList.add('animate-slide-in-left');
				if (type === 'fade-in') el.classList.add('animate-fade-in');
				el.style.animationDelay = `${parseInt(delay, 10) / 1000}s`;
				io.unobserve(el);
			}
		}
	}, { threshold: 0.15 });
	els.forEach(el => io.observe(el));
}

function initCircularProgress() {
	const skillCards = document.querySelectorAll('.skill-card');
	
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const card = entry.target;
				const progressEl = card.querySelector('.circular-progress');
				const percentage = Number(card.getAttribute('data-percentage') || '0');
				
				// Animate card entrance
				setTimeout(() => {
					card.classList.add('animate');
				}, 100);
				
				// Animate progress circle and counter
				if (progressEl) {
					// Reset to 0 initially
					progressEl.style.setProperty('--percentage', '0');
					progressEl.setAttribute('data-percentage', '0');
					
					setTimeout(() => {
						// Start circle animation with JS tween for broad browser support
						progressEl.classList.add('animate');
						const durationMs = 1600;
						let startTs = null;
						const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
						function step(ts) {
							if (startTs === null) startTs = ts;
							const elapsed = ts - startTs;
							const t = Math.min(1, elapsed / durationMs);
							const eased = easeOutCubic(t);
							const current = Math.round(percentage * eased);
							progressEl.style.setProperty('--percentage', String(percentage * eased));
							progressEl.setAttribute('data-percentage', String(current));
							if (t < 1) requestAnimationFrame(step);
						}
						requestAnimationFrame(step);
					}, 300);
				}
				
				observer.unobserve(card);
			}
		});
	}, { threshold: 0.3 });
	
	skillCards.forEach(card => observer.observe(card));
}

function initCertificatesFilter() {
	const buttons = document.querySelectorAll('.filter-btn');
	const cards = document.querySelectorAll('#cert-grid > div');
	const empty = document.getElementById('cert-empty');

	function setActive(targetBtn) {
		buttons.forEach(b => b.classList.remove('is-active'));
		targetBtn.classList.add('is-active');
	}

	function applyFilter(filter) {
		let shown = 0;
		cards.forEach(card => {
			const cat = card.getAttribute('data-category');
			const match = filter === 'all' || filter === null || cat === filter;
			card.style.display = match ? '' : 'none';
			if (match) shown++;
		});
		if (empty) empty.classList.toggle('hidden', shown !== 0);
	}

	buttons.forEach(btn => {
		btn.addEventListener('click', () => {
			setActive(btn);
			applyFilter(btn.getAttribute('data-filter'));
		});
	});

	// default select 'all'
	const defaultBtn = document.querySelector('.filter-btn[data-filter="all"]');
	if (defaultBtn) {
		setActive(defaultBtn);
		applyFilter('all');
	}

	// touch feedback for certificate cards
	const certCards = document.querySelectorAll('#cert-grid > div');
	certCards.forEach(card => {
		// Touch feedback
		card.addEventListener('touchstart', () => card.classList.add('touch-active'), { passive: true });
		card.addEventListener('touchend', () => card.classList.remove('touch-active'));
		card.addEventListener('touchcancel', () => card.classList.remove('touch-active'));
		
		// Handle LinkedIn redirects for certificate cards
		const buttons = card.querySelectorAll('[data-link]');
		buttons.forEach(btn => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				const link = btn.getAttribute('data-link');
				if (link && link !== '#') {
					window.open(link, '_blank');
				}
			});
		});
		
		// Make entire card clickable for mobile touch
		card.addEventListener('click', (e) => {
			// Don't trigger if clicking on buttons or links
			if (e.target.closest('button') || e.target.closest('a')) return;
			
			// Find the first LinkedIn link in the card
			const linkBtn = card.querySelector('[data-link]');
			if (linkBtn && linkBtn.getAttribute('data-link') !== '#') {
				window.open(linkBtn.getAttribute('data-link'), '_blank');
			}
		});
	});
}

function initProjects() {
	const grid = document.getElementById('projects-grid');
	const loading = document.getElementById('projects-loading');
	if (!grid || !loading) return;
	loading.classList.remove('hidden');
	const mock = [
		{ id: 1, name: 'AWS Customer Review', description: 'Serverless project with frontend on Amazon S3, backend via API Gateway and AWS Lambda (Python), and DynamoDB for storing user reviews and messages. Scalable and secure without managing servers.', html_url: 'https://github.com/Niranjan-77/aws_customer_review.git', homepage: 'https://www.linkedin.com/posts/niranjan-saravanan_aws-serverless-dynamodb-activity-7358895803383336973-jpcJ?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEbHc9YBKhIZDj0TPiFzEpQ_-EyA4iBplPE', language: 'Python', stargazers_count: 15, forks_count: 5, topics: ['aws','lambda','apigateway','dynamodb','serverless'] }
	];
	setTimeout(() => {
		loading.classList.add('hidden');
		grid.innerHTML = mock.map((p, idx) => projectCardHtml(p, idx)).join('');
		lucide.createIcons();
		grid.querySelectorAll('[data-action="view-src"]').forEach(btn => btn.addEventListener('click', () => window.open(btn.getAttribute('data-url'), '_blank')));
		grid.querySelectorAll('[data-action="view-live"]').forEach(btn => btn.addEventListener('click', () => window.open(btn.getAttribute('data-url'), '_blank')));
	}, 500);
}

function projectCardHtml(p, index) {
	const langColors = { JavaScript: '#f7df1e', TypeScript: '#3178c6', Python: '#3776ab', Java: '#ed8b00', 'C++': '#00599c', HTML: '#e34f26', CSS: '#1572b6' };
	const color = langColors[p.language] || '#64748b';
	   return `
		   <div class="bg-card border border-card-border rounded-lg shadow-card hover:shadow-card-hover transition-all group flex flex-col" style="animation-delay:${0.1 * index}s">
			   <div class="project-card-header">
				   <div class="flex items-start justify-between mb-3">
					   <div class="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors"><i data-lucide="code" class="text-primary"></i></div>
					   <div class="flex items-center space-x-2">
						   <button class="icon-btn opacity-0 group-hover:opacity-100" data-action="view-src" data-url="${p.html_url}" aria-label="View source code"><i data-lucide="github"></i></button>
						   <button class="icon-btn opacity-0 group-hover:opacity-100" data-action="view-live" data-url="${p.homepage}" aria-label="View live project"><i data-lucide="external-link"></i></button>
					   </div>
				   </div>
				   <h3 class="project-title group-hover:text-primary transition-colors">${p.name}</h3>
				   <div class="project-meta">
					   <div class="flex items-center space-x-1"><div class="w-3 h-3 rounded-full" style="background:${color}"></div><span>${p.language}</span></div>
					   <!-- Star and fork count completely removed -->
				   </div>
			   </div>
			   <div class="project-card-body">
				   <p class="project-description">${p.description}</p>
				   <div class="project-topics">
					   ${(p.topics||[]).slice(0,4).map(t => `<span class="project-topic">${t}</span>`).join('')}
				   </div>
				   <button class="project-view-btn w-full flex items-center justify-center gap-2" data-action="view-live" data-url="${p.homepage}">
					   <span>View Project</span>
					   <i data-lucide="external-link" class="w-4 h-4"></i>
				   </button>
			   </div>
		   </div>
	   `;
}

function initContactForm() {
	const form = document.getElementById('contact-form');
	const submitBtn = document.getElementById('submit-btn');
	const toastRoot = document.getElementById('toast-root');
	if (!form || !submitBtn || !toastRoot) return;

	function showToast({ title, description, variant }) {
		const el = document.createElement('div');
		el.className = 'toast';
		el.innerHTML = `<div class="font-medium mb-1">${title}</div><div class="text-sm text-muted-foreground">${description}</div>`;
		toastRoot.appendChild(el);
		setTimeout(() => el.remove(), 3000);
	}

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		const data = new FormData(form);
		const name = (data.get('name') || '').toString().trim();
		const email = (data.get('email') || '').toString().trim();
		const message = (data.get('message') || '').toString().trim();

		// validation
		if (!name) return showToast({ title: 'Validation Error', description: 'Name is required', variant: 'destructive' });
		if (!email) return showToast({ title: 'Validation Error', description: 'Email is required', variant: 'destructive' });
		if (!/^\S+@\S+\.\S+$/.test(email)) return showToast({ title: 'Validation Error', description: 'Please enter a valid email address', variant: 'destructive' });
		if (!message) return showToast({ title: 'Validation Error', description: 'Message is required', variant: 'destructive' });
		if (message.length < 10) return showToast({ title: 'Validation Error', description: 'Message must be at least 10 characters long', variant: 'destructive' });

		// simulate sending
		submitBtn.disabled = true;
		submitBtn.querySelector('.loader')?.classList.remove('hidden');
		await new Promise(r => setTimeout(r, 2000));
		console.log('Form submission:', { name, email, message });
		showToast({ title: 'Message Sent!', description: "Thank you for your message. I'll get back to you soon!", variant: 'default' });
		form.reset();
		submitBtn.disabled = false;
		submitBtn.querySelector('.loader')?.classList.add('hidden');
	});
}

function initFooterYear() {
	const y = document.getElementById('year');
	if (y) y.textContent = String(new Date().getFullYear());
}

function initImageFallback() {
	const img = document.getElementById('profile-img');
	if (!img) return;
	const cloud = 'https://res.cloudinary.com/dmbek4ywu/image/upload/f_auto,q_auto/v1755670682/IMG_1212_dqobv1.heic';
	const publicFile = './profile.jpg';
	const placeholder = './placeholder.svg';
	img.addEventListener('error', () => {
		const src = img.getAttribute('src');
		if (src === cloud) img.setAttribute('src', publicFile);
		else img.setAttribute('src', placeholder);
	});
}

function ensureResumeExists() {
	// If assets folder is missing (deleted earlier), recreate it in memory by redirecting to an online fallback
	fetch('./Niranjan_Resume.pdf', { method: 'HEAD' })
		.then(res => {
			if (!res.ok) throw new Error('resume missing');
		})
		.catch(() => {
			// Fallback: use in-project image-based PDF link if available or alert
			console.warn('Local resume not found at ./assets/resume.pdf');
		});
}

function bindResumeDownloads() {
	const links = document.querySelectorAll('a.resume-download');
	links.forEach(link => {
		link.addEventListener('click', (e) => {
			const url = './Niranjan_Resume.pdf';
			e.preventDefault();
			// Stream download if present; otherwise show message
			fetch(url).then(r => {
				if (!r.ok) throw new Error('missing');
				return r.blob();
			}).then(blob => {
				const blobUrl = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = blobUrl;
				a.download = 'Niranjan-Resume.pdf';
				document.body.appendChild(a);
				a.click();
				a.remove();
				URL.revokeObjectURL(blobUrl);
			}).catch(() => {
				alert('Resume file not found. Please place Niranjan_Resume.pdf next to index.html (path: static/Niranjan_Resume.pdf).');
			});
		});
	});
}

function initEducationSection() {
	const educationItems = document.querySelectorAll('.education-item');
	
	educationItems.forEach((item, index) => {
		// Add click event for interactive behavior
		item.addEventListener('click', () => {
			// Add a subtle click effect
			item.style.transform = 'scale(0.98)';
			setTimeout(() => {
				item.style.transform = '';
			}, 150);
		});
		
		// Add staggered animation delay
		item.style.animationDelay = `${index * 0.1}s`;
		
		// Add hover sound effect (optional - just for enhanced UX)
		item.addEventListener('mouseenter', () => {
			// You can add a subtle sound effect here if desired
			item.style.zIndex = '10';
		});
		
		item.addEventListener('mouseleave', () => {
			item.style.zIndex = '1';
		});
	});
}

