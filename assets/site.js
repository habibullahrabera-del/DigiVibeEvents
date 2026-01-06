// Shared JS for DigiVibe site
window.addEventListener('DOMContentLoaded', function () {
    // Preloader
    const pre = document.getElementById('preloader');
    if(pre) setTimeout(()=> pre.classList.add('loaded'), 600);

    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal');
    if('IntersectionObserver' in window){
        const io = new IntersectionObserver((entries)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){ entry.target.classList.add('in-view'); }
            });
        },{threshold:0.15});
        reveals.forEach(r=>io.observe(r));
    } else {
        reveals.forEach(r=>r.classList.add('in-view'));
    }

    // Counters
    const runCounter = (el)=>{
        const target = +el.dataset.target;
        const step = Math.max(1, Math.floor(target / 120));
        let current = 0;
        const timer = setInterval(()=>{
            current += step;
            if(current >= target){ el.textContent = target; clearInterval(timer); }
            else el.textContent = current;
        }, 10);
    };
    if('IntersectionObserver' in window){
        const statObserver = new IntersectionObserver((entries, obs)=>{
            entries.forEach(e=>{ if(e.isIntersecting){ e.target.querySelectorAll('.counter').forEach(runCounter); obs.unobserve(e.target); }});
        },{threshold:0.3});
        document.querySelectorAll('.stats-grid').forEach(s=>statObserver.observe(s));
    } else {
        document.querySelectorAll('.counter').forEach(runCounter);
    }

    // Mobile nav toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle && navToggle.addEventListener('click', ()=> navLinks.classList.toggle('open'));

    // Form handling (client-side only)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => form.addEventListener('submit', function(e){
        e.preventDefault();
        this.reset();
        // Friendly inline notification instead of alert if available
        if(window.toastr){ toastr.success('Thanks — your message has been sent!'); }
        else alert('Thanks — your message has been sent! We will contact you shortly.');
    }));

    // Back to top
    const back = document.getElementById('backToTop');
    if(back){
        window.addEventListener('scroll', ()=> back.classList.toggle('visible', window.scrollY > 400));
        back.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));
    }

    // Image fallback: replace any broken images with placeholder
    document.querySelectorAll('img').forEach(img=>{
        img.addEventListener('error', function(){
            if(!this.dataset._placeholder){
                this.dataset._placeholder = '1';
                this.src = 'assets/images/placeholder.png';
            }
        });
    });
});
