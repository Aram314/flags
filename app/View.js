export default class View {
    constructor() {
        this.app = document.getElementById('app');

        this.main = this.createElement('main');
        this.section = this.createElement('section', 'text-center py-5', 'gallery');
        this.container = this.createElement('div', 'container');

        this.title = this.createElement('h2', 'h1-responsive font-weight-bold mb-5');
        this.title.textContent = 'The moment of geography';

        this.subtitle = this.createElement('p', 'grey-text w-responsive mx-auto mb-5');
        this.subtitle.textContent = 'This game is inclined to improve peoples\' geographical knowledge, worldview, and memory.';

        this.lightbox = this.createElement('div', 'mdb-lightbox');

        this.quiz = this.createElement('div', 'col-md-12', 'quiz');

        this.question = this.createElement('p', 'h3 text-left mb-4', 'question');

        this.flagsContainer = this.createElement('div', 'row');

        this.hr = this.createElement('hr', 'my-5');

        this.footer = this.createElement('footer');
        this.footer.innerHTML = `
            <div class="container">
                <div class="row">
                    <p id="progress">
                    </p>
                </div>
            </div>
        `;


        this.quiz.append(this.question, this.flagsContainer);
        this.lightbox.append(this.quiz);
        this.container.append(this.title, this.subtitle, this.lightbox);
        this.section.append(this.container);
        this.main.append(this.section);


        // map
        this.map = `
            <div class="modal fade" id="mapModal">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content">
                        <div class="modal-body mb-0 p-0">
                            <div id="map-container" class="z-depth-1-half map-container" style="height: 400px">
                                <iframe src="https://maps.google.com/maps?q=&t=&z=4&ie=UTF8&iwloc=&output=embed"
                                        frameborder="0" style="border:0" allowfullscreen></iframe>
                            </div>
                        </div>
                        <div class="modal-footer justify-content-center">
                            <button type="button" class="btn btn-outline-info btn-md" data-dismiss="modal">Close <i class="fas fa-times ml-1"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.mapContainer = this.createElement('div');
        this.mapContainer.innerHTML = this.map;

        this.app.append(this.main, this.hr, this.footer, this.mapContainer);
    }

    // simple factory
    createElement(tag, className, id) {
        const el = document.createElement(tag);
        if(className) {
            let classNames = className.split(' ');
            for(className of classNames) {
                el.classList.add(className)
            }
        }
        if(id) {
            el.id = id
        }
        return el
    }

    displayQuestionAndFlags(countries, question, questionsCount, score) {
        this.question.innerHTML = `
            <p>${question.name}</p>
            <span class="openMapText" data-toggle='modal' data-target='#mapModal' >Click to View on Map</span>
        `
        this.flagsContainer.innerHTML = '';

        if(!countries.length) {
            this.flagsContainer.textContent = 'Please reload the page!'
        } else {
            countries.forEach((country, index) => {
                let singleFlag = `
                <div class="col-md-3 mb-2 col-sm-6">
                    <div class="card" id="btn${index}">
                        <div class="view overlay ">
                            <div class="card-body ">
                                <div id="choice${index}" class="flag-wrapper" data-index="${index}">  
                                    <img width='64px' height='64px' class='mx-auto' src="https://www.countryflags.io/${country.alpha2Code}/shiny/64.png" alt="${country.name}">
                                </div>
                            </div>
                            <div class="mask flex-center rgba-orange-light"></div>
                        </div>
                    </div>
                </div>
            `;
                this.flagsContainer.innerHTML += singleFlag
            })
        }

        // update progress
        const progress = document.getElementById('progress');
        progress.innerHTML = `<p>Right Answered: ${score}</p><p>Total Questions: ${questionsCount}</p>`;

        // update map
        const mapContainer = document.getElementById('map-container');
        mapContainer.innerHTML = `<iframe src="https://maps.google.com/maps?q=${question.name}&t=&z=4&ie=UTF8&iwloc=&output=embed" frameborder="0" style="border:0" allowfullscreen></iframe>`
    }

    bindFlagSelect(handler, handleScore) {
        let fn;
        this.flagsContainer.addEventListener('click', fn = e => {
            const target = e.target;
            if(!target.closest('.view')) return;
            this.flagsContainer.removeEventListener('click', fn);
            const choice = target.parentElement.querySelector('.flag-wrapper').dataset.index;
            handler(choice);
            handleScore(choice)
        })
    }

    highlightAnswer(choiceIndex, bool, rightAnswerIndex) {
        this.flagsContainer.children[rightAnswerIndex].firstElementChild.classList.add('success-border');
        if(bool) {
            this.flagsContainer.children[choiceIndex].firstElementChild.classList.add('success-border')
        } else {
            this.flagsContainer.children[choiceIndex].firstElementChild.classList.add('failure-border')
        }
    }
}