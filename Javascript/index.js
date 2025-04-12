const elTemplateList = document.querySelector(".js-movie-template").content;
const elMovieList = document.querySelector(".js-movie-list");
const elModalBlock = document.querySelector(".js-modal-body");
const elForm  = document.querySelector(".js-form");
const elSearchInput = elForm.querySelector(".js-search-input");
const elMinInput = elForm.querySelector(".js-min-year-input");
const elMaxInput = elForm.querySelector(".js-max-year-input");
const elCategorey = elForm.querySelector(".js-categories-select");
const elSortSelect = elForm.querySelector(".js-sort-select");
const elcategoriesList = elForm.querySelector(".js-categories-select");
const elPagination = document.querySelector(".js-pagination");
const elKarzinaTem = document.querySelector(".js-karzina-temp").content;
const elCanvas = document.querySelector(".js-canvas-body");


const renderFunction = (arr) => {
const docFragment = document.createDocumentFragment();
elMovieList.innerHTML = '';
arr.forEach((movie) => {
    const clone = elTemplateList.cloneNode(true);
    clone.querySelector(".js-movie-image").src = movie.img_url;
    clone.querySelector(".js-movie-title").textContent = movie.title;
    clone.querySelector(".js-movie-rating").textContent = movie.imdb_rating;
    clone.querySelector(".js-movie-year").textContent = movie.movie_year;
    clone.querySelector(".js-movie-categories").textContent = movie.categories.join(", ");
    clone.querySelector(".js-more-info").dataset.id = movie.imdb_id;
    clone.querySelector(".js-bookmark").dataset.idd = movie.imdb_id;
    if(movie.status == true){
        clone.querySelector(".js-bookmark").classList.add("activelar");
    }
    docFragment.append(clone);
    });
    elMovieList.append(docFragment);
};

const categoriesFunction = () => {
    let categories = movies.map((movie) => movie.categories).flat();
    let uniqueCategories = [...new Set(categories)];
    const docFragment = document.createDocumentFragment();
    uniqueCategories.forEach((category) => {
        let option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        docFragment.append(option);
    });
    elcategoriesList.append(docFragment);

}


const functionModul = (movie) => {
    elModalBlock.querySelector(".js-movie-iframe").src = movie.movie_frame;
    elModalBlock.querySelector(".js-movie-modal-title").textContent = movie.title;
    elModalBlock.querySelector(".js-movie-rating").textContent = movie.imdb_rating;
    elModalBlock.querySelector(".js-movie-year").textContent = movie.movie_year;
    elModalBlock.querySelector(".js-movie-categories").textContent = movie.categories.join(", ");
};
let moviesKarzina = [];

movies = movies.map((movie) => {
    movie['status'] = false;
    return movie;
});

const functionModul1 = (movie) => {
    let clone = elKarzinaTem.cloneNode(true);
    clone.querySelector(".js-karzina").textContent = movie.title;
    elCanvas.append(clone);
    document.querySelector(".js-bookmark-movies-count").textContent = moviesKarzina.length;

};

const searchMovies = (arr, regex) => {
    let searchResult = arr.filter((movie) => {
         return (movie.title.match(regex)) && (elMinInput.value <= movie.movie_year || elMinInput.value === "") && (elMaxInput.value >= movie.movie_year || elMaxInput.value === "") && (elCategorey.value === "all" ||  movie.categories.includes(elCategorey.value));
    });
    return searchResult;
}


renderFunction(movies.slice(0, 8));
categoriesFunction();
elMovieList.addEventListener("click", (evt) => {
    let target = evt.target;
    if(target.matches(".js-more-info")){
        let id = target.dataset.id;
        let findMovie = movies.find((movie) => movie.imdb_id === id);
        functionModul(findMovie);
        
        
    }
    if(target.matches(".js-bookmark")){
        let id = target.dataset.idd;
        let findMovie = movies.find((movie) => movie.imdb_id === id);
        if(findMovie.status == false){
            findMovie.status = true;
            moviesKarzina.push(findMovie);
            target.classList.add("activelar");
            functionModul1(findMovie);
        }
        else{
            findMovie.status = false;
            moviesKarzina = moviesKarzina.filter((movie) => movie.imdb_id !== id);
            target.classList.remove("activelar");
            elCanvas.innerHTML = '';
            if(moviesKarzina.length === 0){
                document.querySelector(".js-bookmark-movies-count").textContent = 0;
            }
            moviesKarzina.forEach((movie) => {
                functionModul1(movie);
            });
            
        }
        
       
}

})


elForm.addEventListener("submit", (evt) => {
    evt.preventDefault();
    try{
    let searchValue = elSearchInput.value.trim();
    
    let regex = new RegExp(searchValue, "gi");
    moviesSort = searchMovies(movies, regex, searchValue);
    moviesSort.sort((a, b) => {
        if(elSortSelect.value === "a-z"){
            return a.title.localeCompare(b.title);
        }
        if(elSortSelect.value === "z-a"){
            return b.title.localeCompare(a.title);
        }
        if(elSortSelect.value === "old-year"){
            return a.movie_year - b.movie_year;
        }
        if(elSortSelect.value === "new-year"){
            return b.imdb_rating - a.imdb_rating;
        }
    })
    renderFunction(moviesSort.slice(0, 8));

    
    } catch (error) {
        console.log(error);
    }

});
let index = 0;

elPagination.addEventListener("click", (evt) => {
    let target = evt.target;

    let searchValue = elSearchInput.value.trim();
    
    let regex = new RegExp(searchValue, "gi");
    moviesSort = searchMovies(movies, regex, searchValue);
    // let filterMovues = movies.filter((movie) => movie.title.match(regex));
    

    if(target.id === "page2" && index < Math.ceil(moviesSort.length / 8) - 1){
        index++;
        let start = index * 8;
        let end = start + 8;
        let sliceMovies = moviesSort.slice(start, end);
        renderFunction(sliceMovies);
        
    }
    if(target.id === "page1" && index > 0){
        index--;
        let start = index * 8;
        let end = start + 8;
        let sliceMovies = moviesSort.slice(start, end);
        renderFunction(sliceMovies);
    }

});