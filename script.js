let currentTemplate = 0;  // Initial template

// Fields to be considered in the form
const fields = ["name", "email", "phone", "address", "about-me", "education", "experience", "skills", "interests", "languages", "work-history"];

// --------------------
// FUNCTIONS
// --------------------

function generateCV() {
    const cvContent = generateCVContent();
    if (!cvContent) return; 

    const cvSection = document.getElementById("cv-section");
    cvSection.innerHTML = cvContent;
    cvSection.style.display = "block"; 
    cvSection.className = `template${currentTemplate + 1}`; 
    currentTemplate = (currentTemplate + 1) % 4;
    document.getElementById("download-btn").disabled = false;

    saveDataToLocal();
}

function generateCVContent() {
    let cvHTML = "";
    const missingFields = [];
    const profileImage = document.getElementById("profile-image").files[0];

    if (profileImage) {
        cvHTML += `<img src="${URL.createObjectURL(profileImage)}" alt="Profile Image">`;
    }

    cvHTML += `<h2>CV for ${document.getElementById("name").value}</h2>`;
    fields.forEach(field => {
        const value = document.getElementById(field).value;
        if (!value) {
            missingFields.push(field.replace("-", " "));
            return;
        }
        const fieldTitle = field.replace("-", " ").charAt(0).toUpperCase() + field.replace("-", " ").slice(1);
        cvHTML += field !== "name" ? `<h3>${fieldTitle}</h3><p>${value}</p>` : '';
    });

    if (missingFields.length) {
        alert(`Please fill out the following fields: ${missingFields.join(", ")}`);
        return "";
    }

    return cvHTML;
}

function saveDataToLocal() {
    const dataToSave = {};
    fields.concat(["profile-image"]).forEach(field => {
        dataToSave[field] = document.getElementById(field).value;
    });
    localStorage.setItem("cvData", JSON.stringify(dataToSave));
}

function loadDataFromLocal() {
    const savedData = JSON.parse(localStorage.getItem("cvData") || '{}');
    fields.concat(["profile-image"]).forEach(field => {
        if (savedData[field]) {
            document.getElementById(field).value = savedData[field];
        }
    });
    
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        document.getElementById("profile-image-preview").src = savedImage;
    }
}

function resetForm() {
    fields.concat(["profile-image"]).forEach(field => {
        document.getElementById(field).value = '';
    });
    localStorage.removeItem("cvData");
    localStorage.removeItem("profileImage");
    document.getElementById("profile-image-preview").src = ""; 
    document.getElementById("cv-section").style.display = "none"; // Hide the CV section on reset
}


// --------------------
// EVENT LISTENERS
// --------------------

document.addEventListener("DOMContentLoaded", loadDataFromLocal);

document.getElementById("generate-btn").addEventListener("click", generateCV);

document.getElementById("reset-btn").addEventListener("click", resetForm);

document.getElementById("download-btn").addEventListener("click", function() {
    const cvSection = document.getElementById("cv-section");
    const opt = {
        margin: 0,
        filename: 'CV.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 1 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(cvSection).set(opt).save();
});

document.getElementById("profile-image").addEventListener("change", function() {
    const file = this.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            localStorage.setItem("profileImage", reader.result);
            const preview = document.getElementById("profile-image-preview");
            preview.src = reader.result;
            preview.style.display = "block"; // Show the image preview
        }
        reader.readAsDataURL(file);
    } else {
        localStorage.removeItem("profileImage");
        document.getElementById("profile-image-preview").src = ""; 
        document.getElementById("profile-image-preview").style.display = "none";  // Hide the image preview
    }
});


document.getElementById("cv-section").style.display = "none";
