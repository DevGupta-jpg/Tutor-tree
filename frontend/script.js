// Wait for the entire HTML page to load before running any script
document.addEventListener("DOMContentLoaded", () => {

    // --- "Scroll to Top" Button ---
    const mybutton = document.getElementById("movetop");

    if (mybutton) {
        mybutton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        window.onscroll = function() {
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                mybutton.style.display = "block";
            } else {
                mybutton.style.display = "none";
            }
        };
    }
    // --- End "Scroll to Top" ---

    
    // --- "extra part" (Progress Bars) ---
    const sectionToObserve_Progress = document.querySelector("#progress-section");
    
    if (sectionToObserve_Progress) {
        const progressFills = document.querySelectorAll(".progress-fill");
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressFills.forEach(fill => {
                        const targetWidth = fill.getAttribute("data-width");
                        fill.style.width = targetWidth;
                    });
                    progressObserver.unobserve(sectionToObserve_Progress);
                }
            });
        }, { threshold: 0.01 });
        
        progressObserver.observe(sectionToObserve_Progress);
    }
    // --- End "extra part" ---

    
    // --- "Paid couse part" (Stats Counters) ---
    const sectionToObserve_Stats = document.querySelector("#stats-section");

    if (sectionToObserve_Stats) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 1. Animate Counters
                    const counters = document.querySelectorAll("[data-target]");
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 1500;
                        const stepTime = 20;
                        const steps = duration / stepTime;
                        const increment = target / steps;
                        let current = 0;

                        const updateCount = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                setTimeout(updateCount, stepTime);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCount();
                    });

                    // 2. Animate elements fading in
                    const hiddenElements = document.querySelectorAll(".hidden-load");
                    hiddenElements.forEach(el => el.classList.remove("hidden-load"));
                    
                    // 3. Stop observing
                    statsObserver.unobserve(sectionToObserve_Stats);
                }
            });
        }, { threshold: 0.1 });
        
        statsObserver.observe(sectionToObserve_Stats);
    }
    // --- End "Paid couse part" ---

    
    // --- "header part" (Scrolled Navbar) ---
    const navbar = document.querySelector(".navbar");

    if (navbar) {
        window.addEventListener("scroll", function() {
            if (window.scrollY > 20) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }
    // --- End "header part" ---

    
    // --- Backend Connection (TEST on Page Load) ---
    fetch('http://localhost:3000/api/message')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("✅ SUCCESS: Backend se message mil gaya!");
            console.log("Message:", data.message);
        })
        .catch(error => {
            console.error("❌ ERROR: Backend se connect nahi ho paya:", error);
        });
    // --- End Page Load Test ---


    // --- YAHAN HAI AAPKA NAYA FORM CODE ---
    const enquiryForm = document.getElementById("enquiry-form"); 

    if (enquiryForm) {
        enquiryForm.addEventListener("submit", function(event) {
            
            event.preventDefault(); // Page ko reload hone se rokein

            // 1. Aapke HTML se sabhi IDs ka data nikaalein
            const firstName = document.getElementById("formFirstName").value;
            const lastName = document.getElementById("formLastName").value;
            const email = document.getElementById("formEmail").value;
            const phone = document.getElementById("formPhone").value;
            const studentClass = document.getElementById("formClass").value;
            const subject = document.getElementById("formSubject").value;
            const message = document.getElementById("formMessage").value;

            // 2. Data ko ek object mein rakhein
            const formData = {
                name: `${firstName} ${lastName}`, // First aur Last Name ko jod diya
                email: email,
                phone: phone,
                studentClass: studentClass,
                subject: subject,
                message: message
            };

            // 3. Data ko backend API par 'POST' method se bhejein
            fetch('http://localhost:3000/api/send-enquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify(formData) 
            })
            .then(response => {
                // Check if response is ok
                if (!response.ok) {
                    // Try to get error message
                    return response.text().then(text => {
                        console.error("Server response:", text);
                        throw new Error(`Server error: ${response.status} ${response.statusText}`);
                    });
                }
                // Check if response is JSON
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    return response.text().then(text => {
                        console.error("Non-JSON response:", text);
                        throw new Error("Server returned non-JSON response");
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    alert("Aapka message bhej diya gaya hai. Hum jald hi sampark karenge!");
                    enquiryForm.reset(); 
                } else {
                    alert("Error: Message nahi ja paya. Kripya dobara try karein.");
                }
            })
            .catch(error => {
                console.error("Fetch error:", error);
                alert("Ek badi error aayi hai. Backend server check karein. Server restart karein.");
            });
        });
    }
    // --- FORM CODE YAHAN KHATAM ---

});
// --- This is the end of the DOMContentLoaded listener ---







// form data part open

function sendToWhatsApp() {
    // 1. Get all the form values
    var firstName = document.getElementById('formFirstName').value;
    var lastName = document.getElementById('formLastName').value;
    var email = document.getElementById('formEmail').value;
    var phone = document.getElementById('formPhone').value;
    var studentClass = document.getElementById('formClass').value;
    var subject = document.getElementById('formSubject').value;
    var message = document.getElementById('formMessage').value;

    // 2. The WhatsApp number (with country code)
    // I've added '91' for India.
    var whatsappNumber = "917303668697";

    // 3. Create the pre-filled message
    // %0a is a "new line" in a URL
    var text = "New Enquiry!" + "%0a%0a" +
               "First Name: " + firstName + "%0a" +
               "Last Name: " + lastName + "%0a" +
               "Email: " + email + "%0a" +
               "Phone: " + phone + "%0a" +
               "Class: " + studentClass + "%0a" +
               "Subject: " + subject + "%0a" +
               "Message: " + message;

    // 4. Create the WhatsApp URL
    var url = "https://wa.me/" + whatsappNumber + "?text=" + text;

    // 5. Open the URL in a new browser tab
    window.open(url, '_blank').focus();
}

// form data part close