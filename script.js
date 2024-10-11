let currentCategoryVideos = []; // Global variable to hold videos of the current category

const loadVideo = async(searchText = "") => {
 
    const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    const data = await response.json()
    displayData(data.videos);
}
function getTimeString(time){
    const hour = parseInt(time/3600)
    let remainingsecond = time%3600
    const minute = parseInt(remainingsecond / 60)
    remainingsecond = remainingsecond % 60
    return `${hour} : ${minute}: ${remainingsecond}`
}

const displayData = (videos) => {

   
    const videoshow = document.getElementById('videos');
    videoshow.innerHTML = ""

    if (videos.length === 0) {
      
        videoshow.classList.remove('grid');
        videoshow.innerHTML = `
            <img class="mx-auto" src="Icon.png" /> <br />
            <p class="text-3xl font-bold text-center"> No content available</p>
        `;
    } else {
        videoshow.classList.add('grid');
    }

    videos.forEach(element => {
        const div = document.createElement('div');
        div.innerHTML = `
            <div class="card bg-base-100 shadow-xl">
                <figure class="h-[200px] relative">
                    <img class="w-full h-full object-cover" src=${element.thumbnail} alt="Video Thumbnail" />
                     ${element.others.posted_date?.length === 0? " ":`  <span class="absolute bottom-2 right-2 bg-black text-white rounded p-1">${getTimeString(element.others.posted_date)}</span>`}
                </figure>
                <div class="flex p-2 gap-3">
                    <div>
                        <img class="w-10 h-10 rounded-full object-cover" src=${element.authors[0].profile_picture} alt="Author Profile" />
                    </div>
                    <div class="space-y-1">
                        <h2 class="card-title">${element.title}</h2>
                        <div class="flex items-center gap-2">
                            <p>${element.authors[0].profile_name}</p>
                            ${element.authors[0].verified ? `<img class="w-5" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png"/>` : ""}
                        </div>
                        <p>views: ${element.others.views}</p>
                        <div class="card-actions justify-end">
                            <button onclick="modal('${element.video_id}')" class="btn btn-sm btn-error text-white">Details</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        videoshow.appendChild(div);
    });
}

const modal = async(videoID) => {
    const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/video/${videoID}`);
    const data = await response.json();
    modalDeatils(data.video);
}

const modalDeatils = (video) => {
    const modalcontent = document.getElementById('modal-content');
    modalcontent.innerHTML = `
        <img class="w-full rounded-md h-full object-cover" src=${video.thumbnail} alt="Video Thumbnail" />
        <p>${video.description}</p>
    `;
    document.getElementById('custommodal').showModal();
}

const loadBtn = async() => {
    const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/categories`);
    const data = await response.json();
    displayBtn(data.categories);
}

const displayBtn = (categories) => {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = ""; // Clear previous categories
    categories.forEach(element => {
        const div = document.createElement('div');
        div.innerHTML = `
            <button id="btn-${element.category_id}" class="btn btnremoveclr" onclick="loadcategoryVideo('${element.category_id}')">${element.category}</button>
        `;
        categoriesContainer.appendChild(div);
    });
}

const removeActiveBtn = () => {
    const buttons = document.getElementsByClassName('btnremoveclr');
    for (let btn of buttons) {
        btn.classList.remove('bg-red-500');
    }
}

const loadcategoryVideo = async(categoryID) => {
    
    
    const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${categoryID}`);
    const data = await response.json();
    removeActiveBtn();
    const activeBtn = document.getElementById(`btn-${categoryID}`);
    activeBtn.classList.add('text-white', 'bg-red-500');

    currentCategoryVideos = data.category; // Store the current category videos
    displayData(currentCategoryVideos); // Display videos of the selected category
}

// Helper function to convert 'K' and 'M' strings to numbers
const convertViews = (views) => {
    if (views.endsWith('K')) {
        return parseFloat(views) * 1000;
    } else if (views.endsWith('M')) {
        return parseFloat(views) * 1000000;
    } else {
        return parseFloat(views);
    }
};

// Sorting videos by views in descending order
const sortingBtn = async () => {
    if (currentCategoryVideos.length > 0) {
        // Sort the current category videos
        const sortedVideos = currentCategoryVideos.sort((a, b) => {
            return convertViews(b.others.views) - convertViews(a.others.views);
        });
        displayData(sortedVideos); // Display sorted videos
    } else {
        // Sort all videos if no category is selected
        const response = await fetch(`https://openapi.programming-hero.com/api/phero-tube/videos`);
        const data = await response.json();
        const sortedVideos = data.videos.sort((a, b) => {
            return convertViews(b.others.views) - convertViews(a.others.views);
        });
        displayData(sortedVideos); // Display sorted videos
    }
}
// search input
document.getElementById('search-input').addEventListener('keyup',function(e){
    loadVideo(e.target.value)
})

// Load initial data
loadBtn();
loadVideo();
