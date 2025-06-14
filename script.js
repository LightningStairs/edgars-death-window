document.addEventListener('DOMContentLoaded', function() {
    const firebaseConfig = {
      apiKey: "AIzaSyDPQ6FdM6oYYvrkGk0mheivw45L8Ig1xC8",
      authDomain: "edgardeathwindowvotes.firebaseapp.com",
      projectId: "edgardeathwindowvotes",
      storageBucket: "edgardeathwindowvotes.firebasestorage.app",
      messagingSenderId: "664396069532",
      appId: "1:664396069532:web:8be4ca0d64db46ed290b59"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const countdownTargetDate = new Date('September 16, 2025 00:00:00').getTime();
    const windowEndDate = new Date('October 15, 2025 23:59:59').getTime();
    const countdownElement = document.getElementById('countdown');

    function updateCountdown() {
        const now = new Date().getTime();

        if (now > windowEndDate) {
            countdownElement.innerHTML = "EDGAR'S DEATH DATE WINDOW HAS CLOSED";
            countdownElement.style.color = "LightBlue";
            countdownElement.style.textShadow = "0 0 10px rgba(173, 216, 230, 0.7)";
        } else if (now >= countdownTargetDate && now <= windowEndDate) {
            countdownElement.innerHTML = "WE ARE IN EDGAR'S DEATH DATE WINDOW";
            countdownElement.style.color = "red";
            countdownElement.style.textShadow = "0 0 10px rgba(255, 0, 0, 0.7)";
        } else {
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

    const voteButtons = document.querySelectorAll('.vote-option-button');

    const pollOptionKeys = [
        'sept14_20', 'sept21_27', 'sept28_oct4', 'oct5_11', 'oct12_18',
        'before_window', 'after_window', 'wont_die_young', 'already_dead'
    ];

    const voteCountDisplays = {};
    const votePercentageDisplays = {};
    const voteBars = {};

    pollOptionKeys.forEach(key => {
        voteCountDisplays[key] = document.getElementById(`count_${key}`);
        votePercentageDisplays[key] = document.getElementById(`percent_${key}`);
        voteBars[key] = document.getElementById(`bar_${key}`);
    });

    const ctx = document.getElementById('votePieChart');
    let votePieChart; 

    const pollOptionLabels = [
        'Sept 14 - Sept 20', 'Sept 21 - Sept 27', 'Sept 28 - Oct 4', 'Oct 5 - Oct 11', 'Oct 12 - Oct 18',
        'Before Window', 'After Window', 'Won\'t Die Young', 'Already Dead'
    ];
    const chartColors = [
        '#E74C3C', // Sept 14-20 (Red)
        '#C0392B', // Sept 21-27 (Darker Red)
        '#A52A2A', // Sept 28-Oct 4 (Brownish Red)
        '#8B0000', // Oct 5-11 (Dark Red)
        '#6A0000', // Oct 12-18 (Deep Red)
        '#3498DB', // Before Window (Blue)
        '#2980B9', // After Window (Darker Blue)
        '#F1C40F', // Won't Die Young (Yellow/Gold)
        '#7F8C8D'  // Already Dead (Grey/Slate)
    ];

    if (ctx) {
        votePieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: pollOptionLabels,
                datasets: [{
                    data: [], 
                    backgroundColor: chartColors,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: 'white' 
                        }
                    },
                    title: {
                        display: true,
                        text: 'Distribution of Predictions',
                        color: '#FFD700' 
                    }
                }
            }
        });
    }

    voteButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const voteOption = button.dataset.voteOption;
            if (voteOption) {
                try {
                    await db.collection('votes').add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        voteType: voteOption
                    });
                    console.log(`Vote for "${voteOption}" successfully cast!`);
                } catch (error) {
                    console.error("Error casting vote: ", error);
                    alert("Failed to cast vote. Please try again.");
                }
            }
        });
    });

    db.collection('votes').onSnapshot((snapshot) => {
        const counts = {};
        let totalVotes = 0;

        pollOptionKeys.forEach(option => {
            counts[option] = 0;
        });

        snapshot.forEach(doc => {
            const data = doc.data();
            const voteType = data.voteType;
            if (counts.hasOwnProperty(voteType)) { 
                counts[voteType]++;
                totalVotes++; 
            } else {
                console.warn(`Untracked voteType found in Firestore: ${voteType}`);
            }
        });

        pollOptionKeys.forEach(option => { 
            if (voteCountDisplays[option]) { 
                voteCountDisplays[option].textContent = counts[option];

                const percentage = totalVotes > 0 ? ((counts[option] / totalVotes) * 100).toFixed(1) : 0;
                if (votePercentageDisplays[option]) {
                    votePercentageDisplays[option].textContent = `(${percentage}%)`;
                }

                if (voteBars[option]) {
                    voteBars[option].style.width = `${percentage}%`;
                }
            }
        });

        if (votePieChart) {
            const chartData = pollOptionKeys.map(key => counts[key]);
            votePieChart.data.datasets[0].data = chartData;
            votePieChart.update(); 
        }

        console.log("Vote counts updated:", counts);
    }, (error) => {
        console.error("Error getting real-time updates: ", error);
    });
});
