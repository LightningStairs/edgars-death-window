document.addEventListener('DOMContentLoaded', function() {
    const countdownTargetDate = new Date('September 16, 2025 00:00:00').getTime();
    const windowEndDate = new Date('October 15, 2025 23:59:59').getTime();

    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        const now = new Date().getTime();

        
        if (now > windowEndDate) {
            countdownElement.innerHTML = "EDGAR'S DEATH DATE WINDOW HAS CLOSED";
            countdownElement.style.color = "LightBlue"; 
            countdownElement.style.textShadow = "0 0 10px rgba(173, 216, 230, 0.7)"; 
        }
        else if (now >= countdownTargetDate && now <= windowEndDate) {
            countdownElement.innerHTML = "WE ARE IN EDGAR'S DEATH DATE WINDOW";
            countdownElement.style.color = "red"; 
            countdownElement.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.7)"; 
        }
        else {
            const distance = countdownTargetDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            countdownElement.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            countdownElement.style.color = "white"; 
            countdownElement.style.textShadow = "0 0 15px rgba(255, 255, 255, 0.7)"; 
        }
    }

    setInterval(updateCountdown, 1000);

  updateCountdown();
});
