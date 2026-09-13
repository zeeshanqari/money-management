// Local Storage سے ڈیٹا لوڈ کرنا
let UdhaarBookData = JSON.parse(localStorage.getItem("udhaar_data")) || [];

function saveDataToStorage() {
    localStorage.setItem("udhaar_data", JSON.stringify(UdhaarBookData));
}

let currentType = "";

// اسکرینز کنٹرول کرنے کے فنکشنز
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function openForm(type) {
    currentType = type;
    document.getElementById('formTitle').innerText = type;
    
    let dynStatus = document.getElementById('dynamicStatus');
    if(type.includes("Credit")) {
        dynStatus.value = "Payment Not Received - ادائیگی نہیں لی";
        dynStatus.innerText = "Payment Not Received - ادائیگی نہیں لی";
    } else {
        dynStatus.value = "Payment Not Given - ادائیگی نہیں دی";
        dynStatus.innerText = "Payment Not Given - ادائیگی نہیں دی";
    }
    showScreen('formScreen');
}

function closeForm() {
    // فارم کلیئر کریں اور واپس مین سکرین پر جائیں
    document.getElementById('num').value = "";
    document.getElementById('amount').value = "";
    document.getElementById('name').value = "";
    document.getElementById('date').value = "";
    showScreen('mainScreen');
}

function makeCall() {
    let num = document.getElementById('num').value;
    if(num) {
        window.location.href = "tel:" + num;
    } else {
        alert("Please enter a phone number first - پہلے فون نمبر درج کریں");
    }
}

function saveEntry() {
    let num = document.getElementById('num').value;
    let amount = document.getElementById('amount').value;
    let name = document.getElementById('name').value;
    let date = document.getElementById('date').value;
    let status = document.getElementById('paymentStatus').value;

    let paymentStatusText = status ? " | Payment Status: " + status : "";
    let entry = `${currentType} | Name: ${name} | Phone: ${num} | Total: ${amount} | Date: ${date}${paymentStatusText}`;
    
    UdhaarBookData.push(entry);
    saveDataToStorage();
    alert("Saved successfully - کامیابی سے محفوظ ہو گیا");
    closeForm();
}

// Udhaar Book Management
function openUdhaarBook() {
    let listDiv = document.getElementById('recordList');
    listDiv.innerHTML = ""; // پرانا ڈیٹا صاف کریں

    if(UdhaarBookData.length === 0) {
        listDiv.innerHTML = "<p>No records found - کوئی ریکارڈ نہیں ملا</p>";
    }

    UdhaarBookData.forEach((entry, index) => {
        let card = document.createElement('div');
        card.className = "record-card";
        card.innerHTML = `
            <p>${entry}</p>
            <div class="record-actions">
                <button class="btn-upd" onclick="updateBalance(${index})">Update Balance</button>
                <button class="btn-shr" onclick="shareRecord(${index})">Share</button>
                <button class="btn-del" onclick="deleteRecord(${index})">Delete</button>
            </div>
        `;
        listDiv.appendChild(card);
    });
    showScreen('listScreen');
}

function closeList() {
    showScreen('mainScreen');
}

function deleteRecord(index) {
    if(confirm("Are you sure you want to delete this record? - کیا آپ واقعی یہ ریکارڈ حذف کرنا چاہتے ہیں؟")) {
        UdhaarBookData.splice(index, 1);
        saveDataToStorage();
        openUdhaarBook(); // لسٹ ریفریش کریں
    }
}

function updateBalance(index) {
    let currentEntry = UdhaarBookData[index];
    let paidAmount = prompt("Enter payment amount - ادائیگی کی رقم درج کریں:");
    
    if(paidAmount && !isNaN(paidAmount)) {
        let totalMatch = currentEntry.match(/Total: (\d+)/);
        if(totalMatch) {
            let oldAmount = parseInt(totalMatch[1]);
            let newAmount = oldAmount - parseInt(paidAmount);
            
            let paymentStatus = currentEntry.includes("Credit") ? 
                ` (Payment Received: ${paidAmount})` : ` (Payment Given: ${paidAmount})`;
            
            let updatedEntry = currentEntry.replace(/Total: \d+/, "Total: " + newAmount) + paymentStatus;
            UdhaarBookData[index] = updatedEntry;
            saveDataToStorage();
            openUdhaarBook();
            alert("Balance Updated! - بیلنس اپڈیٹ ہو گیا! Remaining: " + newAmount);
        }
    }
}

function shareRecord(index) {
    let text = UdhaarBookData[index];
    // واٹس ایپ شیئر لنک کا استعمال
    window.location.href = "whatsapp://send?text=" + encodeURIComponent(text);
}

function showAbout() {
    alert("How to use for CSR Users:\n1. Use 'Credit' or 'Debit' buttons.\n2. In 'Udhaar Book', view records.\n3. Delete, Update Balance, or Share records.\n\nاردو ترجمہ:\n1. 'قرض لینا' یا 'قرض دینا' استعمال کریں۔\n2. 'ادھار بک' میں ریکارڈ دیکھیں۔");
}

function sendFeedback() {
    window.location.href = "https://wa.me/923265269741";
}

function exitApp() {
    if(confirm("Are you sure you want to exit? - کیا آپ واقعی باہر جانا چاہتے ہیں؟")) {
        window.close(); // یاد رکھیں: براؤزرز میں یہ ہمیشہ کام نہیں کرتا، لیکن ایپس گیزر کے WebView میں کام کر سکتا ہے
    }
}
