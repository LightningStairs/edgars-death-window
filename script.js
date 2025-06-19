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
    
    const voteOptions = {
        'sept14_20': { label: 'Episode 217: Sept 14 - Sept 20' },
        'sept21_27': { label: 'Episode 218: Sept 21 - Sept 27' },
        'sept28_oct4': { label: 'Episode 219: Sept 28 - Oct 4' },
        'oct5_11': { label: 'Episode 220: Oct 5 - Oct 11' },
        'oct12_18': { label: 'Episode 221: Oct 12 - Oct 18' },
        'before_window': { label: 'Before Window' },
        'after_window': { label: 'After Window' },
        'wont_die_young': { label: 'Won\'t Die Young' },
        'already_dead': { label: 'Already Dead' }
    };

    const voteCountDisplays = {};
    const votePercentageDisplays = {};
    const voteBars = {};

    pollOptionKeys.forEach(key => {
        voteCountDisplays[key] = document.getElementById(`count_${key}`);
        votePercentageDisplays[key] = document.getElementById(`percent_${key}`);
        voteBars[key] = document.getElementById(`bar_${key}`);
    });

    const ctx = document.getElementById('votePieChart'); 
    let voteBarChart;

    const chartColors = [
        '#E4002B', // Sept 14 - Sept 20 (Red)
        '#C20023', // Sept 21 - Sept 27 (Darker Red)
        '#A0001B', // Sept 28 - Oct 4 (Even Darker Red)
        '#7E0013', // Oct 5 - Oct 11 (Deep Red)
        '#5C000B', // Oct 12 - Oct 18 (Darkest Red)
        '#4169E1', // Before Window (Royal Blue)
        '#00008B', // After Window (Dark Blue)
        '#FFD700', // Won't Die Young (Gold)
        '#808080'  // Already Dead (Gray)
    ];


    
    function renderChart(voteCounts) {
        const labels = pollOptionKeys.map(key => voteOptions[key].label); 
        const voteCountsArray = pollOptionKeys.map(optionKey => voteCounts[optionKey] || 0);

        
        if (window.voteBarChart) { 
            window.voteBarChart.destroy();
        }

        if (ctx) { 
            window.voteBarChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Number of Votes', 
                        data: voteCountsArray,
                        backgroundColor: chartColors, 
                        borderColor: 'rgba(255, 255, 255, 0.8)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false, 
                    plugins: {
                        legend: {
                            display: false, 
                            labels: {
                                color: 'white'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Distribution of Predictions',
                            color: '#FFD700'
                        }
                    },
                    scales: { 
                        x: { 
                            beginAtZero: true,
                            ticks: {
                                color: 'white',
                                font: {
                                    size: 12 
                                },
                                autoSkip: false, 
                                maxRotation: 90, 
                                minRotation: 45
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' 
                            }
                        },
                        y: { 
                            beginAtZero: true,
                            ticks: {
                                color: 'white', 
                                callback: function(value) { 
                                    if (Number.isInteger(value)) {
                                        return value;
                                    }
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)' 
                            }
                        }
                    }
                }
            });
        }
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

        renderChart(counts); 

        console.log("Vote counts updated:", counts);
    }, (error) => {
        console.error("Error getting real-time updates: ", error);
    });
});
