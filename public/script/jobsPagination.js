const pageSize = 6;
let currentPage = 1;
const jobsContainer = document.getElementById('jobsContainer');
const paginationContainer = document.getElementById('paginationContainer');
const totalPages = Math.ceil(window.jobs.length / pageSize);
function renderJobs(page) {
  jobsContainer.innerHTML = '';
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const jobsToRender = window.jobs.slice(startIndex, endIndex);

  jobsToRender.forEach(job => {
    const colDiv = document.createElement('div');
    colDiv.className = 'col-md-4';
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card job-card';
    cardDiv.style.width = '18rem';

    cardDiv.innerHTML = `
      <div class="card-body">
        <div class="actively-hiring">
          <span>Actively Hiring</span>
          <span><i class="fa-solid fa-chart-line fa-fade"></i></span>
        </div>
        <h5 class="card-title">${job.companyName}</h5>
        <h6 class="card-subtitle mb-2">
          <span class='job-category'>${job.jobCategory}</span>
          <span class="job-role">${job.jobRole}</span>
        </h6>
        <div class="card-content">
          <div class="job-location">
            <span><i class="fa-solid fa-location-dot"></i></span>
            <span>${job.jobLocation}</span>
          </div>
          <div class="job-salary">
            <span><i class="fa-solid fa-indian-rupee-sign"></i></span>
            <span>${job.salary}</span>
          </div>
          <div class="job-skills">
            ${
              Array.isArray(job.skills)
                ? job.skills.map(skill => `<div class="skills"><button type="button" class="btn btn-outline-warning">${skill}</button></div>`).join('')
                : `<div class="skills"><button type="button" class="btn btn-outline-warning">${job.skills}</button></div>`
            }
          </div>
          <a href="viewDetails/${job.id}">
            <button type="button" class="btn btn-success view-details-button">View Details</button>
          </a>
        </div>
      </div>
    `;
    
    colDiv.appendChild(cardDiv);
    jobsContainer.appendChild(colDiv);
  });
}

function renderPagination() {
  paginationContainer.innerHTML = '';

  const prevButton = document.createElement('a');
  prevButton.href = '#';
  prevButton.innerText = 'Prev';
  prevButton.style.margin = '0 5px';
  if (currentPage > 1) {
    prevButton.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage--;
      updatePagination();
    });
  } else {
    prevButton.style.pointerEvents = 'none';
    prevButton.style.opacity = '0.5';
  }
  paginationContainer.appendChild(prevButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement('a');
    pageLink.href = '#';
    pageLink.innerText = i;
    pageLink.style.margin = '0 5px';
    if (i === currentPage) {
      pageLink.classList.add('current');
    }
    pageLink.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      updatePagination();
    });
    paginationContainer.appendChild(pageLink);
  }

  const nextButton = document.createElement('a');
  nextButton.href = '#';
  nextButton.innerText = 'Next';
  nextButton.style.margin = '0 5px';
  if (currentPage < totalPages) {
    nextButton.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage++;
      updatePagination();
    });
  } else {
    nextButton.style.pointerEvents = 'none';
    nextButton.style.opacity = '0.5';
  }
  paginationContainer.appendChild(nextButton);
}

function updatePagination() {
  renderJobs(currentPage);
  renderPagination();
}

updatePagination();