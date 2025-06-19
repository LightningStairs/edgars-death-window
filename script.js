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

    const chartColors = [
        '#E4002B', '#C20023', '#A0001B', '#7E0013', '#5C000B',
        '#4169E1', '#00008B', '#FFD700', '#808080'
    ];

    let voteBarChart;
    let lastVoteCounts = {};

    const MOBILE_BREAKPOINT_WIDTH = 768;

    function getResponsiveLabels(currentWindowWidth) {
        const originalLabels = pollOptionKeys.map(key => voteOptions[key].label);
        if (currentWindowWidth <= MOBILE_BREAKPOINT_WIDTH) {
            return originalLabels.map(label => {
                if (label.startsWith('Episode') && label.includes(':')) {
                    return label.split(':')[0].trim();
                }
                return label;
            });
        }
        return originalLabels;
    }

    function renderChart(counts) {
        const ctx = document.getElementById('votePieChart');
        if (!ctx) {
            console.warn("Chart canvas not found. Skipping chart render.");
            return;
        }

        const currentLabels = pollOptionKeys.map(key => voteOptions[key].label);
        const voteCountsArray = pollOptionKeys.map(optionKey => counts[optionKey] || 0);

        if (voteBarChart) {
            voteBarChart.destroy();
        }

        voteBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: currentLabels,
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
                indexAxis: 'y',
                layout: {
                    padding: {
                        left: 50
                    }
                },
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
                            callback: function(value) {
                                if (Number.isInteger(value)) {
                                    return value;
                                }
                            }
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: 'white',
                            font: {
                                size: 14
                            },
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });
    }

    const COOLDOWN_DURATION_MS = 45 * 60 * 1000; 
    const LOCAL_STORAGE_KEY_PREFIX = 'lastVote_';

    function setButtonCooldown(button, voteOption) {
        const now = Date.now();
        localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + voteOption, now.toString());
        updateButtonState(button, voteOption);
    }

    function getRemainingCooldown(voteOption) {
        const lastVoteTime = parseInt(localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + voteOption) || '0', 10);
        const elapsed = Date.now() - lastVoteTime;
        const remaining = COOLDOWN_DURATION_MS - elapsed;
        return remaining > 0 ? remaining : 0;
    }

    function updateButtonState(button, voteOption) {
        const originalText = voteOptions[voteOption].label; 
        const remaining = getRemainingCooldown(voteOption);

        if (remaining > 0) {
            button.disabled = true;
            button.classList.add('cooldown'); 
        } else {
            button.disabled = false;
            button.classList.remove('cooldown');
            button.textContent = originalText;
        }
    }

    function initializePollLogic() {
        const voteButtons = document.querySelectorAll('.vote-option-button');

        voteButtons.forEach(button => {
            const voteOption = button.dataset.voteOption;
            updateButtonState(button, voteOption); 
        });

        if (window._cooldownInterval) {
            clearInterval(window._cooldownInterval);
        }
        window._cooldownInterval = setInterval(() => {
            voteButtons.forEach(button => {
                const voteOption = button.dataset.voteOption;
                updateButtonState(button, voteOption);
            });
        }, 10 * 1000);

        const voteCountDisplays = {};
        const votePercentageDisplays = {};
        const voteBars = {};

        pollOptionKeys.forEach(key => {
            voteCountDisplays[key] = document.getElementById(`count_${key}`);
            votePercentageDisplays[key] = document.getElementById(`percent_${key}`);
            voteBars[key] = document.getElementById(`bar_${key}`);
        });

        voteButtons.forEach(button => {
            const oldListener = button._chartClickListener;
            if (oldListener) {
                button.removeEventListener('click', oldListener);
            }

            const newListener = async () => {
                const voteOption = button.dataset.voteOption;
                if (voteOption && !button.disabled) { 
                    try {
                        await db.collection('votes').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            voteType: voteOption
                        });
                        console.log(`Vote for "${voteOption}" successfully cast!`);
                        setButtonCooldown(button, voteOption); 
                    } catch (error) {
                        console.error("Error casting vote: ", error);
                        alert("Failed to cast vote. Please try again.");
                    }
                }
            };
            button.addEventListener('click', newListener);
            button._chartClickListener = newListener;
        });

        if (!window._pollSnapshotListener) {
            window._pollSnapshotListener = db.collection('votes').onSnapshot((snapshot) => {
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

                lastVoteCounts = counts;

                renderChart(counts);

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

                console.log("Vote counts updated:", counts);
            }, (error) => {
                console.error("Error getting real-time updates: ", error);
            });
        }
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (voteBarChart && Object.keys(lastVoteCounts).length > 0) {
                renderChart(lastVoteCounts);
            }
        }, 250);
    });

    initializePollLogic();

});