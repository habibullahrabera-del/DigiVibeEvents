window.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    const adminEmail = localStorage.getItem('adminEmail');
    document.getElementById('adminName').textContent = adminEmail.split('@')[0];
    
    loadDashboardData();
    loadBookings();
    loadInquiries();
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        const sectionId = this.dataset.section + '-section';
        document.getElementById(sectionId).classList.add('active');
        
        document.getElementById('pageTitle').textContent = this.textContent.trim().split('\n')[0];
    });
});

document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    window.location.href = 'login.html';
});

function loadDashboardData() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
    
    document.getElementById('totalBookings').textContent = bookings.length;
    document.getElementById('totalInquiries').textContent = inquiries.length;
    document.getElementById('totalClients').textContent = new Set(bookings.map(b => b.clientEmail)).size;
    
    const recentBookings = bookings.slice(-5).reverse();
    const tableBody = document.getElementById('recentBookingsTable');
    tableBody.innerHTML = '';
    
    recentBookings.forEach(booking => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.eventType}</td>
            <td>${booking.eventDate}</td>
            <td>${booking.eventGuests}</td>
            <td><span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span></td>
        `;
        tableBody.appendChild(row);
    });
}

function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const tableBody = document.getElementById('bookingsTable');
    tableBody.innerHTML = '';
    
    bookings.forEach((booking) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${booking.eventType}</td>
            <td>${booking.eventDate}</td>
            <td>${booking.eventGuests}</td>
            <td>${booking.clientName}</td>
            <td><span class="badge badge-${booking.status.toLowerCase()}">${booking.status}</span></td>
            <td>
                <button onclick="editBooking('${booking.id}')" style="color: var(--primary-pink); border: none; background: none; cursor: pointer; text-decoration: underline;">Edit</button>
                <button onclick="deleteBooking('${booking.id}')" style="color: #e74c3c; border: none; background: none; cursor: pointer; text-decoration: underline; margin-left: 10px;">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function loadInquiries() {
    const inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
    const tableBody = document.getElementById('inquiriesTable');
    tableBody.innerHTML = '';
    
    inquiries.forEach(inquiry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${inquiry.name}</td>
            <td>${inquiry.email}</td>
            <td>${inquiry.message.substring(0, 50)}...</td>
            <td>${new Date(inquiry.date).toLocaleDateString()}</td>
            <td>
                <button onclick="deleteInquiry('${inquiry.id}')" style="color: #e74c3c; border: none; background: none; cursor: pointer; text-decoration: underline;">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

closeBtn.addEventListener('click', function() {
    modal.classList.remove('show');
});

window.addEventListener('click', function(e) {
    if (e.target === modal) {
        modal.classList.remove('show');
    }
});

document.getElementById('addBookingBtn').addEventListener('click', function() {
    document.getElementById('modalTitle').textContent = 'Add New Booking';
    document.getElementById('modalForm').reset();
    document.getElementById('modalForm').onsubmit = saveBooking;
    modal.classList.add('show');
});

function saveBooking(e) {
    e.preventDefault();
    
    const booking = {
        id: Date.now().toString(),
        eventType: document.getElementById('eventType').value,
        eventDate: document.getElementById('eventDate').value,
        eventGuests: document.getElementById('eventGuests').value,
        clientName: document.getElementById('clientName').value,
        clientEmail: document.getElementById('clientEmail').value,
        status: document.getElementById('bookingStatus').value
    };
    
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    modal.classList.remove('show');
    loadBookings();
    loadDashboardData();
    alert('Booking saved successfully!');
}

function editBooking(id) {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booking = bookings.find(b => b.id === id);
    
    if (booking) {
        document.getElementById('modalTitle').textContent = 'Edit Booking';
        document.getElementById('eventType').value = booking.eventType;
        document.getElementById('eventDate').value = booking.eventDate;
        document.getElementById('eventGuests').value = booking.eventGuests;
        document.getElementById('clientName').value = booking.clientName;
        document.getElementById('clientEmail').value = booking.clientEmail;
        document.getElementById('bookingStatus').value = booking.status;
        
        document.getElementById('modalForm').onsubmit = function(e) {
            e.preventDefault();
            booking.eventType = document.getElementById('eventType').value;
            booking.eventDate = document.getElementById('eventDate').value;
            booking.eventGuests = document.getElementById('eventGuests').value;
            booking.clientName = document.getElementById('clientName').value;
            booking.clientEmail = document.getElementById('clientEmail').value;
            booking.status = document.getElementById('bookingStatus').value;
            
            localStorage.setItem('bookings', JSON.stringify(bookings));
            modal.classList.remove('show');
            loadBookings();
            loadDashboardData();
            alert('Booking updated successfully!');
        };
        
        modal.classList.add('show');
    }
}

function deleteBooking(id) {
    if (confirm('Are you sure?')) {
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings = bookings.filter(b => b.id !== id);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        loadBookings();
        loadDashboardData();
    }
}

function deleteInquiry(id) {
    if (confirm('Are you sure?')) {
        let inquiries = JSON.parse(localStorage.getItem('inquiries')) || [];
        inquiries = inquiries.filter(i => i.id !== id);
        localStorage.setItem('inquiries', JSON.stringify(inquiries));
        loadInquiries();
        loadDashboardData();
    }
}

document.getElementById('settingsForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const settings = {
        phone: document.getElementById('phoneNumber').value,
        email: document.getElementById('emailAddress').value,
        address: document.getElementById('address').value
    };
    
    localStorage.setItem('siteSettings', JSON.stringify(settings));
    alert('Settings saved successfully!');
});

window.addEventListener('DOMContentLoaded', function() {
    const settings = JSON.parse(localStorage.getItem('siteSettings'));
    if (settings) {
        document.getElementById('phoneNumber').value = settings.phone || '';
        document.getElementById('emailAddress').value = settings.email || '';
        document.getElementById('address').value = settings.address || '';
    }
});